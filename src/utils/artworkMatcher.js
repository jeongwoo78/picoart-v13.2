// Color matching algorithm for artwork selection
// Uses heuristic approach based on color similarity, brightness, and orientation

// Extract dominant colors from image (simplified version)
export const extractDominantColors = async (imageFile) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Resize to small canvas for performance
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      
      const imageData = ctx.getImageData(0, 0, 50, 50);
      const pixels = imageData.data;
      
      // Calculate average RGB
      let r = 0, g = 0, b = 0;
      const pixelCount = pixels.length / 4;
      
      for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
      }
      
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      
      // Convert to hex
      const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      const dominantColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      
      // Calculate brightness
      const brightness = Math.floor((r + g + b) / 3 / 255 * 100);
      
      // Get orientation
      const orientation = img.width > img.height ? 'landscape' : 'portrait';
      
      resolve({
        dominantColors: [dominantColor],
        brightness,
        orientation
      });
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
};

// Convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Calculate color distance (Euclidean distance in RGB space)
const colorDistance = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1000;
  
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

// Compare color palettes
const compareColorPalettes = (photoColors, artworkColors) => {
  let totalDistance = 0;
  
  photoColors.forEach(photoColor => {
    // Find closest artwork color
    const distances = artworkColors.map(artColor => colorDistance(photoColor, artColor));
    const minDistance = Math.min(...distances);
    totalDistance += minDistance;
  });
  
  // Normalize (max distance in RGB space is ~441, so divide by that)
  const avgDistance = totalDistance / photoColors.length;
  const similarity = 1 - (avgDistance / 441);
  
  return Math.max(0, similarity); // 0 to 1
};

// Compare brightness
const compareBrightness = (photoBrightness, artworkBrightness) => {
  const difference = Math.abs(photoBrightness - artworkBrightness);
  return 1 - (difference / 100); // 0 to 1
};

// Compare orientation
const compareOrientation = (photoOrientation, artworkOrientation) => {
  return photoOrientation === artworkOrientation ? 1 : 0.5;
};

// Main matching algorithm
export const calculateMatchScore = (photoAnalysis, artwork) => {
  // 1. Color similarity (70% weight)
  const colorScore = compareColorPalettes(
    photoAnalysis.dominantColors,
    artwork.dominantColors
  );
  
  // 2. Brightness matching (20% weight)
  const brightnessScore = compareBrightness(
    photoAnalysis.brightness,
    artwork.brightness
  );
  
  // 3. Orientation matching (10% weight)
  const orientationScore = compareOrientation(
    photoAnalysis.orientation,
    artwork.orientation
  );
  
  // Calculate weighted score
  const totalScore = (
    colorScore * 0.7 +
    brightnessScore * 0.2 +
    orientationScore * 0.1
  );
  
  return totalScore;
};

// Select best artwork from filtered list
export const selectBestArtwork = (photoAnalysis, artworksList) => {
  if (!artworksList || artworksList.length === 0) {
    return null;
  }
  
  // Calculate scores for all artworks
  const scoredArtworks = artworksList.map(artwork => ({
    artwork,
    score: calculateMatchScore(photoAnalysis, artwork)
  }));
  
  // Sort by score (descending)
  scoredArtworks.sort((a, b) => b.score - a.score);
  
  // Return best match
  return scoredArtworks[0].artwork;
};

// Main function: analyze photo and select artwork
export const matchArtworkToPhoto = async (photoFile, filteredArtworks) => {
  try {
    // Analyze photo
    const photoAnalysis = await extractDominantColors(photoFile);
    
    // Select best artwork
    const bestArtwork = selectBestArtwork(photoAnalysis, filteredArtworks);
    
    return {
      success: true,
      artwork: bestArtwork,
      photoAnalysis
    };
  } catch (error) {
    console.error('Error matching artwork:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

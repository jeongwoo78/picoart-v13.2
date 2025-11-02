// Replicate ControlNet API utility
// Using ControlNet for better content preservation

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const CONTROLNET_MODEL = 'jagilley/controlnet-canny';
const MODEL_VERSION = 'aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613';

// Convert image file to base64
const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Resize image if needed
const resizeImage = async (file, maxWidth = 768) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Resize if too large
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.9);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Sleep utility for polling
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Apply style transfer using Replicate ControlNet
export const applyStyleTransfer = async (photoFile, artwork, apiKey, onProgress) => {
  try {
    // Resize photo
    const resizedPhoto = await resizeImage(photoFile, 768);
    
    // Convert to base64
    const photoBase64 = await fileToBase64(resizedPhoto);
    
    // Create prompt based on artwork
    const styleName = artwork.titleEn || artwork.title;
    const artistName = artwork.artistEn || artwork.artist;
    const styleDescription = getStyleDescription(artwork.style);
    
    const prompt = `professional painting in the style of ${styleName} by ${artistName}, ${styleDescription}, masterpiece, high quality, artistic`;
    const negativePrompt = 'photo, photograph, realistic, modern, low quality, blurry, distorted';
    
    // Update progress
    if (onProgress) onProgress('Creating prediction...');
    
    // Step 1: Create prediction
    const createResponse = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image: photoBase64,
          prompt: prompt,
          negative_prompt: negativePrompt,
          num_inference_steps: 20,
          guidance_scale: 9,
          controlnet_conditioning_scale: 1.0
        }
      })
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Create prediction error:', createResponse.status, errorText);
      throw new Error(`API Error: ${createResponse.status}`);
    }
    
    const prediction = await createResponse.json();
    
    // Step 2: Poll for result
    if (onProgress) onProgress('Processing image...');
    
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max
    
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await sleep(1000);
      attempts++;
      
      const getResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Token ${apiKey}`
        }
      });
      
      if (!getResponse.ok) {
        throw new Error('Failed to get prediction status');
      }
      
      result = await getResponse.json();
      
      if (onProgress) {
        const progress = Math.min(95, 10 + (attempts * 1.5));
        onProgress(`Processing... ${Math.floor(progress)}%`);
      }
    }
    
    if (result.status === 'failed') {
      throw new Error('Style transfer failed');
    }
    
    if (result.status !== 'succeeded') {
      throw new Error('Processing timeout');
    }
    
    // Get result image URL
    const resultUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    
    if (!resultUrl) {
      throw new Error('No result image');
    }
    
    // Fetch the image as blob
    const imageResponse = await fetch(resultUrl);
    const blob = await imageResponse.blob();
    const localUrl = URL.createObjectURL(blob);
    
    return {
      success: true,
      resultUrl: localUrl,
      blob,
      remoteUrl: resultUrl
    };
    
  } catch (error) {
    console.error('Style transfer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get style description for prompt
const getStyleDescription = (styleId) => {
  const descriptions = {
    'impressionism': 'impressionist brushstrokes, light and color, outdoor lighting',
    'expressionism': 'expressionist style, emotional, bold colors, dramatic',
    'cubism': 'cubist style, geometric shapes, multiple perspectives',
    'surrealism': 'surrealist style, dreamlike, imaginative',
    'romanticism': 'romantic style, dramatic, emotional, sublime',
    'baroque': 'baroque style, dramatic lighting, ornate, detailed',
    'renaissance': 'renaissance style, balanced composition, realistic',
    'classical': 'classical style, idealized beauty, harmonious',
    'byzantine': 'byzantine style, golden, religious, iconic',
    'korean': 'Korean traditional painting style, ink and colors, natural',
    'chinese': 'Chinese ink painting style, monochrome, expressive brushwork',
    'japanese': 'Japanese ukiyo-e style, woodblock print, flat colors'
  };
  
  return descriptions[styleId] || 'artistic painting style';
};

// Mock API for testing (when no API key available)
export const mockStyleTransfer = async (photoFile, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(`Processing... ${progress}%`);
      
      if (progress >= 100) {
        clearInterval(interval);
        const url = URL.createObjectURL(photoFile);
        resolve({
          success: true,
          resultUrl: url,
          blob: photoFile,
          isMock: true
        });
      }
    }, 200);
  });
};

// Main function with fallback to mock
export const processStyleTransfer = async (photoFile, artwork, apiKey, onProgress) => {
  // If no API key, use mock
  if (!apiKey || apiKey === 'YOUR_REPLICATE_API_KEY_HERE') {
    console.warn('No API key provided, using mock response');
    return mockStyleTransfer(photoFile, onProgress);
  }
  
  // Try real API
  const result = await applyStyleTransfer(photoFile, artwork, apiKey, onProgress);
  
  // If API fails, fallback to mock
  if (!result.success) {
    console.warn('API failed, falling back to mock');
    return mockStyleTransfer(photoFile, onProgress);
  }
  
  return result;
};

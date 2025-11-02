// FLUX ControlNet style transfer with high-quality prompts

const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const resizeImage = async (file, maxWidth = 1024) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.95);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 고품질 화풍 프롬프트 생성
const createArtisticPrompt = (artwork) => {
  const artist = artwork.artistEn || artwork.artist;
  const style = artwork.style;
  
  // 화가별 상세 스타일 키워드
  const artistPrompts = {
    // 인상주의
    'Claude Monet': 'soft brushstrokes, dappled light, vibrant colors, outdoor atmosphere, impressionist painting style',
    'Pierre-Auguste Renoir': 'warm tones, soft focus, luminous skin, joyful atmosphere, impressionist portrait style',
    'Edgar Degas': 'dynamic composition, ballet dancers, indoor lighting, pastel colors, impressionist scene',
    
    // 표현주의
    'Edvard Munch': 'emotional intensity, swirling forms, dramatic colors, expressionist painting style',
    'Egon Schiele': 'angular lines, emotional depth, expressive gestures, expressionist portrait style',
    
    // 후기인상주의
    'Vincent van Gogh': 'thick impasto brushstrokes, swirling patterns, vibrant colors, emotional intensity, post-impressionist style',
    'Paul Cézanne': 'geometric forms, structured composition, muted colors, post-impressionist style',
    
    // 야수주의
    'Henri Matisse': 'bold colors, simplified forms, decorative patterns, fauvist painting style',
    
    // 입체주의
    'Pablo Picasso': 'fragmented forms, multiple perspectives, geometric shapes, cubist painting style'
  };
  
  // 스타일별 기본 키워드
  const styleKeywords = {
    'impressionism': 'soft brushstrokes, natural light, outdoor scene, vibrant colors',
    'expressionism': 'emotional expression, bold colors, distorted forms, dramatic mood',
    'fauvism': 'wild colors, simplified forms, bold brushwork',
    'cubism': 'geometric shapes, fragmented perspective, angular forms',
    'surrealism': 'dreamlike quality, imaginative elements, surreal atmosphere',
    'romanticism': 'dramatic lighting, emotional atmosphere, sublime beauty',
    'baroque': 'dramatic chiaroscuro, rich colors, ornate details',
    'renaissance': 'realistic proportions, balanced composition, classical beauty'
  };
  
  const artistStyle = artistPrompts[artist] || styleKeywords[style] || 'artistic painting style';
  
  return `A beautiful painting in the style of ${artist}, ${artistStyle}, masterpiece, high quality, professional artwork, detailed, artistic interpretation`;
};

// FLUX ControlNet으로 스타일 변환
export const applyStyleTransfer = async (photoFile, artwork, onProgress) => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    
    const prompt = createArtisticPrompt(artwork);
    
    if (onProgress) onProgress('AI 처리 준비 중...');
    
    // Serverless function 호출
    const createResponse = await fetch('/api/replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: photoBase64,
        prompt: prompt,
        style: artwork.style
      })
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Server error:', errorText);
      throw new Error(`Server error: ${createResponse.status}`);
    }
    
    const prediction = await createResponse.json();
    
    if (onProgress) onProgress('고품질 그림 생성 중...');
    
    // 결과 polling
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 90; // FLUX는 더 오래 걸림
    
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await sleep(2000);
      attempts++;
      
      const checkResponse = await fetch(`/api/check-prediction?id=${prediction.id}`);
      
      if (!checkResponse.ok) {
        throw new Error('Failed to check status');
      }
      
      result = await checkResponse.json();
      
      if (onProgress) {
        const progress = Math.min(95, 5 + (attempts * 1.0));
        onProgress(`생성 중... ${Math.floor(progress)}%`);
      }
    }
    
    if (result.status === 'failed') {
      throw new Error('Style transfer failed');
    }
    
    if (result.status !== 'succeeded') {
      throw new Error('Processing timeout');
    }
    
    const resultUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    
    if (!resultUrl) {
      throw new Error('No result image');
    }
    
    // 이미지 다운로드
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

// Mock (테스트용)
export const mockStyleTransfer = async (photoFile, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(`처리 중... ${progress}%`);
      
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

// Main function
export const processStyleTransfer = async (photoFile, artwork, apiKey, onProgress) => {
  // API 시도
  const result = await applyStyleTransfer(photoFile, artwork, onProgress);
  
  // 실패시 Mock
  if (!result.success) {
    console.warn('API failed, using mock');
    return mockStyleTransfer(photoFile, onProgress);
  }
  
  return result;
};

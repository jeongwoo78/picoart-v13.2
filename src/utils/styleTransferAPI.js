// Prompt-based style transfer using SDXL img2img

const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const resizeImage = async (file, maxWidth = 768) => {
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
      }, 'image/jpeg', 0.9);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 화풍 프롬프트 생성
const createStylePrompt = (artwork) => {
  const artist = artwork.artistEn || artwork.artist;
  const style = artwork.style;
  
  // 스타일별 키워드
  const styleKeywords = {
    'impressionism': 'impressionist painting, visible brushstrokes, light and color, outdoor scene',
    'expressionism': 'expressionist painting, bold colors, emotional, distorted forms',
    'cubism': 'cubist painting, geometric shapes, fragmented, multiple perspectives',
    'surrealism': 'surrealist painting, dreamlike, imaginative, symbolic',
    'romanticism': 'romantic painting, dramatic lighting, emotional atmosphere',
    'baroque': 'baroque painting, dramatic lighting, rich colors, ornate details',
    'renaissance': 'renaissance painting, realistic, balanced composition, classical beauty',
    'fauvism': 'fauvist painting, wild colors, bold brushstrokes, simplified forms',
    'rococo': 'rococo painting, ornate, pastel colors, playful, elegant'
  };
  
  const baseStyle = styleKeywords[style] || 'artistic painting style';
  
  return `A painting in the style of ${artist}, ${baseStyle}, masterpiece, high quality, artistic`;
};

// SDXL로 스타일 변환
export const applyStyleTransfer = async (photoFile, artwork, onProgress) => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 768);
    const photoBase64 = await fileToBase64(resizedPhoto);
    
    const prompt = createStylePrompt(artwork);
    
    if (onProgress) onProgress('서버에 요청 중...');
    
    // Serverless function 호출
    const createResponse = await fetch('/api/replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: photoBase64,
        prompt: prompt
      })
    });
    
    if (!createResponse.ok) {
      throw new Error(`Server error: ${createResponse.status}`);
    }
    
    const prediction = await createResponse.json();
    
    if (onProgress) onProgress('그림 생성 중...');
    
    // 결과 polling
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60;
    
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await sleep(2000);
      attempts++;
      
      const checkResponse = await fetch(`/api/check-prediction?id=${prediction.id}`);
      
      if (!checkResponse.ok) {
        throw new Error('Failed to check status');
      }
      
      result = await checkResponse.json();
      
      if (onProgress) {
        const progress = Math.min(95, 10 + (attempts * 1.5));
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

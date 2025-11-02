// v16: XLabs FLUX Depth ControlNet with optimized prompts
// 깊이 정보 기반으로 사진 구조를 완벽하게 유지하면서 화풍만 변경

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

// v16: Depth ControlNet 최적화 프롬프트
// Depth 컨트롤은 3차원 구조를 유지하므로 프롬프트에서 이를 강조
const createDepthArtisticPrompt = (artwork) => {
  const artist = artwork.artistEn || artwork.artist;
  const style = artwork.style;
  
  // 화가별 Depth-optimized 프롬프트
  const artistPrompts = {
    // 인상주의 - 빛과 대기 표현
    'Claude Monet': 
      'soft impressionist brushstrokes, dappled natural light, ' +
      'vibrant outdoor colors, atmospheric perspective, ' +
      'maintaining depth and composition, plein-air painting style',
    
    'Pierre-Auguste Renoir': 
      'warm luminous tones, soft focus effects, ' +
      'joyful atmosphere with natural lighting, ' +
      'preserving spatial relationships, impressionist portrait style',
    
    'Edgar Degas': 
      'dynamic composition, ballet scene aesthetics, ' +
      'indoor natural lighting, pastel color palette, ' +
      'maintaining depth and movement, impressionist style',
    
    // 표현주의 - 감정과 형태
    'Edvard Munch': 
      'expressive emotional brushstrokes, swirling undulating forms, ' +
      'dramatic color palette, psychological intensity, ' +
      'preserving original depth structure, expressionist masterpiece',
    
    'Egon Schiele': 
      'angular expressive lines, emotional psychological depth, ' +
      'expressive gestures and poses, muted earth tones, ' +
      'maintaining composition, expressionist portrait style',
    
    // 후기인상주의 - 구조와 감정
    'Vincent van Gogh': 
      'thick impasto oil paint texture, swirling dynamic brushwork, ' +
      'vibrant colors with emotional intensity, ' +
      'preserving subject positioning and depth, post-impressionist masterpiece',
    
    'Paul Cézanne': 
      'geometric structured forms, balanced composition, ' +
      'muted natural colors, architectural perspective, ' +
      'maintaining spatial depth, post-impressionist style',
    
    'Paul Gauguin':
      'bold flat color areas, decorative patterns, ' +
      'exotic tropical atmosphere, simplified forms, ' +
      'preserving composition, post-impressionist style',
    
    // 야수주의 - 색채 표현
    'Henri Matisse': 
      'bold vibrant colors, simplified decorative forms, ' +
      'ornate patterns and shapes, joyful composition, ' +
      'maintaining original structure, fauvist painting style',
    
    // 입체주의 - 다시점 표현
    'Pablo Picasso': 
      'geometric fragmented forms, analytical multiple perspectives, ' +
      'cubist angular shapes, earth tone palette, ' +
      'maintaining recognizable subject with multiple angles, modernist masterpiece',
    
    // 아르누보/상징주의
    'Gustav Klimt':
      'ornate decorative patterns, gold leaf symbolic details, ' +
      'art nouveau elegance, Byzantine influences, ' +
      'preserving subject and depth, Vienna Secession style',
    
    // 상징주의
    'Odilon Redon':
      'dreamlike symbolic imagery, mystical atmosphere, ' +
      'soft pastel colors, spiritual depth, ' +
      'maintaining composition, symbolist style'
  };
  
  // 스타일별 기본 Depth-aware 키워드
  const styleKeywords = {
    'impressionism': 
      'soft brushstrokes, natural dappled light, outdoor atmosphere, ' +
      'atmospheric perspective, maintaining spatial depth',
    
    'expressionism': 
      'emotional bold expression, dramatic colors, expressive forms, ' +
      'psychological intensity, preserving composition',
    
    'fauvism': 
      'wild vibrant colors, simplified bold forms, decorative patterns, ' +
      'maintaining structure, fauvist style',
    
    'cubism': 
      'geometric fragmented shapes, multiple perspectives, angular forms, ' +
      'preserving recognizable subject, cubist analysis',
    
    'surrealism': 
      'dreamlike quality, imaginative elements, surreal atmosphere, ' +
      'maintaining depth relationships, surrealist style',
    
    'romanticism': 
      'dramatic lighting, emotional sublime atmosphere, heroic beauty, ' +
      'preserving spatial composition, romantic style',
    
    'baroque': 
      'dramatic chiaroscuro, rich vibrant colors, ornate details, ' +
      'maintaining depth and drama, baroque style',
    
    'renaissance': 
      'realistic proportions, balanced harmonious composition, classical beauty, ' +
      'preserving spatial relationships, renaissance style'
  };
  
  const artistStyle = artistPrompts[artist] || styleKeywords[style] || 
    'artistic painting style, maintaining original composition and depth';
  
  // Depth ControlNet에 최적화된 최종 프롬프트
  return `A beautiful high-quality painting in the style of ${artist}, ` +
    `${artistStyle}, ` +
    `photorealistic interpretation, ` +
    `preserving facial features and spatial relationships, ` +
    `masterpiece quality, detailed artistic rendering`;
};

// v16: XLabs FLUX Depth ControlNet으로 스타일 변환
export const applyStyleTransfer = async (photoFile, artwork, onProgress) => {
  try {
    // 1024x1024로 리사이즈 (XLabs 모델 최적 해상도)
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    
    // Depth-optimized 프롬프트 생성
    const prompt = createDepthArtisticPrompt(artwork);
    
    if (onProgress) onProgress('AI 분석 중...');
    
    // v16 Serverless function 호출
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
    
    if (onProgress) onProgress('고품질 예술 작품 생성 중...');
    
    // 결과 polling (XLabs는 약 54초 소요)
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 90; // 최대 3분
    
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await sleep(2000); // 2초마다 확인
      attempts++;
      
      const checkResponse = await fetch(`/api/check-prediction?id=${prediction.id}`);
      
      if (!checkResponse.ok) {
        throw new Error('Failed to check status');
      }
      
      result = await checkResponse.json();
      
      if (onProgress) {
        const progress = Math.min(95, 10 + (attempts * 1.0));
        onProgress(`예술 작품 생성 중... ${Math.floor(progress)}%`);
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

// Mock (무료 티어용)
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
  // v16: XLabs Depth ControlNet 시도
  const result = await applyStyleTransfer(photoFile, artwork, onProgress);
  
  // 실패시 Mock (무료 티어)
  if (!result.success) {
    console.warn('API failed, using mock version');
    return mockStyleTransfer(photoFile, onProgress);
  }
  
  return result;
};

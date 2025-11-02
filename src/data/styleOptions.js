// Style options for user selection
export const STYLE_OPTIONS = {
  movements: [
    { 
      id: 'impressionism', 
      name: '인상주의', 
      nameEn: 'Impressionism',
      icon: '🎨',
      description: '빛과 색의 순간적 인상을 포착'
    },
    { 
      id: 'expressionism', 
      name: '표현주의', 
      nameEn: 'Expressionism',
      icon: '😱',
      description: '강렬한 감정과 내면 표현'
    },
    { 
      id: 'cubism', 
      name: '입체주의', 
      nameEn: 'Cubism',
      icon: '📐',
      description: '다양한 시점을 하나로 결합'
    },
    { 
      id: 'surrealism', 
      name: '초현실주의', 
      nameEn: 'Surrealism',
      icon: '🌙',
      description: '꿈과 무의식의 세계'
    },
    { 
      id: 'romanticism', 
      name: '낭만주의', 
      nameEn: 'Romanticism',
      icon: '🌹',
      description: '감성과 자연의 숭고함'
    },
    { 
      id: 'baroque', 
      name: '바로크', 
      nameEn: 'Baroque',
      icon: '👑',
      description: '화려하고 극적인 표현'
    },
    { 
      id: 'renaissance', 
      name: '르네상스', 
      nameEn: 'Renaissance',
      icon: '🏛️',
      description: '완벽한 비례와 조화'
    },
    { 
      id: 'classical', 
      name: '그리스-로마', 
      nameEn: 'Classical',
      icon: '⚱️',
      description: '고대의 이상적 아름다움'
    },
    { 
      id: 'byzantine', 
      name: '비잔틴', 
      nameEn: 'Byzantine',
      icon: '✨',
      description: '신성한 황금빛 예술'
    }
  ],
  
  masters: [
    { 
      id: 'klimt', 
      name: '구스타프 클림트', 
      nameEn: 'Gustav Klimt',
      style: 'art-nouveau',
      icon: '✨',
      description: '황금빛 장식미술, 키스'
    },
    {
      id: 'matisse',
      name: '앙리 마티스',
      nameEn: 'Henri Matisse',
      style: 'fauvism',
      icon: '🎨',
      description: '야수파, 색채의 마술사'
    },
    { 
      id: 'munch', 
      name: '에드바르 뭉크', 
      nameEn: 'Edvard Munch',
      style: 'expressionism',
      icon: '😱',
      description: '절규, 불안의 표현'
    },
    { 
      id: 'picasso', 
      name: '파블로 피카소', 
      nameEn: 'Pablo Picasso',
      style: 'cubism',
      icon: '🎭',
      description: '입체주의의 선구자'
    },
    { 
      id: 'vangogh', 
      name: '빈센트 반 고흐', 
      nameEn: 'Vincent van Gogh',
      style: 'post-impressionism',
      icon: '🌻',
      description: '강렬한 색채와 붓터치'
    }
  ],
  
  oriental: [
    { 
      id: 'korean', 
      name: '한국 전통화', 
      nameEn: 'Korean Traditional',
      icon: '🇰🇷',
      description: '먹과 색의 조화, 자연미'
    },
    { 
      id: 'chinese', 
      name: '중국 수묵화', 
      nameEn: 'Chinese Ink Painting',
      icon: '🇨🇳',
      description: '여백의 미, 수묵 정신'
    },
    { 
      id: 'japanese', 
      name: '일본 우키요에', 
      nameEn: 'Japanese Ukiyo-e',
      icon: '🇯🇵',
      description: '판화의 예술, 떠도는 세계'
    }
  ]
};

// Get all options as a flat array
export const getAllStyleOptions = () => {
  return [
    ...STYLE_OPTIONS.movements.map(m => ({ ...m, type: 'movement' })),
    ...STYLE_OPTIONS.masters.map(m => ({ ...m, type: 'master' })),
    ...STYLE_OPTIONS.oriental.map(m => ({ ...m, type: 'oriental' }))
  ];
};

// Get option by id
export const getStyleOption = (id) => {
  const all = getAllStyleOptions();
  return all.find(option => option.id === id);
};

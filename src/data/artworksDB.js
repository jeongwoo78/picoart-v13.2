// Artworks Database - 143 masterpieces
// Western: 98 artworks, Oriental: 45 artworks

export const ARTWORKS_DB = {
  // Impressionism (15 artworks)
  impressionism: [
    {
      id: 'imp_001',
      title: '수련',
      titleEn: 'Water Lilies',
      artist: '클로드 모네',
      artistEn: 'Claude Monet',
      year: 1916,
      style: 'impressionism',
      masterTag: 'monet',
      category: 'western',
      dominantColors: ['#8B9DC3', '#C1D5A4', '#E8F3D6'],
      brightness: 65,
      orientation: 'landscape',
      filename: 'monet_water_lilies.jpg'
    },
    {
      id: 'imp_002',
      title: '인상, 해돋이',
      titleEn: 'Impression, Sunrise',
      artist: '클로드 모네',
      artistEn: 'Claude Monet',
      year: 1872,
      style: 'impressionism',
      masterTag: 'monet',
      category: 'western',
      dominantColors: ['#E8845C', '#7B9BB5', '#F4D6C8'],
      brightness: 55,
      orientation: 'landscape',
      filename: 'monet_impression_sunrise.jpg'
    }
    // Note: Add remaining 13 impressionism artworks
  ],

  // Expressionism (12 artworks)
  expressionism: [
    {
      id: 'exp_001',
      title: '절규',
      titleEn: 'The Scream',
      artist: '에드바르 뭉크',
      artistEn: 'Edvard Munch',
      year: 1893,
      style: 'expressionism',
      masterTag: 'munch',
      category: 'western',
      dominantColors: ['#E8845C', '#4A5F8D', '#F4A460'],
      brightness: 50,
      orientation: 'portrait',
      filename: 'munch_scream.jpg'
    }
    // Note: Add remaining 11 expressionism artworks
  ],

  // Cubism (10 artworks)
  cubism: [
    {
      id: 'cub_001',
      title: '아비뇽의 처녀들',
      titleEn: 'Les Demoiselles d\'Avignon',
      artist: '파블로 피카소',
      artistEn: 'Pablo Picasso',
      year: 1907,
      style: 'cubism',
      masterTag: 'picasso',
      category: 'western',
      dominantColors: ['#D4A574', '#8B7355', '#F5DEB3'],
      brightness: 60,
      orientation: 'portrait',
      filename: 'picasso_demoiselles.jpg'
    }
    // Note: Add remaining 9 cubism artworks
  ],

  // Surrealism (8 artworks)
  surrealism: [
    {
      id: 'sur_001',
      title: '기억의 지속',
      titleEn: 'The Persistence of Memory',
      artist: '살바도르 달리',
      artistEn: 'Salvador Dali',
      year: 1931,
      style: 'surrealism',
      masterTag: 'dali',
      category: 'western',
      dominantColors: ['#D4A76A', '#8B7355', '#87CEEB'],
      brightness: 58,
      orientation: 'landscape',
      filename: 'dali_persistence_memory.jpg'
    }
    // Note: Add remaining 7 surrealism artworks
  ],

  // Romanticism (10 artworks)
  romanticism: [
    {
      id: 'rom_001',
      title: '민중을 이끄는 자유의 여신',
      titleEn: 'Liberty Leading the People',
      artist: '외젠 들라크루아',
      artistEn: 'Eugene Delacroix',
      year: 1830,
      style: 'romanticism',
      masterTag: 'delacroix',
      category: 'western',
      dominantColors: ['#8B4513', '#CD853F', '#F5DEB3'],
      brightness: 45,
      orientation: 'landscape',
      filename: 'delacroix_liberty.jpg'
    }
    // Note: Add remaining 9 romanticism artworks
  ],

  // Baroque (12 artworks)
  baroque: [
    {
      id: 'bar_001',
      title: '야경',
      titleEn: 'The Night Watch',
      artist: '렘브란트',
      artistEn: 'Rembrandt',
      year: 1642,
      style: 'baroque',
      masterTag: 'rembrandt',
      category: 'western',
      dominantColors: ['#8B4513', '#DAA520', '#2F4F4F'],
      brightness: 40,
      orientation: 'landscape',
      filename: 'rembrandt_night_watch.jpg'
    }
    // Note: Add remaining 11 baroque artworks
  ],

  // Renaissance (15 artworks)
  renaissance: [
    {
      id: 'ren_001',
      title: '모나리자',
      titleEn: 'Mona Lisa',
      artist: '레오나르도 다빈치',
      artistEn: 'Leonardo da Vinci',
      year: 1503,
      style: 'renaissance',
      masterTag: 'da-vinci',
      category: 'western',
      dominantColors: ['#8B7355', '#D2B48C', '#556B2F'],
      brightness: 50,
      orientation: 'portrait',
      filename: 'davinci_mona_lisa.jpg'
    }
    // Note: Add remaining 14 renaissance artworks
  ],

  // Classical (8 artworks)
  classical: [
    {
      id: 'cls_001',
      title: '아테네 학당',
      titleEn: 'The School of Athens',
      artist: '라파엘로',
      artistEn: 'Raphael',
      year: 1511,
      style: 'classical',
      masterTag: 'raphael',
      category: 'western',
      dominantColors: ['#D2B48C', '#8B7355', '#F5DEB3'],
      brightness: 65,
      orientation: 'landscape',
      filename: 'raphael_school_athens.jpg'
    }
    // Note: Add remaining 7 classical artworks
  ],

  // Byzantine (8 artworks)
  byzantine: [
    {
      id: 'byz_001',
      title: '하기아 소피아 모자이크',
      titleEn: 'Hagia Sophia Mosaic',
      artist: '비잔틴 예술가',
      artistEn: 'Byzantine Artist',
      year: 1000,
      style: 'byzantine',
      masterTag: null,
      category: 'western',
      dominantColors: ['#DAA520', '#8B4513', '#CD853F'],
      brightness: 55,
      orientation: 'portrait',
      filename: 'byzantine_hagia_sophia.jpg'
    }
    // Note: Add remaining 7 byzantine artworks
  ],

  // Korean Traditional (15 artworks)
  korean: [
    {
      id: 'kor_001',
      title: '인왕제색도',
      titleEn: 'Mt. Inwang After Rain',
      artist: '정선',
      artistEn: 'Jeong Seon',
      year: 1751,
      style: 'korean',
      masterTag: null,
      category: 'oriental',
      dominantColors: ['#8B9DC3', '#D3D3D3', '#2F4F4F'],
      brightness: 60,
      orientation: 'landscape',
      filename: 'korean_inwang.jpg'
    },
    {
      id: 'kor_002',
      title: '금강전도',
      titleEn: 'General View of Mt. Geumgang',
      artist: '정선',
      artistEn: 'Jeong Seon',
      year: 1734,
      style: 'korean',
      masterTag: null,
      category: 'oriental',
      dominantColors: ['#8FBC8F', '#D3D3D3', '#2F4F4F'],
      brightness: 55,
      orientation: 'portrait',
      filename: 'korean_geumgang.jpg'
    }
    // Note: Add remaining 13 Korean artworks
  ],

  // Chinese Ink Painting (15 artworks)
  chinese: [
    {
      id: 'chn_001',
      title: '부춘산거도',
      titleEn: 'Dwelling in the Fuchun Mountains',
      artist: '황공망',
      artistEn: 'Huang Gongwang',
      year: 1350,
      style: 'chinese',
      masterTag: null,
      category: 'oriental',
      dominantColors: ['#D3D3D3', '#8B9DC3', '#2F4F4F'],
      brightness: 70,
      orientation: 'landscape',
      filename: 'chinese_fuchun.jpg'
    }
    // Note: Add remaining 14 Chinese artworks
  ],

  // Japanese Ukiyo-e (15 artworks)
  japanese: [
    {
      id: 'jpn_001',
      title: '가나가와 해변의 높은 파도 아래',
      titleEn: 'The Great Wave off Kanagawa',
      artist: '가쓰시카 호쿠사이',
      artistEn: 'Katsushika Hokusai',
      year: 1831,
      style: 'japanese',
      masterTag: null,
      category: 'oriental',
      dominantColors: ['#4169E1', '#F5F5DC', '#2F4F4F'],
      brightness: 60,
      orientation: 'landscape',
      filename: 'hokusai_great_wave.jpg'
    }
    // Note: Add remaining 14 Japanese artworks
  ]
};

// Helper function to get artworks by style
export const getArtworksByStyle = (styleId) => {
  return ARTWORKS_DB[styleId] || [];
};

// Helper function to get all artworks
export const getAllArtworks = () => {
  return Object.values(ARTWORKS_DB).flat();
};

// Helper function to get artworks by master
export const getArtworksByMaster = (masterId) => {
  return getAllArtworks().filter(artwork => artwork.masterTag === masterId);
};

// Helper function to get artworks by category (oriental type)
export const getArtworksByOriental = (orientalId) => {
  return ARTWORKS_DB[orientalId] || [];
};

import React, { useEffect, useState } from 'react';
import { ARTWORKS_DB } from '../data/artworksDB';
import { matchArtworkToPhoto } from '../utils/artworkMatcher';
import { processStyleTransfer } from '../utils/styleTransferAPI';

const ProcessingScreen = ({ photo, selectedStyle, onComplete }) => {
  const [stage, setStage] = useState(1);
  const [statusText, setStatusText] = useState('사진 분석 중...');
  const [matchedArtwork, setMatchedArtwork] = useState(null);
  const [showEducation, setShowEducation] = useState(false);

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      // Stage 1: Analyze photo
      setStage(1);
      setStatusText('사진의 색상과 구도를 분석하고 있습니다...');
      
      // Get artworks for selected style
      const artworksList = getArtworksForStyle(selectedStyle);
      
      // Stage 2: Match artwork
      await sleep(1500);
      setStage(2);
      setStatusText('최적의 명화를 찾고 있습니다...');
      
      const matchResult = await matchArtworkToPhoto(photo, artworksList);
      
      if (!matchResult.success || !matchResult.artwork) {
        throw new Error('Failed to match artwork');
      }
      
      setMatchedArtwork(matchResult.artwork);
      
      // Show education content
      await sleep(1000);
      setShowEducation(true);
      
      // Stage 3: Apply style transfer
      await sleep(2000);
      setStage(3);
      setStatusText('명화 스타일을 적용하고 있습니다...');
      setShowEducation(false);
      
      // Get API key
      const apiKey = import.meta.env.VITE_REPLICATE_API_KEY;
      
      // Process with progress callback
      const result = await processStyleTransfer(
        photo, 
        matchResult.artwork, 
        apiKey,
        (progressText) => setStatusText(progressText)
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Style transfer failed');
      }
      
      // Stage 4: Complete
      setStage(4);
      setStatusText('완성되었습니다!');
      await sleep(500);
      
      onComplete(matchResult.artwork, result.resultUrl);
      
    } catch (error) {
      console.error('Processing error:', error);
      setStatusText('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // Get artworks based on selected style
  const getArtworksForStyle = (styleOption) => {
    const { type, id } = styleOption;
    
    if (type === 'movement') {
      return ARTWORKS_DB[id] || [];
    } else if (type === 'master') {
      // Filter by masterTag
      const allArtworks = Object.values(ARTWORKS_DB).flat();
      return allArtworks.filter(art => art.masterTag === id);
    } else if (type === 'oriental') {
      // Filter by category
      const allArtworks = Object.values(ARTWORKS_DB).flat();
      return allArtworks.filter(art => art.category === id);
    }
    
    return [];
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="processing-screen">
      <div className="processing-content">
        <h2>🎨 변환 중</h2>
        
        {/* Progress stages */}
        <div className="progress-stages">
          <div className={`stage ${stage >= 1 ? 'active' : ''} ${stage > 1 ? 'complete' : ''}`}>
            <span className="stage-number">1</span>
            <span className="stage-label">사진 분석</span>
          </div>
          <div className={`stage ${stage >= 2 ? 'active' : ''} ${stage > 2 ? 'complete' : ''}`}>
            <span className="stage-number">2</span>
            <span className="stage-label">작품 매칭</span>
          </div>
          <div className={`stage ${stage >= 3 ? 'active' : ''} ${stage > 3 ? 'complete' : ''}`}>
            <span className="stage-number">3</span>
            <span className="stage-label">스타일 변환</span>
          </div>
          <div className={`stage ${stage >= 4 ? 'active' : ''}`}>
            <span className="stage-number">4</span>
            <span className="stage-label">완성</span>
          </div>
        </div>

        {/* Status text */}
        <p className="status-text">{statusText}</p>

        {/* Loading animation */}
        <div className="loading-animation">
          <div className="spinner"></div>
        </div>

        {/* Education content - shown during matching */}
        {showEducation && matchedArtwork && (
          <div className="education-content">
            <div className="artwork-info">
              <h3>🎨 매칭된 작품</h3>
              <p className="artwork-title">
                <strong>{matchedArtwork.title}</strong>
                {matchedArtwork.titleEn && ` (${matchedArtwork.titleEn})`}
              </p>
              <p className="artwork-artist">
                {matchedArtwork.artist} {matchedArtwork.year && `• ${matchedArtwork.year}년`}
              </p>
            </div>

            <div className="style-info">
              <h4>💡 이 작품에 대하여</h4>
              <p className="style-description-text">
                {getStyleEducation(matchedArtwork.style).description}
              </p>
            </div>

            <div className="matching-reason">
              <h4>🎯 왜 이 작품일까요?</h4>
              <p className="reason-text">
                {getMatchingReason(matchedArtwork, selectedStyle)}
              </p>
            </div>

            {getStyleEducation(matchedArtwork.style).funFact && (
              <div className="fun-fact">
                <h4>✨ 재미있는 사실</h4>
                <p className="fact-text">
                  {getStyleEducation(matchedArtwork.style).funFact}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="processing-note">
          잠시만 기다려주세요. 고품질 변환을 위해 20-40초 정도 소요됩니다.
        </p>
      </div>
    </div>
  );
};

// Get style education content - 9개 사조 + 5개 마스터 + 3개 동양화
const getStyleEducation = (styleId) => {
  const education = {
    // ===== 9개 미술 사조 =====
    impressionism: {
      description: '인상주의는 19세기 후반 프랑스에서 시작된 미술 운동으로, 빛과 색채의 순간적인 인상을 포착하는 것이 특징입니다. 야외에서 빠른 붓터치로 자연광의 변화를 표현했습니다.',
      funFact: '인상주의라는 이름은 비평가들이 모네의 "인상, 해돋이"를 보고 조롱하며 붙인 것이었지만, 화가들은 이를 자랑스럽게 받아들였습니다.'
    },
    expressionism: {
      description: '표현주의는 20세기 초 독일과 북유럽에서 발전한 미술 운동으로, 내면의 감정과 주관적 경험을 강렬하게 표현합니다. 왜곡된 형태와 강렬한 색채가 특징입니다.',
      funFact: '뭉크의 "절규"는 작가가 실제로 느낀 공포와 불안을 표현한 것으로, 당시 화산 폭발로 인한 붉은 하늘에서 영감을 받았다고 합니다.'
    },
    cubism: {
      description: '입체주의는 피카소와 브라크가 창시한 혁명적 미술 운동으로, 대상을 여러 시점에서 동시에 표현합니다. 기하학적 형태로 분해하고 재구성하는 것이 특징입니다.',
      funFact: '입체주의는 20세기 미술에 가장 큰 영향을 미친 운동 중 하나로, 추상미술의 토대가 되었습니다. 피카소의 "아비뇽의 처녀들"은 입체주의의 시작을 알린 혁명적 작품입니다.'
    },
    surrealism: {
      description: '초현실주의는 1920년대 시작된 예술 운동으로, 무의식과 꿈의 세계를 탐구합니다. 비논리적이고 환상적인 이미지 조합이 특징입니다.',
      funFact: '달리는 자신의 그림을 그릴 때 반쯤 잠든 상태에서 꿈을 포착하려 했으며, 손에 열쇠를 들고 접시 위에서 떨어뜨려 깨어나는 기법을 사용했습니다.'
    },
    romanticism: {
      description: '낭만주의는 18세기 말-19세기 초 유럽에서 발전한 예술 운동으로, 감정, 상상력, 자연의 숭고함을 강조합니다. 극적이고 감성적인 표현이 특징입니다.',
      funFact: '낭만주의 화가들은 산업혁명에 대한 반발로 자연과 감정의 가치를 재발견했습니다. 격렬한 폭풍우나 거친 바다 같은 자연의 힘을 즐겨 그렸습니다.'
    },
    baroque: {
      description: '바로크는 17세기 유럽 미술의 주류로, 극적인 명암 대비, 풍부한 색채, 역동적인 구도가 특징입니다. 권력과 종교의 웅장함을 표현했습니다.',
      funFact: '바로크라는 말은 원래 "일그러진 진주"를 뜻하는 포르투갈어로, 처음에는 비하하는 의미였습니다. 카라바조는 빛과 그림자의 극적 대비로 바로크 회화를 혁신했습니다.'
    },
    renaissance: {
      description: '르네상스는 14-16세기 이탈리아에서 시작된 문화 운동으로, 고전 문화의 부활과 인간 중심 사상을 특징으로 합니다. 완벽한 원근법과 인체 표현이 발전했습니다.',
      funFact: '레오나르도 다빈치는 완벽주의자여서 "모나리자"를 4년간 작업하고도 완성되지 않았다고 생각했습니다. 미켈란젤로는 시스티나 성당 천장화를 4년간 거의 누워서 그렸습니다.'
    },
    classical: {
      description: '고전주의는 고대 그리스-로마 문화를 이상으로 삼는 예술 양식으로, 조화, 균형, 이상적 아름다움을 추구합니다. 완벽한 비례와 절제된 감정 표현이 특징입니다.',
      funFact: '그리스 조각의 하얀색은 원래 색이 아니라, 시간이 지나 채색이 벗겨진 것입니다. 원래는 화려한 색으로 칠해져 있었습니다.'
    },
    byzantine: {
      description: '비잔틴 미술은 4-15세기 비잔틴 제국의 기독교 미술로, 황금빛 배경과 평면적이고 상징적인 표현이 특징입니다. 신성함과 영성을 강조합니다.',
      funFact: '비잔틴 성화(이콘)는 단순히 그림이 아니라 신성한 대상으로 여겨져, 특별한 의식과 기도 속에서 제작되었습니다. 금박은 신의 빛을 상징합니다.'
    },

    // ===== 5개 거장 (Masters) =====
    klimt: {
      description: '구스타프 클림트(1862-1918)는 오스트리아 분리파를 대표하는 화가입니다. 황금빛 장식과 관능적인 표현이 특징이며, "키스"는 그의 대표작입니다. 비잔틴 모자이크에서 영감을 받았습니다.',
      funFact: '클림트는 작품에 실제 금박을 사용했습니다. 그의 "아델레 블로흐바우어의 초상"은 나치에 약탈당했다가 반환되어, 역사상 가장 비싼 그림 중 하나가 되었습니다.'
    },
    matisse: {
      description: '앙리 마티스(1869-1954)는 야수파(포비즘)의 리더이자 20세기 색채 혁명의 선구자입니다. 순수하고 강렬한 색채 사용이 특징이며, 말년에는 종이 오려붙이기 작품으로 새로운 경지를 열었습니다.',
      funFact: '마티스는 70대에 암 수술로 거동이 불편해지자, 가위와 색종이로 "춤"과 "푸른 누드" 같은 걸작을 만들었습니다. 그는 "그림은 정신의 안락의자"라고 말했습니다.'
    },
    munch: {
      description: '에드바르 뭉크(1863-1944)는 노르웨이 표현주의의 선구자입니다. 불안, 고독, 죽음 같은 인간의 내면을 강렬하게 표현했습니다. "절규"는 세계에서 가장 유명한 그림 중 하나입니다.',
      funFact: '뭉크는 어머니와 누나를 결핵으로 잃은 트라우마가 평생 작품에 영향을 주었습니다. "절규"는 4개 버전이 있으며, 그 중 하나는 1억 달러 이상에 팔렸습니다.'
    },
    picasso: {
      description: '파블로 피카소(1881-1973)는 20세기 가장 영향력 있는 예술가입니다. 입체주의를 창시했으며, 평생 다양한 양식을 실험했습니다. 5만점 이상의 작품을 남긴 다작 작가입니다.',
      funFact: '피카소의 정식 이름은 23개 단어로 이루어져 있습니다. 그는 91세까지 살며 청색시대, 장미빛시대, 입체주의, 신고전주의 등 여러 시기를 거쳤습니다.'
    },
    vangogh: {
      description: '빈센트 반 고흐(1853-1890)는 후기 인상주의를 대표하는 네덜란드 화가입니다. 강렬한 색채와 역동적인 붓터치가 특징이며, 짧은 생애 동안 2000점 이상의 작품을 남겼습니다.',
      funFact: '고흐는 생전에 단 한 점의 그림만 팔렸지만, 지금은 세계에서 가장 사랑받는 화가입니다. 동생 테오에게 보낸 편지는 그의 예술 철학을 보여주는 귀중한 자료입니다.'
    },

    // ===== 3개 동양화 =====
    korean: {
      description: '한국 전통화는 먹과 채색을 사용한 회화로, 자연의 아름다움과 정신을 담아냅니다. 여백의 미와 절제된 표현이 특징입니다. 산수화, 인물화, 화조화 등 다양한 장르가 발전했습니다.',
      funFact: '겸재 정선의 "인왕제색도"는 비 갠 후 인왕산을 그린 작품으로, 한국 산수화의 걸작으로 꼽힙니다. 한국화는 그리는 것보다 비우는 것을 더 중시합니다.'
    },
    chinese: {
      description: '중국 수묵화는 먹의 농담만으로 자연과 정신세계를 표현하는 예술입니다. "기운생동(氣韻生動)"이라는 생명력 있는 표현을 중시하며, 문인화 전통이 깊습니다.',
      funFact: '중국 문인화가들은 그림을 그리기 전 긴 명상을 통해 마음을 비우고, 한 번의 붓질로 완성하는 경지를 추구했습니다. 대나무는 선비 정신을 상징하는 소재였습니다.'
    },
    japanese: {
      description: '일본 우키요에(浮世絵)는 "떠도는 세상의 그림"이란 뜻으로, 에도시대 서민들의 일상과 풍경을 목판화로 표현한 예술입니다. 대담한 구도와 선명한 색채가 특징입니다.',
      funFact: '고흐와 모네 등 인상파 화가들은 우키요에의 평면적 구도와 대담한 색채에 큰 영향을 받았습니다. 호쿠사이의 "가나가와 해변의 높은 파도 아래"는 세계에서 가장 유명한 판화입니다.'
    }
  };

  return education[styleId] || { description: '선택하신 스타일로 변환하고 있습니다.', funFact: '' };
};

// Get matching reason
const getMatchingReason = (artwork, selectedStyle) => {
  const reasons = [
    `이 작품은 ${selectedStyle.name} 스타일의 대표작으로, 당신의 사진과 색채 조화가 뛰어납니다.`,
    `${artwork.artist}의 특징적인 색감이 당신의 사진과 완벽하게 어울립니다.`,
    `사진 속 분위기와 구도가 이 명화의 특성과 잘 맞아떨어집니다.`,
    `AI가 분석한 결과, 이 작품이 당신의 사진을 가장 아름답게 표현할 수 있습니다.`
  ];

  // Return random reason
  return reasons[Math.floor(Math.random() * reasons.length)];
};

export default ProcessingScreen;

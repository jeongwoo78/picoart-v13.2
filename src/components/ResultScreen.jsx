import React from 'react';

function ResultScreen({ originalPhoto, resultImage, artwork, selectedStyle, onReset }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `picoart-${artwork.title || 'result'}.jpg`;
    link.click();
  };

  return (
    <div className="result-screen">
      <div className="result-container">
        <h2>✨ 완성!</h2>

        <div className="result-images">
          <div className="result-image-container">
            <img src={resultImage} alt="Transformed artwork" className="result-image" />
          </div>
        </div>

        <div className="artwork-info-card">
          <h3>📚 선택된 작품</h3>
          
          <div className="artwork-details">
            <div className="artwork-header">
              <h4>{artwork.title}</h4>
              {artwork.titleEn && <p className="artwork-title-en">{artwork.titleEn}</p>}
            </div>

            <div className="artwork-meta">
              <p className="artwork-artist">
                <strong>작가:</strong> {artwork.artist}
                {artwork.artistEn && ` (${artwork.artistEn})`}
              </p>
              {artwork.year && (
                <p className="artwork-year">
                  <strong>제작년도:</strong> {artwork.year}
                </p>
              )}
              {artwork.style && (
                <p className="artwork-style">
                  <strong>스타일:</strong> {selectedStyle.name}
                </p>
              )}
            </div>

            <div className="artwork-explanation">
              <p className="explanation-title">💡 왜 이 작품?</p>
              <p className="explanation-text">
                선택하신 {selectedStyle.name} 중에서 사진의 색감과 구도가 
                이 작품과 가장 잘 어울립니다. AI가 143개의 명화 데이터베이스에서 
                자동으로 최적의 작품을 선택했습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button className="download-button" onClick={handleDownload}>
            💾 저장하기
          </button>
          <button className="reset-button" onClick={onReset}>
            🔄 처음으로
          </button>
        </div>

        <div className="share-info">
          <p>마음에 드시나요? 친구들과 공유해보세요!</p>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;

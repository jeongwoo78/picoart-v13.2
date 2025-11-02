import React, { useRef, useState } from 'react';

function UploadScreen({ onUpload }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Pass to parent after short delay
    setTimeout(() => {
      onUpload(file);
    }, 500);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-screen">
      <div className="upload-container">
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <div className="preview-overlay">
                <p>✓ 사진이 선택되었습니다</p>
              </div>
            </div>
          ) : (
            <>
              <div className="upload-icon">📷</div>
              <p className="upload-text">사진을 여기에 드래그하거나 클릭하세요</p>
              <p className="upload-hint">JPG, PNG 파일 지원</p>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>

        <button className="camera-button" onClick={handleClick}>
          📷 사진 선택하기
        </button>
      </div>

      <div className="info-section">
        <h2>PicoArt는 어떻게 작동하나요?</h2>
        <div className="info-steps">
          <div className="info-step">
            <div className="step-number">1</div>
            <p>사진을 업로드하세요</p>
          </div>
          <div className="info-step">
            <div className="step-number">2</div>
            <p>원하는 스타일을 선택하세요</p>
          </div>
          <div className="info-step">
            <div className="step-number">3</div>
            <p>AI가 최적의 명화를 자동으로 찾아드립니다</p>
          </div>
          <div className="info-step">
            <div className="step-number">4</div>
            <p>당신의 사진이 예술작품으로 변환됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadScreen;

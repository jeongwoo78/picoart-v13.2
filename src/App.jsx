import React, { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import StyleSelection from './components/StyleSelection';
import ProcessingScreen from './components/ProcessingScreen';
import ResultScreen from './components/ResultScreen';
import './styles/App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('upload'); // upload, style, processing, result
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [matchedArtwork, setMatchedArtwork] = useState(null);
  const [resultImage, setResultImage] = useState(null);

  const handlePhotoUpload = (file) => {
    setUploadedPhoto(file);
    setCurrentScreen('style');
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = (artwork, result) => {
    setMatchedArtwork(artwork);
    setResultImage(result);
    setCurrentScreen('result');
  };

  const handleReset = () => {
    setCurrentScreen('upload');
    setUploadedPhoto(null);
    setSelectedStyle(null);
    setMatchedArtwork(null);
    setResultImage(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎨 PicoArt</h1>
        <p className="tagline">당신의 사진을 명화로</p>
      </header>

      <main className="App-main">
        {currentScreen === 'upload' && (
          <UploadScreen onUpload={handlePhotoUpload} />
        )}

        {currentScreen === 'style' && (
          <StyleSelection onSelect={handleStyleSelect} onBack={handleReset} />
        )}

        {currentScreen === 'processing' && (
          <ProcessingScreen
            photo={uploadedPhoto}
            selectedStyle={selectedStyle}
            onComplete={handleProcessingComplete}
          />
        )}

        {currentScreen === 'result' && (
          <ResultScreen
            originalPhoto={uploadedPhoto}
            resultImage={resultImage}
            artwork={matchedArtwork}
            selectedStyle={selectedStyle}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>PicoArt v12 - AI 기반 명화 스타일 변환</p>
        <p>특허: 10-2018-0016297, 10-2018-0122600</p>
      </footer>
    </div>
  );
}

export default App;

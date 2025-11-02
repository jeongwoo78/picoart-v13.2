import React, { useState } from 'react';
import { STYLE_OPTIONS } from '../data/styleOptions';

function StyleSelection({ onSelect, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('movements');

  const handleStyleClick = (style, type) => {
    onSelect({ ...style, type });
  };

  return (
    <div className="style-selection">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <h2>어떤 스타일을 원하시나요?</h2>
      <p className="subtitle">선택하신 범주 내에서 AI가 최적의 명화를 자동으로 찾아드립니다</p>

      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === 'movements' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('movements')}
        >
          🏛️ 미술 사조
        </button>
        <button
          className={`category-tab ${selectedCategory === 'masters' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('masters')}
        >
          👨‍🎨 거장 (마스터)
        </button>
        <button
          className={`category-tab ${selectedCategory === 'oriental' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('oriental')}
        >
          🎎 동양화
        </button>
      </div>

      <div className="styles-grid">
        {selectedCategory === 'movements' && STYLE_OPTIONS.movements.map(style => (
          <div
            key={style.id}
            className="style-card"
            onClick={() => handleStyleClick(style, 'movement')}
          >
            <div className="style-icon">{style.icon}</div>
            <h3>{style.name}</h3>
            <p className="style-name-en">{style.nameEn}</p>
            <p className="style-description">{style.description}</p>
          </div>
        ))}

        {selectedCategory === 'masters' && STYLE_OPTIONS.masters.map(style => (
          <div
            key={style.id}
            className="style-card"
            onClick={() => handleStyleClick(style, 'master')}
          >
            <div className="style-icon">{style.icon}</div>
            <h3>{style.name}</h3>
            <p className="style-name-en">{style.nameEn}</p>
            <p className="style-description">{style.description}</p>
          </div>
        ))}

        {selectedCategory === 'oriental' && STYLE_OPTIONS.oriental.map(style => (
          <div
            key={style.id}
            className="style-card"
            onClick={() => handleStyleClick(style, 'oriental')}
          >
            <div className="style-icon">{style.icon}</div>
            <h3>{style.name}</h3>
            <p className="style-name-en">{style.nameEn}</p>
            <p className="style-description">{style.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StyleSelection;

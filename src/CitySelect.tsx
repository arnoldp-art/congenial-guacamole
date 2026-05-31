import React, { useEffect, useState } from 'react';
import { CityConfig } from './cities';
import './CitySelect.css';

interface Props {
  cities: CityConfig[];
  onSelect: (city: CityConfig) => void;
}

export default function CitySelect({ cities, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  function choose(city: CityConfig) {
    setVisible(false);
    setTimeout(() => onSelect(city), 500);
  }

  return (
    <div className={`city-select ${visible ? 'cs-visible' : ''}`}>
      <div className="cs-header">
        <div className="cs-title">Through Time</div>
        <div className="cs-subtitle">Historical map explorer</div>
      </div>

      <div className="cs-cards">
        {cities.map(city => (
          <button
            key={city.id}
            className={`cs-card ${hoveredId === city.id ? 'cs-hovered' : ''}`}
            style={{ '--accent': city.heroColor } as React.CSSProperties}
            onMouseEnter={() => setHoveredId(city.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => choose(city)}
          >
            <div className="cs-card-glow" />
            <div className="cs-card-body">
              <div className="cs-city-name">{city.name}</div>
              <div className="cs-city-sub">{city.subtitle}</div>
              <div className="cs-city-range">{city.minYear} – {city.maxYear}</div>
              <div className="cs-card-cta">Explore →</div>
            </div>
          </button>
        ))}
      </div>

      <div className="cs-footer">Drag · Zoom · Scrub through centuries</div>
    </div>
  );
}

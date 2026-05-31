import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MAPS, computeOpacities, MIN_YEAR, MAX_YEAR } from './maps';
import { PAINTINGS, type Painting } from './paintings';

const MECHELEN: [number, number] = [51.028, 4.480];
const ZOOM = 13;
const SPEEDS = [{ label: 'Slow', ms: 300 }, { label: 'Normal', ms: 80 }, { label: 'Fast', ms: 20 }];

// Recentres map on Mechelen whenever the year crosses an era boundary
function Recentre({ year }: { year: number }) {
  const map = useMap();
  const prev = useRef(year);
  useEffect(() => {
    // Recentre when playing through era transitions (every ~50 years)
    if (Math.floor(year / 50) !== Math.floor(prev.current / 50)) {
      map.setView(MECHELEN, map.getZoom(), { animate: true });
    }
    prev.current = year;
  }, [year, map]);
  return null;
}

export default function App() {
  const [year, setYear] = useState(MIN_YEAR);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [activePainting, setActivePainting] = useState<Painting | null>(null);
  const [expandedPainting, setExpandedPainting] = useState<Painting | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const opacities = computeOpacities(year);
  const primaryIdx = opacities.indexOf(Math.max(...opacities));
  const secondaryIdx = opacities.findIndex((o, i) => i !== primaryIdx && o > 0.05);
  const inTransition = secondaryIdx !== -1;

  // Pick the most recent applicable painting for the current year
  const currentPaintings = PAINTINGS.filter(
    p => year >= p.showFromYear && year <= p.showToYear
  );
  const latestPainting = currentPaintings[currentPaintings.length - 1] ?? null;

  // Auto-show new painting when era changes
  useEffect(() => {
    if (latestPainting?.id !== activePainting?.id) {
      setActivePainting(latestPainting);
    }
  }, [latestPainting?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const tick = useCallback(() => {
    setYear(y => {
      if (y >= MAX_YEAR) { setPlaying(false); return MAX_YEAR; }
      return y + 1;
    });
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(tick, SPEEDS[speedIdx].ms);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speedIdx, tick]);

  return (
    <div className="app">
      <div className="map-wrapper">
        <MapContainer
          center={MECHELEN}
          zoom={ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <Recentre year={year} />

          {/* Historical tile layers */}
          {MAPS.map((m, i) => {
            if (opacities[i] < 0.01) return null;
            return (
              <TileLayer
                key={m.id}
                url={m.url}
                opacity={opacities[i]}
                attribution={m.attribution}
              />
            );
          })}

          {/* Historical painting as map overlay when toggled */}
          {showOverlay && activePainting && (
            <ImageOverlay
              url={activePainting.imageUrl}
              bounds={activePainting.bounds}
              opacity={0.65}
            />
          )}
        </MapContainer>
      </div>

      {/* Map info — top left */}
      <div className="map-info">
        <div className="map-name">{MAPS[primaryIdx].name}</div>
        {inTransition ? (
          <div className="blend-indicator">
            <span>{MAPS[primaryIdx].name}</span>
            <div className="blend-bar">
              <div className="blend-fill" style={{ width: `${Math.round(opacities[secondaryIdx] * 100)}%` }} />
            </div>
            <span>{MAPS[secondaryIdx].name}</span>
          </div>
        ) : (
          <div className="map-desc">{MAPS[primaryIdx].description}</div>
        )}
      </div>

      {/* Historical painting panel — top right */}
      {activePainting && (
        <div className="painting-panel">
          <div className="painting-header">
            <div className="painting-title">{activePainting.title}</div>
            <div className="painting-meta">{activePainting.creator} · {activePainting.year}</div>
            <div className="painting-actions">
              <button
                className={`overlay-btn ${showOverlay ? 'active' : ''}`}
                onClick={() => setShowOverlay(v => !v)}
                title="Show as map overlay"
              >
                {showOverlay ? '🗺 Hide overlay' : '🗺 Map overlay'}
              </button>
              <button
                className="expand-btn"
                onClick={() => setExpandedPainting(activePainting)}
                title="View full size"
              >
                ⛶
              </button>
            </div>
          </div>
          <div className="painting-thumb-wrap" onClick={() => setExpandedPainting(activePainting)}>
            <img
              src={activePainting.imageUrl}
              alt={activePainting.title}
              className="painting-thumb"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          {currentPaintings.length > 1 && (
            <div className="painting-switcher">
              {currentPaintings.map(p => (
                <button
                  key={p.id}
                  className={`switch-btn ${activePainting.id === p.id ? 'active' : ''}`}
                  onClick={() => setActivePainting(p)}
                >
                  {p.year}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full-size painting lightbox */}
      {expandedPainting && (
        <div className="lightbox" onClick={() => setExpandedPainting(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setExpandedPainting(null)}>✕</button>
            <img src={expandedPainting.imageUrl} alt={expandedPainting.title} className="lightbox-img" />
            <div className="lightbox-caption">
              <strong>{expandedPainting.title}</strong> · {expandedPainting.creator} · {expandedPainting.year}
              <br /><span>{expandedPainting.description}</span>
              <br /><span className="lightbox-source">{expandedPainting.source}</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <button
          className="play-btn"
          onClick={() => { if (year >= MAX_YEAR) setYear(MIN_YEAR); setPlaying(p => !p); }}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <span className="year-num">{year}</span>
        <input
          className="slider"
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={year}
          onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }}
        />
        <div className="speed-btns">
          {SPEEDS.map((s, i) => (
            <button
              key={s.label}
              className={`speed-btn ${speedIdx === i ? 'active' : ''}`}
              onClick={() => setSpeedIdx(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline ticks */}
      <div className="tick-row">
        {MAPS.map(m => (
          <button
            key={m.id}
            className="tick"
            style={{ left: `${((m.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
            onClick={() => { setPlaying(false); setYear(m.year); }}
            title={`${m.year} · ${m.name}`}
          >
            <span className="tick-line" />
            <span className="tick-label">{m.year}</span>
          </button>
        ))}
        {PAINTINGS.map(p => (
          <button
            key={p.id}
            className="tick tick-painting"
            style={{ left: `${((p.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
            onClick={() => { setPlaying(false); setYear(p.year); setActivePainting(p); }}
            title={`${p.year} · ${p.title} · ${p.creator}`}
          >
            <span className="tick-line" />
            <span className="tick-label">🖼</span>
          </button>
        ))}
      </div>
    </div>
  );
}

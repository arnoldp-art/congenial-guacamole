import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MAPS, computeOpacities, MIN_YEAR, MAX_YEAR } from './maps';
import { PAINTINGS, type Painting } from './paintings';

const MECHELEN: [number, number] = [51.028, 4.480];
const ZOOM = 13;
const SPEEDS = [{ label: 'Slow', ms: 300 }, { label: 'Normal', ms: 80 }, { label: 'Fast', ms: 20 }];

function Recentre({ year }: { year: number }) {
  const map = useMap();
  const prev = useRef(year);
  useEffect(() => {
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
  const [mobilePaintingOpen, setMobilePaintingOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const opacities = computeOpacities(year);
  const primaryIdx = opacities.indexOf(Math.max(...opacities));
  const secondaryIdx = opacities.findIndex((o, i) => i !== primaryIdx && o > 0.05);
  const inTransition = secondaryIdx !== -1;

  const currentPaintings = PAINTINGS.filter(p => year >= p.showFromYear && year <= p.showToYear);
  const latestPainting = currentPaintings[currentPaintings.length - 1] ?? null;

  useEffect(() => {
    if (latestPainting?.id !== activePainting?.id) {
      setActivePainting(latestPainting);
      setMobilePaintingOpen(false);
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

  const paintingPanel = activePainting && (
    <>
      <div className="painting-header">
        <div className="painting-title">{activePainting.title}</div>
        <div className="painting-meta">{activePainting.creator} · {activePainting.year}</div>
        <div className="painting-actions">
          <button
            className={`overlay-btn ${showOverlay ? 'active' : ''}`}
            onClick={() => setShowOverlay(v => !v)}
          >
            {showOverlay ? '🗺 Hide overlay' : '🗺 Map overlay'}
          </button>
          <button className="expand-btn" onClick={() => setExpandedPainting(activePainting)}>⛶</button>
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
    </>
  );

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
          {MAPS.map((m, i) => opacities[i] < 0.01 ? null : (
            <TileLayer key={m.id} url={m.url} opacity={opacities[i]} attribution={m.attribution} />
          ))}
          {showOverlay && activePainting && (
            <ImageOverlay url={activePainting.imageUrl} bounds={activePainting.bounds} opacity={0.65} />
          )}
        </MapContainer>
      </div>

      {/* Map info — top left (both) */}
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

      {/* ── DESKTOP: painting panel top-right ── */}
      {activePainting && (
        <div className="painting-panel desktop-only">
          {paintingPanel}
        </div>
      )}

      {/* ── MOBILE: floating painting button + bottom sheet ── */}
      {activePainting && (
        <button
          className="mobile-painting-btn mobile-only"
          onClick={() => setMobilePaintingOpen(v => !v)}
          title="View historical painting"
        >
          🖼
          <span className="mobile-painting-badge">{activePainting.year}</span>
        </button>
      )}

      {mobilePaintingOpen && activePainting && (
        <div className="mobile-painting-sheet mobile-only">
          <div className="mobile-sheet-handle" onClick={() => setMobilePaintingOpen(false)} />
          {paintingPanel}
        </div>
      )}

      {/* Full-size lightbox (both) */}
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

      {/* ── DESKTOP: bottom bar ── */}
      <div className="bottom-bar desktop-only">
        <div className="controls-row">
          <button className="play-btn" onClick={() => { if (year >= MAX_YEAR) setYear(MIN_YEAR); setPlaying(p => !p); }}>
            {playing ? '⏸' : '▶'}
          </button>
          <span className="year-num">{year}</span>
          <div className="slider-wrap">
            <input className="slider" type="range" min={MIN_YEAR} max={MAX_YEAR} value={year}
              onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }} />
          </div>
          <div className="speed-btns">
            {SPEEDS.map((s, i) => (
              <button key={s.label} className={`speed-btn ${speedIdx === i ? 'active' : ''}`}
                onClick={() => setSpeedIdx(i)}>{s.label}</button>
            ))}
          </div>
        </div>
        <div className="tick-row">
          {MAPS.map(m => (
            <button key={m.id} className="tick"
              style={{ left: `${((m.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
              onClick={() => { setPlaying(false); setYear(m.year); }} title={`${m.year} · ${m.name}`}>
              <span className="tick-line" /><span className="tick-label">{m.year}</span>
            </button>
          ))}
          {PAINTINGS.map(p => (
            <button key={p.id} className="tick tick-painting"
              style={{ left: `${((p.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
              onClick={() => { setPlaying(false); setYear(p.year); setActivePainting(p); }}
              title={`${p.year} · ${p.title}`}>
              <span className="tick-line" /><span className="tick-label">🖼</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MOBILE: bottom controls ── */}
      <div className="mobile-bar mobile-only">
        {/* Year + play */}
        <div className="mobile-top-row">
          <button className="mobile-play-btn" onClick={() => { if (year >= MAX_YEAR) setYear(MIN_YEAR); setPlaying(p => !p); }}>
            {playing ? '⏸' : '▶'}
          </button>
          <span className="mobile-year">{year}</span>
          <div className="mobile-speed-btns">
            {SPEEDS.map((s, i) => (
              <button key={s.label} className={`mobile-speed-btn ${speedIdx === i ? 'active' : ''}`}
                onClick={() => setSpeedIdx(i)}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="mobile-slider-row">
          <span className="mobile-year-edge">{MIN_YEAR}</span>
          <input className="mobile-slider" type="range" min={MIN_YEAR} max={MAX_YEAR} value={year}
            onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }} />
          <span className="mobile-year-edge">{MAX_YEAR}</span>
        </div>

        {/* Key era jump buttons */}
        <div className="mobile-era-row">
          {[...MAPS, ...PAINTINGS]
            .sort((a, b) => a.year - b.year)
            .filter((m, i, arr) => i === 0 || m.year - arr[i-1].year > 20)
            .map(m => (
              <button
                key={m.id}
                className={`mobile-era-btn ${'imageUrl' in m ? 'is-painting' : ''} ${year === m.year ? 'active' : ''}`}
                onClick={() => { setPlaying(false); setYear(m.year); if ('imageUrl' in m) setActivePainting(m as Painting); }}
              >
                {'imageUrl' in m ? '🖼' : ''}{m.year}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
}

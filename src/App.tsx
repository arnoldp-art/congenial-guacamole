import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MAPS, MIN_YEAR, MAX_YEAR } from './maps';

const MECHELEN: [number, number] = [51.028, 4.480];
const ZOOM = 13;
const SPEEDS = [{ label: 'Slow', ms: 300 }, { label: 'Normal', ms: 80 }, { label: 'Fast', ms: 20 }];

// Which map index is active for a given year
function activeMapIdx(year: number): number {
  let idx = 0;
  for (let i = 0; i < MAPS.length; i++) {
    if (year >= MAPS[i].year) idx = i;
  }
  return idx;
}

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
  const [failedMaps, setFailedMaps] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPrimaryRef = useRef(-1);

  const primaryIdx = activeMapIdx(year);
  const currentMapFailed = failedMaps.has(MAPS[primaryIdx]?.id);

  // ── Pause automatically when a new map becomes primary ──────────────────
  useEffect(() => {
    if (prevPrimaryRef.current !== -1 && primaryIdx !== prevPrimaryRef.current && playing) {
      setPlaying(false);
    }
    prevPrimaryRef.current = primaryIdx;
  }, [primaryIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Playback ─────────────────────────────────────────────────────────────
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

  // ── Skip to next / prev map ──────────────────────────────────────────────
  const goNext = useCallback(() => {
    setPlaying(false);
    const next = MAPS.find(m => m.year > year);
    if (next) setYear(next.year);
  }, [year]);

  const goPrev = useCallback(() => {
    setPlaying(false);
    const prev = [...MAPS].reverse().find(m => m.year < year);
    if (prev) setYear(prev.year);
  }, [year]);

  const markFailed = useCallback((id: string) => {
    setFailedMaps(s => { const n = new Set(s); n.add(id); return n; });
  }, []);

  // ── Transport controls (shared desktop/mobile) ───────────────────────────
  const transportControls = (isMobile = false) => {
    const prefix = isMobile ? 'mobile-' : '';
    return (
      <div className={`${prefix}transport`}>
        <button className={`${prefix}skip-btn`} onClick={goPrev} title="Previous map"
          disabled={!MAPS.find(m => m.year < year)}>⏮</button>
        <button className={`${prefix}play-btn`}
          onClick={() => { if (year >= MAX_YEAR) setYear(MIN_YEAR); setPlaying(p => !p); }}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className={`${prefix}skip-btn`} onClick={goNext} title="Next map"
          disabled={!MAPS.find(m => m.year > year)}>⏭</button>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="map-wrapper">
        <MapContainer center={MECHELEN} zoom={ZOOM}
          style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <Recentre year={year} />
          {MAPS.map((m, i) => i !== primaryIdx ? null : (
            <TileLayer key={m.id} url={m.url} opacity={1} attribution={m.attribution}
              eventHandlers={{ tileerror: () => markFailed(m.id) }} />
          ))}
        </MapContainer>
      </div>

      {/* Map info — top left */}
      <div className="map-info">
        <div className="map-name">
          {MAPS[primaryIdx].name}
          {currentMapFailed && <span className="map-failed-badge">⚠ not loading</span>}
        </div>
        <div className="map-desc">{MAPS[primaryIdx].description}</div>
      </div>

      {/* DESKTOP bottom bar */}
      <div className="bottom-bar desktop-only">
        <div className="controls-row">
          {transportControls(false)}
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
            <button key={m.id}
              className={`tick ${failedMaps.has(m.id) ? 'tick-failed' : ''}`}
              style={{ left: `${((m.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
              onClick={() => { setPlaying(false); setYear(m.year); }}
              title={`${m.year} · ${m.name}${failedMaps.has(m.id) ? ' (not loading)' : ''}`}>
              <span className="tick-line" /><span className="tick-label">{m.year}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE bottom bar */}
      <div className="mobile-bar mobile-only">
        <div className="mobile-top-row">
          {transportControls(true)}
          <span className="mobile-year">{year}</span>
          <div className="mobile-speed-btns">
            {SPEEDS.map((s, i) => (
              <button key={s.label} className={`mobile-speed-btn ${speedIdx === i ? 'active' : ''}`}
                onClick={() => setSpeedIdx(i)}>{s.label}</button>
            ))}
          </div>
        </div>
        <div className="mobile-slider-row">
          <span className="mobile-year-edge">{MIN_YEAR}</span>
          <input className="mobile-slider" type="range" min={MIN_YEAR} max={MAX_YEAR} value={year}
            onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }} />
          <span className="mobile-year-edge">{MAX_YEAR}</span>
        </div>
        <div className="mobile-era-row">
          {MAPS.map(m => (
            <button key={m.id}
              className={`mobile-era-btn ${primaryIdx === MAPS.indexOf(m) ? 'active' : ''} ${failedMaps.has(m.id) ? 'is-failed' : ''}`}
              onClick={() => { setPlaying(false); setYear(m.year); }}>
              {m.year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

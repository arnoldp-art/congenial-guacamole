import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MAPS, computeOpacities, MIN_YEAR, MAX_YEAR } from './maps';

const MECHELEN: [number, number] = [51.028, 4.480];
const SPEEDS = [{ label: 'Slow', ms: 300 }, { label: 'Normal', ms: 80 }, { label: 'Fast', ms: 20 }];

export default function App() {
  const [year, setYear] = useState(MIN_YEAR);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const opacities = computeOpacities(year);

  // Determine which map(s) are currently most visible
  const primaryIdx = opacities.indexOf(Math.max(...opacities));
  const secondaryIdx = opacities.findIndex((o, i) => i !== primaryIdx && o > 0.05);
  const inTransition = secondaryIdx !== -1;

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
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {MAPS.map((m, i) => {
            if (opacities[i] < 0.01) return null;
            if (m.type === 'wms') {
              return (
                <WMSTileLayer
                  key={m.id}
                  url={m.url}
                  layers={m.wmsLayer ?? ''}
                  format="image/png"
                  transparent={false}
                  opacity={opacities[i]}
                  attribution={m.attribution}
                />
              );
            }
            return (
              <TileLayer
                key={m.id}
                url={m.url}
                opacity={opacities[i]}
                attribution={m.attribution}
                subdomains="abcd"
              />
            );
          })}
        </MapContainer>
      </div>

      {/* Map info overlay */}
      <div className="map-info">
        <div className="map-name">{MAPS[primaryIdx].name}</div>
        {inTransition && (
          <div className="blend-indicator">
            <span>{MAPS[primaryIdx].name}</span>
            <div className="blend-bar">
              <div
                className="blend-fill"
                style={{ width: `${Math.round(opacities[secondaryIdx] * 100)}%` }}
              />
            </div>
            <span>{MAPS[secondaryIdx].name}</span>
          </div>
        )}
        {!inTransition && (
          <div className="map-desc">{MAPS[primaryIdx].description}</div>
        )}
      </div>

      {/* Controls overlay */}
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
      </div>
    </div>
  );
}

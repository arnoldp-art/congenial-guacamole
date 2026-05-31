import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MAPS, MIN_YEAR, MAX_YEAR } from './maps';
import { MAPS_HK, MIN_YEAR_HK, MAX_YEAR_HK } from './maps-hk';
import { CityConfig } from './cities';
import CitySelect from './CitySelect';

const SPEEDS = [{ label: 'Slow', ms: 300 }, { label: 'Normal', ms: 80 }, { label: 'Fast', ms: 20 }];

const CITIES: CityConfig[] = [
  {
    id: 'mechelen',
    name: 'Mechelen',
    subtitle: 'Flanders, Belgium',
    center: [51.028, 4.480],
    zoom: 13,
    minYear: MIN_YEAR,
    maxYear: MAX_YEAR,
    maps: MAPS,
    heroColor: '#c9a84c',
  },
  {
    id: 'san-tin',
    name: 'San Tin',
    subtitle: 'New Territories, Hong Kong',
    center: [22.513, 114.067],
    zoom: 14,
    minYear: MIN_YEAR_HK,
    maxYear: MAX_YEAR_HK,
    maps: MAPS_HK,
    heroColor: '#e05030',
  },
];

function activeMapIdx(maps: CityConfig['maps'], year: number): number {
  let idx = 0;
  for (let i = 0; i < maps.length; i++) {
    if (year >= maps[i].year) idx = i;
  }
  return idx;
}

function Recentre({ center, year }: { center: [number, number]; year: number }) {
  const map = useMap();
  const prev = useRef(year);
  useEffect(() => {
    if (Math.floor(year / 50) !== Math.floor(prev.current / 50)) {
      map.setView(center, map.getZoom(), { animate: true });
    }
    prev.current = year;
  }, [year, center, map]);
  return null;
}

function MapView({ city, onBack }: { city: CityConfig; onBack: () => void }) {
  const { maps, minYear, maxYear, center, zoom } = city;
  const [year, setYear] = useState(minYear);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [failedMaps, setFailedMaps] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPrimaryRef = useRef(-1);

  const primaryIdx = activeMapIdx(maps, year);
  const currentMapFailed = failedMaps.has(maps[primaryIdx]?.id);

  useEffect(() => {
    if (prevPrimaryRef.current !== -1 && primaryIdx !== prevPrimaryRef.current && playing) {
      setPlaying(false);
    }
    prevPrimaryRef.current = primaryIdx;
  }, [primaryIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const tick = useCallback(() => {
    setYear(y => {
      if (y >= maxYear) { setPlaying(false); return maxYear; }
      return y + 1;
    });
  }, [maxYear]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(tick, SPEEDS[speedIdx].ms);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speedIdx, tick]);

  const goNext = useCallback(() => {
    setPlaying(false);
    const next = maps.find(m => m.year > year);
    if (next) setYear(next.year);
  }, [year, maps]);

  const goPrev = useCallback(() => {
    setPlaying(false);
    const prev = [...maps].reverse().find(m => m.year < year);
    if (prev) setYear(prev.year);
  }, [year, maps]);

  const markFailed = useCallback((id: string) => {
    setFailedMaps(s => { const n = new Set(s); n.add(id); return n; });
  }, []);

  const transportControls = (isMobile = false) => {
    const prefix = isMobile ? 'mobile-' : '';
    return (
      <div className={`${prefix}transport`}>
        <button className={`${prefix}skip-btn`} onClick={goPrev} title="Previous map"
          disabled={!maps.find(m => m.year < year)}>⏮</button>
        <button className={`${prefix}play-btn`}
          onClick={() => { if (year >= maxYear) setYear(minYear); setPlaying(p => !p); }}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className={`${prefix}skip-btn`} onClick={goNext} title="Next map"
          disabled={!maps.find(m => m.year > year)}>⏭</button>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="map-wrapper">
        <MapContainer center={center} zoom={zoom}
          style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <Recentre center={center} year={year} />
          {maps.map((m, i) => i !== primaryIdx ? null : (
            <TileLayer key={m.id} url={m.url} opacity={1} attribution={m.attribution}
              eventHandlers={{ tileerror: () => markFailed(m.id) }} />
          ))}
        </MapContainer>
      </div>

      {/* Map info — top left */}
      <div className="map-info">
        <div className="map-name">
          {maps[primaryIdx].name}
          {currentMapFailed && <span className="map-failed-badge">⚠ not loading</span>}
        </div>
        <div className="map-desc">{maps[primaryIdx].description}</div>
      </div>

      {/* Back button — top right */}
      <button className="back-btn" onClick={onBack} title="Choose city">⬡ Cities</button>

      {/* DESKTOP bottom bar */}
      <div className="bottom-bar desktop-only">
        <div className="controls-row">
          {transportControls(false)}
          <span className="year-num">{year}</span>
          <div className="slider-wrap">
            <input className="slider" type="range" min={minYear} max={maxYear} value={year}
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
          {maps.map(m => (
            <button key={m.id}
              className={`tick ${failedMaps.has(m.id) ? 'tick-failed' : ''}`}
              style={{ left: `${((m.year - minYear) / (maxYear - minYear)) * 100}%` }}
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
          <span className="mobile-year-edge">{minYear}</span>
          <input className="mobile-slider" type="range" min={minYear} max={maxYear} value={year}
            onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }} />
          <span className="mobile-year-edge">{maxYear}</span>
        </div>
        <div className="mobile-era-row">
          {maps.map((m, i) => (
            <button key={m.id}
              className={`mobile-era-btn ${primaryIdx === i ? 'active' : ''} ${failedMaps.has(m.id) ? 'is-failed' : ''}`}
              onClick={() => { setPlaying(false); setYear(m.year); }}>
              {m.year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState<CityConfig | null>(null);

  return city
    ? <MapView city={city} onBack={() => setCity(null)} />
    : <CitySelect cities={CITIES} onSelect={setCity} />;
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer, TileLayer, WMSTileLayer, Polygon, Polyline,
  CircleMarker, Popup, useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import {
  VEGETATION, WATER, ROADS, URBAN, getTileConfig, ROAD_STYLES, VEGETATION_COLORS,
  type TileConfig,
} from './mechelenLayers';

interface HistoricalEvent {
  id: string; year: number; title: string; description: string;
  lat: number; lng: number; category: string; impact: string;
}

const MIN_YEAR = 979;
const MAX_YEAR = 2002;
const MECHELEN = [51.028, 4.480] as [number, number];

const ERA_FILTERS: Record<string, string> = {
  'Medieval':         'sepia(0.6) brightness(0.95)',
  'Ferraris (1770s)': 'sepia(0.3) brightness(1.02)',
  'Vandermaelen (1846)': 'sepia(0.15) brightness(1.0)',
  'Modern':           'none',
};

// Switches base tile layer when config changes
function BaseTileLayer({ config }: { config: TileConfig }) {
  const map = useMap();

  // Apply CSS filter to the tile pane to give historical map an aged look
  useEffect(() => {
    const pane = map.getPane('tilePane');
    if (pane) pane.style.filter = ERA_FILTERS[config.label] ?? 'none';
  }, [config.label, map]);

  if (config.type === 'wms') {
    return (
      <WMSTileLayer
        key={config.label}
        url={config.url}
        layers={(config.options.layers as string) ?? ''}
        format={(config.options.format as string) ?? 'image/png'}
        transparent={!!(config.options.transparent)}
        attribution={(config.options.attribution as string) ?? ''}
      />
    );
  }
  return (
    <TileLayer
      key={config.label}
      url={config.url}
      attribution={(config.options.attribution as string) ?? ''}
      subdomains={(config.options.subdomains as string) ?? 'abc'}
      maxZoom={(config.options.maxZoom as number) ?? 19}
    />
  );
}

export default function App() {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [year, setYear] = useState(MIN_YEAR);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // ms per year step
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch('/data/historical-events.json')
      .then(r => r.json())
      .then(d => setEvents(
        d.events.filter((e: HistoricalEvent) =>
          e.lat >= 50.92 && e.lat <= 51.15 &&
          e.lng >= 4.30 && e.lng <= 4.65
        )
      ));
  }, []);

  const tick = useCallback(() => {
    setYear(y => {
      if (y >= MAX_YEAR) { setPlaying(false); return MAX_YEAR; }
      return y + 1;
    });
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(tick, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, tick]);

  const tileConfig = getTileConfig(year);

  const activeVeg = VEGETATION.filter(v => year >= v.fromYear && year <= v.toYear);
  const activeRoads = ROADS.filter(r => year >= r.fromYear);
  const activeWater = WATER.filter(w => year >= w.fromYear);

  // Urban: show largest footprint whose fromYear <= year
  const urbanRings = URBAN.reduce<typeof URBAN>((acc, u) => {
    if (u.fromYear > year) return acc;
    const existing = acc.findIndex(x => x.id.split('-')[0] + '-' + x.id.split('-')[1] === u.id.split('-')[0] + '-' + u.id.split('-')[1]);
    // group by city prefix
    const prefix = u.id.replace(/-\d+$/, '').replace(/-\d{3,4}$/, '');
    const existingIdx = acc.findIndex(x => x.id.replace(/-\d{3,4}$/, '') === prefix);
    if (existingIdx >= 0) { acc[existingIdx] = u; return acc; }
    return [...acc, u];
  }, []);

  const visibleEvents = events.filter(e => e.year <= year);

  return (
    <div className="app">
      <header className="header">
        <div className="title-block">
          <h1>Mechelen</h1>
          <span className="era-tag">{tileConfig.label}</span>
        </div>
        <div className="timeline-block">
          <button
            className={`play-btn ${playing ? 'pause' : 'play'}`}
            onClick={() => { if (year >= MAX_YEAR) setYear(MIN_YEAR); setPlaying(p => !p); }}
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <span className="year-label">{MIN_YEAR}</span>
          <input
            type="range" min={MIN_YEAR} max={MAX_YEAR} value={year}
            onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }}
          />
          <span className="year-label">{MAX_YEAR}</span>
          <span className="current-year">{year}</span>
          <select
            className="speed-select"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            title="Animation speed"
          >
            <option value={200}>Slow</option>
            <option value={50}>Normal</option>
            <option value={12}>Fast</option>
          </select>
        </div>
      </header>

      <div className="map-wrapper">
        <MapContainer
          center={MECHELEN}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <BaseTileLayer config={tileConfig} />

          {/* Water */}
          {activeWater.map(w => (
            <Polyline
              key={w.id}
              positions={w.coords}
              pathOptions={{ color: '#4a90d9', weight: w.width, opacity: 0.7 }}
            >
              <Popup><strong>{w.name}</strong></Popup>
            </Polyline>
          ))}

          {/* Vegetation */}
          {activeVeg.map(v => (
            <Polygon
              key={v.id}
              positions={v.coords}
              pathOptions={{
                color: VEGETATION_COLORS[v.type],
                fillColor: VEGETATION_COLORS[v.type],
                fillOpacity: 0.5,
                weight: 1.2,
              }}
            >
              <Popup>
                <strong>{v.name}</strong><br />
                <em>{v.type}</em> · {v.fromYear}–{v.toYear === 2100 ? 'present' : v.toYear}
              </Popup>
            </Polygon>
          ))}

          {/* Roads */}
          {activeRoads.map(r => {
            const style = ROAD_STYLES[r.type];
            return (
              <Polyline
                key={r.id}
                positions={r.coords}
                pathOptions={{ ...style, opacity: 0.85 }}
              >
                <Popup><strong>{r.name}</strong><br />From {r.fromYear}</Popup>
              </Polyline>
            );
          })}

          {/* Urban footprint */}
          {urbanRings.map(u => (
            <Polygon
              key={u.id}
              positions={u.coords}
              pathOptions={{
                color: '#c0392b',
                fillColor: '#e74c3c',
                fillOpacity: 0.28,
                weight: 1.5,
                dashArray: '3 2',
              }}
            >
              <Popup>{u.name}</Popup>
            </Polygon>
          ))}

          {/* Events */}
          {visibleEvents.map(e => (
            <CircleMarker
              key={e.id}
              center={[e.lat, e.lng]}
              radius={e.impact === 'major' ? 9 : 6}
              pathOptions={{
                color: '#fff',
                fillColor: '#e74c3c',
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{e.year} — {e.title}</strong>
                <p style={{ marginTop: 4 }}>{e.description}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="legend">
        <span className="leg-item"><span className="leg-dot" style={{ background: '#2d6a4f' }} />Forest</span>
        <span className="leg-item"><span className="leg-dot" style={{ background: '#4a8fa8' }} />Wetland</span>
        <span className="leg-item"><span className="leg-dot" style={{ background: '#9b7e46' }} />Heathland</span>
        <span className="leg-item"><span className="leg-dot" style={{ background: '#6a9e3a' }} />Orchards</span>
        <span className="leg-item"><span className="leg-dot" style={{ background: '#e74c3c' }} />Urban</span>
        <span className="leg-item"><span className="leg-line" style={{ background: '#333', borderTop: '2px dashed #333' }} />Railway</span>
        <span className="leg-item"><span className="leg-line" style={{ background: '#4a90d9' }} />Motorway</span>
      </div>
    </div>
  );
}

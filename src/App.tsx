import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import {
  FORESTS, ROADS, URBAN_AREAS, ERAS, getEra,
  type ForestFeature, type RoadFeature,
} from './historicalLayers';

interface HistoricalEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  category: string;
  impact: string;
}

const EVENT_COLORS: Record<string, string> = {
  political: '#e74c3c',
  economic: '#f39c12',
  cultural: '#9b59b6',
  war: '#ff6b35',
};

const MIN_YEAR = 979;
const MAX_YEAR = 2002;

// Swaps tile layer when era changes
function TileLayerSwitcher({ year }: { year: number }) {
  const era = getEra(year);
  return (
    <TileLayer
      key={era.label}
      attribution={era.tileAttribution}
      url={era.tileUrl}
    />
  );
}

// Forces map re-render when key changes (workaround for TileLayer not updating url)
function MapUpdater({ year }: { year: number }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [year, map]);
  return null;
}

export default function App() {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [year, setYear] = useState(979);
  const [showForests, setShowForests] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showUrban, setShowUrban] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  useEffect(() => {
    fetch('/data/historical-events.json')
      .then(r => r.json())
      .then(d => setEvents(d.events));
  }, []);

  const era = getEra(year);

  const activeForests = showForests
    ? FORESTS.filter(f => year >= f.fromYear && year <= f.toYear)
    : [];

  const activeRoads = showRoads
    ? ROADS.filter(r => year >= r.fromYear)
    : [];

  const visibleEvents = showEvents
    ? events.filter(e => e.year <= year)
    : [];

  // Urban areas: show the largest ring whose year <= current year
  const urbanPolygons = showUrban
    ? URBAN_AREAS.map(city => {
        const ringIdx = city.years.reduce((best, y, i) => (y <= year ? i : best), -1);
        if (ringIdx < 0) return null;
        return { ...city, ring: city.coords[ringIdx] };
      }).filter(Boolean)
    : [];

  const eraIndex = ERAS.findIndex(e => e.label === era.label);

  return (
    <div className="app">
      <header className="header">
        <h1>Belgium Historical Map</h1>
        <div className="era-badge" data-era={eraIndex}>{era.label}</div>
        <div className="timeline">
          <span className="year-label">{MIN_YEAR}</span>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          />
          <span className="year-label">{MAX_YEAR}</span>
          <span className="current-year">{year}</span>
        </div>
      </header>

      <div className="map-wrapper">
        <MapContainer
          center={[50.5, 4.5]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayerSwitcher year={year} />
          <MapUpdater year={year} />

          {activeForests.map((f: ForestFeature) => (
            <Polygon
              key={f.id}
              positions={f.coords}
              pathOptions={{ color: f.color, fillColor: f.color, fillOpacity: 0.45, weight: 1 }}
            >
              <Popup>{f.name}</Popup>
            </Polygon>
          ))}

          {activeRoads.map((r: RoadFeature) => (
            <Polyline
              key={r.id}
              positions={r.coords}
              pathOptions={{ color: r.color, weight: r.width, opacity: 0.8 }}
            >
              <Popup>{r.name} (from {r.fromYear})</Popup>
            </Polyline>
          ))}

          {urbanPolygons.map(city => city && (
            <Polygon
              key={city.id}
              positions={city.ring}
              pathOptions={{ color: city.color, fillColor: city.color, fillOpacity: 0.35, weight: 1.5 }}
            >
              <Popup>{city.name} (c. {year})</Popup>
            </Polygon>
          ))}

          {visibleEvents.map(event => (
            <CircleMarker
              key={event.id}
              center={[event.lat, event.lng]}
              radius={event.impact === 'major' ? 8 : 5}
              pathOptions={{
                color: EVENT_COLORS[event.category] ?? '#3498db',
                fillColor: EVENT_COLORS[event.category] ?? '#3498db',
                fillOpacity: 0.85,
                weight: 1.5,
              }}
            >
              <Popup>
                <strong>{event.year} — {event.title}</strong>
                <p style={{ marginTop: 4 }}>{event.description}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="controls">
        <span className="controls-label">Layers:</span>
        {[
          { label: '🌲 Forests', value: showForests, set: setShowForests },
          { label: '🛤 Roads', value: showRoads, set: setShowRoads },
          { label: '🏙 Cities', value: showUrban, set: setShowUrban },
          { label: '📍 Events', value: showEvents, set: setShowEvents },
        ].map(({ label, value, set }) => (
          <button
            key={label}
            className={`layer-btn ${value ? 'active' : ''}`}
            onClick={() => set(v => !v)}
          >
            {label}
          </button>
        ))}
        <span className="era-summary">{era.label} era · {visibleEvents.length} events</span>
      </div>
    </div>
  );
}

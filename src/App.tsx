import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

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

const CATEGORY_COLORS: Record<string, string> = {
  political: '#e74c3c',
  economic: '#f39c12',
  cultural: '#9b59b6',
  war: '#e67e22',
};

const MIN_YEAR = 979;
const MAX_YEAR = 2002;

function App() {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [year, setYear] = useState(MAX_YEAR);

  useEffect(() => {
    fetch('/data/historical-events.json')
      .then(r => r.json())
      .then(d => setEvents(d.events));
  }, []);

  const visible = events.filter(e => e.year <= year);

  return (
    <div className="app">
      <header className="header">
        <h1>Belgium Historical Map</h1>
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
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visible.map(event => (
            <CircleMarker
              key={event.id}
              center={[event.lat, event.lng]}
              radius={event.impact === 'major' ? 10 : 7}
              pathOptions={{
                color: CATEGORY_COLORS[event.category] ?? '#3498db',
                fillColor: CATEGORY_COLORS[event.category] ?? '#3498db',
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <strong>{event.year} — {event.title}</strong>
                <p>{event.description}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="legend">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="legend-item">
            <span className="dot" style={{ background: color }} />
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;

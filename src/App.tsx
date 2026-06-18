import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, WMSTileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { MAPS, MIN_YEAR, MAX_YEAR } from './maps';
import { MAPS_HK, MIN_YEAR_HK, MAX_YEAR_HK } from './maps-hk';
import { MAPS_LONDON, MIN_YEAR_LONDON, MAX_YEAR_LONDON } from './maps-london';
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
  {
    id: 'hendon',
    name: 'Hendon',
    subtitle: 'London Borough of Barnet, England',
    center: [51.5906, -0.2283],
    zoom: 13,
    minYear: MIN_YEAR_LONDON,
    maxYear: MAX_YEAR_LONDON,
    maps: MAPS_LONDON,
    heroColor: '#1a5276',
  },
];

function activeMapIdx(maps: CityConfig['maps'], year: number): number {
  let idx = 0;
  for (let i = 0; i < maps.length; i++) {
    if (year >= maps[i].year) idx = i;
  }
  return idx;
}

function snapToNearest(maps: CityConfig['maps'], year: number): number {
  let best = maps[0].year;
  let bestDist = Math.abs(year - maps[0].year);
  for (const m of maps) {
    const d = Math.abs(year - m.year);
    if (d < bestDist) { bestDist = d; best = m.year; }
  }
  return best;
}

function parseHash(): { city?: string; year?: number; compare?: string } {
  const hash = window.location.hash.slice(1);
  if (!hash) return {};
  const params: Record<string, string> = {};
  hash.split('&').forEach(part => {
    const [k, v] = part.split('=');
    if (k && v) params[k] = decodeURIComponent(v);
  });
  return {
    city: params.city,
    year: params.year ? parseInt(params.year, 10) : undefined,
    compare: params.compare,
  };
}

function setHash(city: string, year: number, compare?: string) {
  const parts = [`city=${encodeURIComponent(city)}`, `year=${year}`];
  if (compare) parts.push(`compare=${encodeURIComponent(compare)}`);
  window.location.hash = parts.join('&');
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

// Native Leaflet tile layer component that supports clipPath
function NativeTileLayer({ map: mapObj, url, attribution, clipPath, zIndex }: {
  map: CityConfig['maps'][0];
  url: string;
  attribution: string;
  clipPath?: string;
  zIndex?: number;
}) {
  const leafletMap = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    const layer = L.tileLayer(url, { attribution, zIndex: zIndex ?? 200 });
    layer.addTo(leafletMap);
    layerRef.current = layer;
    return () => {
      leafletMap.removeLayer(layer);
      layerRef.current = null;
    };
  }, [url, attribution, leafletMap, zIndex]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    // Apply clipPath to the layer's container
    const container = (layer as any)._container as HTMLElement | undefined;
    if (container) {
      container.style.clipPath = clipPath ?? '';
    }
  });

  return null;
}

function MapView({ city, onBack, initialYear, initialCompare }: {
  city: CityConfig;
  onBack: () => void;
  initialYear?: number;
  initialCompare?: string;
}) {
  const { maps, minYear, maxYear, center, zoom } = city;
  const [year, setYear] = useState(initialYear ?? minYear);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [failedMaps, setFailedMaps] = useState<Set<string>>(new Set());
  const [splitMode, setSplitMode] = useState(false);
  const [dividerPct, setDividerPct] = useState(50);
  const [compareCity, setCompareCity] = useState<CityConfig | null>(
    initialCompare ? (CITIES.find(c => c.id === initialCompare) ?? null) : null
  );
  const [showCityPicker, setShowCityPicker] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPrimaryRef = useRef(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDraggingDivider = useRef(false);

  const primaryIdx = activeMapIdx(maps, year);
  const currentMapFailed = failedMaps.has(maps[primaryIdx]?.id);
  const lastMap = maps[maps.length - 1];

  // Permalink update
  useEffect(() => {
    setHash(city.id, year, compareCity?.id);
  }, [city.id, year, compareCity]);

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

  // Slider snap on mouse/touch up
  const handleSliderMouseUp = useCallback(() => {
    setYear(y => snapToNearest(maps, y));
  }, [maps]);

  // Divider drag
  const handleDividerMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingDivider.current = true;

    const move = (clientX: number) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
      setDividerPct(pct);
    };

    const onMouseMove = (ev: MouseEvent) => move(ev.clientX);
    const onTouchMove = (ev: TouchEvent) => move(ev.touches[0].clientX);
    const onUp = () => {
      isDraggingDivider.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onUp);
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

  // Compare mode layout
  if (compareCity) {
    const compareMaps = compareCity.maps;
    const compareIdx = activeMapIdx(compareMaps, year);
    const compareMap = compareMaps[compareIdx];
    const primaryMap = maps[primaryIdx];

    return (
      <div className="app">
        <div className="compare-layout">
          <div className="compare-pane">
            <MapContainer center={center} zoom={zoom}
              style={{ height: '100%', width: '100%' }} zoomControl={true}>
              {primaryMap.type === 'wms' ? (
                <WMSTileLayer key={primaryMap.id} url={primaryMap.url} layers={primaryMap.wmsLayer ?? '0'}
                  format="image/png" transparent={false} attribution={primaryMap.attribution}
                  eventHandlers={{ tileerror: () => markFailed(primaryMap.id) }} />
              ) : (
                <TileLayer key={primaryMap.id} url={primaryMap.url} opacity={1} attribution={primaryMap.attribution}
                  eventHandlers={{ tileerror: () => markFailed(primaryMap.id) }} />
              )}
            </MapContainer>
            <div className="compare-label">
              <strong>{city.name}</strong> · {primaryMap.name}
            </div>
          </div>
          <div className="compare-pane">
            <MapContainer center={compareCity.center} zoom={compareCity.zoom}
              style={{ height: '100%', width: '100%' }} zoomControl={true}>
              {compareMap.type === 'wms' ? (
                <WMSTileLayer key={compareMap.id} url={compareMap.url} layers={compareMap.wmsLayer ?? '0'}
                  format="image/png" transparent={false} attribution={compareMap.attribution} />
              ) : (
                <TileLayer key={compareMap.id} url={compareMap.url} opacity={1} attribution={compareMap.attribution} />
              )}
            </MapContainer>
            <div className="compare-label">
              <strong>{compareCity.name}</strong> · {compareMap.name}
            </div>
          </div>
        </div>

        {/* Map info */}
        <div className="map-info">
          <div className="map-name">{primaryMap.name}</div>
          <div className="map-desc">{primaryMap.description}</div>
          {primaryMap.blurb && <div className="map-blurb">{primaryMap.blurb}</div>}
        </div>

        {/* Top-right buttons */}
        <button className="back-btn" onClick={onBack} title="Choose city">⬡ Cities</button>
        <button className="compare-btn" onClick={() => setCompareCity(null)} title="Exit compare">✕ Compare</button>

        {/* DESKTOP bottom bar */}
        <div className="bottom-bar desktop-only">
          <div className="controls-row">
            {transportControls(false)}
            <span className="year-num">{year}</span>
            <div className="slider-wrap">
              <input className="slider" type="range" min={minYear} max={maxYear} value={year}
                onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }}
                onMouseUp={handleSliderMouseUp}
                onTouchEnd={handleSliderMouseUp} />
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
                title={`${m.year} · ${m.name}`}>
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
              onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }}
              onMouseUp={handleSliderMouseUp}
              onTouchEnd={handleSliderMouseUp} />
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

  return (
    <div className="app">
      <div
        className="map-wrapper"
        ref={wrapperRef}
      >
        <MapContainer center={center} zoom={zoom}
          style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <Recentre center={center} year={year} />

          {splitMode ? (
            <>
              {/* Left side: current year's map, clipped to left of divider */}
              {maps[primaryIdx].type === 'wms' ? (
                <WMSTileLayer key={`left-${maps[primaryIdx].id}`}
                  url={maps[primaryIdx].url} layers={maps[primaryIdx].wmsLayer ?? '0'}
                  format="image/png" transparent={false} attribution={maps[primaryIdx].attribution}
                  eventHandlers={{ tileerror: () => markFailed(maps[primaryIdx].id) }} />
              ) : (
                <NativeTileLayer
                  map={maps[primaryIdx]}
                  url={maps[primaryIdx].url}
                  attribution={maps[primaryIdx].attribution}
                  clipPath={`inset(0 ${100 - dividerPct}% 0 0)`}
                  zIndex={200}
                />
              )}
              {/* Right side: last/most modern map, clipped to right of divider */}
              <NativeTileLayer
                map={lastMap}
                url={lastMap.url}
                attribution={lastMap.attribution}
                clipPath={`inset(0 0 0 ${dividerPct}%)`}
                zIndex={199}
              />
            </>
          ) : (
            maps.map((m, i) => i !== primaryIdx ? null : m.type === 'wms' ? (
              <WMSTileLayer key={m.id} url={m.url} layers={m.wmsLayer ?? '0'}
                format="image/png" transparent={false} attribution={m.attribution}
                eventHandlers={{ tileerror: () => markFailed(m.id) }} />
            ) : (
              <TileLayer key={m.id} url={m.url} opacity={1} attribution={m.attribution}
                eventHandlers={{ tileerror: () => markFailed(m.id) }} />
            ))
          )}
        </MapContainer>

        {/* Split divider */}
        {splitMode && (
          <>
            <div
              className="split-divider"
              style={{ left: `${dividerPct}%` }}
              onMouseDown={handleDividerMouseDown}
              onTouchStart={handleDividerMouseDown as any}
            >
              <div className="split-handle">◀ ▶</div>
            </div>
            <div className="split-label split-label-left" style={{ left: `${Math.max(4, dividerPct - 30)}%` }}>
              {maps[primaryIdx].year} · {maps[primaryIdx].name}
            </div>
            <div className="split-label split-label-right" style={{ left: `${Math.min(96, dividerPct + 2)}%` }}>
              {lastMap.year} · {lastMap.name}
            </div>
          </>
        )}
      </div>

      {/* Map info — top left */}
      <div className="map-info">
        <div className="map-name">
          {maps[primaryIdx].name}
          {currentMapFailed && <span className="map-failed-badge">⚠ not loading</span>}
        </div>
        <div className="map-desc">{maps[primaryIdx].description}</div>
        {maps[primaryIdx].blurb && (
          <div className="map-blurb">{maps[primaryIdx].blurb}</div>
        )}
      </div>

      {/* Back button — top right */}
      <button className="back-btn" onClick={onBack} title="Choose city">⬡ Cities</button>
      <button
        className={`split-btn ${splitMode ? 'active' : ''}`}
        onClick={() => setSplitMode(s => !s)}
        title="Split before/after view"
      >⊟ Split</button>
      <button
        className="compare-btn"
        onClick={() => setShowCityPicker(true)}
        title="Compare with another city"
      >⊞ Compare</button>

      {/* City picker overlay */}
      {showCityPicker && (
        <div className="city-picker-overlay" onClick={() => setShowCityPicker(false)}>
          <div className="city-picker-card" onClick={e => e.stopPropagation()}>
            <div className="city-picker-title">Compare with…</div>
            {CITIES.filter(c => c.id !== city.id).map(c => (
              <button key={c.id} className="city-picker-item"
                onClick={() => { setCompareCity(c); setShowCityPicker(false); }}>
                <strong>{c.name}</strong>
                <span>{c.subtitle}</span>
              </button>
            ))}
            <button className="city-picker-cancel" onClick={() => setShowCityPicker(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* DESKTOP bottom bar */}
      <div className="bottom-bar desktop-only">
        <div className="controls-row">
          {transportControls(false)}
          <span className="year-num">{year}</span>
          <div className="slider-wrap">
            <input className="slider" type="range" min={minYear} max={maxYear} value={year}
              onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }}
              onMouseUp={handleSliderMouseUp}
              onTouchEnd={handleSliderMouseUp} />
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
            onChange={e => { setPlaying(false); setYear(Number(e.target.value)); }}
            onMouseUp={handleSliderMouseUp}
            onTouchEnd={handleSliderMouseUp} />
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
  const [initialYear, setInitialYear] = useState<number | undefined>(undefined);
  const [initialCompare, setInitialCompare] = useState<string | undefined>(undefined);

  // Parse hash on first load
  useEffect(() => {
    const { city: cityId, year, compare } = parseHash();
    if (cityId) {
      const found = CITIES.find(c => c.id === cityId);
      if (found) {
        setCity(found);
        setInitialYear(year);
        setInitialCompare(compare);
      }
    }
  }, []);

  return city
    ? <MapView city={city} onBack={() => { setCity(null); window.location.hash = ''; }} initialYear={initialYear} initialCompare={initialCompare} />
    : <CitySelect cities={CITIES} onSelect={c => { setCity(c); setInitialYear(undefined); setInitialCompare(undefined); }} />;
}

export interface HistoricalMap {
  id: string;
  year: number;          // center year of this map
  name: string;
  description: string;
  type: 'xyz' | 'wms';
  url: string;
  wmsLayer?: string;
  attribution: string;
}

export const MAPS: HistoricalMap[] = [
  {
    id: 'carto-pre',
    year: 1600,
    name: 'Pre-survey',
    description: 'No cartographic survey exists for this period',
    type: 'xyz',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO',
  },
  {
    id: 'ferraris',
    year: 1771,
    name: 'Ferraris map',
    description: 'Cabinet des Pays-Bas autrichiens · ordered by Emperor Joseph II · 1770–1778',
    type: 'wms',
    url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Ferraris/wms',
    wmsLayer: 'Ferraris',
    attribution: '© Digitaal Vlaanderen – Ferraris 1770–1778',
  },
  {
    id: 'vandermaelen',
    year: 1846,
    name: 'Vandermaelen map',
    description: 'First standardised topographic map of Belgium · Philippe Vandermaelen · 1846–1854',
    type: 'wms',
    url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Vandermaelen/wms',
    wmsLayer: 'Vandermaelen',
    attribution: '© Digitaal Vlaanderen – Vandermaelen 1846–1854',
  },
  {
    id: 'modern',
    year: 1960,
    name: 'Modern map',
    description: 'Contemporary topographic base',
    type: 'xyz',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO',
  },
];

// Each map is fully visible within its era, and blends over BLEND_YEARS
// on either side of each transition point.
const BLEND = 18;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function computeOpacities(year: number): number[] {
  const transitions = MAPS.slice(1).map(m => m.year);   // [1771, 1846, 1960]
  const t = transitions.map(ty =>
    clamp((year - (ty - BLEND)) / (2 * BLEND), 0, 1)
  );

  // op[0]: fades out at t[0]
  // op[i]: fades in at t[i-1], fades out at t[i]
  // op[last]: fades in at t[last-1]
  return MAPS.map((_, i) => {
    const fadeIn  = i === 0                 ? 1 : t[i - 1];
    const fadeOut = i === MAPS.length - 1  ? 1 : (1 - t[i]);
    return fadeIn * fadeOut;
  });
}

export const MIN_YEAR = 1600;
export const MAX_YEAR = 2000;

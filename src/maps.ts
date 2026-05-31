export interface HistoricalMap {
  id: string;
  year: number;
  name: string;
  description: string;
  type: 'xyz' | 'wms';
  url: string;
  wmsLayer?: string;
  attribution: string;
}

// Digitaal Vlaanderen histcart WMTS used as XYZ (faster than WMS)
const DV = (layer: string) =>
  `https://geo.api.vlaanderen.be/HISTCART/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile` +
  `&LAYER=${layer}&STYLE=&FORMAT=image/png` +
  `&TILEMATRIXSET=GoogleMapsVL&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`;

// NGI/IGN Belgium tile series — note: {z}/{y}/{x} (y before x — Esri convention)
const NGI_TOPO = (id: string) =>
  `https://wmts.ngi.be/arcgis/rest/services/seamless_carto__default__3857__${id}/MapServer/tile/{z}/{y}/{x}`;

const NGI_ORTHO = (id: string) =>
  `https://wmts.ngi.be/arcgis/rest/services/ortho__default__3857__${id}/MapServer/tile/{z}/{y}/{x}`;

export const MAPS: HistoricalMap[] = [
  {
    id: 'frickx',
    year: 1712,
    name: 'Frickx map',
    description: 'Military survey of the Austrian Netherlands by Eugene Henri Frickx · 1712',
    type: 'xyz',
    url: DV('frickx'),
    attribution: '© Digitaal Vlaanderen – Frickx 1712',
  },
  {
    id: 'ferraris',
    year: 1775,
    name: 'Ferraris map',
    description: 'Cabinet map of the Austrian Netherlands · commissioned by Emperor Joseph II · 1770–1778',
    type: 'xyz',
    url: DV('ferraris'),
    attribution: '© Digitaal Vlaanderen – Ferraris 1770–1778',
  },
  {
    id: 'vandermaelen',
    year: 1850,
    name: 'Vandermaelen map',
    description: 'First standardised topographic map of Belgium · Philippe Vandermaelen · 1846–1854',
    type: 'xyz',
    url: DV('vandermaelen'),
    attribution: '© Digitaal Vlaanderen – Vandermaelen 1846–1854',
  },
  {
    id: 'popp',
    year: 1860,
    name: 'Popp cadastral atlas',
    description: 'Atlas Cadastral Parcellaire de la Belgique · Philippe-Christian Popp · 1842–1879 · parcel-level detail',
    type: 'xyz',
    url: DV('popp'),
    attribution: '© Digitaal Vlaanderen – Popp 1842–1879',
  },
  {
    id: 'ngi-1873',
    year: 1873,
    name: 'NGI topographic 1873',
    description: 'National Geographic Institute survey · post-independence Belgium',
    type: 'xyz',
    url: NGI_TOPO('140'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'ngi-1904',
    year: 1904,
    name: 'NGI topographic 1904',
    description: 'Peak of Belgian industrial expansion',
    type: 'xyz',
    url: NGI_TOPO('450'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'ngi-1939',
    year: 1939,
    name: 'NGI topographic 1939',
    description: 'Pre-war survey of Belgium',
    type: 'xyz',
    url: NGI_TOPO('800'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'ortho-1950',
    year: 1951,
    name: 'Aerial survey 1947–1954',
    description: 'Post-war aerial photography of Belgium',
    type: 'xyz',
    url: NGI_ORTHO('1947-1954'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'ngi-1969',
    year: 1969,
    name: 'NGI topographic 1969',
    description: 'Post-war urban expansion',
    type: 'xyz',
    url: NGI_TOPO('1100'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'ngi-1981',
    year: 1981,
    name: 'NGI topographic 1981',
    description: '',
    type: 'xyz',
    url: NGI_TOPO('1220'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'ortho-1995',
    year: 1995,
    name: 'Aerial survey 1995',
    description: 'Late 20th century aerial photography',
    type: 'xyz',
    url: NGI_ORTHO('1995'),
    attribution: '© NGI/IGN Belgium',
  },
];

// Blend window in years on each side of a transition
const BLEND = 8;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function computeOpacities(year: number): number[] {
  // t[i] = 0→1 as year crosses maps[i+1].year ± BLEND
  const t = MAPS.slice(1).map(m =>
    clamp((year - (m.year - BLEND)) / (2 * BLEND), 0, 1)
  );

  return MAPS.map((_, i) => {
    const fadeIn  = i === 0                ? 1 : t[i - 1];
    const fadeOut = i === MAPS.length - 1  ? 1 : (1 - t[i]);
    return fadeIn * fadeOut;
  });
}

export const MIN_YEAR = 1500;
export const MAX_YEAR = 2000;

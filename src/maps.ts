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

// Digitaal Vlaanderen OKZ — historical aerial mosaics (Flanders only)
const DV_OKZ = (layer: string) =>
  `https://geo.api.vlaanderen.be/OKZ/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile` +
  `&LAYER=${layer}&STYLE=&FORMAT=image/png` +
  `&TILEMATRIXSET=GoogleMapsVL&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`;

// Digitaal Vlaanderen OMW — medium-scale winter orthophoto time series (25 cm, from 2000)
const DV_OMW = (layer: string) =>
  `https://geo.api.vlaanderen.be/OMW/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile` +
  `&LAYER=${layer}&STYLE=&FORMAT=image/png` +
  `&TILEMATRIXSET=GoogleMapsVL&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`;

// NGI/IGN Belgium tile series — note: {z}/{y}/{x} (y before x — Esri convention)
const NGI_TOPO = (id: string) =>
  `https://wmts.ngi.be/arcgis/rest/services/seamless_carto__default__3857__${id}/MapServer/tile/{z}/{y}/{x}`;

const NGI_ORTHO = (id: string) =>
  `https://wmts.ngi.be/arcgis/rest/services/ortho__default__3857__${id}/MapServer/tile/{z}/{y}/{x}`;

// Esri public tile services — no auth required
const ESRI = (service: string) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`;

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
    id: 'abw',
    year: 1843,
    name: 'Atlas der Buurtwegen',
    description: 'Atlas of Neighbourhood Roads · detailed parcel and road survey of Flanders · c. 1840–1845',
    type: 'xyz',
    url: DV('abw'),
    attribution: '© Digitaal Vlaanderen – Atlas der Buurtwegen c.1840',
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
    id: 'ngi-1969',
    year: 1969,
    name: 'NGI topographic 1969',
    description: 'Post-war urban expansion',
    type: 'xyz',
    url: NGI_TOPO('1100'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'okz-1971',
    year: 1971,
    name: 'Aerial survey 1971',
    description: 'Panchromatic aerial mosaic of Flanders · Digitaal Vlaanderen OKZ',
    type: 'xyz',
    url: DV_OKZ('okzpan71vl'),
    attribution: '© Digitaal Vlaanderen – OKZ 1971',
  },
  {
    id: 'ngi-1981',
    year: 1981,
    name: 'NGI topographic 1981',
    description: 'Survey of Belgium during the late industrial era',
    type: 'xyz',
    url: NGI_TOPO('1220'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'ngi-1989',
    year: 1989,
    name: 'NGI topographic 1989',
    description: 'Late 20th century survey of Belgium · pre-EU enlargement era',
    type: 'xyz',
    url: NGI_TOPO('1300'),
    attribution: '© NGI/IGN Belgium',
  },
  {
    id: 'okz-1979-90',
    year: 1990,
    name: 'Aerial survey 1979–1990',
    description: 'Colour aerial mosaic of Flanders 1979–1990 · Digitaal Vlaanderen OKZ',
    type: 'xyz',
    url: DV_OKZ('okzrgb79_90vl'),
    attribution: '© Digitaal Vlaanderen – OKZ 1979–1990',
  },
  {
    id: 'omw-2001',
    year: 2001,
    name: 'Orthophoto 2000–2003',
    description: '25 cm colour aerial mosaic of Flanders · Digitaal Vlaanderen OMW',
    type: 'xyz',
    url: DV_OMW('omwrgb00_03vl'),
    attribution: '© Digitaal Vlaanderen – OMW 2000–2003',
  },
  {
    id: 'omw-2006',
    year: 2006,
    name: 'Orthophoto 2005–2007',
    description: '25 cm colour aerial mosaic of Flanders · Digitaal Vlaanderen OMW',
    type: 'xyz',
    url: DV_OMW('omwrgb05_07vl'),
    attribution: '© Digitaal Vlaanderen – OMW 2005–2007',
  },
  {
    id: 'omw-2010',
    year: 2010,
    name: 'Orthophoto 2008–2011',
    description: '25 cm colour aerial mosaic of Flanders · Digitaal Vlaanderen OMW',
    type: 'xyz',
    url: DV_OMW('omwrgb08_11vl'),
    attribution: '© Digitaal Vlaanderen – OMW 2008–2011',
  },
  {
    id: 'omw-2015',
    year: 2015,
    name: 'Orthophoto 2015',
    description: '25 cm colour aerial mosaic of Flanders · Digitaal Vlaanderen OMW',
    type: 'xyz',
    url: DV_OMW('omwrgb15vl'),
    attribution: '© Digitaal Vlaanderen – OMW 2015',
  },
  {
    id: 'omw-2018',
    year: 2018,
    name: 'Orthophoto 2018',
    description: '25 cm colour aerial mosaic of Flanders · Digitaal Vlaanderen OMW',
    type: 'xyz',
    url: DV_OMW('omwrgb18vl'),
    attribution: '© Digitaal Vlaanderen – OMW 2018',
  },
  {
    id: 'satellite',
    year: 2020,
    name: 'Satellite imagery',
    description: 'Esri World Imagery · high-resolution satellite · current coverage',
    type: 'xyz',
    url: ESRI('World_Imagery'),
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
  {
    id: 'omw-2022',
    year: 2022,
    name: 'Orthophoto 2022',
    description: '15 cm colour aerial mosaic of Flanders · Digitaal Vlaanderen OMW',
    type: 'xyz',
    url: DV_OMW('omwrgb22vl'),
    attribution: '© Digitaal Vlaanderen – OMW 2022',
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

export const MIN_YEAR = 1712;
export const MAX_YEAR = 2024;

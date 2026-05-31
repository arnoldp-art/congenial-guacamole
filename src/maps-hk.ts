import { HistoricalMap } from './maps';

// Lands Department public Map API — official XYZ tile service for HK
// Standard z/x/y tile order, WGS84 spatial reference
const LANDSD = (layer: string) =>
  `https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/${layer}/WGS84/{z}/{x}/{y}.png`;

// Esri public tile services — no auth required
const ESRI = (service: string) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`;

export const MAPS_HK: HistoricalMap[] = [
  {
    id: 'hk-dop1963',
    year: 1963,
    name: 'Aerial survey 1963',
    description: 'DOP1000-1963 · 0.1m resolution · aerial photos Jan/Feb 1963 · Lands Department HKSAR',
    type: 'xyz',
    url: LANDSD('dop1963'),
    attribution: '© Lands Department, HKSAR Government',
  },
  {
    id: 'hk-dop1982',
    year: 1982,
    name: 'Aerial survey 1982',
    description: 'DOP5000-1982 · aerial photos October 1982 · Lands Department HKSAR',
    type: 'xyz',
    url: LANDSD('dop1982'),
    attribution: '© Lands Department, HKSAR Government',
  },
  {
    id: 'hk-satellite',
    year: 2020,
    name: 'Satellite imagery',
    description: 'Esri World Imagery · high-resolution satellite · current coverage',
    type: 'xyz',
    url: ESRI('World_Imagery'),
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
];

export const MIN_YEAR_HK = 1963;
export const MAX_YEAR_HK = 2024;

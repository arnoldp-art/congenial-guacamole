import { HistoricalMap } from './maps';

// hkmaps.hk — community-maintained historical HK tile archive
// XYZ standard order {z}/{x}/{y}, many layers confirmed via Google-indexed directories
const HKMAPS = (year: number) =>
  `https://hkmaps.hk/maps/${year}/{z}/{x}/{y}.png`;

// CHMap (MPIWG Berlin) — late Qing / early Republican era land survey maps of Guangdong province
// Covers the New Territories area (pre-British-annexation region), ~1895–1912
const CHMAP = (layer: string) =>
  `https://chmap.mpiwg-berlin.mpg.de/${layer}/{z}/{x}/{y}.png`;

// Lands Department public Map API — official XYZ tile service for HK
const LANDSD = (layer: string) =>
  `https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/${layer}/WGS84/{z}/{x}/{y}.png`;

// Esri public tile services — no auth required
const ESRI = (service: string) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`;

export const MAPS_HK: HistoricalMap[] = [
  {
    id: 'hk-qing-1900',
    year: 1900,
    name: 'Qing land survey c. 1900',
    description: 'Guangdong province land survey · CHMap / MPIWG Berlin · late Qing dynasty · covers New Territories pre-annexation',
    type: 'xyz',
    url: CHMAP('guangdong'),
    attribution: '© MPIWG Berlin – CHMap Guangdong land surveys',
  },
  {
    id: 'hk-1957',
    year: 1957,
    name: 'Colonial survey 1957',
    description: 'Late colonial survey of Hong Kong and New Territories · Lands and Survey Office · hkmaps.hk',
    type: 'xyz',
    url: HKMAPS(1957),
    attribution: '© UK Open Government Licence v3.0 – hkmaps.hk',
  },
  {
    id: 'hk-aerial1973',
    year: 1973,
    name: 'Aerial survey 1973',
    description: 'Aerial photography mosaic of Hong Kong · hkmaps.hk',
    type: 'xyz',
    url: HKMAPS(1973),
    attribution: '© hkmaps.hk / Lands Department HKSAR',
  },
  {
    id: 'hk-dop1982',
    year: 1982,
    name: 'Aerial survey 1982',
    description: 'Aerial photography mosaic of Hong Kong · hkmaps.hk',
    type: 'xyz',
    url: HKMAPS(1982),
    attribution: '© hkmaps.hk / Lands Department HKSAR',
  },
  {
    id: 'hk-aerial1993',
    year: 1993,
    name: 'Aerial survey 1993',
    description: 'Aerial photography mosaic of Hong Kong · last British colonial aerial survey · hkmaps.hk',
    type: 'xyz',
    url: HKMAPS(1993),
    attribution: '© hkmaps.hk / Lands Department HKSAR',
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

export const MIN_YEAR_HK = 1900;
export const MAX_YEAR_HK = 2024;

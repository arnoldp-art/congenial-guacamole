import { HistoricalMap } from './maps';

// CSDI ArcGIS REST tile endpoint — same Esri y/x convention as NGI Belgium
// tile/{z}/{y}/{x} (y before x)
const CSDI = (serviceId: string) =>
  `https://p1static.csdi.gov.hk/server/rest/services/common/${serviceId}/MapServer/tile/{z}/{y}/{x}`;

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
    url: CSDI('landsd_rcd_1637306686961_88197'),
    attribution: '© Lands Department, HKSAR Government',
  },
  {
    id: 'hk-dop1982',
    year: 1982,
    name: 'Aerial survey 1982',
    description: 'DOP5000-1982 · aerial photos October 1982 · Lands Department HKSAR',
    type: 'xyz',
    url: CSDI('landsd_rcd_1671589976272_67085'),
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

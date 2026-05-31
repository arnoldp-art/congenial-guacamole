import { HistoricalMap } from './maps';

// CSDI (Common Spatial Data Infrastructure) WMS — open data, no API key
// ArcGIS MapServer WMS: layer "0" is the main raster layer
const CSDI_WMS = (serviceId: string) =>
  `https://p1static.csdi.gov.hk/server/services/common/${serviceId}/MapServer/WMSServer`;

export const MAPS_HK: HistoricalMap[] = [
  {
    id: 'hk-dop1963',
    year: 1963,
    name: 'Aerial survey 1963',
    description: 'Digital Orthophoto DOP1000-1963 · 0.1m resolution · New Territories & Kowloon · Lands Department HKSAR',
    type: 'wms',
    url: CSDI_WMS('landsd_rcd_1637306686961_88197'),
    wmsLayer: '0',
    attribution: '© Lands Department, HKSAR Government',
  },
  {
    id: 'hk-dop1982',
    year: 1982,
    name: 'Aerial survey 1982',
    description: 'Digital Orthophoto DOP5000-1982 · aerial photos from October 1982 · Lands Department HKSAR',
    type: 'wms',
    url: CSDI_WMS('landsd_rcd_1671589976272_67085'),
    wmsLayer: '0',
    attribution: '© Lands Department, HKSAR Government',
  },
  {
    id: 'hk-tdop',
    year: 2020,
    name: 'True Digital Orthophoto',
    description: 'TDOP Series · 0.25m resolution · whole territory of Hong Kong · current coverage',
    type: 'wms',
    url: CSDI_WMS('landsd_rcd_1701762716904_4826'),
    wmsLayer: '0',
    attribution: '© Lands Department, HKSAR Government',
  },
];

export const MIN_YEAR_HK = 1963;
export const MAX_YEAR_HK = 2024;

import { HistoricalMap } from './maps';

// HK Lands Department / Survey and Mapping Office tiles
// Standard XYZ — {z}/{x}/{y}
const HK = (path: string) =>
  `https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/${path}/{z}/{x}/{y}.png`;

// HK Government historical aerial photos via GeoData Store
const HK_AERIAL = (year: string) =>
  `https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/orthophoto/${year}/{z}/{x}/{y}.png`;

export const MAPS_HK: HistoricalMap[] = [
  {
    id: 'hk-topo-1945',
    year: 1945,
    name: 'British survey 1945',
    description: 'British colonial topographic survey of Hong Kong · post-WWII reoccupation',
    type: 'xyz',
    url: 'https://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/HK_Historical_Map_1945/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Survey & Mapping Office, Lands Department, HKSAR',
  },
  {
    id: 'hk-topo-1963',
    year: 1963,
    name: 'Colonial survey 1963',
    description: 'Hong Kong Crown Colony topographic map · rapid post-war industrialisation',
    type: 'xyz',
    url: 'https://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/HK_Historical_Map_1963/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Survey & Mapping Office, Lands Department, HKSAR',
  },
  {
    id: 'hk-topo-1980',
    year: 1980,
    name: 'HK topographic 1980',
    description: 'Survey during the last decade of major New Territories transformation',
    type: 'xyz',
    url: 'https://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/HK_Historical_Map_1980/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Survey & Mapping Office, Lands Department, HKSAR',
  },
  {
    id: 'hk-topo-2000',
    year: 2000,
    name: 'HK topographic 2000',
    description: 'Post-handover Hong Kong · New Territories development',
    type: 'xyz',
    url: HK('basemap/wgs84'),
    attribution: '© Lands Department, HKSAR Government',
  },
];

export const MIN_YEAR_HK = 1945;
export const MAX_YEAR_HK = 2000;

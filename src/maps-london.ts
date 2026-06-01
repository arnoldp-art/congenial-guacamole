import { HistoricalMap } from './maps';

// NLS (National Library of Scotland) S3 tile archive — free, no API key required
// Standard XYZ {z}/{x}/{y} — browser-accessible
const NLS_S3 = (path: string) =>
  `https://mapseries-tilesets.s3.amazonaws.com/${path}/{z}/{x}/{y}.png`;

// NLS geo.nls.uk tile server — host-restricted (cloud IPs blocked, browsers work fine)
// Standard XYZ {z}/{x}/{y}
const NLS_GEO = (path: string) =>
  `https://geo.nls.uk/${path}/{z}/{x}/{y}.png`;

// NLS geo.nls.uk — TMS layers (inverted Y axis), use {-y} in Leaflet
const NLS_GEO_TMS = (path: string) =>
  `https://geo.nls.uk/${path}/{z}/{x}/{-y}.png`;

// Esri public tile services — no auth required
const ESRI = (service: string) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`;

export const MAPS_LONDON: HistoricalMap[] = [
  {
    id: 'london-os6in-msx-1866',
    year: 1866,
    name: 'OS 6-inch Middlesex c.1866',
    description: 'Ordnance Survey 6-inch to the mile · Middlesex county 1st edition · surveyed 1863–1870 · covers Hendon and all of north London',
    type: 'xyz',
    url: NLS_S3('os/six-inch-middlesex'),
    attribution: '© National Library of Scotland – OS Six-Inch Middlesex 1st edition',
  },
  {
    id: 'london-os2500-1893',
    year: 1893,
    name: 'OS 1:2,500 London Victorian 1890s',
    description: 'Ordnance Survey 1:2,500 scale · London Urban Area · large-scale Victorian parcel mapping · very high detail',
    type: 'xyz',
    url: NLS_S3('os/london_2500'),
    attribution: '© National Library of Scotland – OS 1:2,500 London',
  },
  {
    id: 'london-os6in-2nd-1896',
    year: 1896,
    name: 'OS 6-inch England 2nd edition c.1896',
    description: 'Ordnance Survey 6-inch to the mile · England & Wales 2nd edition · surveyed 1888–1914 · national coverage',
    type: 'xyz',
    url: NLS_S3('os/6inchsecond'),
    attribution: '© National Library of Scotland – OS Six-Inch England 2nd edition',
  },
  {
    id: 'london-os1in-2nded-1898',
    year: 1898,
    name: 'OS 1-inch 2nd edition 1885–1903',
    description: 'Ordnance Survey 1-inch to the mile · 2nd edition (GSGS 3908) · covers all of Great Britain',
    type: 'xyz',
    url: NLS_S3('1inch_2nd_ed'),
    attribution: '© National Library of Scotland – OS 1-inch 2nd edition',
  },
  {
    id: 'london-bartholomew-1900',
    year: 1900,
    name: 'Bartholomew Half-Inch 1897–1907',
    description: 'John Bartholomew & Son half-inch to the mile · Great Britain · coloured layer representation · late Victorian / Edwardian era',
    type: 'xyz',
    url: NLS_GEO_TMS('mapdata2/bartholomew/great_britain'),
    attribution: '© National Library of Scotland – Bartholomew Half-Inch Great Britain',
  },
  {
    id: 'london-os1in-revised-1907',
    year: 1907,
    name: 'OS 1-inch Revised New edition c.1907',
    description: 'Ordnance Survey 1-inch to the mile · Revised New edition · revised 1897–1914 from the 2nd edition',
    type: 'xyz',
    url: NLS_S3('os/1inch_revised'),
    attribution: '© National Library of Scotland – OS 1-inch Revised New edition',
  },
  {
    id: 'london-os-popular-1920',
    year: 1920,
    name: 'OS Popular edition 1919–1926',
    description: 'Ordnance Survey 1-inch to the mile · Popular edition · England & Wales · inter-war period',
    type: 'xyz',
    url: NLS_S3('os/popular-england'),
    attribution: '© National Library of Scotland – OS Popular edition',
  },
  {
    id: 'london-os-newpop-1950',
    year: 1950,
    name: 'OS New Popular edition 1944–1956',
    description: 'Ordnance Survey 1-inch to the mile · New Popular (National Grid) edition · wartime / post-war survey of Great Britain',
    type: 'xyz',
    url: NLS_S3('os/newpopular'),
    attribution: '© National Library of Scotland – OS New Popular edition',
  },
  {
    id: 'london-os25k-1955',
    year: 1955,
    name: 'OS 1:25,000 1st Series 1937–1961',
    description: 'Ordnance Survey 1:25,000 · 1st Series (Provisional edition) · National Grid · post-war detailed mapping of Great Britain',
    type: 'xyz',
    url: NLS_GEO_TMS('mapdata2/os/25000'),
    attribution: '© National Library of Scotland – OS 1:25,000 1st Series',
  },
  {
    id: 'london-os1250-1960',
    year: 1960,
    name: 'OS 1:1,250 London National Grid c.1947–1963',
    description: 'Ordnance Survey 1:1,250 scale · London National Grid · very large-scale post-war mapping · highest detail available',
    type: 'xyz',
    url: NLS_S3('london_1940s'),
    attribution: '© National Library of Scotland – OS 1:1,250 London National Grid',
  },
  {
    id: 'london-os7th-1963',
    year: 1963,
    name: 'OS 1-inch 7th Series 1952–1973',
    description: 'Ordnance Survey 1-inch to the mile · 7th Series · National Grid · standard topographic map of Great Britain in the post-war era',
    type: 'xyz',
    url: NLS_GEO_TMS('mapdata2/os/seventh'),
    attribution: '© National Library of Scotland – OS 1-inch 7th Series',
  },
  {
    id: 'london-satellite',
    year: 2020,
    name: 'Satellite imagery',
    description: 'Esri World Imagery · high-resolution satellite · current coverage',
    type: 'xyz',
    url: ESRI('World_Imagery'),
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
];

export const MIN_YEAR_LONDON = 1866;
export const MAX_YEAR_LONDON = 2024;

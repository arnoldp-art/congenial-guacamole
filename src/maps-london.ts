import { HistoricalMap } from './maps';

// NLS (National Library of Scotland) S3 tile archive — free, no API key required
const NLS_S3 = (path: string) =>
  `https://mapseries-tilesets.s3.amazonaws.com/${path}/{z}/{x}/{y}.png`;

// Esri public tile services — no auth required
const ESRI = (service: string) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`;

export const MAPS_LONDON: HistoricalMap[] = [
  {
    id: 'london-os6in-msx-1866',
    year: 1866,
    name: 'OS 6-inch Middlesex c.1866',
    description: 'Ordnance Survey 6-inch to the mile · Middlesex county 1st edition · surveyed 1863–1870 · covers Hendon and all of north London',
    blurb: "Hendon is a quiet rural parish of scattered farms, hay meadows, and market gardens supplying London — the population is under 3,000 and the railway hasn't arrived yet.",
    type: 'xyz',
    url: NLS_S3('os/six-inch-middlesex'),
    attribution: '© National Library of Scotland – OS Six-Inch Middlesex 1st edition',
  },
  {
    id: 'london-os2500-1893',
    year: 1893,
    name: 'OS 1:2,500 London Victorian 1890s',
    description: 'Ordnance Survey 1:2,500 scale · London Urban Area · large-scale Victorian parcel mapping · very high detail',
    blurb: "The Midland Railway (opened 1868) triggered the first wave of suburban development — Victorian villas line the new roads from the station while open fields still dominate.",
    type: 'xyz',
    url: NLS_S3('os/london_2500'),
    attribution: '© National Library of Scotland – OS 1:2,500 London',
  },
  {
    id: 'london-os6in-2nd-1896',
    year: 1896,
    name: 'OS 6-inch England 2nd edition c.1896',
    description: 'Ordnance Survey 6-inch to the mile · England & Wales 2nd edition · surveyed 1888–1914 · national coverage',
    blurb: "Late-Victorian Hendon is a prosperous middle-class suburb in formation. The Welsh Harp reservoir (built 1835) draws leisure visitors; the gap between station and old village is rapidly filling.",
    type: 'xyz',
    url: NLS_S3('os/6inchsecond'),
    attribution: '© National Library of Scotland – OS Six-Inch England 2nd edition',
  },
  {
    id: 'london-os1in-2nded-1898',
    year: 1898,
    name: 'OS 1-inch 2nd edition 1885–1903',
    description: 'Ordnance Survey 1-inch to the mile · 2nd edition (GSGS 3908) · covers all of Great Britain',
    blurb: "Edwardian growth accelerates — the area between Hendon and Golders Green is being laid out for development ahead of the Northern Line extension (Golders Green opens 1907, Hendon Central 1923).",
    type: 'xyz',
    url: NLS_S3('1inch_2nd_ed'),
    attribution: '© National Library of Scotland – OS 1-inch 2nd edition',
  },
  {
    id: 'london-os1in-revised-1907',
    year: 1907,
    name: 'OS 1-inch Revised New edition c.1907',
    description: 'Ordnance Survey 1-inch to the mile · Revised New edition · revised 1897–1914 from the 2nd edition',
    blurb: "With the Underground extension imminent, fields are being staked out for streets. Hendon's transformation from agricultural parish to London suburb is well underway.",
    type: 'xyz',
    url: NLS_S3('os/1inch_revised'),
    attribution: '© National Library of Scotland – OS 1-inch Revised New edition',
  },
  {
    id: 'london-os-popular-1920',
    year: 1920,
    name: 'OS Popular edition 1919–1926',
    description: 'Ordnance Survey 1-inch to the mile · Popular edition · England & Wales · inter-war period',
    blurb: "The RAF established its aerodrome here in 1910 — one of the world's first public airfields. The inter-war housing boom is transforming open fields into dense Metroland suburbia at remarkable speed.",
    type: 'xyz',
    url: NLS_S3('os/popular-england'),
    attribution: '© National Library of Scotland – OS Popular edition',
  },
  {
    id: 'london-os-newpop-1950',
    year: 1950,
    name: 'OS New Popular edition 1944–1956',
    description: 'Ordnance Survey 1-inch to the mile · New Popular (National Grid) edition · wartime / post-war survey of Great Britain',
    blurb: "Post-war Hendon is almost entirely built out. The RAF aerodrome (visible here, it closes in 1957) dominates the north-west; the North Circular Road cuts a hard edge through the urban fabric.",
    type: 'xyz',
    url: NLS_S3('os/newpopular'),
    attribution: '© National Library of Scotland – OS New Popular edition',
  },
  {
    id: 'london-os1250-1960',
    year: 1960,
    name: 'OS 1:1,250 London National Grid c.1947–1963',
    description: 'Ordnance Survey 1:1,250 scale · London National Grid · very large-scale post-war mapping · highest detail available',
    blurb: "The last open land is being developed. Brent Cross — visible here as an industrial area — will become one of Britain's first out-of-town shopping centres when it opens in 1976.",
    type: 'xyz',
    url: NLS_S3('london_1940s'),
    attribution: '© National Library of Scotland – OS 1:1,250 London National Grid',
  },
  {
    id: 'london-satellite',
    year: 2020,
    name: 'Satellite imagery',
    description: 'Esri World Imagery · high-resolution satellite · current coverage',
    blurb: "Modern Hendon — the former aerodrome is now the RAF Museum (opened 1972) and Middlesex University. Every field visible in the 1866 map is now built over.",
    type: 'xyz',
    url: ESRI('World_Imagery'),
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
];

export const MIN_YEAR_LONDON = 1866;
export const MAX_YEAR_LONDON = 2024;

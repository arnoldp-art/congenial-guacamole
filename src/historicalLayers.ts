export interface Era {
  label: string;
  minYear: number;
  maxYear: number;
  tileUrl: string;
  tileAttribution: string;
}

export const ERAS: Era[] = [
  {
    label: 'Medieval',
    minYear: 979,
    maxYear: 1499,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    tileAttribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    label: 'Early Modern',
    minYear: 1500,
    maxYear: 1799,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    tileAttribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    label: 'Industrial',
    minYear: 1800,
    maxYear: 1913,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
    tileAttribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    label: 'War Era',
    minYear: 1914,
    maxYear: 1949,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    tileAttribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    label: 'Modern',
    minYear: 1950,
    maxYear: 2100,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    tileAttribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
];

export function getEra(year: number): Era {
  return ERAS.find(e => year >= e.minYear && year <= e.maxYear) ?? ERAS[ERAS.length - 1];
}

// Each forest polygon has a presence range [fromYear, toYear]
export interface ForestFeature {
  id: string;
  name: string;
  fromYear: number;
  toYear: number;
  color: string;
  coords: [number, number][]; // [lat, lng]
}

export const FORESTS: ForestFeature[] = [
  // Ardennes - always present but shrinks in industrial era
  {
    id: 'ardennes-core',
    name: 'Ardennes Forest (core)',
    fromYear: 979,
    toYear: 2100,
    color: '#2d6a4f',
    coords: [
      [50.45, 5.10], [50.45, 6.40], [49.50, 6.40],
      [49.50, 5.10], [50.45, 5.10],
    ],
  },
  {
    id: 'ardennes-extended',
    name: 'Ardennes Forest (extended)',
    fromYear: 979,
    toYear: 1799,
    color: '#2d6a4f',
    coords: [
      [50.60, 4.90], [50.60, 6.40], [49.50, 6.40],
      [49.50, 4.90], [50.60, 4.90],
    ],
  },
  // Sonian Forest (Forêt de Soignes) - near Brussels, significantly reduced
  {
    id: 'sonian-medieval',
    name: 'Sonian Forest (medieval extent)',
    fromYear: 979,
    toYear: 1499,
    color: '#40916c',
    coords: [
      [50.85, 4.35], [50.85, 4.65], [50.65, 4.65],
      [50.65, 4.35], [50.85, 4.35],
    ],
  },
  {
    id: 'sonian-early-modern',
    name: 'Sonian Forest (reduced)',
    fromYear: 1500,
    toYear: 1849,
    color: '#40916c',
    coords: [
      [50.80, 4.38], [50.80, 4.58], [50.70, 4.58],
      [50.70, 4.38], [50.80, 4.38],
    ],
  },
  {
    id: 'sonian-modern',
    name: 'Sonian Forest (current)',
    fromYear: 1850,
    toYear: 2100,
    color: '#40916c',
    coords: [
      [50.78, 4.40], [50.78, 4.55], [50.72, 4.55],
      [50.72, 4.40], [50.78, 4.40],
    ],
  },
  // Kempen heathland (northeast) - mostly cleared for industry/agriculture
  {
    id: 'kempen-medieval',
    name: 'Kempen Heathland',
    fromYear: 979,
    toYear: 1799,
    color: '#b5c27a',
    coords: [
      [51.30, 4.80], [51.30, 5.60], [51.00, 5.60],
      [51.00, 4.80], [51.30, 4.80],
    ],
  },
  {
    id: 'kempen-industrial',
    name: 'Kempen (partially cleared)',
    fromYear: 1800,
    toYear: 1913,
    color: '#b5c27a',
    coords: [
      [51.25, 4.90], [51.25, 5.50], [51.05, 5.50],
      [51.05, 4.90], [51.25, 4.90],
    ],
  },
  // Houthulst Forest (West Flanders) - destroyed in WWI
  {
    id: 'houthulst-pre-wwi',
    name: 'Houthulst Forest',
    fromYear: 979,
    toYear: 1913,
    color: '#52b788',
    coords: [
      [51.00, 2.88], [51.00, 3.02], [50.90, 3.02],
      [50.90, 2.88], [51.00, 2.88],
    ],
  },
  {
    id: 'houthulst-post-wwi',
    name: 'Houthulst Forest (replanted)',
    fromYear: 1925,
    toYear: 2100,
    color: '#52b788',
    coords: [
      [50.98, 2.90], [50.98, 3.00], [50.92, 3.00],
      [50.92, 2.90], [50.98, 2.90],
    ],
  },
  // Meerdaal Forest (near Leuven)
  {
    id: 'meerdaal',
    name: 'Meerdaal Forest',
    fromYear: 979,
    toYear: 2100,
    color: '#74c69d',
    coords: [
      [50.78, 4.65], [50.78, 4.80], [50.72, 4.80],
      [50.72, 4.65], [50.78, 4.65],
    ],
  },
  // Charleroi coal basin forests - cleared for mining
  {
    id: 'charleroi-forests',
    name: 'Sambre-Meuse forests',
    fromYear: 979,
    toYear: 1849,
    color: '#2d6a4f',
    coords: [
      [50.50, 4.20], [50.50, 4.70], [50.35, 4.70],
      [50.35, 4.20], [50.50, 4.20],
    ],
  },
];

export interface RoadFeature {
  id: string;
  name: string;
  fromYear: number;
  color: string;
  width: number;
  coords: [number, number][]; // [lat, lng]
}

export const ROADS: RoadFeature[] = [
  // Roman road Bavay-Tongeren (Chaussée Brunehaut)
  {
    id: 'roman-bavay-tongeren',
    name: 'Roman Road: Bavay–Tongeren',
    fromYear: 100,
    color: '#8B7355',
    width: 3,
    coords: [
      [50.30, 3.80], [50.45, 4.00], [50.62, 4.30],
      [50.78, 4.62], [50.88, 5.10],
    ],
  },
  // Medieval road Brussels-Bruges
  {
    id: 'medieval-brussels-bruges',
    name: 'Medieval Road: Brussels–Bruges',
    fromYear: 1200,
    color: '#8B7355',
    width: 2,
    coords: [
      [50.85, 4.35], [50.95, 4.00], [51.05, 3.70],
      [51.15, 3.40], [51.21, 3.22],
    ],
  },
  // Napoleon road network (~1800)
  {
    id: 'napoleon-liege-brussels',
    name: 'Napoleon Road: Brussels–Liège',
    fromYear: 1800,
    color: '#c9a84c',
    width: 3,
    coords: [
      [50.85, 4.35], [50.82, 4.60], [50.70, 5.00],
      [50.65, 5.35], [50.64, 5.57],
    ],
  },
  {
    id: 'napoleon-brussels-ghent',
    name: 'Napoleon Road: Brussels–Ghent',
    fromYear: 1800,
    color: '#c9a84c',
    width: 3,
    coords: [
      [50.85, 4.35], [51.00, 4.00], [51.05, 3.72],
    ],
  },
  // First railway: Brussels-Mechelen (1835)
  {
    id: 'rail-brussels-mechelen',
    name: 'Railway: Brussels–Mechelen (1835)',
    fromYear: 1835,
    color: '#2c2c2c',
    width: 3,
    coords: [
      [50.85, 4.35], [51.02, 4.48],
    ],
  },
  // Railway: Brussels-Liège (1842)
  {
    id: 'rail-brussels-liege',
    name: 'Railway: Brussels–Liège',
    fromYear: 1842,
    color: '#2c2c2c',
    width: 2,
    coords: [
      [50.85, 4.35], [50.82, 4.65], [50.70, 5.10],
      [50.64, 5.57],
    ],
  },
  // Railway: Brussels-Antwerp (1836)
  {
    id: 'rail-brussels-antwerp',
    name: 'Railway: Brussels–Antwerp',
    fromYear: 1836,
    color: '#2c2c2c',
    width: 2,
    coords: [
      [50.85, 4.35], [51.02, 4.48], [51.22, 4.40],
    ],
  },
  // Motorway E40 (1950s+)
  {
    id: 'motorway-e40',
    name: 'Motorway E40: Brussels–Liège',
    fromYear: 1955,
    color: '#3a86ff',
    width: 4,
    coords: [
      [50.85, 4.35], [50.80, 4.65], [50.72, 5.00],
      [50.65, 5.35], [50.62, 5.57],
    ],
  },
  // Motorway E17 (1960s+)
  {
    id: 'motorway-e17',
    name: 'Motorway E17: Antwerp–Ghent',
    fromYear: 1960,
    color: '#3a86ff',
    width: 4,
    coords: [
      [51.22, 4.40], [51.10, 3.95], [51.05, 3.72],
    ],
  },
];

export interface UrbanFeature {
  id: string;
  name: string;
  coords: [number, number][][]; // array of rings per era
  years: number[]; // year each ring appears
  color: string;
}

export const URBAN_AREAS: UrbanFeature[] = [
  {
    id: 'brussels',
    name: 'Brussels',
    color: '#e63946',
    years: [979, 1300, 1600, 1800, 1900, 1950],
    coords: [
      // 979 - tiny settlement
      [[50.852, 4.345], [50.852, 4.360], [50.840, 4.360], [50.840, 4.345]],
      // 1300
      [[50.856, 4.335], [50.856, 4.370], [50.835, 4.370], [50.835, 4.335]],
      // 1600 - capital of Spanish Netherlands
      [[50.870, 4.310], [50.870, 4.400], [50.820, 4.400], [50.820, 4.310]],
      // 1800 - Napoleon era
      [[50.890, 4.290], [50.890, 4.420], [50.800, 4.420], [50.800, 4.290]],
      // 1900 - industrial expansion
      [[50.930, 4.250], [50.930, 4.460], [50.770, 4.460], [50.770, 4.250]],
      // 1950 - modern sprawl
      [[50.980, 4.200], [50.980, 4.520], [50.720, 4.520], [50.720, 4.200]],
    ],
  },
  {
    id: 'antwerp',
    name: 'Antwerp',
    color: '#e63946',
    years: [979, 1400, 1560, 1800, 1880, 1950],
    coords: [
      [[51.222, 4.395], [51.222, 4.415], [51.210, 4.415], [51.210, 4.395]],
      [[51.228, 4.390], [51.228, 4.425], [51.205, 4.425], [51.205, 4.390]],
      [[51.240, 4.375], [51.240, 4.445], [51.195, 4.445], [51.195, 4.375]],
      [[51.255, 4.355], [51.255, 4.465], [51.180, 4.465], [51.180, 4.355]],
      [[51.270, 4.330], [51.270, 4.490], [51.160, 4.490], [51.160, 4.330]],
      [[51.310, 4.280], [51.310, 4.540], [51.130, 4.540], [51.130, 4.280]],
    ],
  },
  {
    id: 'ghent',
    name: 'Ghent',
    color: '#e63946',
    years: [979, 1200, 1500, 1800, 1870, 1950],
    coords: [
      [[51.055, 3.715], [51.055, 3.730], [51.045, 3.730], [51.045, 3.715]],
      [[51.065, 3.705], [51.065, 3.740], [51.040, 3.740], [51.040, 3.705]],
      [[51.075, 3.695], [51.075, 3.760], [51.030, 3.760], [51.030, 3.695]],
      [[51.090, 3.680], [51.090, 3.780], [51.015, 3.780], [51.015, 3.680]],
      [[51.110, 3.660], [51.110, 3.800], [50.995, 3.800], [50.995, 3.660]],
      [[51.140, 3.630], [51.140, 3.840], [50.970, 3.840], [50.970, 3.630]],
    ],
  },
  {
    id: 'liege',
    name: 'Liège',
    color: '#e63946',
    years: [979, 1200, 1500, 1800, 1860, 1950],
    coords: [
      [[50.648, 5.568], [50.648, 5.580], [50.638, 5.580], [50.638, 5.568]],
      [[50.655, 5.558], [50.655, 5.590], [50.630, 5.590], [50.630, 5.558]],
      [[50.665, 5.545], [50.665, 5.600], [50.620, 5.600], [50.620, 5.545]],
      [[50.680, 5.530], [50.680, 5.620], [50.605, 5.620], [50.605, 5.530]],
      [[50.700, 5.510], [50.700, 5.650], [50.585, 5.650], [50.585, 5.510]],
      [[50.730, 5.480], [50.730, 5.700], [50.560, 5.700], [50.560, 5.480]],
    ],
  },
];

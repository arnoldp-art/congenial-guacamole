// Mechelen area historical landscape data
// Coordinates: [lat, lng]

export interface VegetationFeature {
  id: string;
  name: string;
  type: 'forest' | 'wetland' | 'heathland' | 'orchard';
  fromYear: number;
  toYear: number;
  coords: [number, number][];
}

export interface WaterFeature {
  id: string;
  name: string;
  type: 'river' | 'canal';
  fromYear: number;
  coords: [number, number][];
  width: number;
}

export interface RoadFeature {
  id: string;
  name: string;
  type: 'roman' | 'medieval' | 'chaussee' | 'railway' | 'motorway';
  fromYear: number;
  coords: [number, number][];
}

export interface UrbanFeature {
  id: string;
  name: string;
  fromYear: number;
  coords: [number, number][];
}

// ── Vegetation ──────────────────────────────────────────────────────────────

export const VEGETATION: VegetationFeature[] = [
  // Vrijbroekbos — large medieval forest west of city, shrinks over centuries
  {
    id: 'vrijbroek-medieval',
    name: 'Vrijbroek Forest (medieval)',
    type: 'forest',
    fromYear: 979,
    toYear: 1499,
    coords: [
      [51.052, 4.418], [51.058, 4.428], [51.055, 4.443],
      [51.048, 4.452], [51.040, 4.457], [51.032, 4.455],
      [51.024, 4.450], [51.018, 4.442], [51.015, 4.430],
      [51.018, 4.420], [51.025, 4.412], [51.035, 4.408],
      [51.044, 4.411], [51.050, 4.415],
    ],
  },
  {
    id: 'vrijbroek-early-modern',
    name: 'Vrijbroekbos',
    type: 'forest',
    fromYear: 1500,
    toYear: 1834,
    coords: [
      [51.042, 4.424], [51.046, 4.432], [51.043, 4.442],
      [51.036, 4.448], [51.028, 4.447], [51.022, 4.442],
      [51.019, 4.433], [51.022, 4.424], [51.030, 4.419],
      [51.038, 4.420],
    ],
  },
  {
    id: 'vrijbroek-modern',
    name: 'Vrijbroekbos (current)',
    type: 'forest',
    fromYear: 1835,
    toYear: 2100,
    coords: [
      [51.038, 4.428], [51.040, 4.435], [51.037, 4.441],
      [51.031, 4.444], [51.025, 4.441], [51.023, 4.433],
      [51.026, 4.426], [51.033, 4.424],
    ],
  },

  // Muizenbos — forest south of Mechelen near the village of Muizen
  {
    id: 'muizenbos-medieval',
    name: 'Muizenbos (medieval)',
    type: 'forest',
    fromYear: 979,
    toYear: 1799,
    coords: [
      [50.983, 4.490], [50.988, 4.500], [50.990, 4.515],
      [50.985, 4.525], [50.976, 4.528], [50.968, 4.522],
      [50.965, 4.510], [50.969, 4.498], [50.977, 4.490],
    ],
  },
  {
    id: 'muizenbos-reduced',
    name: 'Muizenbos',
    type: 'forest',
    fromYear: 1800,
    toYear: 2100,
    coords: [
      [50.980, 4.494], [50.984, 4.502], [50.984, 4.514],
      [50.978, 4.520], [50.971, 4.516], [50.969, 4.506],
      [50.973, 4.496],
    ],
  },

  // Planckendaelbos — east of Mechelen
  {
    id: 'planckendael-medieval',
    name: 'Planckendaelbos',
    type: 'forest',
    fromYear: 979,
    toYear: 1849,
    coords: [
      [51.022, 4.530], [51.028, 4.538], [51.030, 4.550],
      [51.025, 4.562], [51.016, 4.565], [51.008, 4.558],
      [51.006, 4.544], [51.011, 4.532], [51.018, 4.527],
    ],
  },
  {
    id: 'planckendael-modern',
    name: 'Planckendaelbos (reduced)',
    type: 'forest',
    fromYear: 1850,
    toYear: 2100,
    coords: [
      [51.018, 4.534], [51.022, 4.540], [51.022, 4.550],
      [51.016, 4.556], [51.010, 4.551], [51.009, 4.541],
      [51.014, 4.533],
    ],
  },

  // Battenbroeck wetlands — along the Rupel to the north
  {
    id: 'battenbroeck-medieval',
    name: 'Battenbroeck Marshes',
    type: 'wetland',
    fromYear: 979,
    toYear: 1849,
    coords: [
      [51.068, 4.452], [51.075, 4.462], [51.080, 4.478],
      [51.082, 4.495], [51.078, 4.510], [51.070, 4.518],
      [51.060, 4.515], [51.053, 4.505], [51.050, 4.488],
      [51.054, 4.470], [51.061, 4.458],
    ],
  },
  {
    id: 'battenbroeck-drained',
    name: 'Battenbroeck (drained polders)',
    type: 'wetland',
    fromYear: 1850,
    toYear: 2100,
    coords: [
      [51.072, 4.462], [51.076, 4.472], [51.077, 4.486],
      [51.073, 4.498], [51.066, 4.503], [51.059, 4.498],
      [51.057, 4.484], [51.060, 4.470], [51.067, 4.462],
    ],
  },

  // Torfbroek — peaty wetland southeast of Mechelen
  {
    id: 'torfbroek',
    name: 'Torfbroek',
    type: 'wetland',
    fromYear: 979,
    toYear: 1913,
    coords: [
      [51.000, 4.538], [51.005, 4.546], [51.004, 4.557],
      [50.997, 4.563], [50.990, 4.558], [50.989, 4.546],
      [50.994, 4.537],
    ],
  },

  // Heathland (Bonheiden area) — east, disappears with agriculture
  {
    id: 'heathland-bonheiden',
    name: 'Bonheiden Heathland',
    type: 'heathland',
    fromYear: 979,
    toYear: 1699,
    coords: [
      [51.005, 4.568], [51.012, 4.578], [51.015, 4.594],
      [51.010, 4.608], [51.000, 4.613], [50.991, 4.606],
      [50.988, 4.590], [50.993, 4.574],
    ],
  },

  // Orchards/market gardens north of Mechelen (18th century onwards)
  {
    id: 'market-gardens',
    name: 'Market Gardens (Mechelen Asparagus)',
    type: 'orchard',
    fromYear: 1750,
    toYear: 2100,
    coords: [
      [51.048, 4.488], [51.053, 4.496], [51.052, 4.506],
      [51.046, 4.511], [51.039, 4.508], [51.037, 4.498],
      [51.041, 4.488],
    ],
  },
];

// ── Water features ───────────────────────────────────────────────────────────

export const WATER: WaterFeature[] = [
  {
    id: 'dijle',
    name: 'Dijle (Dyle)',
    type: 'river',
    fromYear: 979,
    width: 4,
    coords: [
      [50.968, 4.508], [50.978, 4.502], [50.990, 4.498],
      [51.002, 4.492], [51.012, 4.488], [51.022, 4.484],
      [51.032, 4.480], [51.042, 4.477], [51.055, 4.475],
      [51.068, 4.472],
    ],
  },
  {
    id: 'rupel',
    name: 'Rupel',
    type: 'river',
    fromYear: 979,
    width: 6,
    coords: [
      [51.068, 4.472], [51.076, 4.484], [51.082, 4.500],
      [51.085, 4.520], [51.083, 4.540],
    ],
  },
  {
    id: 'zenne-canal',
    name: 'Zenne',
    type: 'river',
    fromYear: 979,
    width: 3,
    coords: [
      [51.005, 4.408], [51.015, 4.418], [51.025, 4.428],
      [51.038, 4.440], [51.050, 4.452], [51.062, 4.462],
    ],
  },
  {
    id: 'canal-brussels-mechelen',
    name: 'Canal Brussels–Mechelen',
    type: 'canal',
    fromYear: 1561,
    width: 3,
    coords: [
      [51.018, 4.470], [51.028, 4.468], [51.040, 4.466],
      [51.052, 4.465], [51.065, 4.466],
    ],
  },
];

// ── Roads & transport ────────────────────────────────────────────────────────

export const ROADS: RoadFeature[] = [
  {
    id: 'roman-boulogne-cologne',
    name: 'Roman Road: Boulogne–Cologne',
    type: 'roman',
    fromYear: 100,
    coords: [
      [50.975, 4.442], [50.992, 4.452], [51.010, 4.462],
      [51.028, 4.472], [51.045, 4.480], [51.062, 4.490],
    ],
  },
  {
    id: 'medieval-bruges-liege',
    name: 'Medieval Road: Bruges–Liège',
    type: 'medieval',
    fromYear: 1200,
    coords: [
      [51.028, 4.350], [51.028, 4.390], [51.028, 4.430],
      [51.028, 4.480], [51.028, 4.520], [51.025, 4.560],
    ],
  },
  {
    id: 'chaussee-brussels-antwerp',
    name: 'Chaussée: Brussels–Antwerp',
    type: 'chaussee',
    fromYear: 1715,
    coords: [
      [50.980, 4.480], [50.995, 4.480], [51.010, 4.479],
      [51.028, 4.480], [51.045, 4.480], [51.062, 4.480],
      [51.080, 4.482],
    ],
  },
  {
    id: 'railway-brussels-mechelen',
    name: 'Railway: Brussels–Mechelen (1835)',
    type: 'railway',
    fromYear: 1835,
    coords: [
      [50.975, 4.470], [50.990, 4.472], [51.005, 4.473],
      [51.020, 4.474], [51.028, 4.475],
    ],
  },
  {
    id: 'railway-mechelen-antwerp',
    name: 'Railway: Mechelen–Antwerp (1836)',
    type: 'railway',
    fromYear: 1836,
    coords: [
      [51.028, 4.475], [51.042, 4.476], [51.058, 4.477],
      [51.075, 4.479],
    ],
  },
  {
    id: 'motorway-e19',
    name: 'Motorway E19',
    type: 'motorway',
    fromYear: 1958,
    coords: [
      [50.972, 4.468], [50.988, 4.469], [51.005, 4.470],
      [51.022, 4.470], [51.038, 4.470], [51.056, 4.472],
      [51.074, 4.474],
    ],
  },
];

// ── Urban footprint ──────────────────────────────────────────────────────────

export const URBAN: UrbanFeature[] = [
  {
    id: 'mechelen-979',
    name: 'Mechelen (979)',
    fromYear: 979,
    coords: [
      [51.030, 4.474], [51.032, 4.480], [51.030, 4.486],
      [51.025, 4.488], [51.020, 4.484], [51.020, 4.476],
      [51.024, 4.472],
    ],
  },
  {
    id: 'mechelen-1300',
    name: 'Mechelen (1300)',
    fromYear: 1300,
    coords: [
      [51.035, 4.468], [51.038, 4.478], [51.036, 4.490],
      [51.030, 4.496], [51.022, 4.494], [51.018, 4.484],
      [51.019, 4.472], [51.026, 4.466],
    ],
  },
  {
    id: 'mechelen-1500',
    name: 'Mechelen (1500) — capital of Habsburg Netherlands',
    fromYear: 1500,
    coords: [
      [51.040, 4.462], [51.044, 4.475], [51.042, 4.492],
      [51.035, 4.502], [51.024, 4.502], [51.016, 4.493],
      [51.015, 4.476], [51.020, 4.462], [51.030, 4.458],
    ],
  },
  {
    id: 'mechelen-1800',
    name: 'Mechelen (1800)',
    fromYear: 1800,
    coords: [
      [51.044, 4.456], [51.050, 4.472], [51.048, 4.494],
      [51.040, 4.508], [51.026, 4.510], [51.014, 4.500],
      [51.012, 4.480], [51.016, 4.460], [51.028, 4.452],
    ],
  },
  {
    id: 'mechelen-1900',
    name: 'Mechelen (1900)',
    fromYear: 1900,
    coords: [
      [51.050, 4.448], [51.058, 4.466], [51.057, 4.494],
      [51.048, 4.514], [51.030, 4.520], [51.012, 4.510],
      [51.008, 4.486], [51.012, 4.458], [51.026, 4.445],
      [51.040, 4.444],
    ],
  },
  {
    id: 'mechelen-1960',
    name: 'Mechelen (modern)',
    fromYear: 1960,
    coords: [
      [51.058, 4.438], [51.068, 4.460], [51.068, 4.492],
      [51.058, 4.520], [51.038, 4.532], [51.015, 4.525],
      [51.004, 4.502], [51.005, 4.468], [51.018, 4.442],
      [51.038, 4.434],
    ],
  },
];

// ── Tile layers by era ────────────────────────────────────────────────────────

export interface TileConfig {
  label: string;
  minYear: number;
  maxYear: number;
  type: 'xyz' | 'wms';
  url: string;
  options: Record<string, unknown>;
}

export const TILE_CONFIGS: TileConfig[] = [
  {
    label: 'Medieval',
    minYear: 979,
    maxYear: 1770,
    type: 'xyz',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    options: {
      attribution: '&copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    },
  },
  {
    label: 'Ferraris (1770s)',
    minYear: 1771,
    maxYear: 1845,
    type: 'wms',
    url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Ferraris/wms',
    options: {
      layers: 'Ferraris',
      format: 'image/png',
      transparent: false,
      attribution: '&copy; Digitaal Vlaanderen – Ferraris 1770-1778',
      maxZoom: 19,
    },
  },
  {
    label: 'Vandermaelen (1846)',
    minYear: 1846,
    maxYear: 1949,
    type: 'wms',
    url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Vandermaelen/wms',
    options: {
      layers: 'Vandermaelen',
      format: 'image/png',
      transparent: false,
      attribution: '&copy; Digitaal Vlaanderen – Vandermaelen 1846-1854',
      maxZoom: 19,
    },
  },
  {
    label: 'Modern',
    minYear: 1950,
    maxYear: 2100,
    type: 'xyz',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
    options: {
      attribution: '&copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    },
  },
];

export function getTileConfig(year: number): TileConfig {
  return TILE_CONFIGS.find(t => year >= t.minYear && year <= t.maxYear)
    ?? TILE_CONFIGS[TILE_CONFIGS.length - 1];
}

export const ROAD_STYLES: Record<string, { color: string; weight: number; dashArray?: string }> = {
  roman:    { color: '#8B7355', weight: 2, dashArray: '4 3' },
  medieval: { color: '#a07850', weight: 1.5, dashArray: '3 4' },
  chaussee: { color: '#c9a84c', weight: 2.5 },
  railway:  { color: '#333', weight: 3, dashArray: '6 3' },
  motorway: { color: '#4a90d9', weight: 4 },
};

export const VEGETATION_COLORS: Record<string, string> = {
  forest:    '#2d6a4f',
  wetland:   '#4a8fa8',
  heathland: '#9b7e46',
  orchard:   '#6a9e3a',
};

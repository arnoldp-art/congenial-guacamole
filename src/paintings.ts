export interface Painting {
  id: string;
  title: string;
  creator: string;
  year: number;
  showFromYear: number;
  showToYear: number;
  imageUrl: string;
  // Approximate lat/lng bounds for map overlay [south, west, north, east]
  bounds: [[number, number], [number, number]];
  description: string;
  source: string;
}

export const PAINTINGS: Painting[] = [
  {
    id: 'van-deventer',
    title: 'Map of Mechelen',
    creator: 'Jacob van Deventer',
    year: 1557,
    showFromYear: 1500,
    showToYear: 1711,
    // Van Deventer is a proper survey — approximate georeferencing of city walls
    bounds: [[51.012, 4.455], [51.048, 4.510]],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Mechelen,_map_by_Jacob_van_Deventer.JPG',
    description: 'One of ~260 manuscript town maps made for Philip II of Spain · c.1550–1565 · Court cartographer to Charles V',
    source: 'Wikimedia Commons / Royal Library of Belgium (KBR)',
  },
  {
    id: 'braun-hogenberg',
    title: 'Nitidissimae Civitatis Mechlineensis',
    creator: 'Braun & Hogenberg',
    year: 1575,
    showFromYear: 1500,
    showToYear: 1711,
    // Bird's-eye view from the south-east, approximate bounds of the walled city
    bounds: [[51.010, 4.458], [51.046, 4.508]],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/16th-century_Map_of_Mechelen.jpg',
    description: 'Bird\'s-eye view from Civitates Orbis Terrarum · engraved by Frans Hogenberg, who was born in Mechelen · c.1574–1582',
    source: 'Wikimedia Commons / Civitates Orbis Terrarum Vol. I',
  },
  {
    id: 'blaeu-1649',
    title: 'Machlinia (Mechelen)',
    creator: 'Joan Blaeu',
    year: 1649,
    showFromYear: 1640,
    showToYear: 1711,
    // Blaeu plan is orthographic — better georeferencing possible
    bounds: [[51.008, 4.452], [51.048, 4.512]],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Mechelen_Anno_1649.jpg',
    description: 'Plan from Novum Ac Magnum Theatrum Urbium Belgicae · Joan Blaeu, Amsterdam · 1649',
    source: 'Wikimedia Commons / Novum Theatrum Urbium Belgicae',
  },
];

import { HistoricalMap } from './maps';

export interface CityConfig {
  id: string;
  name: string;
  subtitle: string;
  center: [number, number];
  zoom: number;
  minYear: number;
  maxYear: number;
  maps: HistoricalMap[];
  heroColor: string; // accent colour for the selection card
}

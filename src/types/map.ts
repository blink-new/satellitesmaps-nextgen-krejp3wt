export type MapProvider = 'gmaps' | 'mapbox' | 'esri' | 'here' | 'osm';
export type MapType = 's' | 'p'; // satellite or plain

export interface MapConfig {
  provider: MapProvider;
  type: MapType;
  lat: number;
  lng: number;
  zoom: number;
}

export interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  provider: MapProvider;
  type: MapType;
  createdAt: string;
}

export interface HistoryLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  provider: MapProvider;
  type: MapType;
  visitedAt: string;
}

export interface ProviderInfo {
  id: MapProvider;
  name: string;
  description: string;
  shortcut: string;
}
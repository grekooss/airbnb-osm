import { Models } from 'react-native-appwrite';

export interface Listing extends Models.Document {
  osm_id: string;
  name: string;
  operator: string;
  brand: string;
  addr_housename: string;
  addr_housenumber: string;
  amenity: string;
  barrier: string;
  building: string;
  landuse: string;
  leisure: string;
  natural: string;
  sport: string;
  surface: string;
  way_area: number;
  center_point: string;
  way: string;
}

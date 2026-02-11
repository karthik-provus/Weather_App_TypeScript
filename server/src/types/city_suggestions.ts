// The clean object your Frontend will receive
export interface CitySuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  // A pre-formatted string for your dropdown (e.g., "Pune, Maharashtra, India")
  label: string; 
}
 export interface GeoDBResponse {
  data: Array<{
    id: number;
    name: string;
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    population: number;
    type: string;
  }>;
}
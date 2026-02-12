import { api } from './api';

// Define the interface for the suggestion here (frontend version)
export interface CitySuggestion {
  id: number;
  name:string;
  label: string;
  lat: number;
  lon: number;
}

export const WeatherService = {
  async searchCities(query: string): Promise<CitySuggestion[]> {
    const { data } = await api.get<CitySuggestion[]>(`/search?q=${query}`);
    return data;
  },

  async getCurrentWeather(city: string) {
    const { data } = await api.get(`/weather?city=${city}`);
    return data;
  },
  
  async getForecast(city: string, days: number = 3) {
    const { data } = await api.get(`/forecast?city=${city}&days=${days}`);
    return data;
  }
};
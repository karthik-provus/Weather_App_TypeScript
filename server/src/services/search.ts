import { Location } from '../types/weather'; 

class WeatherApiClient {
  private api_key: string;
  private weather_api: string;

  constructor() {
    this.api_key = process.env.WEATHER_API_KEY || "";
    this.weather_api = process.env.WEATHER_API || "";

    if (!this.api_key || !this.weather_api) {
      throw new Error("WeatherApiClient initialized without API Key or Base URL");
    }
  }

  async search(query: string): Promise<Location[]> {
    return this.get<Location[]>('/search.json', { q: query });
  }

  // A generic GET method that handles URL building and Error checking
  private async get<T>(endpoint: string, queryParams: Record<string, string>): Promise<T> {
    
    // URL Construction: Safely handle spaces and special characters
    const params = new URLSearchParams({ 
        key: this.api_key, 
        ...queryParams 
    });

    const url = `${this.weather_api}${endpoint}?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`WeatherAPI Error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }
}

// Export a single instance to be used everywhere
export const weatherClient = new WeatherApiClient();

import { api } from './api';

export interface CitySuggestion {
  id: number;
  name: string;
  label: string;
  lat: number;
  lon: number;
  region: string;
  country: string;
}

// Define types for cache params
type SearchParams = { q: string };
type WeatherParams = { city: string };
type ForecastParams = { city: string; days: number };
type HourlyParams = { city: string; days: number };

type CacheParams = SearchParams | WeatherParams | ForecastParams | HourlyParams;

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string, params: CacheParams): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key as keyof typeof params];
        return acc;
      }, {} as Record<string, string | number>);
    return `${endpoint}:${JSON.stringify(sortedParams)}`;
  }

  get<T>(endpoint: string, params: CacheParams): T | null {
    const key = this.getCacheKey(endpoint, params);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    if (import.meta.env.DEV) {
      console.log(`Cache HIT for ${key}`);
    }
    return entry.data as T;
  }

  set<T>(endpoint: string, params: CacheParams, data: T): void {
    const key = this.getCacheKey(endpoint, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    if (import.meta.env.DEV) {
      console.log(`Cache SET for ${key}`);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
const cache = new CacheManager();

// Cleanup every minute
setInterval(() => {
  cache.cleanup();
}, 60 * 1000);

export const WeatherService = {
  async searchCities(query: string): Promise<CitySuggestion[]> {
    const params: SearchParams = { q: query };
    const cached = cache.get<CitySuggestion[]>('search', params);
    if (cached) {
      return cached;
    }

    const { data } = await api.get<CitySuggestion[]>(`/search?q=${query}`);
    cache.set('search', params, data);
    return data;
  },

  async getCurrentWeather(city: string) {
    const params: WeatherParams = { city };
    const cached = cache.get('weather', params);
    if (cached) {
      return cached;
    }

    const { data } = await api.get(`/weather?city=${city}`);
    cache.set('weather', params, data);
    return data;
  },
  
  async getForecast(city: string, days: number = 1) {
    const params: ForecastParams = { city, days };
    const cached = cache.get('forecast', params);
    if (cached) {
      return cached;
    }

    const { data } = await api.get(`/daily_forecast?city=${city}&days=${days}`);
    
    if (import.meta.env.DEV) {
      console.log("forecast data: ", data);
    }
    
    cache.set('forecast', params, data);
    return data;
  },

  async getHourlyForecast(city: string, days: number = 1) {
    const params: HourlyParams = { city, days };
    const cached = cache.get('hourly', params);
    if (cached) {
      return cached;
    }

    const { data } = await api.get(`/hourly_forecast?city=${city}&days=${days}`);
    
    if (import.meta.env.DEV) {
      console.log("hourly forecast data: ", data);
    }
    
    cache.set('hourly', params, data);
    return data;
  },

  // Utility method to clear cache if needed
  clearCache() {
    cache.clear();
  }
};
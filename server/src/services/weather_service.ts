import axios from 'axios';
import dotenv from 'dotenv';
// We use 'import type' because these are just interfaces, not real values
import type { WeatherAPIResult, WeatherResponse } from '../types/weather';
import cache from '../utils/cache';

dotenv.config();

// FIX 1: Change return type to Promise<WeatherResponse>
export const get_weather_data = async (city: string, no_of_days: number = 1): Promise<WeatherResponse> => {
  const API_KEY = process.env.WEATHER_API_KEY;
  const BASE_URL = process.env.WEATHER_API;

  if (!API_KEY || !BASE_URL) {
    throw new Error("Missing environment variables: WEATHER_API_KEY or WEATHER_API");
  }

  // 1. DEFINE A UNIQUE KEY
  // We lowercase the query so "Pune" and "pune" are treated as the same request
  const weather_data_cache_key = `city_weather_${city.toLowerCase()}_days_${no_of_days}`;

  // 2. CHECK CACHE FIRST
  const weather_cached_data = cache.get<WeatherResponse>(weather_data_cache_key);
  if (weather_cached_data) {
    console.log(`[CACHE HIT] Returning saved results for: ${city}`);
    return weather_cached_data;
  }

  console.log(`[API CALL] Fetching fresh data for: ${city}`);

  try {
    const response = await axios.get<WeatherAPIResult>(BASE_URL, {
      params: { 
        key: API_KEY, 
        q: city,
        days:no_of_days
      }
    });

    // 3. SAVE TO CACHE
    // Store this result for 24 hours (600 seconds) because weather data might not change for 10 minutes
    let final_weather_data = response.data as WeatherResponse;
    cache.set(weather_data_cache_key, final_weather_data, 600);

    // FIX 2: We cast as WeatherResponse because we handled the error logic below
    return response.data as WeatherResponse;

  } catch (error: any) {
    // This logic handles the "400 Bad Request" from the API
    if (error.response && error.response.data) {
        const apiError = error.response.data;

        // Extract the specific message "No matching location found."
        if (apiError.error && apiError.error.message) {
            throw new Error(apiError.error.message);
        }
    }

    // Fallback error
    throw new Error("Failed to fetch weather data. Please try again.");
  }
};



import axios from 'axios';
import { CitySuggestion, GeoDBResponse } from '../types/city_suggestions';
import { log } from 'node:console';
import cache from '../utils/cache';

export const searchCities = async (query: string): Promise<CitySuggestion[]> => {
  const API_KEY = process.env.RAPID_API_KEY;
  const API_HOST = "wft-geo-db.p.rapidapi.com";

  if (!API_KEY) throw new Error("Missing RAPID_API_KEY");

  // Don't search for tiny strings
  if (!query || query.length < 3) return [];
  // 1. DEFINE A UNIQUE KEY
  // We lowercase the query so "Pune" and "pune" are treated as the same request
  const cacheKey = `city_search_${query.toLowerCase()}`;

  // 2. CHECK CACHE FIRST
  const cachedData = cache.get<CitySuggestion[]>(cacheKey);
  if (cachedData) {
    console.log(`[CACHE HIT] Returning saved results for: ${query}`);
    return cachedData;
  }

  console.log(`[API CALL] Fetching fresh data for: ${query}`);
  try {
    const response = await axios.get<GeoDBResponse>("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
      params: {
        namePrefix: query,
        limit: 10,
        sort: "-population", 
        languageCode: "en",
        // 'CITY' filters out huge regions like "Pune Division" so you get the actual city
        types: "CITY" 
      },
    });

    const rawCities = response.data.data;

    // Transform and Filter
    const suggestions: CitySuggestion[] = rawCities
      // Optional: Filter out places with 0 population if you want strict relevance
      .filter((city: any) => city.type === 'CITY' && city.population > 0) 
      .map((city: any) => ({
        id: city.id,
        name: city.name,
        region: city.region,
        country: city.country,
        lat: city.latitude,
        lon: city.longitude,
        // Helper string for the frontend dropdown
        label: `${city.name}, ${city.region}, ${city.country}`
      }));
      // 3. SAVE TO CACHE
    // Store this result for 24 hours (86400 seconds) because city names don't change often
    cache.set(cacheKey, suggestions, 86400);

    return suggestions;

  } catch (error: any) {
    console.error("GeoDB Service Error:", error.message);
    // Return empty array instead of crashing so the UI just shows "No results"
    return []; 
  }
};
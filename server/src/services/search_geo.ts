
// import axios from "axios";

// export const searchCities = async (query: string) => {
//   if (!query) return [];

//   const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
//     headers: {
//       "X-RapidAPI-Key": process.env.RAPID_API_KEY!,
//       "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
//     },
//     params: {
//       namePrefix: query,
//       limit: 10,
//       sort: "-population"
//     },
//   });

//   return response.data.data.map((c: any) => ({
//     city: c.city,
//     country: c.country,
//   }));
// };

import axios from 'axios';
import { CitySuggestion, GeoDBResponse } from '../types/city_suggestions';
import { log } from 'node:console';

export const searchCities = async (query: string): Promise<CitySuggestion[]> => {
  const API_KEY = process.env.RAPID_API_KEY;
  const API_HOST = "wft-geo-db.p.rapidapi.com";

  if (!API_KEY) throw new Error("Missing RAPID_API_KEY");

  // Don't search for tiny strings
  if (!query || query.length < 3) return [];
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

    return suggestions;

  } catch (error: any) {
    console.error("GeoDB Service Error:", error.message);
    // Return empty array instead of crashing so the UI just shows "No results"
    return []; 
  }
};
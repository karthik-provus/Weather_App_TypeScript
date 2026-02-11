// import axios from 'axios';
// import { WeatherAPIError, WeatherAPIResult, WeatherResponse } from '../types/weather'; // Assuming you have this type

// export const get_weather_data = async (city: string) => {
//   const API_KEY = process.env.WEATHER_API_KEY;
//   const BASE_URL = process.env.WEATHER_API;

//   if (!API_KEY || !BASE_URL) {
//     throw new Error("Missing environment variables: WEATHER_API_KEY or WEATHER_API");
//   }
//   try {
//     const response = await axios.get<WeatherAPIResult>(BASE_URL, {
//       params: { key: API_KEY, q: city }
//     });

//     return response.data;

//   } catch (error: any) { // 'any' stop TS complaints

//     if (error.response && error.response.data) {
//         const apiError = error.response.data;

//         if (apiError.error && apiError.error.message) {
//             throw new Error(apiError.error.message);
//         }
//     }
//     // // server down or network down
//     throw new Error("Failed to fetch weather data. Please try again.");
//   }
// };

import axios from 'axios';
import dotenv from 'dotenv';
// We use 'import type' because these are just interfaces, not real values
import type { WeatherAPIResult, WeatherResponse } from '../types/weather';

dotenv.config();

// FIX 1: Change return type to Promise<WeatherResponse>
export const get_weather_data = async (city: string): Promise<WeatherResponse> => {
  const API_KEY = process.env.WEATHER_API_KEY;
  const BASE_URL = process.env.WEATHER_API;

  if (!API_KEY || !BASE_URL) {
    throw new Error("Missing environment variables: WEATHER_API_KEY or WEATHER_API");
  }

  try {
    const response = await axios.get<WeatherAPIResult>(BASE_URL, {
      params: { 
        key: API_KEY, 
        q: city 
      }
    });

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
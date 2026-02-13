// import axios from "axios";
// import { WeatherResponse } from "@/types/weather";

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

// // UPDATED: Using a model explicitly found in your list
// const MODEL_NAME = "gemini-2.0-flash"; 

// export const AIService = {
//   generateWeatherSummary: async (weather: WeatherResponse): Promise<string> => {
//     if (!API_KEY) {
//       console.error("❌ ERROR: API Key is missing.");
//       return "Error: Missing API Key.";
//     }

//     // Construct URL
//     // We use the 'models/' prefix here because the endpoint expects: 
//     // .../v1beta/models/{model}:generateContent
//     const url = `${BASE_URL}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
//     console.log("Requesting AI Summary from:", MODEL_NAME); 

//     const prompt = `
//       You are a witty weather reporter. 
//       Current weather in ${weather.location.name}:
//       - Condition: ${weather.current.condition.text}
//       - Temperature: ${weather.current.temp_c}°C
//       - Humidity: ${weather.current.humidity}%
//       - Wind: ${weather.current.wind_kph} km/h
//       - Time: ${weather.current.is_day ? "Day" : "Night"}
      
//       Write a very short (max 2 sentences), fun, helpful summary. 
//       Example: "It's scorching outside, stay hydrated."
//     `;

//     try {
//       const response = await axios.post(
//         url,
//         { contents: [{ parts: [{ text: prompt }] }] },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (response.data.candidates && response.data.candidates.length > 0) {
//         return response.data.candidates[0].content.parts[0].text;
//       } else {
//         return "AI returned no response. Try again.";
//       }
      
//     } catch (error: any) {
//       console.error("❌ Gemini API Error:", error.response?.data || error.message);
      
//       // Fallback: If 2.0 fails, try the generic 'gemini-pro' which is universally available
//       if (error.response?.status === 404) {
//          console.warn("Retrying with fallback model 'gemini-pro'...");
//          return await AIService.generateWeatherSummaryFallback(weather);
//       }
      
//       return "The AI is currently freezing... (Network Error)";
//     }
//   },

//   // Fallback function just in case
//   generateWeatherSummaryFallback: async (weather: WeatherResponse): Promise<string> => {
//       const fallbackUrl = `${BASE_URL}/models/gemini-pro:generateContent?key=${API_KEY}`;
//       const prompt = `Weather in ${weather.location.name}: ${weather.current.condition.text}, ${weather.current.temp_c}C. Short fun summary.`;
      
//       try {
//         const response = await axios.post(fallbackUrl, { contents: [{ parts: [{ text: prompt }] }] });
//         return response.data.candidates[0].content.parts[0].text;
//       } catch (e) {
//         return "AI is unavailable right now.";
//       }
//   }
// };


import axios from "axios";
import { WeatherResponse } from "@/types/weather";

export const AIService = {
  generateWeatherSummary: async (
    weather: WeatherResponse
  ): Promise<string> => {
    const response = await axios.post(
      "http://localhost:8000/api/ai-summary",
      weather
    );

    return response.data.summary;
  }
};

// src/lib/weatherFormatter.ts
import { WeatherResponse, WeatherUnit, WeatherSummary } from "@/types/weather";

export function formatWeatherSummary(data: WeatherResponse, unit: WeatherUnit = WeatherUnit.C): WeatherSummary {
  const current = data.current;
  const isMetric = unit === WeatherUnit.C;

  return {
    city: data.location.name,
    condition: current.condition.text,
    
    temp: {
      current: Math.round(isMetric ? current.temp_c : current.temp_f),
      feelsLike: Math.round(isMetric ? current.feelslike_c : current.feelslike_f),
    },
    
    wind: {
      speed: isMetric ? current.wind_kph : current.wind_mph,
      dir: current.wind_dir,
    },
    
    atmosphere: {
      humidity: current.humidity,
      uv: current.uv,
      visibility: isMetric ? current.vis_km : current.vis_miles,
    },
    
    isDay: Boolean(current.is_day),
    timestamp: new Date().toISOString(),
  };
}

// Optional: A helper to turn that summary into a human-readable string (Great for AI Prompts)
export function summaryToString(summary: WeatherSummary): string {
    return `The weather in ${summary.city} is ${summary.condition} at ${summary.temp.current}°. ` +
           `Wind is ${summary.wind.speed}kph, Humidity is ${summary.atmosphere.humidity}%.`;
}
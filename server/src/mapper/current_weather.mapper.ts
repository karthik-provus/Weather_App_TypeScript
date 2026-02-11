import { CurrentWeatherResponse, WeatherAPIResult, WeatherResponse } from "../types/weather";


export const map_current_weather = (data: WeatherResponse): CurrentWeatherResponse => ({
  city: data.location.name,
  country: data.location.country,
  localtime: data.location.localtime!,
  temp_c: data.current.temp_c,
  temp_f: data.current.temp_f,
  condition: data.current.condition.text,
  icon: data.current.condition.icon,
  humidity: data.current.humidity,
  wind_kph: data.current.wind_kph,
  wind_mph: data.current.wind_mph,
  feelslike_c: data.current.feelslike_c,
  feelslike_f: data.current.feelslike_f,
  uv: data.current.uv,
});

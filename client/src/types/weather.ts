// 1. Common Shared Types
export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

// 2. Location Data
export interface LocationData {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

// 3. Current Weather Data
export interface CurrentData {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

// 4. Forecast Data (We'll add this now to be future-proof)
export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    avghumidity: number;
    condition: WeatherCondition;
    maxwind_kph: number;
    daily_chance_of_rain: number;
  };
  hour: HourData[];
}

export interface HourData {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  wind_kph: number;
  humidity: number;
  feelslike_c: number;
  chance_of_rain: number;
}

// 5. The Main Response Interface
export interface WeatherResponse {
  location: LocationData;
  current: CurrentData;
  forecast?: {
    forecastday: ForecastDay[];
  };
}
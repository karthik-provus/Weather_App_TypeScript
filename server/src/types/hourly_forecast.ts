export interface HourlyForecastResponse {
  date: string;          // 2026-02-05
  time: string;          // 2026-02-05 14:00
  time_epoch: number;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  wind_mph: number;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
  chance_of_rain: number;
  chance_of_snow: number;
  uv: number;
}

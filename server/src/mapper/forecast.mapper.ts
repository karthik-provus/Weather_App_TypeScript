import { DailyForecastResponse } from "../types/forecast";
import { WeatherResponse } from "../types/weather";
import { Forecast } from "../types/weather";


export const mapDailyForecast = (
  data: WeatherResponse
): DailyForecastResponse[] => {
  return data.forecast.forecastday.map((day) => ({
    date: day.date,
    date_epoch: day.date_epoch,
    day: day.day,
    astro: day.astro,
  }));
};
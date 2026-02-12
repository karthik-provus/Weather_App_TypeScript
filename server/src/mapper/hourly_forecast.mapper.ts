import { HourlyForecastResponse } from "../types/hourly_forecast";
import { WeatherResponse } from "../types/weather";

export const mapHourlyForecast = (
  data: WeatherResponse
): HourlyForecastResponse[] => {

  return data.forecast.forecastday.flatMap((day) =>
    day.hour.map((hour) => ({
      date: day.date,
      time: hour.time,
      time_epoch: hour.time_epoch,
      temp_c: hour.temp_c,
      temp_f: hour.temp_f,
      condition: hour.condition,
      wind_kph: hour.wind_kph,
      wind_mph: hour.wind_mph,
      humidity: hour.humidity,
      feelslike_c: hour.feelslike_c,
      feelslike_f: hour.feelslike_f,
      chance_of_rain: hour.chance_of_rain,
      chance_of_snow: hour.chance_of_snow,
      uv: hour.uv,
    }))
  );
};

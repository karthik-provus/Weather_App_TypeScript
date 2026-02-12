import { Request, Response } from "express";
import { get_weather_data } from "../services/weather_service";
import { DailyForecastResponse } from "../types/forecast";
import { mapDailyForecast } from "../mapper/forecast.mapper";
import { HourlyForecastResponse } from "../types/hourly_forecast";
import { mapHourlyForecast } from "../mapper/hourly_forecast.mapper";

export const get_daily_forecast = async (
  req: Request,
  res: Response
) => {
  const city = req.query.city as string;
  const no_of_days: number = parseInt(req.query.days as string) | 1;
  if(no_of_days>14 || no_of_days<1){
    return res.status(400).json({message: "Forecast only upto 14 days possible."})
  }

  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  try {
    const weatherData = await get_weather_data(city, no_of_days);

    const forecast: DailyForecastResponse[] =
      mapDailyForecast(weatherData);

    res.status(200).json(forecast);

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error (daily forecast)";
    res.status(500).json({ message });
  }
};



export const get_hourly_forecast = async (
  req: Request,
  res: Response
) => {
  const city = req.query.city as string;
  const parsedDays = parseInt(req.query.days as string);

  const no_of_days = isNaN(parsedDays) ? 1 : parsedDays;

  if(no_of_days>14 || no_of_days<1){
    return res.status(400).json({message: "Forecast only upto 14 days possible."})
  }
  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  try {
    const weatherData = await get_weather_data(city, no_of_days);

    const hourly: HourlyForecastResponse[] =
      mapHourlyForecast(weatherData);

    res.status(200).json(hourly);

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error (hourly forecast)";
    res.status(500).json({ message });
  }
};


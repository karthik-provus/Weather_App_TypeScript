import { Request, Response } from 'express';
import { get_weather_data } from '../services/weather_service';
import { CurrentWeatherResponse } from '../types/weather';
import { map_current_weather } from '../mapper/current_weather.mapper';

export const get_weather = async (req: Request, res: Response) => {
  // query would look something like this: /weather?city=London
  const city = req.query.city as string;

  if (!city) {
    res.status(400).json({ message: 'City parameter is required' });
    return; 
  }

  try {
    const weatherData = await get_weather_data(city);
    res.status(200).json(weatherData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({ message });
  }
};


export const get_current_weather = async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    res.status(400).json({ message: "City parameter is required" });
    return;
  }

  try {
    const data = await get_weather_data(city);

    const current_weather_data: CurrentWeatherResponse = map_current_weather(data)

    res.status(200).json(current_weather_data);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error (current weather)";
    res.status(500).json({ message });
  }
};



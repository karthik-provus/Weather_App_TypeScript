import { Request, Response } from 'express';
import { get_weather_data } from '../services/weather_service';

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


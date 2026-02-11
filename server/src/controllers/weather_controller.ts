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


export const get_current_weather = async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    res.status(400).json({ message: "City parameter is required" });
    return;
  }

  try {
    const data = await get_weather_data(city);

    const current = {
      city: data.location.name,
      country: data.location.country,
      localtime: data.location.localtime,
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
    };

    res.status(200).json(current);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error (current weather)";
    res.status(500).json({ message });
  }
};



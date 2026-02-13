import axios from "axios";
import { Request, Response } from "express";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";

export const generateSummary = async (req: Request, res: Response) => {
  const weather = req.body;

  const prompt = `
    You are a witty weather reporter.
    Current weather in ${weather.location.name}:
    - Condition: ${weather.current.condition.text}
    - Temperature: ${weather.current.temp_c}°C
    - Humidity: ${weather.current.humidity}%
    - Wind: ${weather.current.wind_kph} km/h
    - Time: ${weather.current.is_day ? "Day" : "Night"}

    Write a very short (max 2 sentences), fun summary.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=AIzaSyBPBBzs1vQ8ub-540gBYCLZzcUDrQTLkEM`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;


    res.json({ summary: text || "AI returned nothing." });

  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ summary: "AI unavailable." });
  }
};

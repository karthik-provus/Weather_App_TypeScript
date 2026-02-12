
import { Request, Response } from 'express';
import { searchCities } from '../services/search_geo';

export const getCitySuggestions = async (req: Request, res: Response) => {
//   console.log("RAW QUERY:", req.query);
//   console.log("TYPE:", typeof req.query.q);
//   console.log("VALUE:", req.query.q);
  const query = req.query.q as string;

  if (!query) {
    res.status(400).json({ message: "Query is required" });
    return;
  }

  try {
    const suggestions = await searchCities(query);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cities" });
  }
};
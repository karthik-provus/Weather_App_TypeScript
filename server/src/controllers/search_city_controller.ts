
// export const searchCities = async (req: Request, res: Response) => {
//   try {
//     // 1. Extract the query from the URL (e.g., /api/search?q=London)
//     const query = req.query.q as string;

//     // 2. Validation: Don't call the API if the user sent an empty string
//     if (!query || query.trim().length === 0) {
//        res.status(400).json({ message: "Search query 'q' is required" });
//        return;
//     }

//     const locations = await weatherClient.search(query);

//     res.status(200).json(locations);

//   } catch (error: any) {
//     console.error("Search Error:", error.message);
//     res.status(500).json({ message: "Failed to search locations" });
//   }
// };

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
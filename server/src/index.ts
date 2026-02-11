import express from 'express'; 
import type { Express, Request, Response } from 'express'; // Explicitly load these as types only
import dotenv from 'dotenv';
import cors from 'cors';

import weather_routes from './routes/weather_routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(cors());              
app.use(express.json());  // Parse incoming JSON requests

// Health checking
app.get('/', (req: Request, res: Response) => {
  res.send('Weather App Backend is running!');
});

app.use('/api', weather_routes);


app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
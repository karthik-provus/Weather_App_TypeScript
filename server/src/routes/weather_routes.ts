
import { Router } from 'express';
import { get_weather } from '../controllers/weather_controller';

const router = Router();

// Define the route: GET /weather
router.get('/weather', get_weather);

export default router;
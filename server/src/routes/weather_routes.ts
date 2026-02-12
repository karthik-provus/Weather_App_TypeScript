
import { Router } from 'express';
import { get_current_weather, get_weather } from '../controllers/weather_controller';
import { getCitySuggestions } from '../controllers/search_city_controller';
import { get_daily_forecast, get_hourly_forecast } from '../controllers/forecast_controller';

const router = Router();

// Define the route: GET /weather
router.get('/weather', get_weather);
router.get('/current_weather', get_current_weather);
router.get('/search', getCitySuggestions);
router.get('/daily_forecast', get_daily_forecast)
router.get('/hourly_forecast', get_hourly_forecast)

export default router;
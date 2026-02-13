
import { useEffect, useState, useCallback, useMemo } from 'react';
import { CloudSun, AlertCircle, GitCompare } from 'lucide-react';

// Components
import { WeatherService, CitySuggestion } from '@/services/weatherService';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { SearchBar } from '@/components/weather/SearchBar';
import { Forecast } from './components/weather/Forecast';
import { HourlyTemperature } from '@/components/weather/HourlyTemperature';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from './components/ui/button';
import { ForecastDay, HourData, WeatherResponse, WeatherUnit } from './types/weather';
import { WeatherMap } from '@/components/weather/WeatherMap';
import { LiveAlerts } from '@/components/weather/LiveAlerts';
import { getBackgroundGradient } from '@/lib/weatherThemes';
import { RecentSearches } from './components/weather/RecentSearches';
import { WeatherActivities } from './components/weather/WeatherActivities';
import { DailyBriefing } from './components/weather/DailyBriefing';
import { ComparisonView } from './components/weather/ComparisonView';

// Combined state interface for better performance
interface WeatherData {
  weather: WeatherResponse | null;
  forecast: ForecastDay[];
  hourlyForecast: HourData[];
}

function App() {
  // Combine related state to reduce re-renders
  const [weatherData, setWeatherData] = useState<WeatherData>({
    weather: null,
    forecast: [],
    hourlyForecast: []
  });
  
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [unit, setUnit] = useState<WeatherUnit>(WeatherUnit.C);
  const [days, setDays] = useState<number>(3);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<CitySuggestion[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonData, setComparisonData] = useState<WeatherData>({
    weather: null,
    forecast: [],
    hourlyForecast: []
  });

  // Load search history from localStorage once on mount
  useEffect(() => {
    const saved = localStorage.getItem("weather-history");
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse search history", e);
      }
    }
  }, []);

  // Memoize the addToHistory function
  const addToHistory = useCallback((city: CitySuggestion) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id);
      const newHistory = [city, ...filtered].slice(0, 5);
      localStorage.setItem("weather-history", JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Memoize the removeFromHistory function
  const removeFromHistory = useCallback((cityId: number) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter(item => item.id !== cityId);
      localStorage.setItem("weather-history", JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Memoize the main fetch function
  const fetchWeatherData = useCallback(async (query: string, daysCount: number) => {
    if (!weatherData.weather) {
      setLoading(true);
    }
    setLocationError(null);
    setCurrentQuery(query);
    
    try {
      // Parallel API calls for better performance
      const [currentData, forecastData, hourlyData] = await Promise.all([
        WeatherService.getCurrentWeather(query),
        WeatherService.getForecast(query, daysCount),
        WeatherService.getHourlyForecast(query, 1)
      ]);

      // Single state update instead of 3 separate updates
      setWeatherData({
        weather: currentData,
        forecast: forecastData,
        hourlyForecast: hourlyData
      });

    } catch (error) {
      console.error("Failed to fetch weather", error);
      setLocationError("Could not fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [weatherData.weather]);

  // Memoize location handler
  const handleLocationClick = useCallback(() => {
    if (!navigator.geolocation) {
      const query = `Jaipur`;
      fetchWeatherData(query, days);
      setLocationError("Geolocation is not supported by your browser.");
      
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const query = `${latitude},${longitude}`;
        fetchWeatherData(query, days);
      },
      (error) => {
        setLoading(false);
        setLocationError("Location access denied. Please enable permissions.");
        console.error(error);
      }
    );
  }, [days, fetchWeatherData]);

  // Memoize city select handler
  const handleCitySelect = useCallback((city: CitySuggestion) => {
    addToHistory(city);
    const query = city.lat && city.lon ? `${city.lat},${city.lon}` : city.name;
    fetchWeatherData(query, days);
  }, [days, fetchWeatherData, addToHistory]);

  // Auto-load on startup - with proper dependency
  useEffect(() => {
    handleLocationClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Memoize days change handler
  const handleDaysChange = useCallback((newDays: number) => {
    setDays(newDays);
    if (currentQuery) {
      fetchWeatherData(currentQuery, newDays);
    }
  }, [currentQuery, fetchWeatherData]);

  // Handle comparison city selection
  const handleComparisonCitySelect = useCallback(async (city: CitySuggestion) => {
    setLoading(true);
    try {
      const query = city.lat && city.lon ? `${city.lat},${city.lon}` : city.name;
      
      const [currentData, forecastData, hourlyData] = await Promise.all([
        WeatherService.getCurrentWeather(query),
        WeatherService.getForecast(query, days),
        WeatherService.getHourlyForecast(query, 1)
      ]);

      setComparisonData({
        weather: currentData,
        forecast: forecastData,
        hourlyForecast: hourlyData
      });
      
    } catch (error) {
      console.error("Failed to fetch comparison weather", error);
      setLocationError("Could not fetch comparison weather data.");
    } finally {
      setLoading(false);
    }
  }, [days]);

  // Toggle comparison mode
  const toggleComparisonMode = useCallback(() => {
    setComparisonMode(prev => !prev);
    if (comparisonMode) {
      // Clear comparison data when turning off
      setComparisonData({
        weather: null,
        forecast: [],
        hourlyForecast: []
      });
    }
  }, [comparisonMode]);

  // Memoize expensive gradient calculation
  const bgGradient = useMemo(() => {
    return weatherData.weather
      ? getBackgroundGradient(
          weatherData.weather.current.condition.code, 
          weatherData.weather.current.is_day
        )
      : 'from-sky-50 via-white to-slate-100';
  }, [weatherData.weather?.current.condition.code, weatherData.weather?.current.is_day]);

  // Memoize dark mode calculation
  const isDarkMode = useMemo(() => {
    return weatherData.weather && (
      weatherData.weather.current.is_day === 0 ||
      [1087, 1273, 1276].includes(weatherData.weather.current.condition.code)
    );
  }, [weatherData.weather?.current.is_day, weatherData.weather?.current.condition.code]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000`}>
      <div className={`max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>

        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-50">
          <div className="flex items-center gap-4">

            {/* Weather icon */}
            <div className={`p-3 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-500
              ${isDarkMode
                ? 'bg-white/10 border-white/20 text-blue-300'
                : 'bg-white/80 border-slate-100 text-blue-500'
              }`}
            >
              <CloudSun className="w-10 h-10" />
            </div>

              {/* heading */}
            <div>
              <h1 className={`text-4xl font-extrabold tracking-tight transition-colors duration-1000
                ${isDarkMode ? 'text-white drop-shadow-md' : 'text-slate-800'}
              `}>
                Weather Forecast
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Comparison Mode Toggle */}
            {weatherData.weather && (
              <Button
                onClick={toggleComparisonMode}
                className={`flex items-center gap-2 backdrop-blur-md transition-all duration-500 shadow-sm
                  ${comparisonMode 
                    ? (isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700')
                    : (isDarkMode ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white')
                  }`}
              >
                <GitCompare className="w-4 h-4" />
                {comparisonMode ? 'Exit Compare' : 'Compare Cities'}
              </Button>
            )}
            
            {/* Temperature Unit Toggle */}
            <div className={`flex items-center gap-2 p-1 rounded-lg border shadow-sm backdrop-blur-md transition-all duration-500
              ${isDarkMode
                ? 'bg-white/10 border-white/20'
                : 'bg-white/80 border-slate-200'
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUnit(WeatherUnit.C)}
                className={`rounded-md font-bold transition-all ${unit === WeatherUnit.C
                  ? (isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white')
                  : (isDarkMode ? 'text-blue-100 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                  }`}
              >
                °C
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUnit(WeatherUnit.F)}
                className={`rounded-md font-bold transition-all ${unit === WeatherUnit.F
                  ? (isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white')
                  : (isDarkMode ? 'text-blue-100 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                  }`}
              >
                °F
              </Button>
            </div>
          </div>
        </header>

        <div className="w-full max-w-lg mx-auto mb-10 relative z-50">
          <SearchBar
            onCitySelect={handleCitySelect}
            onLocationClick={handleLocationClick}
          />
          <RecentSearches
            history={searchHistory}
            onSelect={handleCitySelect}
            onClear={removeFromHistory}
            isDay={weatherData.weather ? Boolean(weatherData.weather.current.is_day) : true}
          />
        </div>

        <div className="space-y-6 flex-1">
          {locationError && (
            <Alert variant="destructive" className="max-w-md mx-auto animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {loading && <WeatherSkeleton />}

          {!loading && weatherData.weather && (
            <>
              {comparisonMode ? (
                <ComparisonView
                  city1Data={weatherData}
                  city2Data={comparisonData}
                  unit={unit}
                  onCitySelect={handleComparisonCitySelect}
                  isDarkMode={isDarkMode? true: false}
                />
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">

                  {/* Live-Alerts */}
              <LiveAlerts weather={weatherData.weather} forecast={weatherData.forecast} />

                {/* Main Weather Data */}
              <CurrentWeather data={weatherData.weather} unit={unit} />

                {/* Weather Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {weatherData.hourlyForecast && (
                    <HourlyTemperature
                      data={weatherData.hourlyForecast}
                      unit={unit}
                      isDay={Boolean(weatherData.weather.current.is_day)}
                      key={weatherData.weather.location.name}
                    />
                  )}
                </div>

                  {/* Map - rechart*/}
                <div className="lg:col-span-1 h-full min-h-[400px]">
                  <WeatherMap
                    lat={weatherData.weather.location.lat}
                    lon={weatherData.weather.location.lon}
                    name={weatherData.weather.location.name}
                    onLocationSelect={(lat, lon) => {
                      const query = `${lat},${lon}`;
                      fetchWeatherData(query, days);
                    }}
                  />
                </div>
              </div>
              
              {/* N-day forecast */}
              <div className="pt-4">
                <Forecast 
                  forecastData={weatherData.forecast} 
                  unit={unit} 
                  days={days} 
                  onDaysChange={handleDaysChange} 
                />
              </div>

              {/* LifeStyle */}
              <div className="mt-6">
                <WeatherActivities 
                  weather={weatherData.weather} 
                  isDay={Boolean(weatherData.weather.current.is_day)} 
                />
              </div>
              
              {/* Summary */}
              <div className="mt-8 pb-8">
                {weatherData.weather && weatherData.forecast.length > 0 && (
                  <DailyBriefing
                    weather={weatherData.weather}
                    forecast={weatherData.forecast}
                    unit={unit}
                    isDay={Boolean(weatherData.weather.current.is_day)} 
                  />
                )}
              </div>
            </div>
              )}
            </>
          )}

          {!loading && !weatherData.weather && !locationError && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <CloudSun className="w-12 h-12 mb-4 opacity-20" />
              <p>Search for a city or use your location to start.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[200px] w-full rounded-xl col-span-2" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-[150px] w-full rounded-xl" />
        <Skeleton className="h-[150px] w-full rounded-xl" />
        <Skeleton className="h-[150px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export default App;

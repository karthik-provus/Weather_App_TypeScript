
import { useEffect, useState } from 'react';
import { CloudSun, AlertCircle } from 'lucide-react';

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
import { formatWeatherSummary, summaryToString } from "@/lib/weatherFormatter";
import { DailyBriefing } from './components/weather/DailyBriefing';

function App() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourData[]>([]);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [unit, setUnit] = useState<WeatherUnit>(WeatherUnit.C);
  const [days, setDays] = useState<number>(3); // Default to 3 days
  const [currentQuery, setCurrentQuery] = useState<string>(""); // Keep track of active city
  const [searchHistory, setSearchHistory] = useState<CitySuggestion[]>([]);
  // const [isComparing, setIsComparing] = useState(false);

  // Recently Searched items
  useEffect(() => {
    const saved = localStorage.getItem("weather-history");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);
  const addToHistory = (city: CitySuggestion) => {
    setSearchHistory((prev) => {
      // Remove duplicates (if city already exists, remove old one)
      const filtered = prev.filter((item) => item.id !== city.id);
      // Add new city to the front
      const newHistory = [city, ...filtered].slice(0, 5); // Keep max 5
      // Save to LocalStorage
      localStorage.setItem("weather-history", JSON.stringify(newHistory));
      return newHistory;
    });
  };
  const removeFromHistory = (cityId: number) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter(item => item.id !== cityId);
      localStorage.setItem("weather-history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // 1. Centralized Data Fetcher
  const fetchWeatherData = async (query: string, daysCount: number) => {
    if (!weather) {
      setLoading(true);
    }
    // setLoading(true);
    setLocationError(null);
    setCurrentQuery(query);
    try {
      // If coordinates, we format query differently or just pass as is
      // (Your service seems to handle "lat,lon" strings well)
      const [currentData, forecastData, hourlyData] = await Promise.all([
        WeatherService.getCurrentWeather(query),
        WeatherService.getForecast(query, daysCount),
        WeatherService.getHourlyForecast(query, 1) // Assuming this gets 24h data
      ]);

      setWeather(currentData);
      setForecast(forecastData);
      setHourlyForecast(hourlyData);

      const cleanSummary = formatWeatherSummary(currentData, unit);
      console.log("Clean Summary Object:", cleanSummary);
      console.log("Human String:", summaryToString(cleanSummary));

    } catch (error) {
      console.error("Failed to fetch weather", error);
      setLocationError("Could not fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
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
        console.log(error)
      }
    );
  };

  const handleCitySelect = (city: CitySuggestion) => {
    addToHistory(city);
    // Prefer coordinates for accuracy if available, else name
    const query = city.lat && city.lon ? `${city.lat},${city.lon}` : city.name;
    fetchWeatherData(query, days);
  };

  // Auto-load on startup
  useEffect(() => {
    handleLocationClick();
  }, []);

  // Handle Slider Change
  const handleDaysChange = (newDays: number) => {
    setDays(newDays);
    if (currentQuery) {
      // Re-fetch using the SAME city but NEW days
      fetchWeatherData(currentQuery, newDays);
    }
  };

  // 2. Calculate the dynamic class
  // Default to a pleasant "waiting" gradient if data isn't loaded yet
  const bgGradient = weather
    ? getBackgroundGradient(weather.current.condition.code, weather.current.is_day)
    : 'from-sky-50 via-white to-slate-100';

  // 3. Determine if we need light text (for dark backgrounds)
  // Simple logic: If it's night OR raining/thundering, we likely have a dark background.
  const isDarkMode = weather && (
    weather.current.is_day === 0 ||
    [1087, 1273, 1276].includes(weather.current.condition.code) // Thunder codes
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000`}>
      <div className={`max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>



        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-50">
          <div className="flex items-center gap-4">
            {/* Logo Icon with Glassmorphism */}
            <div className={`p-3 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-500
      ${isDarkMode
                ? 'bg-white/10 border-white/20 text-blue-300'
                : 'bg-white/80 border-slate-100 text-blue-500'
              }`}
            >
              <CloudSun className="w-10 h-10" />
            </div>

            <div>
              <h1 className={`text-4xl font-extrabold tracking-tight transition-colors duration-1000
        ${isDarkMode ? 'text-white drop-shadow-md' : 'text-slate-800'}
      `}>
                Weather Forecast
              </h1>
              <p className={`text-sm font-medium transition-colors duration-1000
        ${isDarkMode ? 'text-blue-200' : 'text-slate-500'}
      `}>
              </p>
            </div>
          </div>

          {/* Unit Switcher (Now also adapts to theme) */}
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
            {/* <Button
              variant="outline"
              onClick={() => setIsComparing(true)}
              className="bg-white/20 backdrop-blur-md border-white/20 text-gray hover:bg-white/30"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2 text-gray-500" />
              Compare
            </Button> */}
          </div>
        </header>

        {/* --- Search Section --- */}
        <div className="w-full max-w-lg mx-auto mb-10 relative z-50">
          <SearchBar
            onCitySelect={handleCitySelect}
            onLocationClick={handleLocationClick}
          />
          <RecentSearches
            history={searchHistory}
            onSelect={handleCitySelect}
            onClear={removeFromHistory}
            isDay={weather ? Boolean(weather.current.is_day) : true}
          />
        </div>

        {/* --- Main Content --- */}
        <div className="space-y-6 flex-1">

          {/* Error State */}
          {locationError && (
            <Alert variant="destructive" className="max-w-md mx-auto animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {/* Loading State (Skeleton UI) */}
          {loading && <WeatherSkeleton />}

          {/* MAIN CONTENT */}
          {!loading && weather && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">

              <LiveAlerts weather={weather} forecast={forecast} />

              {/* Top Row: Current Weather */}
              <CurrentWeather data={weather} unit={unit} />

              {/* 2. Charts & Map Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart takes up 2/3 of the space */}
                <div className="lg:col-span-2">
                  {hourlyForecast && (
                    <HourlyTemperature
                      data={hourlyForecast}
                      unit={unit}
                      isDay={Boolean(weather.current.is_day)}
                      key={weather.location.name}
                    />
                  )}
                </div>

                {/* Map takes up 1/3 of the space */}
                <div className="lg:col-span-1 h-full min-h-[400px]">
                  <WeatherMap
                    lat={weather.location.lat}
                    lon={weather.location.lon}
                    name={weather.location.name}
                    // The Magic Handler:
                    onLocationSelect={(lat, lon) => {
                      const query = `${lat},${lon}`;
                      fetchWeatherData(query, days); // Re-fetch for clicked location
                    }}
                  />
                </div>
              </div>

              {/* Bottom Row: 3-Day Forecast */}
              <div className="pt-4">
                <Forecast forecastData={forecast} unit={unit} days={days} onDaysChange={handleDaysChange} />
              </div>

              <div className="mt-6">
                <WeatherActivities weather={weather} isDay={Boolean(weather.current.is_day)} />
              </div>

              {/* <WeatherAISummary weather={weather} isDay={Boolean(weather.current.is_day)}/> */}
              {/* {isComparing && weather && hourlyForecast && (
                <ComparisonView
                  weatherA={weather}
                  hourlyA={hourlyForecast}
                  unit={unit}
                  onClose={() => setIsComparing(false)}
                /> */}
              {/* )} */}

              <div className="mt-8 pb-8">
                {weather && forecast.length > 0 && (
                  <DailyBriefing
                    weather={weather}
                    forecast={forecast}
                    unit={unit}
                    isDay={Boolean(weather.current.is_day)} 
                  />
                )}
              </div>


            </div>
          )}

          {/* Empty State */}
          {!loading && !weather && !locationError && (
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

// --- Sub-component: Skeleton Loader ---
// Keeps the layout stable while data loads
function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      {/* Current Weather Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[200px] w-full rounded-xl col-span-2" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>

      {/* Chart Skeleton */}
      <Skeleton className="h-[300px] w-full rounded-xl" />

      {/* Forecast Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-[150px] w-full rounded-xl" />
        <Skeleton className="h-[150px] w-full rounded-xl" />
        <Skeleton className="h-[150px] w-full rounded-xl" />
      </div>

    </div>
  );
}

export default App;

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
import { ForecastDay, HourData, WeatherResponse } from './types/weather';

function App() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourData[]>([]);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [days, setDays] = useState<number>(3); // Default to 3 days
  const [currentQuery, setCurrentQuery] = useState<string>(""); // Keep track of active city

  // 1. Centralized Data Fetcher
  const fetchWeatherData = async (query: string, daysCount: number) => {
    setLoading(true);
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
    // Prefer coordinates for accuracy if available, else name
    const query = city.lat && city.lon ? `${city.lat},${city.lon}` : city.name;
    fetchWeatherData(query, days);
  };

  // Auto-load on startup
  useEffect(() => {
    handleLocationClick();
    console.log(unit)
  }, []);

  // Handle Slider Change
  const handleDaysChange = (newDays: number) => {
    setDays(newDays);
    if (currentQuery) {
      // Re-fetch using the SAME city but NEW days
      fetchWeatherData(currentQuery, newDays);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-gray-100 text-slate-900 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
        
        {/* --- Header Section --- */}
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100">
              <CloudSun className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              SkyCast
            </h1>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
             <Button 
               variant={unit === 'C' ? 'default' : 'ghost'} 
               size="sm"
               onClick={() => setUnit('C')}
               className={`rounded-md font-bold transition-all ${unit === 'C' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}
             >
               °C
             </Button>
             <Button 
               variant={unit === 'F' ? 'default' : 'ghost'} 
               size="sm"
               onClick={() => setUnit('F')}
               className={`rounded-md font-bold transition-all ${unit === 'F' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}
             >
               °F
             </Button>
          </div>
        </header>

        {/* --- Search Section --- */}
        <div className="w-full max-w-lg mx-auto mb-10 relative z-50">
           <SearchBar 
              onCitySelect={handleCitySelect} 
              onLocationClick={handleLocationClick}
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

          {/* Data State */}
          {!loading && weather && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
              
              {/* Top Row: Current Weather */}
              <CurrentWeather data={weather} unit={unit} />
              
              {/* Middle Row: Hourly Chart */}
              {hourlyForecast && (
                <div className="grid gap-6">
                  <HourlyTemperature data={hourlyForecast} unit={unit} />
                </div>
              )}

              {/* Bottom Row: 3-Day Forecast */}
              <div className="pt-4">
                <Forecast forecastData={forecast} unit={unit} days={days} onDaysChange={handleDaysChange}/>
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

        {/* --- Footer --- */}
        <footer className="mt-20 text-center text-slate-400 text-sm py-4">
          <p>Powered by WeatherAPI & GeoDB</p>
        </footer>

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
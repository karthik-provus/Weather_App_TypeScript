import { useState } from 'react';
import { WeatherService, CitySuggestion } from '@/services/weatherService';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { SearchBar } from '@/components/weather/SearchBar';

function App() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCitySelect = async (city: CitySuggestion) => {
    setLoading(true);
    try {
      // Use the coords for better accuracy
      const query = `${city.lat},${city.lon}`;
      const data = await WeatherService.getCurrentWeather(query);
      setWeather(data);
    } catch (error) {
      alert("Error fetching weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            SkyCast
          </h1>
          <p className="text-slate-500 text-lg">Real-time weather insights</p>
        </header>

        <SearchBar onCitySelect={handleCitySelect} />

        {loading ? (
          <div className="text-center py-20 text-slate-400">Updating weather...</div>
        ) : weather ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <CurrentWeather data={weather} />
          </div>
        ) : (
          <div className="text-center py-20 text-slate-300 border-2 border-dashed rounded-xl">
             Search for a city to see live conditions
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from './SearchBar';
import { CitySuggestion } from '@/services/weatherService';
import { HourData, WeatherResponse, ForecastDay, WeatherUnit } from '@/types/weather';
import { 
  ThermometerSun, Wind, Droplets, Eye, Sun, 
  TrendingUp, TrendingDown, Minus, MapPin
} from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';

interface WeatherData {
  weather: WeatherResponse | null;
  forecast: ForecastDay[];
  hourlyForecast: HourData[];
}

interface ComparisonViewProps {
  city1Data: WeatherData;
  city2Data: WeatherData;
  unit: WeatherUnit;
  onCitySelect: (city: CitySuggestion) => void;
  isDarkMode: boolean;
}

export function ComparisonView({ 
  city1Data, 
  city2Data, 
  unit, 
  onCitySelect,
  isDarkMode 
}: ComparisonViewProps) {
  
  const hasCity2 = city2Data.weather !== null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Comparison Header */}
      <div className={`rounded-2xl p-6 border backdrop-blur-md shadow-lg transition-all duration-500
        ${isDarkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/70 border-slate-200'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          City Comparison
        </h2>
        
        {!hasCity2 && (
          <div className="max-w-md">
            <p className={`mb-4 text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
              Search for a second city to compare weather conditions side by side
            </p>
            <SearchBar
              onCitySelect={onCitySelect}
              onLocationClick={() => {}}
              hideLocationButton={true}
            />
          </div>
        )}
      </div>

      {hasCity2 && city1Data.weather && city2Data.weather && (
        <>
          {/* Main Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* City 1 Card */}
            <ComparisonCityCard
              weather={city1Data.weather}
              forecast={city1Data.forecast}
              unit={unit}
              isDarkMode={isDarkMode}
              isPrimary={true}
            />

            {/* City 2 Card */}
            <ComparisonCityCard
              weather={city2Data.weather}
              forecast={city2Data.forecast}
              unit={unit}
              isDarkMode={isDarkMode}
              isPrimary={false}
            />
          </div>

          {/* Detailed Metrics Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetricsComparisonCard
              label="Temperature"
              city1Value={unit === WeatherUnit.C ? city1Data.weather.current.temp_c : city1Data.weather.current.temp_f}
              city2Value={unit === WeatherUnit.C ? city2Data.weather.current.temp_c : city2Data.weather.current.temp_f}
              city1Name={city1Data.weather.location.name}
              city2Name={city2Data.weather.location.name}
              unit={unit === WeatherUnit.C ? '°C' : '°F'}
              icon={<ThermometerSun className="w-5 h-5" />}
              isDarkMode={isDarkMode}
            />

            <MetricsComparisonCard
              label="Feels Like"
              city1Value={unit === WeatherUnit.C ? city1Data.weather.current.feelslike_c : city1Data.weather.current.feelslike_f}
              city2Value={unit === WeatherUnit.C ? city2Data.weather.current.feelslike_c : city2Data.weather.current.feelslike_f}
              city1Name={city1Data.weather.location.name}
              city2Name={city2Data.weather.location.name}
              unit={unit === WeatherUnit.C ? '°C' : '°F'}
              icon={<ThermometerSun className="w-5 h-5" />}
              isDarkMode={isDarkMode}
            />

            <MetricsComparisonCard
              label="Wind Speed"
              city1Value={unit === WeatherUnit.C ? city1Data.weather.current.wind_kph : city1Data.weather.current.wind_mph}
              city2Value={unit === WeatherUnit.C ? city2Data.weather.current.wind_kph : city2Data.weather.current.wind_mph}
              city1Name={city1Data.weather.location.name}
              city2Name={city2Data.weather.location.name}
              unit={unit === WeatherUnit.C ? 'km/h' : 'mph'}
              icon={<Wind className="w-5 h-5" />}
              isDarkMode={isDarkMode}
            />

            <MetricsComparisonCard
              label="Humidity"
              city1Value={city1Data.weather.current.humidity}
              city2Value={city2Data.weather.current.humidity}
              city1Name={city1Data.weather.location.name}
              city2Name={city2Data.weather.location.name}
              unit="%"
              icon={<Droplets className="w-5 h-5" />}
              isDarkMode={isDarkMode}
            />

            <MetricsComparisonCard
              label="Visibility"
              city1Value={unit === WeatherUnit.C ? city1Data.weather.current.vis_km : city1Data.weather.current.vis_miles}
              city2Value={unit === WeatherUnit.C ? city2Data.weather.current.vis_km : city2Data.weather.current.vis_miles}
              city1Name={city1Data.weather.location.name}
              city2Name={city2Data.weather.location.name}
              unit={unit === WeatherUnit.C ? 'km' : 'mi'}
              icon={<Eye className="w-5 h-5" />}
              isDarkMode={isDarkMode}
            />

            <MetricsComparisonCard
              label="UV Index"
              city1Value={city1Data.weather.current.uv}
              city2Value={city2Data.weather.current.uv}
              city1Name={city1Data.weather.location.name}
              city2Name={city2Data.weather.location.name}
              unit=""
              icon={<Sun className="w-5 h-5" />}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Temperature Comparison Chart */}
          <ComparisonChart
            city1Data={city1Data}
            city2Data={city2Data}
            unit={unit}
            isDarkMode={isDarkMode}
          />

          {/* Search for New City Button */}
          <div className={`rounded-2xl p-6 border backdrop-blur-md shadow-lg transition-all duration-500
            ${isDarkMode 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/70 border-slate-200'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Compare with Different City
            </h3>
            <SearchBar
              onCitySelect={onCitySelect}
              onLocationClick={() => {}}
              hideLocationButton={true}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Helper component for individual city cards in comparison
function ComparisonCityCard({ 
  weather, 
  forecast, 
  unit, 
  isDarkMode, 
  isPrimary 
}: { 
  weather: WeatherResponse;
  forecast: ForecastDay[];
  unit: WeatherUnit;
  isDarkMode: boolean;
  isPrimary: boolean;
}) {
  const temp = unit === WeatherUnit.C ? Math.round(weather.current.temp_c) : Math.round(weather.current.temp_f);
  const feelsLike = unit === WeatherUnit.C ? Math.round(weather.current.feelslike_c) : Math.round(weather.current.feelslike_f);

  return (
    <Card className={`
      overflow-hidden border-none shadow-xl transition-all duration-500 backdrop-blur-md
      ${isDarkMode 
        ? 'bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50 text-white' 
        : 'bg-gradient-to-br from-blue-500/90 via-blue-400/90 to-indigo-500/90 text-white'
      }
      ${isPrimary ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent' : ''}
    `}>
      <CardContent className="p-6 relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10 space-y-4">
          {/* City Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white/70" />
              <h3 className="text-2xl font-bold">{weather.location.name}</h3>
            </div>
            {isPrimary && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                Primary
              </span>
            )}
          </div>

          <p className="text-sm text-white/70">{weather.location.country}</p>

          {/* Main Temperature Display */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="text-6xl font-bold tracking-tight">{temp}°</div>
              <p className="text-xl font-medium text-white/90 capitalize mt-2">
                {weather.current.condition.text}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-white/70">
                <ThermometerSun className="w-4 h-4" />
                Feels like {feelsLike}°
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-[40px] rounded-full" />
              <img 
                src={weather.current.condition.icon.replace("64x64", "128x128")} 
                alt={weather.current.condition.text}
                className="w-28 h-28 relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
            <div className="text-center">
              <Wind className="w-4 h-4 mx-auto mb-1 text-white/70" />
              <p className="text-xs text-white/60">Wind</p>
              <p className="font-semibold text-sm">{weather.current.wind_kph} km/h</p>
            </div>
            <div className="text-center">
              <Droplets className="w-4 h-4 mx-auto mb-1 text-white/70" />
              <p className="text-xs text-white/60">Humidity</p>
              <p className="font-semibold text-sm">{weather.current.humidity}%</p>
            </div>
            <div className="text-center">
              <Eye className="w-4 h-4 mx-auto mb-1 text-white/70" />
              <p className="text-xs text-white/60">Visibility</p>
              <p className="font-semibold text-sm">{weather.current.vis_km} km</p>
            </div>
          </div>

          {/* 3-Day Forecast Preview */}
          {forecast.length > 0 && (
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm text-white/70 mb-3">3-Day Forecast</p>
              <div className="grid grid-cols-3 gap-2">
                {forecast.slice(0, 3).map((day) => (
                  <div 
                    key={day.date} 
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center"
                  >
                    <p className="text-xs text-white/60 mb-1">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <img 
                      src={day.day.condition.icon} 
                      alt={day.day.condition.text}
                      className="w-8 h-8 mx-auto my-1"
                    />
                    <p className="text-sm font-semibold">
                      {unit === WeatherUnit.C ? Math.round(day.day.avgtemp_c) : Math.round(day.day.avgtemp_f)}°
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for metric comparison cards
function MetricsComparisonCard({
  label,
  city1Value,
  city2Value,
  city1Name,
  city2Name,
  unit,
  icon,
  isDarkMode
}: {
  label: string;
  city1Value: number;
  city2Value: number;
  city1Name: string;
  city2Name: string;
  unit: string;
  icon: React.ReactNode;
  isDarkMode: boolean;
}) {
  const difference = city1Value - city2Value;
  const percentDiff = city2Value !== 0 ? Math.abs((difference / city2Value) * 100) : 0;

  const getTrendIcon = () => {
    if (Math.abs(difference) < 0.5) return <Minus className="w-4 h-4" />;
    return difference > 0 
      ? <TrendingUp className="w-4 h-4 text-green-500" />
      : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <Card className={`
      border-none shadow-sm backdrop-blur-md transition-all duration-300
      ${isDarkMode 
        ? 'bg-white/5 hover:bg-white/10' 
        : 'bg-white/70 hover:bg-white/80'
      }
    `}>
      <CardContent className="p-4">
        <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
          {icon}
          <span className="font-medium">{label}</span>
        </div>

        <div className="space-y-3">
          {/* City 1 */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
              {city1Name}
            </span>
            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {city1Value.toFixed(1)}{unit}
            </span>
          </div>

          {/* City 2 */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
              {city2Name}
            </span>
            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {city2Value.toFixed(1)}{unit}
            </span>
          </div>

          {/* Difference */}
          <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-white/50' : 'text-slate-400'}`}>
              Difference
            </span>
            <span className={`text-sm font-semibold flex items-center gap-1 ${isDarkMode ? 'text-white/80' : 'text-slate-700'}`}>
              {getTrendIcon()}
              {Math.abs(difference).toFixed(1)}{unit} ({percentDiff.toFixed(1)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

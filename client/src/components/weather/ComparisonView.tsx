import { useState } from "react";
// We use 'any' for the weather objects here because your service 
// returns a custom mapped structure, not the raw WeatherResponse type.
import { HourData, WeatherUnit } from "@/types/weather";
import { SearchBar } from "./SearchBar";
import { ComparisonChart } from "./ComparisonChart";
import { CitySuggestion, WeatherService } from "@/services/weatherService";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft, Droplets, Eye, Sun, Wind, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ComparisonViewProps {
  weatherA: any; // Changed to any to match your flattened structure
  hourlyA: HourData[];
  onClose: () => void;
  unit: WeatherUnit;
}

export function ComparisonView({ weatherA, hourlyA, onClose, unit }: ComparisonViewProps) {
  const [weatherB, setWeatherB] = useState<any | null>(null);
  const [hourlyB, setHourlyB] = useState<HourData[] | null>(null);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const [errorB, setErrorB] = useState<string | null>(null);

  const handleCityBSelect = async (city: CitySuggestion) => {
    setIsLoadingB(true);
    setErrorB(null);
    setWeatherB(null);

    try {
      const query = city.lat && city.lon ? `${city.lat},${city.lon}` : city.name;
      
      // FIX: We need TWO calls. 
      // 1. Get Current Weather (for the top card info like City Name, Icon, Temp)
      // 2. Get Hourly Data (for the chart)
      const [currentData, hourlyData] = await Promise.all([
          WeatherService.getCurrentWeather(query),
          WeatherService.getHourlyForecast(query, 1)
      ]);
      
      if (!currentData || !hourlyData) {
          throw new Error("Incomplete data");
      }

      setWeatherB(currentData);
      setHourlyB(hourlyData);

    } catch (e) {
      console.error("Failed to load City B", e);
      setErrorB("Could not load weather for this city.");
    } finally {
      setIsLoadingB(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-50/95 backdrop-blur-md py-4 z-50 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                    <ArrowRightLeft className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Compare Cities</h2>
                    <p className="text-slate-500 text-sm">Analyze weather patterns side-by-side</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-200">
                <X className="w-6 h-6 text-slate-500" />
            </Button>
        </div>

        {/* --- Main Comparison Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Left Column: City A (Fixed) */}
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-3xl shadow-lg border border-slate-100 ring-1 ring-slate-100/50">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Base Location</div>
                    {/* FIX: Use .city instead of .location.name */}
                    <h3 className="text-3xl font-bold text-slate-800 truncate">{weatherA.city}</h3>
                    <div className="flex items-center gap-4 mt-6">
                        {/* FIX: Access properties directly from the flat object */}
                        {/* <img src={weatherA.icon.replace("64x64", "128x128")} className="w-20 h-20 drop-shadow-md" /> */}
                        <div>
                            <div className="text-6xl font-bold text-slate-900 tracking-tighter">
                                {Math.round(unit === WeatherUnit.C ? weatherA.temp_c : weatherA.temp_f)}°
                            </div>
                            <div className="text-lg text-slate-500 font-medium">{weatherA.condition}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: City B (Searchable) */}
            <div className="space-y-6">
                {!weatherB ? (
                    <div className="h-full min-h-[280px] flex flex-col items-center justify-center p-8 bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl group hover:border-blue-400 transition-colors">
                        {isLoadingB ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <p className="text-slate-500 font-medium">Fetching data...</p>
                            </div>
                        ) : errorB ? (
                             <div className="flex flex-col items-center gap-2 text-red-500 text-center">
                                <AlertCircle className="w-8 h-8" />
                                <p>{errorB}</p>
                                <Button variant="link" onClick={() => setErrorB(null)}>Try again</Button>
                             </div>
                        ) : (
                            <>
                                <p className="text-lg font-medium text-slate-500 mb-6 group-hover:text-blue-500 transition-colors">Select a city to compare</p>
                                <div className="w-full max-w-sm relative z-20">
                                    <SearchBar onCitySelect={handleCityBSelect} onLocationClick={() => {}} />
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-6 bg-white rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden ring-1 ring-slate-100/50">
                        <button onClick={() => setWeatherB(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                        
                        <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Comparison</div>
                        <h3 className="text-3xl font-bold text-slate-800 truncate pr-10">{weatherB.city}</h3>
                        <div className="flex items-center gap-4 mt-6">
                            <img src={weatherB.icon.replace("64x64", "128x128")} className="w-20 h-20 drop-shadow-md" />
                            <div>
                                <div className="text-6xl font-bold text-slate-900 tracking-tighter">
                                    {Math.round(unit === WeatherUnit.C ? weatherB.temp_c : weatherB.temp_f)}°
                                </div>
                                <div className="text-lg text-slate-500 font-medium">{weatherB.condition}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- Shared Content --- */}
        {weatherB && hourlyB && hourlyA && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
                
                {/* 1. The Chart */}
                <ComparisonChart 
                    dataA={hourlyA} 
                    dataB={hourlyB} 
                    nameA={weatherA.city} 
                    nameB={weatherB.city} 
                    unit={unit} 
                />

                {/* 2. Tale of the Tape Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatComparison 
                        label="Wind" 
                        icon={<Wind className="w-4 h-4 text-slate-500" />}
                        valA={`${weatherA.wind_kph} km/h`}
                        valB={`${weatherB.wind_kph} km/h`}
                    />
                    <StatComparison 
                        label="Humidity" 
                        icon={<Droplets className="w-4 h-4 text-blue-500" />}
                        valA={`${weatherA.humidity}%`}
                        valB={`${weatherB.humidity}%`}
                    />
                    {/* Check if visibility exists, as it wasn't in your snippet */}
                    {weatherA.vis_km !== undefined && (
                        <StatComparison 
                            label="Visibility" 
                            icon={<Eye className="w-4 h-4 text-indigo-500" />}
                            valA={`${weatherA.vis_km} km`}
                            valB={`${weatherB.vis_km || 10} km`}
                        />
                    )}
                    <StatComparison 
                        label="UV Index" 
                        icon={<Sun className="w-4 h-4 text-orange-500" />}
                        valA={`${weatherA.uv}`}
                        valB={`${weatherB.uv}`}
                    />
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

// Helper for the grid
function StatComparison({ label, icon, valA, valB }: { label: string, icon: any, valA: string, valB: string }) {
    return (
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    {icon} {label}
                </div>
                <div className="flex justify-between items-baseline">
                    <div className="text-center w-1/2 border-r border-slate-100 pr-2">
                        <div className="text-xl font-bold text-blue-600">{valA}</div>
                    </div>
                    <div className="text-center w-1/2 pl-2">
                        <div className="text-xl font-bold text-orange-600">{valB}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse, ForecastDay, WeatherUnit } from "@/types/weather";
import { Sunrise, Sunset, TrendingUp, TrendingDown, Moon, CloudRain, Sun, Snowflake } from "lucide-react";

interface DailyBriefingProps {
  weather: WeatherResponse;
  forecast: ForecastDay[];
  unit: WeatherUnit;
  isDay: boolean; // <--- New Prop
}

export function DailyBriefing({ weather, forecast, unit, isDay }: DailyBriefingProps) {
  const today = forecast[0]?.day;
  const astro = forecast[0]?.astro;
  const isDark = !isDay;
  
  if (!today || !astro) return null;

  const currentTemp = unit === WeatherUnit.C ? weather.current.temp_c : weather.current.temp_f;
  const maxTemp = unit === WeatherUnit.C ? today.maxtemp_c : today.maxtemp_f;
  const minTemp = unit === WeatherUnit.C ? today.mintemp_c : today.mintemp_f;

  // Logic for the "Verdict"
  let verdict = "A standard day.";
  let verdictColor = isDark ? "text-slate-300 bg-white/10" : "text-slate-600 bg-slate-100";
  let VerdictIcon = Sun;
  
  if (today.daily_chance_of_rain>60) {
    verdict = "Keep an umbrella close.";
    verdictColor = isDark ? "text-blue-300 bg-blue-500/20" : "text-blue-600 bg-blue-50";
    VerdictIcon = CloudRain;
  } else if (maxTemp > 30) {
    verdict = "It's going to be a hot one.";
    verdictColor = isDark ? "text-orange-300 bg-orange-500/20" : "text-orange-600 bg-orange-50";
    VerdictIcon = Sun;
  } else if (maxTemp < 5) {
    verdict = "Dress warmly, it's freezing.";
    verdictColor = isDark ? "text-blue-200 bg-blue-500/20" : "text-blue-800 bg-blue-50";
    VerdictIcon = Snowflake;
  } else {
    verdict = "Perfect weather for a walk.";
    verdictColor = isDark ? "text-green-300 bg-green-500/20" : "text-green-600 bg-green-50";
    VerdictIcon = Sun;
  }

  // Common Text Colors
  const textColor = isDark ? "text-white" : "text-slate-800";
  const subTextColor = isDark ? "text-white/60" : "text-slate-500";
  const labelColor = isDark ? "text-white/40" : "text-slate-400";
  const dividerColor = isDark ? "divide-white/10" : "divide-slate-100";
  const borderColor = isDark ? "border-white/10" : "border-slate-100";

  return (
    <Card className={`
        border-none shadow-xl backdrop-blur-md overflow-hidden transition-all duration-500
        ${isDark ? 'bg-black/25' : 'bg-white/80'}
    `}>
      <CardHeader className={`pb-3 border-b ${borderColor} ${isDark ? 'bg-white/5' : 'bg-slate-50/50'}`}>
        <CardTitle className={`flex justify-between items-center text-lg font-bold ${textColor}`}>
          <span>Daily Briefing</span>
          <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full border border-transparent shadow-sm ${verdictColor}`}>
            <VerdictIcon className="w-4 h-4" />
            {verdict}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x ${dividerColor}`}>
          
          {/* Section 1: Temperature Context */}
          <div className="p-6 flex flex-col justify-center gap-1">
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${labelColor}`}>Temperature Range</div>
            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${textColor}`}>{Math.round(maxTemp)}°</span>
                <span className={`font-medium ${subTextColor}`}>/ {Math.round(minTemp)}°</span>
            </div>
            <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${subTextColor}`}>
                {currentTemp > maxTemp - 2 ? (
                     <><TrendingUp className="w-4 h-4 text-orange-500" /> Near today's peak</>
                ) : currentTemp < minTemp + 2 ? (
                     <><TrendingDown className="w-4 h-4 text-blue-500" /> Near today's low</>
                ) : (
                     <span className={subTextColor}>Stable conditions</span>
                )}
            </div>
          </div>

          {/* Section 2: Sun Cycle */}
          <div className="p-6 flex flex-col justify-center gap-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-600'}`}>
                        <Sunrise className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={`text-xs font-bold ${labelColor}`}>Sunrise</div>
                        <div className={`font-semibold ${textColor}`}>{astro.sunrise}</div>
                    </div>
                </div>
                
                {/* Timeline Line */}
                <div className={`w-12 h-[1px] ${isDark ? 'bg-white/20' : 'bg-slate-200'}`}></div>

                <div className="flex items-center gap-3">
                    <div>
                        <div className={`text-xs font-bold text-right ${labelColor}`}>Sunset</div>
                        <div className={`font-semibold text-right ${textColor}`}>{astro.sunset}</div>
                    </div>
                    <div className={`p-2 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Sunset className="w-4 h-4" />
                    </div>
                </div>
             </div>
          </div>

          {/* Section 3: Tonight's Outlook */}
          <div className="p-6 flex flex-col justify-center gap-1">
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${labelColor}`}>Tonight's Outlook</div>
            <div className="flex items-center gap-3">
                <Moon className={`w-8 h-8 ${isDark ? 'text-indigo-300' : 'text-indigo-400'}`} />
                <div>
                    <div className={`font-bold ${textColor}`}>
                        {astro.moon_phase}
                    </div>
                    <div className={`text-xs font-medium ${subTextColor}`}>
                        Moon Illumination: {astro.moon_illumination}%
                    </div>
                </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
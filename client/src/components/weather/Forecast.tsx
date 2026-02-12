
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ForecastDay } from "@/types/weather";
import { 
    CalendarDays, 
    CalendarRange, 
    Droplets, 
    Wind, 
    ArrowDown, 
    ArrowUp 
} from "lucide-react";

interface ForecastProps {
  forecastData: ForecastDay[];
  unit: 'C' | 'F';
  days: number;
  onDaysChange: (days: number) => void;
}

// --- Helper: Get Gradient for Forecast Cards ---
// We assume 'Day' mode (1) for forecasts since we are showing daily highs.
const getForecastGradient = (code: number): string => {
    // 1. Thunderstorm / Rain
    if ([1087, 1273, 1276, 1279, 1282, 1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
        return "from-slate-600 to-blue-600";
    }
    // 2. Snow / Ice
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
        return "from-blue-400 to-indigo-400";
    }
    // 3. Cloudy / Overcast
    if ([1003, 1006, 1009].includes(code)) {
        return "from-slate-400 to-gray-500";
    }
    // 4. Mist / Fog
    if ([1030, 1135, 1147].includes(code)) {
        return "from-slate-300 to-gray-400";
    }
    // 5. Clear / Sunny (Default) -> NEW, SOFTER GRADIENT
    return "from-yellow-400 via-amber-400 to-orange-400"; 
};

export function Forecast({ forecastData, unit, days, onDaysChange }: ForecastProps) {
  
  const formatTemp = (tempC: number) => {
    if (unit === 'C') return Math.round(tempC);
    return Math.round((tempC * 9/5) + 32);
  };

  const formatDayName = (dateStr: string, index: number) => {
      if (index === 0) return "Today";
      if (index === 1) return "Tomorrow";
      return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="space-y-6">
      
      {/* --- Control Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-white drop-shadow-md" />
          <h3 className="font-bold text-white text-lg drop-shadow-md">
            {days}-Day Forecast
          </h3>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-1/2 md:w-1/3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-sm text-white">
          <CalendarRange className="w-4 h-4 text-white/70" />
          <Slider
            defaultValue={[days]}
            max={14}
            min={1}
            step={1}
            onValueCommit={(vals) => onDaysChange(vals[0])} 
            className="flex-1"
          />
          <span className="text-sm font-bold text-white w-8 text-right">
            {days}d
          </span>
        </div>
      </div>

      {/* --- Cards Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {forecastData.map((day, index) => {
          // Calculate gradient for this specific day
          const gradientClass = getForecastGradient(day.day.condition.code);

          return (
            <Card 
                key={day.date_epoch} 
                className={`
                    group overflow-hidden border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                    bg-gradient-to-br ${gradientClass} text-white
                `}
            >
                <CardContent className="p-0">
                    {/* 1. Header: Date & Rain Badge */}
                    <div className="p-3 border-b border-white/10 flex justify-between items-start bg-black/5">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white shadow-sm">
                                {formatDayName(day.date, index)}
                            </span>
                            <span className="text-xs text-white/70 font-medium">
                                {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                        
                        {/* High Visibility Rain Badge */}
                        {day.day.daily_chance_of_rain > 0 && (
                            <div className="flex items-center gap-1 bg-white text-blue-600 px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm">
                                <Droplets className="w-3 h-3" />
                                {day.day.daily_chance_of_rain}%
                            </div>
                        )}
                    </div>

                    {/* 2. Body: Icon & Temps */}
                    <div className="p-4 flex flex-col items-center justify-center gap-2">
                        {/* Icon with drop shadow for pop */}
                        <img 
                            src={day.day.condition.icon} 
                            alt={day.day.condition.text} 
                            className="w-14 h-14 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" 
                        />
                        
                        <span className="text-xs text-center font-medium text-white/90 line-clamp-1 h-4 shadow-sm">
                            {day.day.condition.text}
                        </span>

                        <div className="flex items-center gap-4 mt-1 w-full justify-center">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-white/70 flex items-center gap-0.5 uppercase tracking-wide">
                                    <ArrowUp className="w-3 h-3" /> Max
                                </span>
                                <span className="text-lg font-bold text-white shadow-sm">
                                    {formatTemp(day.day.maxtemp_c)}°
                                </span>
                            </div>
                            
                            <div className="w-[1px] h-8 bg-white/20"></div> {/* Divider */}

                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-white/70 flex items-center gap-0.5 uppercase tracking-wide">
                                    <ArrowDown className="w-3 h-3" /> Min
                                </span>
                                <span className="text-lg font-bold text-white/90 shadow-sm">
                                    {formatTemp(day.day.mintemp_c)}°
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Footer: Extra Metrics */}
                    <div className="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10 bg-black/10">
                        <div className="py-2 flex items-center justify-center gap-1.5 text-xs text-white/80 font-medium">
                            <Droplets className="w-3 h-3 text-white/60" />
                            {day.day.avghumidity}%
                        </div>
                        <div className="py-2 flex items-center justify-center gap-1.5 text-xs text-white/80 font-medium">
                            <Wind className="w-3 h-3 text-white/60" />
                            {Math.round(day.day.maxwind_kph)} km/h
                        </div>
                    </div>

                </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
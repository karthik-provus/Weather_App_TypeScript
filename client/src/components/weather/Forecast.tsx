
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider"; // Import the slider
import { ForecastDay } from "@/types/weather";
import { CalendarDays, CalendarRange } from "lucide-react";

interface ForecastProps {
  forecastData: ForecastDay[];
  unit: 'C' | 'F';
  days: number;
  onDaysChange: (days: number) => void;
}

export function Forecast({ forecastData, unit, days, onDaysChange }: ForecastProps) {
  
  const formatTemp = (tempC: number) => {
    if (unit === 'C') return Math.round(tempC);
    return Math.round((tempC * 9/5) + 32);
  };

  return (
    <div className="space-y-6">
      {/* Header with Slider Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-700">
            {days}-Day Forecast
          </h3>
        </div>

        {/* Slider UI */}
        <div className="flex items-center gap-4 w-full sm:w-1/2 md:w-1/3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          <CalendarRange className="w-4 h-4 text-slate-400" />
          <Slider
            defaultValue={[days]}
            max={13}
            min={1}
            step={1}
            // onValueCommit is better than onValueChange (fetches only when you let go)
            onValueCommit={(vals) => onDaysChange(vals[0])} 
            className="flex-1"
          />
          <span className="text-sm font-bold text-slate-600 w-6 text-right">
            {days}d
          </span>
        </div>
      </div>

      {/* Dynamic Grid - Adapts to the number of cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {forecastData.map((day, index) => (
          <Card 
            key={index} 
            className="overflow-hidden border-none bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-xs text-slate-300 mb-2">
                 {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </span>
              
              <img src={day.day.condition.icon} alt={day.day.condition.text} className="w-12 h-12 my-1" />
              
              <div className="text-lg font-bold text-slate-800">
                {formatTemp(day.day.maxtemp_c)}°
              </div>
              <div className="text-sm font-medium text-slate-400">
                {formatTemp(day.day.mintemp_c)}°
              </div>
              
              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// import { Card, CardContent } from "@/components/ui/card";
// import { Slider } from "@/components/ui/slider"; // Import the slider
// import { ForecastDay } from "@/types/weather";
// import { CalendarDays, CalendarRange } from "lucide-react";

// interface ForecastProps {
//   forecastData: ForecastDay[];
//   unit: 'C' | 'F';
//   days: number;
//   onDaysChange: (days: number) => void;
// }

// export function Forecast({ forecastData, unit, days, onDaysChange }: ForecastProps) {
  
//   const formatTemp = (tempC: number) => {
//     if (unit === 'C') return Math.round(tempC);
//     return Math.round((tempC * 9/5) + 32);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with Slider Control */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        
//         {/* Title */}
//         <div className="flex items-center gap-2">
//           <CalendarDays className="w-5 h-5 text-slate-600" />
//           <h3 className="font-semibold text-slate-700">
//             {days}-Day Forecast
//           </h3>
//         </div>

//         {/* Slider UI */}
//         <div className="flex items-center gap-4 w-full sm:w-1/2 md:w-1/3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
//           <CalendarRange className="w-4 h-4 text-slate-400" />
//           <Slider
//             defaultValue={[days]}
//             max={13}
//             min={1}
//             step={1}
//             // onValueCommit is better than onValueChange (fetches only when you let go)
//             onValueCommit={(vals) => onDaysChange(vals[0])} 
//             className="flex-1"
//           />
//           <span className="text-sm font-bold text-slate-600 w-6 text-right">
//             {days}d
//           </span>
//         </div>
//       </div>

//       {/* Dynamic Grid - Adapts to the number of cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {forecastData.map((day, index) => (
//           <Card 
//             key={index} 
//             className="overflow-hidden border-none bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
//           >
//             <CardContent className="p-4 flex flex-col items-center text-center">
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
//               </span>
//               <span className="text-xs text-slate-300 mb-2">
//                  {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
//               </span>
              
//               <img src={day.day.condition.icon} alt={day.day.condition.text} className="w-12 h-12 my-1" />
              
//               <div className="text-lg font-bold text-slate-800">
//                 {formatTemp(day.day.maxtemp_c)}°
//               </div>
//               <div className="text-sm font-medium text-slate-400">
//                 {formatTemp(day.day.mintemp_c)}°
//               </div>
              
              
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }


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
          <CalendarDays className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-lg">
            {days}-Day Forecast
          </h3>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-1/2 md:w-1/3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <CalendarRange className="w-4 h-4 text-slate-400" />
          <Slider
            defaultValue={[days]}
            max={13}
            min={1}
            step={1}
            onValueCommit={(vals) => onDaysChange(vals[0])} 
            className="flex-1"
          />
          <span className="text-sm font-bold text-blue-600 w-8 text-right">
            {days}d
          </span>
        </div>
      </div>

      {/* --- Cards Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {forecastData.map((day, index) => (
          <Card 
            key={day.date_epoch} 
            className="group overflow-hidden border-slate-100 bg-white shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300"
          >
            <CardContent className="p-0">
                {/* 1. Header: Date & Rain Badge */}
                <div className="p-3 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                            {formatDayName(day.date, index)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                            {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                    
                    {/* Only show rain badge if chance > 0 */}
                    {day.day.daily_chance_of_rain > 0 && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                            <Droplets className="w-3 h-3" />
                            {day.day.daily_chance_of_rain}%
                        </div>
                    )}
                </div>

                {/* 2. Body: Icon & Temps */}
                <div className="p-4 flex flex-col items-center justify-center gap-2">
                    <img 
                        src={day.day.condition.icon} 
                        alt={day.day.condition.text} 
                        className="w-14 h-14 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" 
                    />
                    
                    <span className="text-xs text-center font-medium text-slate-500 line-clamp-1 h-4">
                        {day.day.condition.text}
                    </span>

                    <div className="flex items-center gap-4 mt-1 w-full justify-center">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-0.5">
                                <ArrowUp className="w-3 h-3" /> Max
                            </span>
                            <span className="text-lg font-bold text-slate-800">
                                {formatTemp(day.day.maxtemp_c)}°
                            </span>
                        </div>
                        
                        <div className="w-[1px] h-8 bg-slate-100"></div> {/* Divider */}

                        <div className="flex flex-col items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-0.5">
                                <ArrowDown className="w-3 h-3" /> Min
                            </span>
                            <span className="text-lg font-bold text-slate-500">
                                {formatTemp(day.day.mintemp_c)}°
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Footer: Extra Metrics (Humidity & Wind) */}
                <div className="grid grid-cols-2 border-t border-slate-50 divide-x divide-slate-50 bg-slate-50/30">
                    <div className="py-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        {day.day.avghumidity}%
                    </div>
                    <div className="py-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                        <Wind className="w-3 h-3 text-slate-400" />
                        {Math.round(day.day.maxwind_kph)} km/h
                    </div>
                </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
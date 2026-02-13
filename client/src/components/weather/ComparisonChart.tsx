import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { HourData, WeatherResponse, ForecastDay, WeatherUnit } from "@/types/weather";

interface WeatherData {
  weather: WeatherResponse | null;
  forecast: ForecastDay[];
  hourlyForecast: HourData[];
}

interface ComparisonChartProps {
  city1Data: WeatherData;
  city2Data: WeatherData;
  unit: WeatherUnit;
  isDarkMode: boolean;
}

export function ComparisonChart({ city1Data, city2Data, unit, isDarkMode }: ComparisonChartProps) {
  if (!city1Data.weather || !city2Data.weather || 
      !city1Data.hourlyForecast.length || !city2Data.hourlyForecast.length) {
    return null;
  }

  const nameA = city1Data.weather.location.name;
  const nameB = city2Data.weather.location.name;
  const dataA = city1Data.hourlyForecast;
  const dataB = city2Data.hourlyForecast;

  // Merge data based on hour index (0-23)
  const chartData = dataA.map((item, index) => {
    const itemB = dataB[index];
    return {
      time: item.time.split(" ")[1], // "14:00"
      tempA: unit === WeatherUnit.C ? item.temp_c : item.temp_f,
      tempB: itemB ? (unit === WeatherUnit.C ? itemB.temp_c : itemB.temp_f) : null,
    };
  });

  return (
    <Card className={`
      border-none shadow-xl backdrop-blur-md transition-all duration-500
      ${isDarkMode 
        ? 'bg-white/5 hover:bg-white/10' 
        : 'bg-white/70 hover:bg-white/80'
      }
    `}>
      <CardHeader>
        <CardTitle className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          24-Hour Temperature Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDarkMode ? "#60a5fa" : "#3b82f6"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isDarkMode ? "#60a5fa" : "#3b82f6"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDarkMode ? "#fb923c" : "#f97316"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isDarkMode ? "#fb923c" : "#f97316"} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis 
                dataKey="time" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                interval={3}
                stroke={isDarkMode ? '#fff' : '#000'}
                tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
              />
              <YAxis 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `${Math.round(val)}°`} 
                width={30}
                stroke={isDarkMode ? '#fff' : '#000'}
                tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
              />
              
              <Tooltip
                contentStyle={{ 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  background: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)',
                  color: isDarkMode ? '#fff' : '#000'
                }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ color: isDarkMode ? '#fff' : '#000' }}
              />

              {/* City A Line (Blue) */}
              <Area 
                type="monotone" 
                dataKey="tempA" 
                name={nameA} 
                stroke={isDarkMode ? "#60a5fa" : "#3b82f6"} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#gradA)" 
              />
              
              {/* City B Line (Orange) */}
              <Area 
                type="monotone" 
                dataKey="tempB" 
                name={nameB} 
                stroke={isDarkMode ? "#fb923c" : "#f97316"} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#gradB)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
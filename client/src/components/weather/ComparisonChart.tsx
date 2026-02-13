import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { HourData, WeatherUnit } from "@/types/weather";

interface ComparisonChartProps {
  dataA: HourData[];
  dataB: HourData[];
  nameA: string;
  nameB: string;
  unit: WeatherUnit;
}

export function ComparisonChart({ dataA, dataB, nameA, nameB, unit }: ComparisonChartProps) {
  // Merge data based on hour index (0-23)
  // We compare "Local Time vs Local Time" (e.g. 2PM London vs 2PM Tokyo)
  const chartData = dataA.map((item, index) => {
    const itemB = dataB[index];
    return {
      time: item.time.split(" ")[1], // "14:00"
      tempA: unit ===WeatherUnit.C ? item.temp_c : item.temp_f,
      tempB: itemB ? (unit === WeatherUnit.C ? itemB.temp_c : itemB.temp_f) : null,
    };
  });

  return (
    <Card className="border-none shadow-xl bg-white/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">24-Hour Temperature Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} interval={3} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${Math.round(val)}°`} width={30} />
              
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              
              <Legend verticalAlign="top" height={36} iconType="circle" />

              {/* City A Line (Blue) */}
              <Area type="monotone" dataKey="tempA" name={nameA} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#gradA)" />
              
              {/* City B Line (Orange) */}
              <Area type="monotone" dataKey="tempB" name={nameB} stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#gradB)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
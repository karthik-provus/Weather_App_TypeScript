
import { useState } from "react"; // useEffect is no longer needed for initialization
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HourData, WeatherUnit } from "@/types/weather";

interface HourlyTemperatureProps {
    data: HourData[];
    unit: WeatherUnit;
    isDay: boolean;
}

export function HourlyTemperature({ data, unit, isDay }: HourlyTemperatureProps) {
    const isDark = !isDay;

    // FIX: Initialize state lazily. 
    // This function runs only once on mount, preventing the cascading render.
    const [activeIndex, setActiveIndex] = useState<number | null>(() => {
        const currentHour = new Date().getHours();
        const index = data.findIndex(item => {
            const itemHour = parseInt(item.time.split(" ")[1].split(":")[0]);
            return itemHour === currentHour;
        });
        return index !== -1 ? index : null;
    });

    const dataKey = unit === WeatherUnit.C ? "temp_c" : "temp_f";
    const formatTemp = (val: number) => `${Math.round(val)}°`;

    return (
        <Card className={`
            flex-1 w-full h-full min-h-[450px] border-none shadow-xl backdrop-blur-md transition-colors duration-500
            ${isDark ? 'bg-black/25 text-white' : 'bg-white/80 text-slate-800'}
        `}>
            <CardHeader>
                <CardTitle className={`text-xl font-bold flex justify-between items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <span>Today's Trend</span>
                    <span className={`text-sm font-normal px-2 py-1 rounded-md ${isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-500'}`}>
                        24 Hours
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Chart Section */}
                <div className="h-[250px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            // Only update state if it actually changed to prevent jitter
                            onMouseMove={(e) => {
                                if (e.activeTooltipIndex !== undefined && e.activeTooltipIndex !== activeIndex) {
                                    setActiveIndex(e.activeTooltipIndex as number);
                                }
                            }}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isDark ? "#60a5fa" : "#3b82f6"} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={isDark ? "#60a5fa" : "#3b82f6"} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                stroke={isDark ? "#94a3b8" : "#94a3b8"}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => val.split(" ")[1]}
                                interval={3}
                            />
                            <YAxis
                                stroke={isDark ? "#94a3b8" : "#94a3b8"}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${Math.round(val)}°`}
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                                    borderColor: isDark ? "#334155" : "#e2e8f0",
                                    borderRadius: "12px",
                                    color: isDark ? "#fff" : "#1e293b",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                }}
                                itemStyle={{ color: isDark ? "#60a5fa" : "#2563eb", fontWeight: "bold" }}
                                formatter={(val) => {
                                    if (val == null) return ["--", "Temp"];
                                    return [formatTemp(val as number), "Temp"];
                                }}
                                labelFormatter={(label) => new Date(label).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={isDark ? "#60a5fa" : "#3b82f6"}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTemp)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: isDark ? "#60a5fa" : "#3b82f6" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* List Section */}
                <div className="w-full">
                    <div className="flex overflow-x-auto pb-4 gap-3 px-2 snap-x scroll-smooth no-scrollbar">
                        {data.map((item, index) => {
                            const isActive = activeIndex === index;
                            const timeString = item.time.split(" ")[1];
                            const tempValue = unit === WeatherUnit.C ? item.temp_c : item.temp_f;

                            return (
                                <button
                                    key={item.time_epoch}
                                    onClick={() => setActiveIndex(index)}
                                    className={`
                                        flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[70px] border snap-center cursor-pointer
                                        ${isActive
                                            ? "bg-blue-600 text-white shadow-lg scale-105 border-blue-600"
                                            : isDark
                                                ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                                : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    <span className={`text-[10px] font-bold mb-1 ${isActive ? "text-blue-100" : (isDark ? "text-slate-400" : "text-slate-400")}`}>
                                        {timeString}
                                    </span>
                                    <img src={item.condition.icon} alt="weather icon" className="w-8 h-8 mb-1 drop-shadow-sm" />
                                    <span className={`text-sm font-bold ${isActive ? "text-white" : (isDark ? "text-white" : "text-slate-800")}`}>
                                        {Math.round(tempValue)}°
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface HourlyTemperatureProps {
    data: any[];
    unit: "C" | "F";
}

export function HourlyTemperature({ data, unit }: HourlyTemperatureProps) {
    return (
        <Card className="flex-1 w-full h-full min-h-[300px]"> {/* Ensure card has height */}
            <CardHeader>
                <CardTitle>Today's Temperature</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        hour12: true, // Change to false for 24h format (00:00)
                                    });
                                }}
                                interval={3} // Shows 00:00, 03:00, 06:00, etc. Adjust as you like!
                                padding={{ left: 20, right: 20 }}
                            />

                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}°`}
                                // domain={['dataMin - 2', 'dataMax + 2']}
                            />

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-white p-2 shadow-sm text-xs">
                                                <div className="flex flex-col">
                                                    <span className="uppercase text-muted-foreground text-[10px]">Time</span>
                                                    <span className="font-bold">
                                                        {/* Extract 00:00 from the payload */}
                                                        {payload[0].payload.time.split(" ")[1]}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col mt-1">
                                                    <span className="uppercase text-muted-foreground text-[10px]">Temp</span>
                                                    <span className="font-bold text-blue-600">
                                                        {payload[0].value}°C
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey={unit=='C'?"temp_c": "temp_f"}
                                stroke="#6366f1"
                                strokeWidth={2}
                                fillOpacity={0.6}
                                fill="url(#colorTemp)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}




// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Area,
//   AreaChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// interface HourlyTemperatureProps {
//   data: any[];
// }

// export function HourlyTemperature({ data }: HourlyTemperatureProps) {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   // Find the index that matches the current hour
//   const next12Hours = data.slice(0, 12);
//   useEffect(() => {
//     const currentHour = new Date().getHours();
//     const index = data.findIndex(item => {
//       const itemHour = parseInt(item.time.split(" ")[1].split(":")[0]); 
//       return itemHour === currentHour;
//     });
//     if (index !== -1) setActiveIndex(index);
//   }, [data]);

//   return (
//     <Card className="flex-1 w-full h-full min-h-[450px] border-none shadow-xl bg-white text-slate-800">
//       <CardHeader>
//         <CardTitle className="text-xl font-bold text-slate-800">
//           Temperature Timeline
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
        
//         {/* --- 1. The Interactive Chart (Light Theme) --- */}
//         <div className="h-[250px] w-full mb-6">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart 
//               data={data}
//               onMouseMove={(e) => {
//                 if (e.activeTooltipIndex !== undefined) {
//                   setActiveIndex(e.activeTooltipIndex);
//                 }
//               }}
//             >
//               <defs>
//                 <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
//                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
//                 </linearGradient>
//               </defs>

//               <XAxis
//                 dataKey="time"
//                 stroke="#94a3b8" // Slate-400
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => {
//                    const time = value.split(" ")[1];
//                    return time.startsWith("0") ? time.slice(1,5) : time.slice(0,5);
//                 }}
//                 interval={3}
//               />
//               <YAxis
//                 stroke="#94a3b8"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `${value}°`}
//               />
              
//               <Tooltip 
//                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b" }}
//                  itemStyle={{ color: "#6366f1" }}
//                  labelStyle={{ color: "#64748b" }}
//                  formatter={(value) => [`${value}°`, "Temp"]}
//                  labelFormatter={(label) => {
//                    const date = new Date(label);
//                    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
//                  }}
//               />

//               <Area
//               data={next12Hours}
//               activeIndex={activeIndex ?? undefined}
//   onMouseMove={(e) => {
//     if (e.activeTooltipIndex !== undefined) {
//       setActiveIndex(e.activeTooltipIndex);
//     }}}
//                 type="monotone"
//                 dataKey="temp_c"
//                 stroke="#6366f1"
//                 strokeWidth={3}
//                 fillOpacity={1}
//                 fill="url(#colorTemp)"
//                 // Highlight the dot corresponding to the clicked/active card
//                 activeDot={false} // Disable default behavior to handle manually via state if needed
//               />
//               {/* Render a custom Dot for the active index */}
//               {/* (Recharts handles active state via Tooltip internally mostly, but we can rely on sync) */}
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* --- 2. The Horizontal Scrollable List (Fixed) --- */}
//         <div className="w-full overflow-hidden">
//           <div className="flex overflow-x-auto pb-4 gap-4 px-2 snap-x scroll-smooth no-scrollbar">
//             {next12Hours.map((item, index) => {
//               const isActive = activeIndex === index;
//               const timeString = item.time.split(" ")[1]; 

//               return (
//                 <button
//                   key={item.time_epoch}
//                   onClick={() => setActiveIndex(index)}
//                   className={`
//                     flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[80px] border snap-center
//                     ${isActive 
//                       ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-600 scale-105" 
//                       : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-indigo-300"
//                     }
//                   `}
//                 >
//                   <span className={`text-xs font-medium mb-1 ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
//                     {timeString}
//                   </span>
                  
//                   <img 
//                     src={item.icon} 
//                     alt="icon" 
//                     className="w-8 h-8 mb-1"
//                   />
                  
//                   <span className="text-sm font-bold">
//                     {Math.round(item.temp_c)}°
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//       </CardContent>
//     </Card>
//   );
// }





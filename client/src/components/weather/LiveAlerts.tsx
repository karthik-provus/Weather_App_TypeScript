// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AlertCircle, Bell } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { WeatherResponse, ForecastDay } from "@/types/weather";

// export interface WeatherAlert {
//   id: string;
//   severity: "critical" | "warning" | "info";
//   message: string;
//   time: string;
// }

// interface LiveAlertsProps {
//     weather: WeatherResponse;
//     forecast: ForecastDay[];
// }

// export function LiveAlerts({ weather, forecast }: LiveAlertsProps) {
  
//   // Logic to generate alerts based on REAL data
//   const generateAlerts = (): WeatherAlert[] => {
//     const alerts: WeatherAlert[] = [];
//     const current = weather.current;
//     const today = forecast[0]?.day;

//     const addAlert = (severity: WeatherAlert['severity'], message: string) => {
//         alerts.push({
//             id: message.replace(/\s+/g, '-').toLowerCase(),
//             severity,
//             message,
//             time: "Current Condition" // Since these are based on live data
//         });
//     };

//     // --- 1. TEMPERATURE RULES ---
//     if (current.temp_c > 40) {
//         addAlert("critical", `Extreme heat warning (${Math.round(current.temp_c)}°C). Stay hydrated.`);
//     } else if (current.temp_c > 35) {
//         addAlert("warning", `High temperature detected (${Math.round(current.temp_c)}°C).`);
//     } else if (current.temp_c < 0) {
//         addAlert("critical", `Freezing conditions detected (${Math.round(current.temp_c)}°C).`);
//     } else if (current.temp_c < 10) {
//         addAlert("info", `Low temperature advisory. Dress warmly.`);
//     }

//     // --- 2. WIND RULES ---
//     if (current.wind_kph > 60) {
//          addAlert("critical", `Dangerous wind speeds of ${current.wind_kph} km/h.`);
//     } else if (current.wind_kph > 30) {
//          addAlert("warning", `Strong winds detected (${current.wind_kph} km/h).`);
//     }

//     // --- 3. RAIN/SNOW RULES (Current) ---
//     if (current.precip_mm > 5) {
//          addAlert("warning", "Heavy rain detected.");
//     } else if (current.precip_mm > 0.5) {
//          addAlert("info", "Light rain occurring.");
//     }

//     // --- 4. FORECAST RULES (Today) ---
//     if (today) {
//         // If it's NOT currently raining, but rain is expected later
//         if (today.daily_chance_of_rain > 70 && current.precip_mm === 0) {
//              addAlert("info", `High chance of rain (${today.daily_chance_of_rain}%) expected later today.`);
//         }
//         if (today.daily_chance_of_snow > 50) {
//              addAlert("warning", "Snowfall expected today.");
//         }
//     }

//     // --- 5. VISIBILITY / UV RULES ---
//     if (current.vis_km < 1) {
//          addAlert("warning", "Very low visibility (<1km). Drive carefully.");
//     }
//     if (current.uv > 8) {
//          addAlert("critical", `Extreme UV Index (${current.uv}). Avoid direct sunlight.`);
//     } else if (current.uv > 5) {
//          addAlert("warning", `High UV Index (${current.uv}). Wear sunscreen.`);
//     }

//     return alerts;
//   };

//   const alerts = generateAlerts();

//   // If everything is fine, don't show the component at all
//   if (alerts.length === 0) return null;

//   return (
//     <Card className="border-red-100 bg-red-50/50 shadow-sm animate-in slide-in-from-top-2 mb-6">
//       <CardHeader className="pb-2 flex flex-row items-center justify-between">
//         <div className="flex items-center gap-2">
//             <div className="relative">
//                 <Bell className="w-5 h-5 text-red-600 animate-pulse" />
//                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//                 </span>
//             </div>
//             <CardTitle className="text-base font-bold text-red-700">Weather Alerts</CardTitle>
//         </div>
//         <Badge variant="outline" className="bg-white text-red-600 border-red-200">
//             {alerts.length} Active
//         </Badge>
//       </CardHeader>
      
//       <CardContent>
//         <ScrollArea className="h-full max-h-[150px] pr-4">
//             <div className="space-y-3">
//                 {alerts.map((alert) => (
//                     <div 
//                         key={alert.id} 
//                         className={`
//                             relative p-3 rounded-lg border flex gap-3 items-start
//                             ${alert.severity === 'critical' ? 'bg-white border-red-200 shadow-sm' : 'bg-red-50/50 border-red-100'}
//                         `}
//                     >
//                         <AlertCircle className={`w-5 h-5 mt-0.5 shrink-0 ${alert.severity === 'critical' ? 'text-red-600' : 'text-orange-500'}`} />
//                         <div className="flex-1">
//                             <div className="flex justify-between items-center mb-1">
//                                 <span className={`text-xs font-bold uppercase ${alert.severity === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
//                                     {alert.severity} Alert
//                                 </span>
//                             </div>
//                             <p className="text-sm text-slate-700 font-medium leading-tight">
//                                 {alert.message}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { WeatherResponse, ForecastDay } from "@/types/weather";

export interface WeatherAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  time: string;
}

interface LiveAlertsProps {
    weather: WeatherResponse;
    forecast: ForecastDay[];
}

export function LiveAlerts({ weather, forecast }: LiveAlertsProps) {
  
  // Logic to generate alerts based on REAL data
  const generateAlerts = (): WeatherAlert[] => {
    const alerts: WeatherAlert[] = [];
    const current = weather.current;
    const today = forecast[0]?.day;

    const addAlert = (severity: WeatherAlert['severity'], message: string) => {
        alerts.push({
            id: message.replace(/\s+/g, '-').toLowerCase(),
            severity,
            message,
            time: "Current Condition" 
        });
    };

    // --- 1. TEMPERATURE RULES ---
    if (current.temp_c > 40) {
        addAlert("critical", `Extreme heat warning (${Math.round(current.temp_c)}°C). Stay hydrated.`);
    } else if (current.temp_c > 35) {
        addAlert("warning", `High temperature detected (${Math.round(current.temp_c)}°C).`);
    } else if (current.temp_c < 0) {
        addAlert("critical", `Freezing conditions detected (${Math.round(current.temp_c)}°C).`);
    } else if (current.temp_c < 10) {
        addAlert("info", `Low temperature advisory. Dress warmly.`);
    }

    // --- 2. WIND RULES ---
    if (current.wind_kph > 60) {
         addAlert("critical", `Dangerous wind speeds of ${current.wind_kph} km/h.`);
    } else if (current.wind_kph > 30) {
         addAlert("warning", `Strong winds detected (${current.wind_kph} km/h).`);
    }

    // --- 3. RAIN/SNOW RULES ---
    if (current.precip_mm > 5) {
         addAlert("warning", "Heavy rain detected.");
    } else if (current.precip_mm > 0.5) {
         addAlert("info", "Light rain occurring.");
    }

    // --- 4. FORECAST RULES ---
    if (today) {
        if (today.daily_chance_of_rain > 70 && current.precip_mm === 0) {
             addAlert("info", `High chance of rain (${today.daily_chance_of_rain}%) expected later.`);
        }
        if (today.daily_chance_of_snow > 50) {
             addAlert("warning", "Snowfall expected today.");
        }
    }

    // --- 5. VISIBILITY / UV RULES ---
    if (current.vis_km < 1) {
         addAlert("warning", "Very low visibility (<1km). Drive carefully.");
    }
    if (current.uv > 8) {
         addAlert("critical", `Extreme UV Index (${current.uv}). Avoid direct sunlight.`);
    } else if (current.uv > 5) {
         addAlert("warning", `High UV Index (${current.uv}). Wear sunscreen.`);
    }

    return alerts;
  };

  const alerts = generateAlerts();

  if (alerts.length === 0) return null;

  return (
    // Updated Card Style: White Glassmorphism with Red Border
    <Card className="border-red-200 shadow-xl bg-white/80 backdrop-blur-md animate-in slide-in-from-top-4 duration-500 mb-6 overflow-hidden">
      
      {/* Header with subtle red gradient background */}
      <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between bg-red-50/50 border-b border-red-100">
        <div className="flex items-center gap-2.5">
            <div className="relative">
                <Bell className="w-5 h-5 text-red-600 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </div>
            <CardTitle className="text-base font-bold text-red-700 tracking-tight">
                Weather Alerts
            </CardTitle>
        </div>
        <Badge variant="outline" className="bg-white text-red-600 border-red-200 shadow-sm">
            {alerts.length} Active
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ScrollArea className="h-full max-h-[200px] w-full">
            <div className="flex flex-col gap-0 divide-y divide-red-50">
                {alerts.map((alert) => (
                    <div 
                        key={alert.id} 
                        className={`
                            relative p-4 flex gap-4 items-start hover:bg-red-50/30 transition-colors
                            ${alert.severity === 'critical' ? 'bg-red-50/60' : ''}
                        `}
                    >
                        {/* Icon Box */}
                        <div className={`
                            p-2 rounded-full shrink-0 mt-0.5
                            ${alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}
                        `}>
                            <AlertCircle className="w-4 h-4" />
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                                <span className={`
                                    text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                                    ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                                `}>
                                    {alert.severity}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                {alert.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
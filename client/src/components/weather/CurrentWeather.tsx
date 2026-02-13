
import { Card, CardContent } from "@/components/ui/card";
import { WeatherResponse, WeatherUnit } from "@/types/weather";
import { Droplets, Wind, Eye, ThermometerSun, Sun } from "lucide-react";

interface CurrentWeatherProps {
    data: WeatherResponse;
    unit: WeatherUnit;
}

// --- Helper: Dynamic Card Gradients ---
const getCardGradient = (code: number, isDay: number): string => {
    const isNight = isDay === 0;

    // 1. Thunderstorm / Rain
    if ([1087, 1273, 1276, 1279, 1282, 1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
        return isNight 
            ? "from-slate-900 via-slate-800 to-indigo-900" 
            : "from-slate-600 via-slate-500 to-blue-600";
    }

    // 2. Snow / Ice
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
        return isNight 
            ? "from-blue-950 via-slate-900 to-slate-800"
            : "from-blue-500 via-blue-400 to-indigo-400";
    }

    // 3. Cloudy / Overcast
    if ([1003, 1006, 1009].includes(code)) {
        return isNight 
            ? "from-slate-800 via-gray-800 to-slate-900" 
            : "from-slate-500 via-slate-400 to-blue-400";
    }

    // 4. Mist / Fog
    if ([1030, 1135, 1147].includes(code)) {
        return isNight 
            ? "from-gray-900 via-slate-800 to-gray-800" 
            : "from-slate-400 via-gray-400 to-slate-300";
    }

    // 5. Clear / Sunny (Default)
    return isNight 
        ? "from-indigo-950 via-purple-900 to-slate-900" // Starry Night
        : "from-blue-500 via-blue-400 to-sky-400"; // Sunny Day
};

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
    const { 
        temp_c, temp_f, 
        feelslike_c, feelslike_f, 
        humidity, 
        wind_kph, wind_mph, wind_dir,
        vis_km, vis_miles,
        uv
    } = data.current;

    const temp = unit === WeatherUnit.C ? Math.round(temp_c) : Math.round(temp_f);
    const feelsLike = unit === WeatherUnit.C ? Math.round(feelslike_c) : Math.round(feelslike_f);
    const windSpeed = unit === WeatherUnit.C ? `${wind_kph} km/h` : `${wind_mph} mph`;
    const visibility = unit === WeatherUnit.C ? `${vis_km} km` : `${vis_miles} miles`;

    const bgClass = getCardGradient(data.current.condition.code, data.current.is_day);
    
    // Determine if the UI should be in "Dark Mode" styling (Night or Storm)
    const isDark = data.current.is_day === 0 || 
                   [1087, 1273, 1276, 1279, 1282].includes(data.current.condition.code);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Main Hero Section */}
            <Card className={`overflow-hidden border-none shadow-xl bg-gradient-to-br ${bgClass} text-white relative transition-all duration-1000`}>
                <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center relative z-10">
                    
                    {/* Left: Text Info */}
                    <div className="space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                             <span className="text-lg font-medium tracking-wide flex items-center gap-1">
                                {data.location.name}, {data.location.country}
                             </span>
                        </div>
                        
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                             <h1 className="text-8xl font-bold tracking-tighter drop-shadow-md">
                                {temp}°
                             </h1>
                        </div>

                        <p className="text-2xl font-medium text-white/90 capitalize drop-shadow-sm">
                            {data.current.condition.text}
                        </p>
                        
                        <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium text-white mt-2 border border-white/10 shadow-sm">
                             <ThermometerSun className="w-4 h-4" /> 
                             Feels like {feelsLike}°
                        </div>
                    </div>

                    {/* Right: Big Icon with Glow */}
                    <div className="relative mt-6 md:mt-0 group">
                        <div className="absolute inset-0 bg-white/30 blur-[60px] rounded-full group-hover:bg-white/40 transition-all duration-500" />
                        <img 
                            src={data.current.condition.icon.replace("64x64", "128x128")} 
                            alt={data.current.condition.text} 
                            className="w-40 h-40 relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500" 
                        />
                    </div>
                </CardContent>

                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none mix-blend-overlay" />
            </Card>

            {/* 2. Secondary Metrics Grid (Bento Style) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <DetailCard 
                    icon={<Wind className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />}
                    title="Wind"
                    value={windSpeed}
                    subValue={`Direction: ${wind_dir}`}
                    isDark={isDark}
                />

                <DetailCard 
                    icon={<Droplets className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />}
                    title="Humidity"
                    value={`${humidity}%`}
                    subValue={humidity > 60 ? "High" : "Normal"}
                    isDark={isDark}
                />

                <DetailCard 
                    icon={<Eye className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-500'}`} />}
                    title="Visibility"
                    value={visibility}
                    subValue={vis_km >= 10 ? "Clear View" : "Haze/Fog"}
                    isDark={isDark}
                />

                <DetailCard 
                    icon={<Sun className={`w-5 h-5 ${isDark ? 'text-orange-300' : 'text-orange-500'}`} />} 
                    title="UV Index"
                    value={uv.toString()}
                    subValue={getUVDescription(uv)}
                    isDark={isDark}
                />
            </div>
        </div>
    );
}

// --- Helper Component: Theme-Aware Detail Card ---
function DetailCard({ 
    icon, 
    title, 
    value, 
    subValue, 
    isDark 
}: { 
    icon: React.ReactNode, 
    title: string, 
    value: string, 
    subValue: string, 
    isDark: boolean 
}) {
    return (
        <Card className={`
            border-none shadow-sm transition-all duration-300 group backdrop-blur-md
            ${isDark 
                ? "bg-black/25 hover:bg-black/40 text-white"  // Dark Mode Styles
                : "bg-white/60 hover:bg-white text-slate-800" // Light Mode Styles
            }
        `}>
            <CardContent className="p-4 flex flex-col gap-3">
                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? "text-white/70" : "text-slate-500"}`}>
                    {icon}
                    {title}
                </div>
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className={`text-xs font-medium ${isDark ? "text-white/50" : "text-slate-400"}`}>
                        {subValue}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Helper for UV
function getUVDescription(uv: number) {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    return "Very High";
}
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { WeatherResponse } from "@/types/weather";
// import { Droplets, Wind} from "lucide-react";

// interface CurrentWeatherProps {
//     data: WeatherResponse; // We will properly type this once the UI is set
//     unit: "C" | "F";
// }

// export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
//     return (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             {/* Main Temperature Card */}
//             <Card className="col-span-full lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-100 text-white border-none shadow-xl">
//                 <CardContent className="pt-6 flex justify-between items-center">
//                     <div>
//                         <h2 className="text-3xl font-bold">{data.location.name}</h2>
//                         <p className="text-blue-100 font-medium">{data.current.condition.text}</p>
//                         <div className="text-7xl font-extrabold mt-4 ">

//                             {unit=='C'?Math.round(data.current.temp_c):Math.round(data.current.temp_f)}°
                        
//                         </div>
//                     </div>
//                     <img src={data.current.condition.icon} alt="icon" className="w-32 h-32" />
                
//                 </CardContent>
//             </Card>

//             {/* Wind Card */}
//             <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                     <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
//                     <Wind className="w-4 h-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                     <div className="text-2xl font-bold">{data.current.wind_kph} km/h</div>
//                 </CardContent>
//             </Card>

//             {/* Humidity Card */}
//             <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                     <CardTitle className="text-sm font-medium">Humidity</CardTitle>
//                     <Droplets className="w-4 h-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                     <div className="text-2xl font-bold">{data.current.humidity}%</div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


import { Card, CardContent } from "@/components/ui/card";
import { WeatherResponse } from "@/types/weather";
import { Droplets, Wind, Eye, ThermometerSun, Sun } from "lucide-react";

interface CurrentWeatherProps {
    data: WeatherResponse;
    unit: "C" | "F";
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
    const { 
        temp_c, temp_f, 
        feelslike_c, feelslike_f, 
        humidity, 
        wind_kph, wind_mph, wind_dir,
        vis_km, vis_miles,
        // pressure_mb,
        uv
    } = data.current;

    const temp = unit === 'C' ? Math.round(temp_c) : Math.round(temp_f);
    const feelsLike = unit === 'C' ? Math.round(feelslike_c) : Math.round(feelslike_f);
    const windSpeed = unit === 'C' ? `${wind_kph} km/h` : `${wind_mph} mph`;
    const visibility = unit === 'C' ? `${vis_km} km` : `${vis_miles} miles`;

    return (
        <div className="space-y-4">
            {/* 1. Main Hero Section */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white relative">
                <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center relative z-10">
                    
                    {/* Left: Text Info */}
                    <div className="space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                             <span className="text-lg font-medium tracking-wide">
                                {data.location.name}, {data.location.country}
                             </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                             <h1 className="text-8xl font-bold tracking-tighter">
                                {temp}°
                             </h1>
                        </div>

                        <p className="text-2xl font-medium text-blue-50 capitalize">
                            {data.current.condition.text}
                        </p>
                        
                        {/* Feels Like Badge */}
                        <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium text-white mt-2">
                             <ThermometerSun className="w-4 h-4" /> 
                             Feels like {feelsLike}°
                        </div>
                    </div>

                    {/* Right: Big Icon with Glow */}
                    <div className="relative mt-6 md:mt-0">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-white/30 blur-[60px] rounded-full" />
                        <img 
                            src={data.current.condition.icon.replace("64x64", "128x128")} // Trick to get higher res icon if available
                            alt={data.current.condition.text} 
                            className="w-40 h-40 relative z-10 drop-shadow-2xl" 
                        />
                    </div>
                </CardContent>

                {/* Decorative Pattern Background */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-900/20 rounded-full blur-2xl pointer-events-none" />
            </Card>

            {/* 2. Secondary Metrics Grid (Bento Style) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Wind */}
                <DetailCard 
                    icon={<Wind className="w-5 h-5 text-blue-500" />}
                    title="Wind"
                    value={windSpeed}
                    subValue={`Direction: ${wind_dir}`}
                />

                {/* Humidity */}
                <DetailCard 
                    icon={<Droplets className="w-5 h-5 text-blue-500" />}
                    title="Humidity"
                    value={`${humidity}%`}
                    subValue={humidity > 60 ? "High" : "Normal"}
                />

                {/* Visibility */}
                <DetailCard 
                    icon={<Eye className="w-5 h-5 text-blue-500" />}
                    title="Visibility"
                    value={visibility}
                    subValue={vis_km >= 10 ? "Clear View" : "Haze/Fog"}
                />

                {/* UV Index */}
                <DetailCard 
                    icon={<Sun className="w-5 h-5 text-orange-500" />} // Orange for UV
                    title="UV Index"
                    value={uv.toString()}
                    subValue={getUVDescription(uv)}
                />
            </div>
        </div>
    );
}

// Helper Component for the small cards
function DetailCard({ icon, title, value, subValue }: { icon: React.ReactNode, title: string, value: string, subValue: string }) {
    return (
        <Card className="border-none shadow-sm bg-white/60 hover:bg-white transition-colors">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    {icon}
                    {title}
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-800">{value}</div>
                    <div className="text-xs text-slate-400 font-medium">{subValue}</div>
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
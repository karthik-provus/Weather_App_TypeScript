import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse } from "@/types/weather";
import { Droplets, Wind} from "lucide-react";

interface CurrentWeatherProps {
    data: WeatherResponse; // We will properly type this once the UI is set
    unit: "C" | "F";
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Main Temperature Card */}
            <Card className="col-span-full lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-100 text-white border-none shadow-xl">
                <CardContent className="pt-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">{data.location.name}</h2>
                        <p className="text-blue-100 font-medium">{data.current.condition.text}</p>
                        <div className="text-7xl font-extrabold mt-4 ">

                            {unit=='C'?Math.round(data.current.temp_c):Math.round(data.current.temp_f)}°
                        
                        </div>
                    </div>
                    <img src={data.current.condition.icon} alt="icon" className="w-32 h-32" />
                
                </CardContent>
            </Card>

            {/* Wind Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
                    <Wind className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.current.wind_kph} km/h</div>
                </CardContent>
            </Card>

            {/* Humidity Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                    <Droplets className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.current.humidity}%</div>
                </CardContent>
            </Card>
        </div>
    );
}
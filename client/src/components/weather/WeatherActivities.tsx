import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse } from "@/types/weather";
import { Car, Dumbbell, Leaf, Tent } from "lucide-react"; // Removed unused imports

interface WeatherActivitiesProps {
  weather: WeatherResponse;
  isDay: boolean; // <--- New Prop
}

export function WeatherActivities({ weather, isDay }: WeatherActivitiesProps) {
  const { temp_c, wind_kph, precip_mm, vis_km, humidity, uv } = weather.current;
  const isDark = !isDay;

  // Helper to calculate score (0-10) and get a label
  const getActivityStatus = (activityId: string) => {
    let score = 10;
    let reason = "Perfect conditions";

    switch (activityId) {
      case "running":
        if (temp_c > 30) { score -= 4; reason = "Too hot"; }
        if (temp_c < 5) { score -= 3; reason = "Chilly"; }
        if (precip_mm > 0.5) { score -= 5; reason = "Raining"; }
        if (humidity > 80) { score -= 2; reason = "Humid"; }
        break;

      case "driving":
        if (vis_km < 5) { score -= 5; reason = "Low Visibility"; }
        if (precip_mm > 2) { score -= 3; reason = "Wet Roads"; }
        if (wind_kph > 50) { score -= 4; reason = "High Winds"; }
        break;

      case "picnic":
        if (precip_mm > 0) { score = 0; reason = "Raining"; }
        if (temp_c < 15) { score -= 4; reason = "Too Cold"; }
        if (wind_kph > 20) { score -= 3; reason = "Windy"; }
        break;

      case "hiking":
        if (precip_mm > 0) { score -= 6; reason = "Muddy/Wet"; }
        if (uv > 7) { score -= 2; reason = "High UV"; }
        if (vis_km < 9) { score -= 2; reason = "No Views"; }
        break;
    }

    score = Math.max(0, Math.min(10, score));
    
    let label = "Great";
    // Define colors based on score (Red/Orange/Green)
    // We return generic color names, and handle them in JSX based on isDark
    let colorType: 'green' | 'orange' | 'red' = 'green';
    
    if (score < 4) { label = "Poor"; colorType = 'red'; }
    else if (score < 7) { label = "Fair"; colorType = 'orange'; }

    return { score, label, reason, colorType };
  };

  const activities = [
    { id: "running", name: "Running", icon: <Dumbbell className="w-5 h-5" /> },
    { id: "driving", name: "Driving", icon: <Car className="w-5 h-5" /> },
    { id: "picnic", name: "Picnic/BBQ", icon: <Tent className="w-5 h-5" /> },
    { id: "hiking", name: "Hiking", icon: <Leaf className="w-5 h-5" /> },
  ];

  return (
    <Card className={`
        border-none shadow-xl backdrop-blur-md transition-all duration-500
        ${isDark ? 'bg-black/25 text-white' : 'bg-white/80 text-slate-800'}
    `}>
      <CardHeader>
        <CardTitle className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Lifestyle Index
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {activities.map((activity) => {
            const status = getActivityStatus(activity.id);
            
            // Dynamic Colors for the Icons/Badges
            // If Dark Mode: Use lighter, pastel versions (e.g., bg-green-500/20 text-green-300)
            // If Light Mode: Use standard versions (e.g., bg-green-100 text-green-700)
            
            const colorMap = {
                green: isDark ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700",
                orange: isDark ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700",
                red: isDark ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-700",
            };

            const progressBarColor = {
                green: "bg-green-500",
                orange: "bg-orange-500",
                red: "bg-red-500",
            };

            const cardBg = isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/50 border-slate-100 hover:bg-white";

            return (
              <div key={activity.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${cardBg}`}>
                <div className={`p-2 rounded-full ${colorMap[status.colorType]}`}>
                  {activity.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                        {activity.name}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorMap[status.colorType]}`}>
                      {status.score}/10
                    </span>
                  </div>
                  
                  <div className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                     {status.label} • {status.reason}
                  </div>
                  
                  {/* Mini Progress Bar */}
                  <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <div 
                        className={`h-full rounded-full ${progressBarColor[status.colorType]}`} 
                        style={{ width: `${status.score * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
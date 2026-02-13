import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse } from "@/types/weather";
import { Sparkles, Loader2, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { AIService } from "@/services/aiService"; // Import your new service

interface WeatherAISummaryProps {
  weather: WeatherResponse;
  isDay: boolean;
}

export function WeatherAISummary({ weather, isDay }: WeatherAISummaryProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDark = !isDay;

  useEffect(() => {
    let isMounted = true;

    const fetchAI = async () => {
      setIsLoading(true);
      
      // Call the Real Gemini API
      const result = await AIService.generateWeatherSummary(weather);
      
      if (isMounted) {
        setSummary(result);
        setIsLoading(false);
      }
    };

    fetchAI();

    return () => { isMounted = false; };
  }, [weather.location.name]); // Re-run only when location changes

  return (
    <Card className={`
        border-none shadow-xl backdrop-blur-md transition-all duration-500 h-full min-h-[140px]
        ${isDark ? 'bg-black/25 text-white' : 'bg-white/80 text-slate-800'}
    `}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {isLoading ? (
            <Loader2 className={`w-5 h-5 animate-spin ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
        ) : (
            <Bot className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-purple-600'}`} />
        )}
        
        <CardTitle className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Gemini Insights
            {!isLoading && <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
            // Loading Skeleton
            <div className="space-y-2 animate-pulse">
                <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                <div className={`h-4 w-1/2 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
            </div>
        ) : (
            // The AI Text
            <p className={`text-lg font-medium leading-relaxed animate-in fade-in duration-700 ${isDark ? 'text-blue-100' : 'text-slate-700'}`}>
                "{summary}"
            </p>
        )}
      </CardContent>
    </Card>
  );
}

import { CitySuggestion } from "@/services/weatherService";
import { Clock, X } from "lucide-react";

interface RecentSearchesProps {
  history: CitySuggestion[];
  onSelect: (city: CitySuggestion) => void;
  onClear: (id: number) => void;
  isDay: boolean; 
}

export function RecentSearches({ history, onSelect, onClear, isDay }: RecentSearchesProps) {
  if (history.length === 0) return null;

  const isDark = !isDay;

  return (
    <div className="w-full max-w-md mx-auto mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {history.map((city) => (
          <button
            key={city.id}
            className={`
                group flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border cursor-pointer transition-all duration-300 backdrop-blur-md
                ${isDark 
                    ? "bg-black/20 border-white/10 hover:bg-black/40 text-white" 
                    : "bg-white/30 border-white/40 hover:bg-white/60 text-slate-700"
                }
            `}
            onClick={() => onSelect(city)}
          >
             <Clock className={`w-3 h-3 transition-colors ${isDark ? "text-white/70 group-hover:text-blue-300" : "text-slate-600 group-hover:text-blue-600"}`} />
             
             <span className={`text-sm font-medium ${isDark ? "text-white group-hover:text-blue-100" : "text-slate-800 group-hover:text-slate-900"}`}>
                {city.name}
             </span>
             
             {/* Delete Button (Visible on Hover) */}
             <div
               role="button"
               className={`
                   ml-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200
                   ${isDark 
                       ? "hover:bg-white/20 text-white/50 hover:text-red-300" 
                       : "hover:bg-red-100 text-slate-400 hover:text-red-500"
                   }
               `}
               onClick={(e) => {
                 e.stopPropagation(); // Stop the click from triggering the search
                 onClear(city.id);
               }}
               title="Remove from history"
             >
               <X className="w-3 h-3" />
             </div>
          </button>
        ))}
      </div>
    </div>
  );
}
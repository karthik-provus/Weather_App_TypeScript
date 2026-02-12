import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WeatherService, CitySuggestion } from "@/services/weatherService";

interface SearchBarProps {
  onCitySelect: (city: CitySuggestion) => void;
}

export function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await WeatherService.searchCities(query);
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error("Failed to fetch suggestions");
      }
    };

    const timer = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search city (e.g. Pune)..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
        />
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((city) => (
            <button
              key={city.id}
              className="w-full px-4 py-2 text-left hover:bg-slate-100 transition-colors border-b last:border-0"
              onClick={() => {
                onCitySelect(city);
                setQuery(""); // Clear search after selection
                setIsOpen(false);
              }}
            >
              <div className="font-medium text-sm">{city.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
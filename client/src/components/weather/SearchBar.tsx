

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WeatherService, CitySuggestion } from "@/services/weatherService";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
    onCitySelect: (city: CitySuggestion) => void;
    onLocationClick: () => void;
    hideLocationButton?: boolean;
}

export function SearchBar({ onCitySelect, onLocationClick, hideLocationButton = false }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // We use a ref to track if we are clicking inside the component
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close dropdown if clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await WeatherService.searchCities(query);
                setSuggestions(data);
                setIsOpen(data.length > 0);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
            <div className="flex gap-3">
                
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300">
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </div>

                    <Input
                        placeholder="Search city..."
                        className="pl-12 h-12 rounded-2xl border-none shadow-xl bg-white/80 backdrop-blur-md text-lg text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-all duration-300"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) setIsOpen(true);
                        }}
                    />

                    {isOpen && suggestions.length > 0 && (
                        <Card className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                {suggestions.map((city) => (
                                    <button
                                        key={city.id}
                                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0 flex items-center gap-3 group"
                                        // The FIX: Use onMouseDown to trigger before onBlur
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input blur
                                            onCitySelect(city);
                                            setQuery(""); 
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="p-2 bg-slate-100 rounded-full text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                                            <Map className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-700">{city.name}</div>
                                            <div className="text-xs text-slate-400">
                                                {city.region ? `${city.region}, ` : ''}{city.country}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {!hideLocationButton && (
                    <Button
                        size="icon"
                        onClick={onLocationClick}
                        title="Use current location"
                        className="h-12 w-12 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md hover:bg-white text-blue-600 hover:text-blue-700 border-none transition-all duration-300 hover:scale-105"
                    >
                        <MapPin className="h-5 w-5" />
                    </Button>
                )}

            </div>
        </div>
    );
}
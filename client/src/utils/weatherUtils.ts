// src/utils/weatherUtils.ts

export function getWeatherBackground(conditionText: string, isDay: number): string {
  const condition = conditionText.toLowerCase();

  // --- NIGHT TIME (is_day === 0) ---
  if (isDay === 0) {
    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("mist")) {
      return "bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white"; // Rainy Night
    }
    if (condition.includes("cloud") || condition.includes("overcast")) {
      return "bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white"; // Cloudy Night
    }
    if (condition.includes("clear")) {
      return "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white"; // Clear Night
    }
    return "bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white"; // Default Night
  }

  // --- DAY TIME (is_day === 1) ---
  
  // 1. Rain / Storm
  if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("storm") || condition.includes("thunder")) {
    return "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-slate-900"; 
  }

  // 2. Snow / Ice
  if (condition.includes("snow") || condition.includes("ice") || condition.includes("blizzard")) {
    return "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-800";
  }

  // 3. Cloudy / Overcast / Mist
  if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("mist") || condition.includes("fog")) {
    return "bg-gradient-to-br from-gray-200 via-slate-200 to-gray-300 text-slate-800";
  }

  // 4. Sunny / Clear (Default Day)
  return "bg-gradient-to-br from-sky-400 via-blue-100 to-white text-slate-800";
}
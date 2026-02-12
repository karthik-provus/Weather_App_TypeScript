// Define the 6 main visual themes
type WeatherTheme = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunder' | 'mist';

// Helper to map API codes to a theme
function getThemeByCode(code: number): WeatherTheme {
  // 1. Thunderstorm (Prioritize this for drama)
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'thunder';

  // 2. Snow / Ice / Sleet
  if ([
    1066, 1069, 1072, 1114, 1117, 
    1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 
    1249, 1252, 1255, 1258, 1261, 1264
  ].includes(code)) return 'snow';

  // 3. Rain / Drizzle
  if ([
    1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 
    1240, 1243, 1246
  ].includes(code)) return 'rain';

  // 4. Fog / Mist
  if ([1030, 1135, 1147].includes(code)) return 'mist';

  // 5. Clouds
  if ([1003, 1006, 1009].includes(code)) return 'clouds';

  // Default to clear
  return 'clear';
}

// The Main Function
export function getBackgroundGradient(code: number, isDay: number): string {
  const theme = getThemeByCode(code);
  const isNight = isDay === 0;

  // Define gradients for Day vs Night
  // We use "via-" to create rich, deep color transitions
  
  if (isNight) {
    switch (theme) {
      case 'clear':
        return 'from-slate-900 via-purple-950 to-slate-900'; // Deep starry night
      case 'clouds':
        return 'from-gray-900 via-slate-800 to-gray-900'; // Dark overcast
      case 'rain':
        return 'from-indigo-950 via-slate-900 to-slate-950'; // Rainy night
      case 'snow':
        return 'from-slate-900 via-slate-800 to-blue-950'; // Snowy night
      case 'thunder':
        return 'from-slate-950 via-indigo-950 to-black'; // Stormy night
      case 'mist':
        return 'from-slate-900 via-gray-900 to-slate-800'; // Foggy night
    }
  } else {
    // Daytime Themes
    switch (theme) {
      case 'clear':
        return 'from-blue-400 via-blue-300 to-blue-100'; // Bright sunny sky
      case 'clouds':
        return 'from-slate-400 via-slate-300 to-slate-200'; // Cloudy day
      case 'rain':
        return 'from-slate-600 via-slate-500 to-slate-400'; // Gloomy rain
      case 'snow':
        return 'from-blue-100 via-white to-blue-50'; // Bright snow
      case 'thunder':
        return 'from-slate-700 via-indigo-900 to-slate-800'; // Dark storm clouds
      case 'mist':
        return 'from-slate-300 via-gray-300 to-slate-200'; // Hazy day
    }
  }
  
  // Fallback
  return 'from-sky-50 via-white to-slate-100';
}
"use client";

import { Button } from "@/components/ui/button";
import { Cloud, SunMoon, SunSnow, Search, Wind, Droplets, MapPin, Loader, LoaderCircle } from "lucide-react";
import { useState } from "react";

// Weather API Response Type
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
}

const WeatherPage = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setWeather(null); // Reset before fetching
    try {
      setError("");
      // Using units=metric for Celsius
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=2de3f53b454da51ffbe7195454b05cd5&units=metric`
      );
      if (!res.ok) throw new Error("City not found or API error.");
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err) {
      setError("We couldn't find weather data for that city. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 lg:p-8 transition-colors duration-300">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] border border-gray-100 dark:border-gray-800 p-8 lg:p-12 transition-colors duration-300">
        
        {/* Left Section - Search & Context */}
        <div className="flex flex-col justify-center h-full space-y-8 pr-0 lg:pr-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 transition-colors">
              Real-Time <span className="text-blue-600 dark:text-blue-400">Weather</span> Insights
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed transition-colors">
              Enter any city worldwide to get accurate, up-to-the-minute weather conditions, temperatures, and forecasts.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Lagos, London, Tokyo..."
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-900 transition-all text-lg font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <Button
              onClick={fetchWeather}
              disabled={loading}
              className="px-8 py-4 h-auto rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {/* Visual embellishments */}
          <div className="hidden lg:flex items-center space-x-6 text-gray-300 dark:text-gray-800 pointer-events-none mt-12 opacity-50 transition-colors">
             <SunMoon className="w-16 h-16 animate-pulse" />
             <Cloud className="w-20 h-20 animate-bounce delay-100" />
             <SunSnow className="w-16 h-16 animate-pulse delay-200" />
          </div>
        </div>

        {/* Right Section - Results Display */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-8 lg:p-12 text-white h-full flex flex-col justify-center relative shadow-inner w-full min-h-[400px] transition-colors duration-300">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
              <Cloud className="w-24 h-24 text-blue-200 dark:text-blue-300" />
              <p className="text-xl font-medium text-blue-100 dark:text-blue-200">Fetching local weather...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-white/10 dark:bg-black/20 rounded-full mb-2">
                <Search className="w-10 h-10 text-red-300 dark:text-red-400" />
              </div>
              <p className="text-2xl font-bold text-white">{error}</p>
              <p className="text-blue-200 dark:text-blue-300">Please check the spelling and try again.</p>
            </div>
          ) : weather ? (
            <div className="flex flex-col h-full justify-between animate-in fade-in zoom-in duration-500">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold flex items-center gap-3 text-white">
                    {weather.name}
                    <MapPin className="w-6 h-6 text-blue-300 dark:text-blue-400" />
                  </h2>
                  <p className="text-blue-200 dark:text-blue-300 text-xl capitalize mt-2 font-medium">
                    {weather.weather[0]?.description}
                  </p>
                </div>
                {/* Dynamically choosing an icon based on words (fallback logic) */}
                {weather.weather[0]?.main?.toLowerCase().includes('cloud') ? (
                  <Cloud className="w-24 h-24 text-white opacity-90 drop-shadow-lg" />
                ) : weather.weather[0]?.main?.toLowerCase().includes('rain') ? (
                   <Droplets className="w-24 h-24 text-white opacity-90 drop-shadow-lg" />
                ) : (
                  <SunMoon className="w-24 h-24 text-white opacity-90 drop-shadow-lg" />
                )}
              </div>

              <div className="mb-10 text-white">
                <div className="text-7xl lg:text-9xl font-black tracking-tighter drop-shadow-md">
                  {Math.round(weather.main.temp)}°
                </div>
                <p className="text-blue-200 dark:text-blue-300 text-lg mt-2 font-medium">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/20 dark:border-white/10 pt-8">
                <div className="flex items-center space-x-4 bg-white/10 dark:bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <Wind className="w-8 h-8 text-blue-200 dark:text-blue-300" />
                  <div>
                    <p className="text-blue-200 dark:text-blue-300 text-sm font-medium">Wind</p>
                    <p className="text-xl font-bold text-white">{weather.wind.speed} m/s</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-white/10 dark:bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <Droplets className="w-8 h-8 text-blue-200 dark:text-blue-300" />
                  <div>
                    <p className="text-blue-200 dark:text-blue-300 text-sm font-medium">Humidity</p>
                    <p className="text-xl font-bold text-white">{weather.main.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-6 h-full text-blue-200/60 dark:text-blue-300/40">
              <SunSnow className="w-32 h-32 opacity-50" />
              <p className="text-2xl font-medium">No city selected</p>
              <p className="text-lg">Start typing to see weather metrics</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
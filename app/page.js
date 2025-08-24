"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowSplash(false), 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  async function getWeather() {
    if (!city) return;
    setLoading(true);
    setWeather(null);
    setForecast([]);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData.list.slice(0, 5));
    } catch (error) {
      setWeather({ error: error.message });
    }

    setLoading(false);
    setTimeout(() => setShowSplash(false), 500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      {showSplash && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${loading ? "opacity-100" : "opacity-0"}`}
        >
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-white text-2xl font-bold">🌤 Weather App</h1>
          <p className="text-gray-300 mt-2 animate-pulse">Loading...</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center relative z-10">
        <h2 className="text-2xl font-bold mb-4">🌤 Weather App</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
          />
          <button
            onClick={getWeather}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {weather && !weather.error && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">{weather.name}</h3>
            <p className="text-gray-600">{weather.weather[0].description}</p>
            <p className="text-3xl font-bold">{weather.main.temp}°C</p>
          </div>
        )}
        {weather?.error && (
          <p className="mt-4 text-red-500">{weather.error}</p>
        )}

        {forecast.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            {forecast.map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-3 shadow text-center"
              >
                <p className="font-semibold">
                  {new Date(f.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <p className="text-gray-600">{f.weather[0].main}</p>
                <p className="font-bold">{f.main.temp}°C</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

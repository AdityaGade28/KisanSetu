import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Cloud, CloudLightning, Droplets, Wind, AlertTriangle, MapPin } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLocation, setMapLocation] = useState({ lat: 18.5204, lon: 73.8567, name: 'Pune Region, India' });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await api.get('/weather/forecast');
        setWeather(res.data);
      } catch (error) {
        toast.error('Failed to load weather forecast');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();

    // Fetch live GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapLocation({ 
            lat: position.coords.latitude, 
            lon: position.coords.longitude, 
            name: 'Live GPS Location' 
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kisan-green" />
      </div>
    );
  }

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="text-yellow-500" size={32} />;
      case 'Rainy':
        return <CloudRain className="text-blue-500" size={32} />;
      case 'Thunderstorm':
        return <CloudLightning className="text-purple-500" size={32} />;
      default:
        return <Cloud className="text-gray-400" size={32} />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CloudRain className="text-kisan-green" /> Real-Time Weather Dashboard
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">Get hyper-local meteorological forecasting and actionable insights custom-tailored for your agricultural planning.</p>
      </div>

      {weather && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Weather Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-gradient-to-br from-kisan-green to-kisan-green-dark text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[300px]">
            <div className="absolute top-0 right-0 p-8 opacity-10"><CloudRain size={220} /></div>
            <div className="relative z-10">
              <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 inline-block">Current Conditions</span>
              <div className="flex items-center gap-6 mt-4">
                <Sun size={64} className="text-yellow-300 animate-spin-slow" />
                <div>
                  <h2 className="text-6xl font-extrabold">{weather.current.temp}°C</h2>
                  <p className="text-lg text-kisan-green-light mt-1 font-medium">{weather.current.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Droplets className="text-kisan-green-light" size={20} />
                  <div>
                    <p className="text-xs text-kisan-green-light">Humidity</p>
                    <p className="font-semibold">{weather.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="text-kisan-green-light" size={20} />
                  <div>
                    <p className="text-xs text-kisan-green-light">Wind Speed</p>
                    <p className="font-semibold">{weather.current.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="text-kisan-green-light" size={20} />
                  <div>
                    <p className="text-xs text-kisan-green-light">Rainfall</p>
                    <p className="font-semibold">{weather.current.rainfall} mm</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sowing / Farming Alerts Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm uppercase tracking-wider mb-6">
                <AlertTriangle size={18} />
                <span>Agricultural Advisories</span>
              </div>

              <div className="space-y-4">
                {weather.agriculturalInsights.map((insight, idx) => (
                  <div key={idx} className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 p-4 rounded-xl flex gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center gap-2 text-kisan-green dark:text-kisan-green-light text-sm font-semibold">
              <AlertTriangle className="animate-pulse" size={16} />
              <span>Sowing Window: ACTIVE</span>
            </div>
          </motion.div>

          {/* Weather Radar Map Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 }} 
            className="lg:col-span-3 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin size={20} className="text-kisan-green" /> 
                  Interactive Weather & Precipitation Radar Map
                </h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  Track real-time precipitation, wind velocity, temperature, and cloud formations over your region.
                </p>
              </div>
              <div className="bg-kisan-green/5 dark:bg-kisan-green/10 border border-kisan-green/15 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-kisan-green dark:text-kisan-green-light w-fit">
                <span className="w-2 h-2 bg-kisan-green rounded-full animate-pulse" />
                <span>Monitoring Center: {mapLocation.name}</span>
              </div>
            </div>

            <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-gray-100 dark:border-zinc-800/80 bg-gray-50 h-[450px]">
              <iframe 
                src={`https://embed.windy.com/embed2.html?lat=${mapLocation.lat}&lon=${mapLocation.lon}&zoom=7&level=surface&overlay=rain&product=ecmwf&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=${mapLocation.lat}&detailLon=${mapLocation.lon}&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
                className="w-full h-full border-none"
                title="Real-Time Weather Radar Map"
                allowFullScreen
              />
            </div>
          </motion.div>

          {/* 7-Day Forecast */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">7-Day Meteorological Outlook</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {weather.forecast.map((day, idx) => (
                <div key={idx} className="bg-gray-50/50 dark:bg-zinc-950/40 hover:bg-kisan-green/5 dark:hover:bg-kisan-green/10 border border-gray-100 dark:border-zinc-800 hover:border-kisan-green/10 p-5 rounded-2xl flex flex-col items-center justify-between text-center transition-all">
                  <span className="text-sm font-semibold text-gray-550 dark:text-zinc-450">{day.day}</span>
                  <div className="my-4">{getWeatherIcon(day.condition)}</div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{day.temp}°C</span>
                  <span className="text-xs font-semibold text-kisan-green mt-1 bg-kisan-green/5 px-2.5 py-0.5 rounded-full">{day.condition}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;

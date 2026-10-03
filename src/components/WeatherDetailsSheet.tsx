import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeatherData, WeatherConditionType } from '../types/weather';
import { X, Wind, Droplets, Compass, Sun, Sunrise, Sunset, Eye, Gauge, RefreshCw, Sparkles, CloudRain, Snowflake, Zap, CloudFog, CloudSun } from 'lucide-react';

interface WeatherDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherData;
  tempUnit: 'celsius' | 'fahrenheit';
  onRefreshWeather: () => void;
  isLoading: boolean;
  onOverrideCondition?: (condition: WeatherConditionType, label: string) => void;
}

export const WeatherDetailsSheet: React.FC<WeatherDetailsSheetProps> = ({
  isOpen,
  onClose,
  weatherData,
  tempUnit,
  onRefreshWeather,
  isLoading,
  onOverrideCondition,
}) => {
  const { current, location, hourly, daily, lastUpdated } = weatherData;

  const formatTemp = (celsius: number) => {
    return tempUnit === 'celsius'
      ? `${celsius}°C`
      : `${Math.round((celsius * 9) / 5 + 32)}°F`;
  };

  const conditionPresets: Array<{ id: WeatherConditionType; label: string; icon: React.ReactNode }> = [
    { id: 'clear_day', label: 'Clear Sky', icon: <Sun className="w-4 h-4 text-amber-300" /> },
    { id: 'partly_cloudy_day', label: 'Partly Cloudy', icon: <CloudSun className="w-4 h-4 text-amber-200" /> },
    { id: 'rain', label: 'Passing Rain', icon: <CloudRain className="w-4 h-4 text-sky-300" /> },
    { id: 'heavy_rain', label: 'Downpour', icon: <CloudRain className="w-4 h-4 text-blue-400 font-bold" /> },
    { id: 'thunderstorm', label: 'Thunderstorm', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: 'snow', label: 'Gentle Snow', icon: <Snowflake className="w-4 h-4 text-blue-100" /> },
    { id: 'blizzard', label: 'Blizzard', icon: <Snowflake className="w-4 h-4 text-cyan-200 font-bold" /> },
    { id: 'fog', label: 'Dense Fog', icon: <CloudFog className="w-4 h-4 text-slate-300" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="relative w-full max-w-xl max-h-[88vh] bg-slate-900/95 border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10"
          >
            {/* Header */}
            <div className="pt-3 pb-3 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  {location.name}, {location.country}
                </h3>
                <span className="text-xs text-white/50">Updated {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onRefreshWeather}
                  disabled={isLoading}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Refresh weather"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/10 text-white/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Primary Temperature Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-white/10">
                <div>
                  <div className="font-display text-5xl font-extrabold text-white">
                    {formatTemp(current.temperature)}
                  </div>
                  <div className="text-sm font-medium text-sky-200 mt-1">
                    {current.conditionLabel}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Feels like {formatTemp(current.apparentTemperature)}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-xs text-white/80">
                    Wind: <span className="font-semibold text-white">{current.windSpeed} km/h</span>
                  </div>
                  <div className="text-xs text-white/80">
                    Humidity: <span className="font-semibold text-white">{current.humidity}%</span>
                  </div>
                  <div className="text-xs text-white/80">
                    Precip: <span className="font-semibold text-white">{current.precipitation} mm</span>
                  </div>
                </div>
              </div>

              {/* Quick Weather Simulator Bar */}
              {onOverrideCondition && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2.5 block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Live Weather Preview</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {conditionPresets.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => onOverrideCondition(preset.id, preset.label)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          current.condition === preset.id
                            ? 'bg-sky-500/20 border-sky-400 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {preset.icon}
                        <span className="text-[11px] font-medium leading-tight">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hourly Forecast */}
              {hourly.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 block">
                    Next 12 Hours
                  </label>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
                    {hourly.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 w-16 p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-between text-center"
                      >
                        <span className="text-[10px] text-white/60 font-mono">
                          {h.time.includes('T') ? h.time.split('T')[1].substring(0, 5) : h.time}
                        </span>
                        <div className="my-1.5">
                          {h.condition.includes('rain') ? (
                            <CloudRain className="w-4 h-4 text-sky-300 mx-auto" />
                          ) : h.condition.includes('snow') ? (
                            <Snowflake className="w-4 h-4 text-blue-100 mx-auto" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-300 mx-auto" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-white">{formatTemp(h.temperature)}</span>
                        {h.precipitationProbability > 0 && (
                          <span className="text-[9px] text-sky-300 mt-1 font-mono">
                            {h.precipitationProbability}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5-Day Outlook */}
              {daily.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2.5 block">
                    5-Day Atmospheric Outlook
                  </label>
                  <div className="space-y-1.5">
                    {daily.map((d, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                      >
                        <span className="font-semibold text-white w-20">
                          {d.date.length > 5 ? d.date.substring(5) : d.date}
                        </span>
                        <div className="flex items-center gap-2 flex-1 justify-center">
                          {d.condition.includes('rain') ? (
                            <CloudRain className="w-4 h-4 text-sky-300" />
                          ) : d.condition.includes('snow') ? (
                            <Snowflake className="w-4 h-4 text-blue-100" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-300" />
                          )}
                          <span className="text-white/60 capitalize text-[11px] truncate max-w-[100px]">
                            {d.condition.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="font-bold text-white">{formatTemp(d.temperatureMax)}</span>
                          <span className="text-white/40">{formatTemp(d.temperatureMin)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Atmospheric Telemetry Grid */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 block">
                  Atmospheric Telemetry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/60 mb-1">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      <span>Wind Gusts</span>
                    </div>
                    <div className="font-bold text-white text-base font-mono">{current.windGusts} km/h</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/60 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Humidity</span>
                    </div>
                    <div className="font-bold text-white text-base font-mono">{current.humidity}%</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/60 mb-1">
                      <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pressure</span>
                    </div>
                    <div className="font-bold text-white text-base font-mono">{current.pressure} hPa</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 text-white/60 mb-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>UV Index</span>
                    </div>
                    <div className="font-bold text-white text-base font-mono">{current.uvIndex ?? 4} (Moderate)</div>
                  </div>
                </div>
              </div>

              {/* Sun Times */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-around text-xs">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-amber-300" />
                  <div>
                    <span className="text-[10px] text-white/50 block">Sunrise</span>
                    <span className="font-mono font-semibold text-white">{current.sunriseTime.substring(0, 5)}</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <Sunset className="w-4 h-4 text-orange-400" />
                  <div>
                    <span className="text-[10px] text-white/50 block">Sunset</span>
                    <span className="font-mono font-semibold text-white">{current.sunsetTime.substring(0, 5)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useEffect, useState } from 'react';
import { CurrentWeather, LocationData } from '../types/weather';
import { ClockStyleId, ThemePreset } from '../types/theme';
import { CloudSun, CloudRain, Sun, Cloud, Snowflake, Zap, CloudFog, Wind } from 'lucide-react';

interface AndroidClockWidgetProps {
  weather: CurrentWeather;
  location: LocationData;
  theme: ThemePreset;
  clockStyle: ClockStyleId;
  tempUnit: 'celsius' | 'fahrenheit';
  customTimeHour?: number;
  onOpenWeather: () => void;
  onOpenThemes: () => void;
}

export const AndroidClockWidget: React.FC<AndroidClockWidgetProps> = ({
  weather,
  location,
  theme,
  clockStyle,
  tempUnit,
  customTimeHour,
  onOpenWeather,
  onOpenThemes,
}) => {
  const [time, setTime] = useState<{ hours: string; minutes: string; seconds: string; dateStr: string }>({
    hours: '12',
    minutes: '00',
    seconds: '00',
    dateStr: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (customTimeHour !== undefined) {
        const h = Math.floor(customTimeHour);
        const m = Math.floor((customTimeHour - h) * 60);
        setTime({
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(now.getSeconds()).padStart(2, '0'),
          dateStr: now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        });
      } else {
        setTime({
          hours: String(now.getHours()).padStart(2, '0'),
          minutes: String(now.getMinutes()).padStart(2, '0'),
          seconds: String(now.getSeconds()).padStart(2, '0'),
          dateStr: now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [customTimeHour]);

  const displayTemp = tempUnit === 'celsius'
    ? `${weather.temperature}°C`
    : `${Math.round((weather.temperature * 9) / 5 + 32)}°F`;

  const getWeatherIcon = () => {
    const cond = weather.condition;
    if (cond.includes('thunder')) return <Zap className="w-4 h-4 text-amber-300 animate-pulse" />;
    if (cond.includes('rain')) return <CloudRain className="w-4 h-4 text-sky-300" />;
    if (cond.includes('snow') || cond === 'blizzard') return <Snowflake className="w-4 h-4 text-blue-100" />;
    if (cond.includes('fog')) return <CloudFog className="w-4 h-4 text-slate-300" />;
    if (cond === 'cloudy') return <Cloud className="w-4 h-4 text-slate-200" />;
    if (cond.includes('partly')) return <CloudSun className="w-4 h-4 text-amber-200" />;
    return <Sun className="w-4 h-4 text-amber-300" />;
  };

  return (
    <div className="flex flex-col items-center justify-center select-none z-20 pointer-events-auto">
      {/* 1. Clock Display by Style */}
      {clockStyle === 'material_two_line' && (
        <div
          onClick={onOpenThemes}
          role="button"
          tabIndex={0}
          className="flex flex-col items-center leading-[0.82] tracking-tighter cursor-pointer group"
          title="Tap to customize wallpaper and clock styles"
        >
          <span
            className="font-display font-extrabold text-[84px] drop-shadow-md transition-transform group-hover:scale-[1.02]"
            style={{ color: theme.colors.accentColor }}
          >
            {time.hours}
          </span>
          <span
            className="font-display font-extrabold text-[84px] text-white/95 drop-shadow-md transition-transform group-hover:scale-[1.02]"
          >
            {time.minutes}
          </span>
        </div>
      )}

      {clockStyle === 'digital_clean' && (
        <div
          onClick={onOpenThemes}
          role="button"
          tabIndex={0}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="font-display font-bold text-6xl text-white drop-shadow-lg tracking-tight">
            {time.hours}:{time.minutes}
          </span>
        </div>
      )}

      {clockStyle === 'retro_flip' && (
        <div
          onClick={onOpenThemes}
          role="button"
          tabIndex={0}
          className="flex items-center gap-2 cursor-pointer group my-2"
        >
          <div className="px-3 py-2 rounded-xl bg-black/60 border border-white/20 shadow-lg text-white font-mono text-4xl font-bold">
            {time.hours}
          </div>
          <span className="text-white/60 font-bold text-2xl animate-pulse">:</span>
          <div className="px-3 py-2 rounded-xl bg-black/60 border border-white/20 shadow-lg text-white font-mono text-4xl font-bold">
            {time.minutes}
          </div>
        </div>
      )}

      {clockStyle === 'minimal_stacked' && (
        <div
          onClick={onOpenThemes}
          role="button"
          tabIndex={0}
          className="text-center cursor-pointer group my-1"
        >
          <div className="font-display font-light text-5xl tracking-widest text-white/90">
            {time.hours} <span className="opacity-40">|</span> {time.minutes}
          </div>
        </div>
      )}

      {clockStyle === 'futuristic_hud' && (
        <div
          onClick={onOpenThemes}
          role="button"
          tabIndex={0}
          className="px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/40 text-cyan-400 font-mono tracking-widest cursor-pointer text-center"
        >
          <div className="text-4xl font-bold">
            {time.hours}:{time.minutes}
            <span className="text-xs ml-1 text-cyan-200">.{time.seconds}</span>
          </div>
          <div className="text-[10px] tracking-widest opacity-80 mt-0.5">ATMOS_TELEMETRY // SYNCED</div>
        </div>
      )}

      {/* Date & Location Line */}
      <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-white/80 drop-shadow">
        <span>{time.dateStr}</span>
        <span aria-hidden="true" className="opacity-50">·</span>
        <span>{location.name}</span>
      </div>

      {/* At-a-Glance Weather Glance Pill */}
      <button
        onClick={onOpenWeather}
        className="mt-3.5 px-3.5 py-1.5 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center gap-2 text-xs font-medium shadow-md transition-all active:scale-95"
      >
        <span className="flex items-center justify-center">{getWeatherIcon()}</span>
        <span className="font-semibold">{displayTemp}</span>
        <span className="text-white/60">·</span>
        <span className="text-white/90 truncate max-w-[130px]">{weather.conditionLabel}</span>
      </button>
    </div>
  );
};

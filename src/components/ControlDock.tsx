import React from 'react';
import { Smartphone, Maximize2, Minimize2, Palette, ShieldAlert, Sun, Moon, Volume2, VolumeX, MapPin, RefreshCw, Sparkles, Clock } from 'lucide-react';
import { LocationData, WeatherData } from '../types/weather';
import { ThemePreset } from '../types/theme';

interface ControlDockProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenThemes: () => void;
  onOpenAlerts: () => void;
  onOpenLocation: () => void;
  onOpenWeather: () => void;
  onOpenSetWallpaper: () => void;
  weatherData: WeatherData;
  theme: ThemePreset;
  activeAlertsCount: number;
  customTimeHour?: number;
  onChangeCustomTime: (hour: number | undefined) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onRefreshWeather: () => void;
  isLoadingWeather: boolean;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onOpenThemes,
  onOpenAlerts,
  onOpenLocation,
  onOpenWeather,
  onOpenSetWallpaper,
  weatherData,
  theme,
  activeAlertsCount,
  customTimeHour,
  onChangeCustomTime,
  isAudioMuted,
  onToggleAudio,
  onRefreshWeather,
  isLoadingWeather,
}) => {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between z-40 relative">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span>AetherLive</span>
        </a>
        <span className="hidden md:inline text-xs text-white/40">·</span>
        <button
          onClick={onOpenLocation}
          className="hidden md:flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
          title="Change location"
        >
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span>{weatherData.location.name}</span>
          <span className="text-white/40">({weatherData.current.temperature}°C)</span>
        </button>
      </div>

      {/* Zone 2: Navigation / Interactive Studio Controls */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-white/70">
        {/* Time-of-Day Slider (Time Machine) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
          <Sun className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-white/50 text-[11px]">Time:</span>
          <input
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={customTimeHour !== undefined ? customTimeHour : new Date().getHours()}
            onChange={e => onChangeCustomTime(parseFloat(e.target.value))}
            className="w-24 accent-sky-400 h-1.5 bg-white/15 rounded-lg cursor-pointer"
            title="Slide to preview time of day (sunrise, zenith, golden dusk, midnight)"
          />
          <button
            onClick={() => onChangeCustomTime(undefined)}
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
              customTimeHour === undefined ? 'bg-sky-500/20 text-sky-300' : 'text-white/40 hover:text-white'
            }`}
            title="Reset to live local clock"
          >
            {customTimeHour !== undefined ? `${Math.floor(customTimeHour)}:00` : 'Live'}
          </button>
          <Moon className="w-3.5 h-3.5 text-indigo-300" />
        </div>

        {/* Themes Button */}
        <button
          onClick={onOpenThemes}
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>Themes ({theme.name.split(' ')[0]})</span>
        </button>

        {/* Weather Forecast Details */}
        <button
          onClick={onOpenWeather}
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>Weather Radar</span>
        </button>

        {/* Severe Weather Alerts Link */}
        <button
          onClick={onOpenAlerts}
          className={`transition-colors flex items-center gap-1.5 ${
            activeAlertsCount > 0 ? 'text-amber-300 font-semibold' : 'hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Alerts {activeAlertsCount > 0 && `(${activeAlertsCount})`}</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={onToggleAudio}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          title={isAudioMuted ? 'Enable atmospheric audio' : 'Mute atmospheric audio'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
        </button>
      </nav>

      {/* Zone 3: 1-2 Primary Actions */}
      <div className="flex items-center gap-2.5">
        {/* Toggle Mode: Phone Bezel vs Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
          title={isFullscreen ? 'Switch to Android phone frame' : 'Switch to fullscreen live wallpaper'}
        >
          {isFullscreen ? <Smartphone className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Phone Bezel' : 'Fullscreen'}</span>
        </button>

        {/* Set as Wallpaper CTA */}
        <button
          onClick={onOpenSetWallpaper}
          className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/20 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Set Wallpaper</span>
        </button>
      </div>
    </header>
  );
};

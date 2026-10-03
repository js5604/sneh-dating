import React from 'react';
import { WeatherData } from '../types/weather';
import { ThemePreset, WallpaperSettings } from '../types/theme';
import { SevereWeatherAlert } from '../types/alert';
import { WeatherCanvas } from './WeatherCanvas';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidClockWidget } from './AndroidClockWidget';
import { Phone, MessageSquare, CloudSun, Palette, ShieldAlert, Search, Mic, Camera, Chrome } from 'lucide-react';

interface AndroidPhoneFrameProps {
  weatherData: WeatherData;
  theme: ThemePreset;
  settings: WallpaperSettings;
  alerts: SevereWeatherAlert[];
  customTimeHour?: number;
  onOpenNotifications: () => void;
  onOpenWeather: () => void;
  onOpenThemes: () => void;
  onOpenAlerts: () => void;
  onOpenLocation: () => void;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  weatherData,
  theme,
  settings,
  alerts,
  customTimeHour,
  onOpenNotifications,
  onOpenWeather,
  onOpenThemes,
  onOpenAlerts,
  onOpenLocation,
}) => {
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="relative mx-auto my-auto w-full max-w-[380px] h-[780px] max-h-[92vh] rounded-[48px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/80 flex flex-col justify-between overflow-hidden select-none">
      {/* Side Hardware Buttons Visual */}
      <div className="absolute -left-[5px] top-28 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
      <div className="absolute -left-[5px] top-44 w-[3px] h-16 bg-slate-600 rounded-l-sm" />
      <div className="absolute -right-[5px] top-32 w-[3px] h-14 bg-slate-600 rounded-r-sm" />

      {/* Internal Screen Area */}
      <div className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col justify-between bg-black">
        {/* Live Weather Canvas Background */}
        <WeatherCanvas
          weather={weatherData.current}
          theme={theme}
          settings={settings}
          customTimeHour={customTimeHour}
        />

        {/* Top Section: Status Bar & Pull-down affordance */}
        <div className="relative z-30 pt-1">
          <AndroidStatusBar
            alerts={alerts}
            onOpenNotifications={onOpenNotifications}
            isLightText={true}
          />
        </div>

        {/* Center Section: Android Clock & Weather Glance Widget */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 -mt-8">
          <AndroidClockWidget
            weather={weatherData.current}
            location={weatherData.location}
            theme={theme}
            clockStyle={settings.clockStyle}
            tempUnit={settings.tempUnit}
            customTimeHour={customTimeHour}
            onOpenWeather={onOpenWeather}
            onOpenThemes={onOpenThemes}
          />

          {/* Quick Location Badge (Tap to search/change) */}
          <button
            onClick={onOpenLocation}
            className="mt-3 text-[11px] font-medium text-white/70 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/10 transition-colors"
          >
            <span>📍 Change City ({weatherData.location.name})</span>
          </button>
        </div>

        {/* Bottom Section: Android Search Bar, Dock Icons & Gesture Bar */}
        <div className="relative z-20 px-4 pb-4 space-y-4">
          {/* Android Google Search Pill */}
          <div
            onClick={onOpenLocation}
            className="w-full h-11 px-4 rounded-full bg-white/15 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {/* Google colored G */}
              <span className="font-display font-black text-sm tracking-tight flex items-center">
                <span className="text-blue-400">G</span>
                <span className="text-red-400">o</span>
                <span className="text-amber-400">o</span>
                <span className="text-blue-400">g</span>
                <span className="text-emerald-400">l</span>
                <span className="text-red-400">e</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Search className="w-4 h-4 text-white/80" />
              <Mic className="w-4 h-4 text-white/80" />
            </div>
          </div>

          {/* App Dock Icons */}
          <div className="grid grid-cols-5 gap-2 px-1">
            {/* Phone */}
            <button
              onClick={() => {}}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
              title="Phone"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:brightness-110">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-white/80 truncate">Phone</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => {}}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
              title="Messages"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:brightness-110">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-white/80 truncate">Messages</span>
            </button>

            {/* Live Weather Forecast */}
            <button
              onClick={onOpenWeather}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
              title="Live Weather & Forecast"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:brightness-110 ring-2 ring-sky-300/40">
                <CloudSun className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-sky-200 truncate">Weather</span>
            </button>

            {/* Wallpaper Themes */}
            <button
              onClick={onOpenThemes}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
              title="Wallpaper Studio"
            >
              <div
                className="w-12 h-12 rounded-2xl text-slate-950 flex items-center justify-center shadow-lg group-hover:brightness-110 font-bold"
                style={{ backgroundColor: theme.colors.accentColor }}
              >
                <Palette className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium text-white/80 truncate">Themes</span>
            </button>

            {/* Severe Weather Alerts Center */}
            <button
              onClick={onOpenAlerts}
              className="flex flex-col items-center gap-1 group active:scale-95 transition-transform relative"
              title="Severe Weather Alerts"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:brightness-110 ${
                unreadAlertsCount > 0 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-amber-400'
              }`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
              <span className="text-[10px] font-medium text-white/80 truncate">Alerts</span>
            </button>
          </div>

          {/* Android Home Navigation Gesture Bar */}
          <div className="w-full flex justify-center pt-1">
            <div className="w-28 h-1 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

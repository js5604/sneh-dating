import React from 'react';
import { Wifi, Signal, Battery, Code, Globe2, Sun, Moon, ShieldCheck, DollarSign, Download } from 'lucide-react';
import { Language, AppScreen, AppTheme } from '../types/dating';
import { THEME_PALETTES } from '../constants/themePalettes';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  language: Language;
  onToggleLanguage: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme: AppTheme;
  onOpenCodeInspector: () => void;
  onOpenDownloadApk: () => void;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  children,
  activeScreen,
  onNavigate,
  language,
  onToggleLanguage,
  isDarkMode,
  onToggleDarkMode,
  currentTheme,
  onOpenCodeInspector,
  onOpenDownloadApk
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const theme = THEME_PALETTES[currentTheme] || THEME_PALETTES.royal_gulab;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 px-2 select-none">
      {/* Top Device Bar & Quick Controls */}
      <div className="w-full max-w-md mb-2.5 flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pixel 9 Pro</span>
          </div>

          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium transition-colors text-[11px]"
            title="Toggle between English and Punjabi (Gurmukhi)"
          >
            <Globe2 className="w-3 h-3 text-amber-400" />
            <span>{language === 'en' ? 'EN' : 'ਪੰਜਾਬੀ'}</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenDownloadApk}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950 transition-all text-[11px]"
            title="Get Ready APK for Android"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get APK</span>
          </button>

          <button
            onClick={onOpenCodeInspector}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 font-semibold shadow-sm transition-all text-[11px]"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Screen Quick Jumper for Easy Testing */}
      <div className="w-full max-w-md mb-2.5 flex items-center gap-1 overflow-x-auto pb-1 px-1 scrollbar-none text-[11px]">
        {(['discovery', 'matches', 'chat', 'verification', 'owner_monetisation', 'profile_builder', 'safety', 'privacy', 'settings', 'premium'] as AppScreen[]).map((scr) => {
          const isOwnerTab = scr === 'owner_monetisation';
          const isVerifyTab = scr === 'verification';
          return (
            <button
              key={scr}
              onClick={() => onNavigate(scr)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors flex items-center gap-1 ${
                activeScreen === scr
                  ? isOwnerTab 
                    ? 'bg-emerald-600 text-white font-bold shadow'
                    : 'bg-rose-600 text-white font-semibold shadow'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {isOwnerTab && <DollarSign className="w-3 h-3 text-amber-300" />}
              {isVerifyTab && <ShieldCheck className="w-3 h-3 text-sky-400" />}
              <span>{scr.replace('_', ' ')}</span>
            </button>
          );
        })}
      </div>

      {/* Physical Phone Outer Bezel */}
      <div className="relative w-full max-w-[395px] h-[820px] rounded-[48px] p-3.5 bg-gradient-to-b from-[#2a2433] via-[#1a1523] to-[#120d1c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[3px] border-[#443852] ring-1 ring-white/10 flex flex-col">
        {/* Device Screen Frame with Dynamic Aesthetic Theme Gradient */}
        <div
          className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col shadow-inner transition-colors duration-300 ${
            isDarkMode ? 'bg-[#0f0917] text-slate-100' : 'bg-[#faf7f2] text-slate-900'
          }`}
          style={{
            borderColor: theme.primaryColor
          }}
        >
          {/* Android Status Bar */}
          <div
            className={`w-full h-8 pt-1.5 px-6 flex items-center justify-between text-[11px] font-medium z-30 shrink-0 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {/* Clock */}
            <span>{currentTime}</span>

            {/* Front Camera Punch-Hole */}
            <div className="w-4 h-4 rounded-full bg-black ring-2 ring-black/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#172554]" />
            </div>

            {/* Android System Icons */}
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Active Screen Container */}
          <div className="flex-1 w-full h-[calc(100%-48px)] overflow-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Gesture Navigation Pill */}
          <div className="w-full h-4 flex items-center justify-center shrink-0 z-30">
            <div
              className={`w-28 h-1 rounded-full ${
                isDarkMode ? 'bg-white/30' : 'bg-black/30'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

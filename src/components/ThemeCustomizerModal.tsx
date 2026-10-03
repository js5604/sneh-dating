import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THEME_PRESETS } from '../constants/themes';
import { ClockStyleId, ParticleDensity, ThemePresetId, WallpaperSettings } from '../types/theme';
import { X, Check, Sparkles, Sliders, Battery, Volume2, Eye, Compass, Moon, Palette, Clock } from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WallpaperSettings;
  onUpdateSettings: (updates: Partial<WallpaperSettings>) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const clockStyles: Array<{ id: ClockStyleId; label: string; preview: string }> = [
    { id: 'material_two_line', label: 'Material You 2-Line', preview: '12\n45' },
    { id: 'digital_clean', label: 'Digital Clean', preview: '12:45' },
    { id: 'retro_flip', label: 'Retro Flip', preview: '[12]:[45]' },
    { id: 'minimal_stacked', label: 'Minimalist Line', preview: '12 | 45' },
    { id: 'futuristic_hud', label: 'Cyber HUD', preview: '12:45.30' },
  ];

  const densities: Array<{ id: ParticleDensity; label: string }> = [
    { id: 'off', label: 'Off' },
    { id: 'low', label: 'Gentle' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'high', label: 'High' },
    { id: 'storm', label: 'Storm Max' },
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

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="relative w-full max-w-xl max-h-[85vh] bg-slate-900/95 border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10"
          >
            {/* Grab handle & Header */}
            <div className="pt-3 pb-3 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-sky-400" />
                <h3 className="font-display font-bold text-base text-white">Live Wallpaper Customizer</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Wallpaper Aesthetic Themes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 block">
                  Curated Aesthetic Themes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {THEME_PRESETS.map(preset => {
                    const isSelected = settings.themeId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => onUpdateSettings({ themeId: preset.id })}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between relative overflow-hidden group ${
                          isSelected
                            ? 'border-sky-400 ring-2 ring-sky-400/30 bg-slate-800'
                            : 'border-white/10 bg-slate-800/60 hover:bg-slate-800'
                        }`}
                      >
                        {/* Color gradient preview strip */}
                        <div
                          className="w-full h-8 rounded-lg mb-2 shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, ${preset.colors.skyTop} 0%, ${preset.colors.skyMiddle || preset.colors.skyBottom} 50%, ${preset.colors.accentColor} 100%)`,
                          }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white leading-tight">
                            {preset.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-white/60 leading-tight mt-1 line-clamp-2">
                          {preset.tagline}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Clock Widget Styling */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Clock Widget Typography</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {clockStyles.map(st => {
                    const isSelected = settings.clockStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => onUpdateSettings({ clockStyle: st.id })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-sky-400 bg-sky-500/10 text-white'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-white truncate">{st.label}</div>
                        <div className="text-xs font-mono opacity-60 mt-0.5 whitespace-pre">{st.preview}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Particle Physics & Atmosphere */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-sky-400 block flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Atmospheric Simulation Controls</span>
                </label>

                {/* Particle Density */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/80 font-medium">Particle Density (Rain & Snow)</span>
                    <span className="text-sky-300 font-mono text-[11px] uppercase">{settings.particleDensity}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
                    {densities.map(d => (
                      <button
                        key={d.id}
                        onClick={() => onUpdateSettings({ particleDensity: d.id })}
                        className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                          settings.particleDensity === d.id
                            ? 'bg-sky-500 text-slate-950 font-bold shadow'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Particle Speed Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/80 font-medium">Animation Speed</span>
                    <span className="text-sky-300 font-mono text-[11px]">{settings.particleSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.particleSpeed}
                    onChange={e => onUpdateSettings({ particleSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>

              {/* Section 4: Visual Effects Toggles */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cinematic Weather Features</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Lightning */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-white block">Lightning Flashes</span>
                      <span className="text-[10px] text-white/50">Multi-fork strikes during storms</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableLightning}
                      onChange={e => onUpdateSettings({ enableLightning: e.target.checked })}
                      className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Sun Flare */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-white block">Sun Glare & Corona</span>
                      <span className="text-[10px] text-white/50">Radial lens glow during daytime</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableSunGlare}
                      onChange={e => onUpdateSettings({ enableSunGlare: e.target.checked })}
                      className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Aurora Waves */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-white block">Aurora Waves</span>
                      <span className="text-[10px] text-white/50">Emerald polar light ribbons</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableAurora}
                      onChange={e => onUpdateSettings({ enableAurora: e.target.checked })}
                      className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Living Nature Landscape */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 block">Mountains, Trees & Lake</span>
                      <span className="text-[10px] text-white/50">Natural terrain & water reflections</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableLandscape}
                      onChange={e => onUpdateSettings({ enableLandscape: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Nature Creatures & Birds */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-amber-300 block">Birds & Wildlife</span>
                      <span className="text-[10px] text-white/50">Flocks flying home at sunset</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableWildlife}
                      onChange={e => onUpdateSettings({ enableWildlife: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* 3D Parallax Tilt */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-white block">3D Parallax Gyroscope</span>
                      <span className="text-[10px] text-white/50">Shift layers with device tilt</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableParallax}
                      onChange={e => onUpdateSettings({ enableParallax: e.target.checked })}
                      className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
                    />
                  </label>

                  {/* Battery Saver */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 block">Battery Saver (30 FPS)</span>
                      <span className="text-[10px] text-white/50">Reduces GPU draw & particle cost</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.batterySaver}
                      onChange={e => onUpdateSettings({ batterySaver: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Audio Ambience */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                    <div>
                      <span className="text-xs font-semibold text-white block">Procedural Audio Ambience</span>
                      <span className="text-[10px] text-white/50">Synthesized rain & wind sounds</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableAudioAmbience}
                      onChange={e => onUpdateSettings({ enableAudioAmbience: e.target.checked })}
                      className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Section 5: Units & Preferences */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/80 font-medium">Temperature Unit</span>
                <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
                  <button
                    onClick={() => onUpdateSettings({ tempUnit: 'celsius' })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      settings.tempUnit === 'celsius'
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    °C Celsius
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ tempUnit: 'fahrenheit' })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      settings.tempUnit === 'fahrenheit'
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    °F Fahrenheit
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 active:scale-95 transition-transform"
              >
                Apply Wallpaper Theme
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

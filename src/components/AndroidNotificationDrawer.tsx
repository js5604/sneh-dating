import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SevereWeatherAlert } from '../types/alert';
import { AlertTriangle, Bell, Volume2, VolumeX, ShieldAlert, X, Radio, ChevronDown, Check, Zap, Wind, CloudRain, Flame, Snowflake } from 'lucide-react';
import { weatherAudio } from '../utils/audioEngine';

interface AndroidNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SevereWeatherAlert[];
  onDismissAlert: (id: string) => void;
  onClearAllAlerts: () => void;
  onTriggerSimulatedAlert: (type: 'tornado' | 'thunderstorm' | 'flood' | 'blizzard' | 'gale') => void;
  audioAmbienceEnabled: boolean;
  onToggleAudioAmbience: () => void;
  batterySaverEnabled: boolean;
  onToggleBatterySaver: () => void;
  cityName: string;
}

export const AndroidNotificationDrawer: React.FC<AndroidNotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onDismissAlert,
  onClearAllAlerts,
  onTriggerSimulatedAlert,
  audioAmbienceEnabled,
  onToggleAudioAmbience,
  batterySaverEnabled,
  onToggleBatterySaver,
  cityName,
}) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'emergency':
        return {
          bg: 'bg-rose-950/80 border-rose-500/80',
          badge: 'bg-rose-600 text-white',
          text: 'text-rose-200',
          iconColor: 'text-rose-400',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/80 border-amber-500/70',
          badge: 'bg-amber-500 text-slate-950',
          text: 'text-amber-200',
          iconColor: 'text-amber-400',
        };
      case 'watch':
        return {
          bg: 'bg-orange-950/70 border-orange-500/50',
          badge: 'bg-orange-500 text-white',
          text: 'text-orange-200',
          iconColor: 'text-orange-400',
        };
      default:
        return {
          bg: 'bg-sky-950/70 border-sky-500/50',
          badge: 'bg-sky-500 text-slate-950',
          text: 'text-sky-200',
          iconColor: 'text-sky-400',
        };
    }
  };

  const handleTestAlertSound = () => {
    weatherAudio.playSevereAlertBeep();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl text-slate-100 overflow-hidden"
        >
          {/* Top Grab Handle & Header */}
          <div className="pt-3 pb-2 px-6 flex flex-col items-center border-b border-white/10 shrink-0">
            <div className="w-12 h-1 bg-white/30 rounded-full mb-3 cursor-grab" onClick={onClose} />
            <div className="w-full flex items-center justify-between text-xs text-white/70">
              <span className="font-semibold text-white text-sm">Android Notification Shade</span>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-white/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Settings Tiles Grid */}
          <div className="px-5 py-3 border-b border-white/10 bg-slate-900/60 shrink-0">
            <div className="grid grid-cols-4 gap-2">
              {/* Sound Ambience Tile */}
              <button
                onClick={onToggleAudioAmbience}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl text-xs font-medium transition-all ${
                  audioAmbienceEnabled
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                {audioAmbienceEnabled ? <Volume2 className="w-4 h-4 mb-1" /> : <VolumeX className="w-4 h-4 mb-1" />}
                <span className="text-[11px] leading-tight text-center">Atmosphere Audio</span>
              </button>

              {/* Battery Saver */}
              <button
                onClick={onToggleBatterySaver}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl text-xs font-medium transition-all ${
                  batterySaverEnabled
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <Zap className="w-4 h-4 mb-1" />
                <span className="text-[11px] leading-tight text-center">Battery Saver</span>
              </button>

              {/* Test EAS Chime */}
              <button
                onClick={handleTestAlertSound}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-medium transition-all"
              >
                <Radio className="w-4 h-4 mb-1 text-amber-400" />
                <span className="text-[11px] leading-tight text-center">EAS Chime</span>
              </button>

              {/* Severe Alert Status */}
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 text-white/80 text-xs font-medium">
                <ShieldAlert className="w-4 h-4 mb-1 text-sky-400" />
                <span className="text-[11px] leading-tight text-center">{alerts.length} Active</span>
              </div>
            </div>
          </div>

          {/* Alert Simulator Quick Triggers */}
          <div className="px-5 py-2.5 bg-slate-900/40 border-b border-white/5 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px] text-white/60 font-medium">Simulate Alert:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onTriggerSimulatedAlert('tornado')}
                className="px-2 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-semibold"
              >
                Tornado
              </button>
              <button
                onClick={() => onTriggerSimulatedAlert('thunderstorm')}
                className="px-2 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-semibold"
              >
                Storm
              </button>
              <button
                onClick={() => onTriggerSimulatedAlert('flood')}
                className="px-2 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[10px] font-semibold"
              >
                Flood
              </button>
              <button
                onClick={() => onTriggerSimulatedAlert('gale')}
                className="px-2 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold"
              >
                Gale
              </button>
              <button
                onClick={() => onTriggerSimulatedAlert('blizzard')}
                className="px-2 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold"
              >
                Blizzard
              </button>
            </div>
          </div>

          {/* Notifications Scroll Area */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Weather Alert Broadcasts</span>
              {alerts.length > 0 && (
                <button
                  onClick={onClearAllAlerts}
                  className="text-sky-400 hover:text-sky-300 text-xs font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {alerts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 text-white/50 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-white/20" />
                <p className="text-sm font-medium text-white/80">No Active Severe Warnings</p>
                <p className="text-xs text-white/50">
                  Meteorological radar reports clear atmospheric conditions across {cityName}. Tap any simulator button above to preview live alert handling.
                </p>
              </div>
            ) : (
              alerts.map(alert => {
                const style = getSeverityStyle(alert.severity);
                return (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 rounded-2xl border backdrop-blur-md shadow-lg ${style.bg} relative overflow-hidden`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 shrink-0 ${style.iconColor}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                          {alert.severity}
                        </span>
                        <span className="text-[11px] text-white/50 font-mono">{alert.effectiveTime}</span>
                      </div>
                      <button
                        onClick={() => onDismissAlert(alert.id)}
                        className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                        title="Dismiss alert"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Headline */}
                    <h4 className="mt-2 text-sm font-bold text-white leading-snug">
                      {alert.headline}
                    </h4>

                    {/* Description */}
                    <p className={`mt-1.5 text-xs leading-relaxed ${style.text}`}>
                      {alert.description}
                    </p>

                    {/* Action Instruction Box */}
                    <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white/90">
                      <span className="font-semibold text-amber-300">Action: </span>
                      {alert.instruction}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-white/50">
                      <span>Source: {alert.source}</span>
                      <span>Area: {alert.affectedArea}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Bottom Close Bar */}
          <div className="p-3 border-t border-white/10 flex justify-center bg-slate-950 shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
              <span>Close Drawer</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertThresholdSettings, SevereWeatherAlert } from '../types/alert';
import { ShieldAlert, AlertTriangle, Bell, Volume2, X, Sliders, Check, Radio, Wind, CloudRain, Flame, Snowflake, ExternalLink } from 'lucide-react';
import { weatherAudio } from '../utils/audioEngine';

interface SevereAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SevereWeatherAlert[];
  thresholds: AlertThresholdSettings;
  onUpdateThresholds: (updates: Partial<AlertThresholdSettings>) => void;
  onTriggerSimulatedAlert: (type: 'tornado' | 'thunderstorm' | 'flood' | 'blizzard' | 'gale') => void;
  cityName: string;
}

export const SevereAlertsModal: React.FC<SevereAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  thresholds,
  onUpdateThresholds,
  onTriggerSimulatedAlert,
  cityName,
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification('AetherLive Severe Weather Alert Active', {
          body: `Real-time weather emergency monitoring enabled for ${cityName}.`,
          icon: '/favicon.ico',
        });
      }
    }
  };

  const handleTestAlertWithSound = (type: 'tornado' | 'thunderstorm' | 'flood' | 'blizzard' | 'gale') => {
    weatherAudio.playSevereAlertBeep();
    onTriggerSimulatedAlert(type);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 Severe Weather Broadcast: ${type.toUpperCase()}`, {
        body: `Urgent meteorological bulletin issued for ${cityName}. Open AetherLive wallpaper for radar updates.`,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Severe Weather Alerts Center
                  </h3>
                  <p className="text-xs text-white/60">
                    Emergency notifications & atmospheric safety thresholds
                  </p>
                </div>
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
              {/* Browser Push Notifications Opt-In Banner */}
              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3">
                <Bell className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    System Push Notifications
                  </h4>
                  <p className="text-xs text-sky-200 mt-1">
                    Receive high-urgency Android / browser alerts when severe squalls, gale-force winds, or tornado warnings are detected.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {notificationPermission === 'granted' ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Push Notifications Active
                      </span>
                    ) : (
                      <button
                        onClick={requestBrowserPermission}
                        className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
                      >
                        Enable Notifications
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Broadcast Alert Simulator Buttons */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 block flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Test Severe Alert Broadcasts</span>
                </label>
                <p className="text-xs text-white/60 mb-3">
                  Trigger an immediate simulated alert with EAS dual-tone audio chime and Android notification banner:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTestAlertWithSound('tornado')}
                    className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200">
                      🚨 Tornado Warning
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">Immediate shelter EAS</div>
                  </button>

                  <button
                    onClick={() => handleTestAlertWithSound('thunderstorm')}
                    className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                      ⚡ Severe Storm & Hail
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">Heavy lightning warning</div>
                  </button>

                  <button
                    onClick={() => handleTestAlertWithSound('flood')}
                    className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/40 hover:bg-blue-500/25 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-blue-300 group-hover:text-blue-200">
                      🌊 Flash Flood
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">High precipitation alert</div>
                  </button>

                  <button
                    onClick={() => handleTestAlertWithSound('gale')}
                    className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 hover:bg-cyan-500/25 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                      💨 High Gale Advisory
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">Gusts &gt; 80 km/h</div>
                  </button>

                  <button
                    onClick={() => handleTestAlertWithSound('blizzard')}
                    className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/40 hover:bg-indigo-500/25 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200">
                      ❄️ Blizzard Warning
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">Whiteout conditions</div>
                  </button>

                  <button
                    onClick={() => weatherAudio.playSevereAlertBeep()}
                    className="p-3 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 text-left transition-all"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Test EAS Chime
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">Play dual frequency tone</div>
                  </button>
                </div>
              </div>

              {/* Severe Alert Trigger Thresholds */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Custom Severity Thresholds</span>
                </label>

                {/* High Wind Slider */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-white/90">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      High Wind Alert Limit
                    </span>
                    <span className="font-mono text-sky-300 font-bold">{thresholds.highWindThreshold} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="90"
                    step="5"
                    value={thresholds.highWindThreshold}
                    onChange={e => onUpdateThresholds({ highWindThreshold: parseInt(e.target.value) })}
                    className="w-full accent-sky-400 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                </div>

                {/* Heavy Rain Slider */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-white/90">
                      <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                      Heavy Rain / Flood Threshold
                    </span>
                    <span className="font-mono text-blue-300 font-bold">{thresholds.heavyRainThreshold} mm/h</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="5"
                    value={thresholds.heavyRainThreshold}
                    onChange={e => onUpdateThresholds({ heavyRainThreshold: parseInt(e.target.value) })}
                    className="w-full accent-blue-400 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                </div>

                {/* Extreme Heat Slider */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-white/90">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Extreme Heat Warning Trigger
                    </span>
                    <span className="font-mono text-amber-300 font-bold">{thresholds.extremeHeatThreshold}°C</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="45"
                    step="1"
                    value={thresholds.extremeHeatThreshold}
                    onChange={e => onUpdateThresholds({ extremeHeatThreshold: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <span className="text-xs font-semibold text-white">Enable Severe Weather Alerts</span>
                  <input
                    type="checkbox"
                    checked={thresholds.enableAlerts}
                    onChange={e => onUpdateThresholds({ enableAlerts: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <span className="text-xs font-semibold text-white">Audible EAS Alarm Tone</span>
                  <input
                    type="checkbox"
                    checked={thresholds.enableSound}
                    onChange={e => onUpdateThresholds({ enableSound: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
              >
                Save Alert Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

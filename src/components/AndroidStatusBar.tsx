import React, { useEffect, useState } from 'react';
import { Wifi, Signal, Battery, Bell, AlertTriangle } from 'lucide-react';
import { SevereWeatherAlert } from '../types/alert';

interface AndroidStatusBarProps {
  alerts: SevereWeatherAlert[];
  onOpenNotifications: () => void;
  isLightText?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  alerts,
  onOpenNotifications,
  isLightText = true,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(88);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.isRead);
  const textColor = isLightText ? 'text-white' : 'text-slate-900';

  return (
    <div
      onClick={onOpenNotifications}
      role="button"
      tabIndex={0}
      title="Click to pull down notification drawer"
      className={`w-full px-5 py-2.5 flex items-center justify-between z-30 select-none cursor-pointer transition-colors ${textColor}`}
    >
      {/* Left: Time and alert badges */}
      <div className="flex items-center gap-2">
        <span className="font-display font-semibold text-xs tracking-tight">{currentTime || '12:00'}</span>
        {unreadAlerts.length > 0 && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-bold animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>{unreadAlerts.length}</span>
          </div>
        )}
      </div>

      {/* Center: Subtle Android Camera Notch Indicator */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/80 border border-white/10 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900/90" />
      </div>

      {/* Right: Network & Battery status */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium opacity-80">5G</span>
        <Signal className="w-3 h-3 opacity-90" />
        <Wifi className="w-3 h-3 opacity-90" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono opacity-80">{batteryLevel}%</span>
          <Battery className="w-3.5 h-3.5 opacity-90" />
        </div>
      </div>
    </div>
  );
};

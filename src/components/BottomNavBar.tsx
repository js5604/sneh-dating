import React from 'react';
import { Compass, MessageCircle, Shield, Lock, User, Crown } from 'lucide-react';
import { AppScreen, Language } from '../types/dating';
import { translations } from '../constants/translations';

interface BottomNavBarProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  language: Language;
  unreadCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeScreen,
  onNavigate,
  language,
  unreadCount = 1
}) => {
  const t = translations[language];

  const navItems = [
    { screen: 'discovery' as AppScreen, label: t.discover, icon: Compass },
    { screen: 'matches' as AppScreen, label: t.messages, icon: MessageCircle, badge: unreadCount },
    { screen: 'safety' as AppScreen, label: t.safety, icon: Shield },
    { screen: 'privacy' as AppScreen, label: t.privacy, icon: Lock },
    { screen: 'settings' as AppScreen, label: t.settings, icon: User }
  ];

  return (
    <div className="w-full h-14 bg-[#140c1f] border-t border-white/10 flex items-center justify-around px-2 z-20 shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.screen;
        return (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
              isActive ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-1 ring-[#140c1f]">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

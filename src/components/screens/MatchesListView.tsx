import React from 'react';
import { MessageSquare, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { MatchProfile, Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface MatchesListViewProps {
  matches: MatchProfile[];
  language: Language;
  onSelectMatch: (match: MatchProfile) => void;
}

export const MatchesListView: React.FC<MatchesListViewProps> = ({
  matches,
  language,
  onSelectMatch
}) => {
  const t = translations[language];

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#0e0816] text-slate-100 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <span>{t.matches}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
          {matches.length}
        </span>
      </h2>

      {/* New Matches Horizontal Reel */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
          New Matches
        </h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-400 group-hover:scale-105 transition-transform">
                <img
                  src={match.photo}
                  alt={match.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#0e0816]"
                />
              </div>
              <span className="text-xs font-medium text-slate-200 truncate w-16 text-center">
                {match.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
          Messages
        </h3>
        <div className="space-y-2">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 text-left transition-colors"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <img src={match.photo} alt={match.name} className="w-full h-full object-cover" />
                {match.verified && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-sky-500 rounded-full flex items-center justify-center text-white ring-1 ring-[#0e0816]">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-semibold text-sm text-white truncate">
                    {match.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {match.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {match.lastMessage}
                </p>
              </div>

              {match.unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                  {match.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

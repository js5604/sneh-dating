import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { MatchProfile, Language } from '../types/dating';
import { translations } from '../constants/translations';
import { sampleIcebreakers } from '../constants/initialData';

interface MatchCelebrationModalProps {
  matchedProfile: MatchProfile;
  myPhoto: string;
  language: Language;
  onSendMessage: (icebreaker?: string) => void;
  onKeepDiscovering: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  matchedProfile,
  myPhoto,
  language,
  onSendMessage,
  onKeepDiscovering
}) => {
  const t = translations[language];

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#F59E0B', '#38BDF8', '#FFFFFF']
    });
  }, []);

  const randomIcebreaker = sampleIcebreakers[Math.floor(Math.random() * sampleIcebreakers.length)];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#241228] to-[#120917] border border-rose-500/30 p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Dual Avatars */}
        <div className="flex items-center justify-center -space-x-4 my-4">
          <div className="w-20 h-20 rounded-full border-4 border-rose-500 overflow-hidden shadow-lg z-10 animate-bounce">
            <img src={myPhoto} alt="My profile" className="w-full h-full object-cover" />
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white z-20 shadow-md">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-amber-400 overflow-hidden shadow-lg z-10 animate-bounce">
            <img src={matchedProfile.photo} alt={matchedProfile.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 tracking-wider">
          {t.itsAMatch}
        </h2>
        <p className="text-xs text-rose-200/80 mt-1">
          {t.matchSub.replace('%s', matchedProfile.name)}
        </p>

        {/* AI Suggested Icebreaker Card */}
        <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.suggestedIcebreaker}</span>
          </div>
          <p className="text-xs text-slate-200 mt-1 italic">
            "{randomIcebreaker}"
          </p>
          <button
            onClick={() => onSendMessage(randomIcebreaker)}
            className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
          >
            <span>Use this icebreaker</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => onSendMessage()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.sendMessage}</span>
          </button>

          <button
            onClick={onKeepDiscovering}
            className="w-full py-2.5 px-4 rounded-2xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            {t.keepDiscovering}
          </button>
        </div>
      </div>
    </div>
  );
};

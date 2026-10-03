import React, { useState } from 'react';
import { Heart, ShieldCheck, Lock, Sparkles, ChevronRight } from 'lucide-react';
import { Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface OnboardingViewProps {
  language: Language;
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  language,
  onGetStarted,
  onSignIn
}) => {
  const t = translations[language];
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      title: t.onboarding1Title,
      desc: t.onboarding1Desc,
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      tag: 'CULTURALLY ROOTED'
    },
    {
      title: t.onboarding2Title,
      desc: t.onboarding2Desc,
      icon: Lock,
      color: 'from-amber-500 to-rose-500',
      tag: 'PRIVACY BY DESIGN'
    },
    {
      title: t.onboarding3Title,
      desc: t.onboarding3Desc,
      icon: ShieldCheck,
      color: 'from-sky-500 to-indigo-600',
      tag: 'ANTI-FRAUD SHIELD'
    },
    {
      title: t.onboarding4Title,
      desc: t.onboarding4Desc,
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      tag: 'VERIFIED SINGLES'
    }
  ];

  const currentSlide = slides[slideIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#140b1c] via-[#0f0817] to-[#0a0510] text-slate-100">
      {/* Brand Header */}
      <div className="text-center pt-4">
        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 font-display">
          {language === 'pa' ? 'ਸਨੇਹ' : 'Sneh'}
        </h1>
        <p className="text-[11px] text-rose-300/80 tracking-widest uppercase font-semibold mt-1">
          {t.slogan}
        </p>
      </div>

      {/* Slide Illustration & Text */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
        <div className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${currentSlide.color} p-0.5 shadow-xl shadow-rose-950/50 mb-6 animate-pulse`}>
          <div className="w-full h-full bg-[#120a1a] rounded-[22px] flex items-center justify-center">
            <IconComponent className="w-12 h-12 text-white" />
          </div>
        </div>

        <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase mb-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
          {currentSlide.tag}
        </span>

        <h2 className="text-xl font-bold text-white mb-2 leading-tight">
          {currentSlide.title}
        </h2>
        <p className="text-xs text-slate-300/90 leading-relaxed max-w-[280px]">
          {currentSlide.desc}
        </p>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slideIndex === idx ? 'w-6 bg-rose-500' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-2">
        {slideIndex < slides.length - 1 ? (
          <button
            onClick={() => setSlideIndex(slideIndex + 1)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onGetStarted}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
          >
            {t.getStarted}
          </button>
        )}

        <button
          onClick={onSignIn}
          className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
        >
          {t.alreadyMember}
        </button>
      </div>
    </div>
  );
};

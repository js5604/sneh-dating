import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, Users, Lock, ChevronRight, ExternalLink } from 'lucide-react';
import { Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface SafetyCenterViewProps {
  language: Language;
  onOpenReportGeneral: () => void;
}

export const SafetyCenterView: React.FC<SafetyCenterViewProps> = ({
  language,
  onOpenReportGeneral
}) => {
  const t = translations[language];

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#0e0816] text-slate-100 overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <ShieldCheck className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl font-bold text-white">
            {t.safetyHubTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Your well-being, dignity, and personal safety are the foundational pillars of Sneh.
        </p>
      </div>

      {/* Emergency Hotline Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-[#1e1028] border border-rose-500/30 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{t.helplinesTitle}</span>
        </h3>

        <div className="space-y-2 text-xs">
          <a
            href="tel:112"
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="font-semibold text-white">{t.helpline112}</span>
            <span className="text-[11px] text-rose-400 font-mono">Dial 112</span>
          </a>

          <a
            href="tel:1091"
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="font-semibold text-white">{t.helpline1091}</span>
            <span className="text-[11px] text-rose-400 font-mono">Dial 1091</span>
          </a>

          <a
            href="tel:1930"
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="font-semibold text-white">{t.helpline1930}</span>
            <span className="text-[11px] text-rose-400 font-mono">Dial 1930</span>
          </a>
        </div>
      </div>

      {/* First-Date Guidelines */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Golden Rules for Mindful Dating
        </h3>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug">{t.meetupRule1}</p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p className="leading-snug">{t.meetupRule2}</p>
          </div>
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-snug">{t.meetupRule3}</p>
          </div>
        </div>
      </div>

      {/* Report Button */}
      <div className="pt-2">
        <button
          onClick={onOpenReportGeneral}
          className="w-full py-3 px-4 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>File a Safety Incident or Grievance</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Settings, Globe, Shield, Lock, Moon, Sun, Bell, UserX, Crown, LogOut, ChevronRight, HelpCircle, FileText, Palette, ShieldCheck, DollarSign, Award } from 'lucide-react';
import { Language, UserProfile, AppTheme } from '../../types/dating';
import { translations } from '../../constants/translations';
import { THEME_PALETTES } from '../../constants/themePalettes';

interface SettingsViewProps {
  userProfile: UserProfile;
  language: Language;
  onToggleLanguage: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
  onNavigateToPrivacy: () => void;
  onNavigateToSafety: () => void;
  onNavigateToPremium: () => void;
  onNavigateToVerification: () => void;
  onNavigateToOwnerMonetisation: () => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  language,
  onToggleLanguage,
  isDarkMode,
  onToggleDarkMode,
  currentTheme,
  onChangeTheme,
  onNavigateToPrivacy,
  onNavigateToSafety,
  onNavigateToPremium,
  onNavigateToVerification,
  onNavigateToOwnerMonetisation,
  onLogout
}) => {
  const t = translations[language];
  const [showGrievance, setShowGrievance] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#0e0816] text-slate-100 overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">
          {t.settings}
        </h2>
        <p className="text-xs text-slate-400">
          Preferences, aesthetics, verification, and legal controls.
        </p>
      </div>

      {/* Govt ID Online Verification Card */}
      <button
        onClick={onNavigateToVerification}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-indigo-950/60 to-sky-950/40 border border-sky-400/30 flex items-center justify-between text-left group transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold border border-sky-400/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-sky-200">Govt ID Online Verification</h4>
              {userProfile.govtVerification?.isVerified && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  VERIFIED
                </span>
              )}
            </div>
            <p className="text-[11px] text-sky-300/80">
              {userProfile.govtVerification?.isVerified 
                ? `Verified via ${userProfile.govtVerification.docType} (${userProfile.govtVerification.maskedNumber})` 
                : 'Aadhaar Card, PAN Card, Indian Passport, or Voter ID'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* VIP Premium Banner */}
      <button
        onClick={onNavigateToPremium}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/10 border border-amber-500/30 flex items-center justify-between text-left group transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Crown className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-amber-200">Sneh Shahi VIP</h4>
            <p className="text-xs text-amber-300/80">Unlimited Likes, Incognito &amp; Travel Pass</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Owner-Only Monetisation Suite */}
      <button
        onClick={onNavigateToOwnerMonetisation}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 flex items-center justify-between text-left group transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
            <DollarSign className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-emerald-200">Monetisation &amp; Revenue Suite</h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">
                OWNER ONLY
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Only Jatindersingh5604@gmail.com can manage ads, pricing, and bank payouts
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Interface Themes Selection */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
          <span>Aesthetic App Themes</span>
          <Palette className="w-3.5 h-3.5 text-rose-400" />
        </h3>

        <div className="rounded-2xl bg-white/5 border border-white/5 p-3 space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(THEME_PALETTES) as AppTheme[]).map((thmKey) => {
              const thm = THEME_PALETTES[thmKey];
              const isSelected = currentTheme === thmKey;
              return (
                <button
                  key={thmKey}
                  onClick={() => onChangeTheme(thmKey)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-500/20 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/40'
                      : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                      style={{ backgroundColor: thm.primaryColor }}
                    />
                    <div>
                      <div className="text-xs font-semibold">
                        {language === 'pa' ? thm.namePa : thm.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {thm.description}
                      </div>
                    </div>
                  </div>
                  {isSelected && <span className="text-xs text-rose-400 font-bold">Active</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Account & Safety Section */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Account &amp; Safety
        </h3>

        <div className="rounded-2xl bg-white/5 border border-white/5 divide-y divide-white/5 text-xs">
          <button
            onClick={onNavigateToPrivacy}
            className="w-full p-3.5 flex items-center justify-between hover:bg-white/5 text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Privacy &amp; Data Rights (DPDP)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={onNavigateToSafety}
            className="w-full p-3.5 flex items-center justify-between hover:bg-white/5 text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Safety &amp; Well-being Center</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={onToggleLanguage}
            className="w-full p-3.5 flex items-center justify-between hover:bg-white/5 text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Language / ਭਾਸ਼ਾ</span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10">
              {language === 'en' ? 'English' : 'ਪੰਜਾਬੀ (Gurmukhi)'}
            </span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="w-full p-3.5 flex items-center justify-between hover:bg-white/5 text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span>Dark / Light Mode</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {isDarkMode ? 'Dark Theme' : 'Light Theme'}
            </span>
          </button>
        </div>
      </div>

      {/* Statutory India IT Rules Grievance Officer */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Legal &amp; Compliance
        </h3>

        <div className="rounded-2xl bg-white/5 border border-white/5 divide-y divide-white/5 text-xs">
          <button
            onClick={() => setShowGrievance(!showGrievance)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-white/5 text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>India Statutory Grievance Redressal</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-500 transform transition-transform ${showGrievance ? 'rotate-90' : ''}`} />
          </button>

          {showGrievance && (
            <div className="p-3.5 bg-black/30 text-[11px] text-slate-300 space-y-1 leading-relaxed border-t border-white/5">
              <p><strong>Designated Grievance Officer:</strong> Priyanshu Sharma</p>
              <p><strong>Email:</strong> grievance-officer@snehdating.in</p>
              <p><strong>Physical Address:</strong> Level 5, Embassy TechZone, Hinjawadi, Pune, Maharashtra 411057</p>
              <p className="text-[10px] text-slate-400 pt-1">
                Pursuant to Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. Acknowledgement within 24 hours, resolution within 15 days.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

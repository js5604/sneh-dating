import React, { useState } from 'react';
import { Crown, Check, Sparkles, ArrowLeft, Shield, Zap, Eye, Compass } from 'lucide-react';
import { Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface PremiumViewProps {
  language: Language;
  onBack: () => void;
}

export const PremiumView: React.FC<PremiumViewProps> = ({
  language,
  onBack
}) => {
  const t = translations[language];
  const [selectedPlan, setSelectedPlan] = useState<'1month' | '3months' | '12months'>('3months');
  const [billingNotice, setBillingNotice] = useState(false);

  const handlePurchase = () => {
    setBillingNotice(true);
    setTimeout(() => setBillingNotice(false), 5000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-gradient-to-b from-[#1f1027] via-[#120a1b] to-[#0a0510] text-slate-100 overflow-y-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 rounded-full text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200">
            {t.premiumTitle}
          </h2>
          <p className="text-[11px] text-amber-300/80">
            Royal matchmaking privileges
          </p>
        </div>
      </div>

      {/* Hero Badge */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 to-rose-600/20 border border-amber-400/30 text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Crown className="w-6 h-6 fill-slate-950" />
        </div>
        <h3 className="font-bold text-sm text-white">Elevate Your Presence</h3>
        <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
          {t.premiumSub}
        </p>
      </div>

      {/* Privilege List */}
      <div className="space-y-2 text-xs">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-white">Unlimited Swipes &amp; 5 Super Likes Daily</h4>
            <p className="text-[11px] text-slate-400">Stand out with priority card placement</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Eye className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-white">See Who Liked You</h4>
            <p className="text-[11px] text-slate-400">Browse incoming likes without waiting for mutual swipe</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-white">Incognito Browsing Mode</h4>
            <p className="text-[11px] text-slate-400">Be visible solely to individuals you have chosen to like</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Compass className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <h4 className="font-semibold text-white">All-India Passport (Travel Pass)</h4>
            <p className="text-[11px] text-slate-400">Discover singles across Mumbai, Delhi, Bengaluru &amp; Chandigarh</p>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Plans */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => setSelectedPlan('1month')}
          className={`p-3 rounded-2xl border text-center transition-all ${
            selectedPlan === '1month'
              ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <div className="text-[10px] uppercase font-semibold">1 Month</div>
          <div className="text-sm font-bold text-white mt-1">₹799</div>
          <div className="text-[9px] text-slate-400">/mo</div>
        </button>

        <button
          onClick={() => setSelectedPlan('3months')}
          className={`p-3 rounded-2xl border text-center transition-all relative ${
            selectedPlan === '3months'
              ? 'bg-amber-500/25 border-amber-400 text-white font-bold shadow-lg ring-1 ring-amber-400/40'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-rose-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
            Popular
          </span>
          <div className="text-[10px] uppercase font-semibold">3 Months</div>
          <div className="text-sm font-bold text-amber-300 mt-1">₹499</div>
          <div className="text-[9px] text-slate-400">/mo</div>
        </button>

        <button
          onClick={() => setSelectedPlan('12months')}
          className={`p-3 rounded-2xl border text-center transition-all ${
            selectedPlan === '12months'
              ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <div className="text-[10px] uppercase font-semibold">12 Months</div>
          <div className="text-sm font-bold text-white mt-1">₹299</div>
          <div className="text-[9px] text-slate-400">/mo</div>
        </button>
      </div>

      {/* Google Play Billing Architecture Notification */}
      {billingNotice && (
        <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-400 text-sky-200 text-xs leading-relaxed animate-in fade-in duration-200">
          <strong>Google Play Billing Client (Ready for APK Release):</strong><br />
          In production, this initiates `BillingClient.launchBillingFlow()` with SKU <code className="text-amber-300">sneh_shahi_subscription_{selectedPlan}</code>. Server-side token validation is handled via Google Play Developer API.
        </div>
      )}

      {/* Upgrade CTA */}
      <div className="pt-2">
        <button
          onClick={handlePurchase}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Subscribe via Google Play</span>
        </button>
      </div>
    </div>
  );
};

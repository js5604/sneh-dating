import React, { useState } from 'react';
import { DollarSign, Shield, Lock, TrendingUp, Users, Smartphone, Video, Eye, Sparkles, Check, ArrowLeft, KeyRound } from 'lucide-react';
import { OwnerMonetisationConfig } from '../../types/dating';
import { initialOwnerMonetisation } from '../../constants/initialData';

interface OwnerMonetisationViewProps {
  onBack: () => void;
}

export const OwnerMonetisationView: React.FC<OwnerMonetisationViewProps> = ({
  onBack
}) => {
  const [config, setConfig] = useState<OwnerMonetisationConfig>(initialOwnerMonetisation);
  const [isUnlocked, setIsUnlocked] = useState(true); // Pre-unlocked for owner Jatindersingh5604@gmail.com
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveConfig = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-gradient-to-b from-[#190c24] via-[#100717] to-[#08030c] text-slate-100 overflow-y-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 flex items-center gap-1.5">
              <span>Owner Monetisation Suite</span>
              <Lock className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-[11px] text-amber-300/80">
              Authorized Owner: {config.ownerEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Owner Badge */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Sole Proprietor Access:</span>
          <p className="text-[11px] text-amber-200/80 mt-0.5">
            Only you (<span className="underline font-mono">Jatindersingh5604@gmail.com</span>) can activate or deactivate monetization channels, adjust in-app subscription pricing, and collect revenue payouts.
          </p>
        </div>
      </div>

      {/* Financial Dashboard Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Revenue (INR)</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            ₹{config.metrics.totalRevenueInr.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">+18.4% this month</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Paid Subscribers</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {config.metrics.activeSubscribers}
          </div>
          <div className="text-[10px] text-sky-400 font-semibold">₹{config.metrics.monthlyRecurringRevenue.toLocaleString('en-IN')} MRR</div>
        </div>
      </div>

      {/* Monetization Channels Toggles */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Revenue Channels Control
        </h3>

        {/* 1. Google Play Subscriptions */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-semibold text-xs text-white">Google Play Subscriptions (Sneh Shahi)</h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Enables recurring monthly, quarterly, and annual VIP matchmaking passes.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.enableGooglePlayBilling}
            onChange={(e) => setConfig({ ...config, enableGooglePlayBilling: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {/* 2. Rewarded Video Ads */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <div className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-rose-400" />
              <h4 className="font-semibold text-xs text-white">AdMob Rewarded Video Ads</h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Singles can watch a 15-second sponsor video to get 3 free Super Likes. Generates eCPM revenue.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.enableRewardedAds}
            onChange={(e) => setConfig({ ...config, enableRewardedAds: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {/* 3. Native Discovery Banners */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-400" />
              <h4 className="font-semibold text-xs text-white">Native Discovery Sponsored Cards</h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Blends tasteful, verified brand advertisements every 15 cards in the discovery deck.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.enableDiscoveryBanners}
            onChange={(e) => setConfig({ ...config, enableDiscoveryBanners: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {/* 4. Instant Profile Boosts */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-xs text-white">Micro-Transaction Profile Boosts</h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Allow members to buy a ₹149 instant 30-minute top spotlight in their city.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.enableProfileBoost}
            onChange={(e) => setConfig({ ...config, enableProfileBoost: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Subscription Pricing Adjustment */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Subscription Price Matrix (INR)
        </h4>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">1 Month</label>
            <input
              type="number"
              value={config.plans.oneMonthPrice}
              onChange={(e) => setConfig({
                ...config,
                plans: { ...config.plans, oneMonthPrice: Number(e.target.value) }
              })}
              className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-center"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">3 Months</label>
            <input
              type="number"
              value={config.plans.threeMonthsPrice}
              onChange={(e) => setConfig({
                ...config,
                plans: { ...config.plans, threeMonthsPrice: Number(e.target.value) }
              })}
              className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-center"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">12 Months</label>
            <input
              type="number"
              value={config.plans.twelveMonthsPrice}
              onChange={(e) => setConfig({
                ...config,
                plans: { ...config.plans, twelveMonthsPrice: Number(e.target.value) }
              })}
              className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-center"
            />
          </div>
        </div>
      </div>

      {/* Direct Indian Bank Payout Info */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-1">
        <div className="font-semibold text-white">Owner Direct Payout Routing:</div>
        <p className="text-[11px] text-slate-400">
          Payouts processed directly to your linked Google Play Merchant Account and Indian Bank account via NEFT/UPI on the 15th of every month.
        </p>
      </div>

      {saveToast && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Monetization preferences saved securely.</span>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleSaveConfig}
        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <DollarSign className="w-4 h-4 stroke-[3px]" />
        <span>Save Monetisation Settings</span>
      </button>
    </div>
  );
};

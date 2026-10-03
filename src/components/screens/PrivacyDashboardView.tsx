import React, { useState } from 'react';
import { Lock, EyeOff, MapPin, CheckSquare, Download, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserProfile, Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface PrivacyDashboardViewProps {
  userProfile: UserProfile;
  language: Language;
  onUpdatePrivacySettings: (updated: Partial<UserProfile>) => void;
  onDeleteAccountConfirmed: () => void;
}

export const PrivacyDashboardView: React.FC<PrivacyDashboardViewProps> = ({
  userProfile,
  language,
  onUpdatePrivacySettings,
  onDeleteAccountConfirmed
}) => {
  const t = translations[language];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadData = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#0e0816] text-slate-100 overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <Lock className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-white">
            {t.privacyTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          In full accordance with India's Digital Personal Data Protection (DPDP) Act.
        </p>
      </div>

      {/* DPDP Statutory Guarantee Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
        <span className="font-bold block">Your Statutory Data Rights</span>
        <p className="text-[11px] text-amber-200/80 leading-relaxed">
          You hold irrevocable rights to access, correct, restrict processing, or permanently delete personal records stored in Sneh at any time.
        </p>
      </div>

      {/* Privacy Switches */}
      <div className="space-y-2.5">
        {/* Approximate Location */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <h4 className="font-semibold text-xs text-white">
              {t.approxDistanceSwitch}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.approxDistanceSub}
            </p>
          </div>
          <input
            type="checkbox"
            checked={userProfile.showApproxDistance}
            onChange={(e) => onUpdatePrivacySettings({ showApproxDistance: e.target.checked })}
            className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
          />
        </div>

        {/* Incognito Mode */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <h4 className="font-semibold text-xs text-white">
              {t.incognitoSwitch}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.incognitoSub}
            </p>
          </div>
          <input
            type="checkbox"
            checked={userProfile.incognito}
            onChange={(e) => onUpdatePrivacySettings({ incognito: e.target.checked })}
            className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
          />
        </div>

        {/* Read Receipts */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <h4 className="font-semibold text-xs text-white">
              {t.readReceiptsSwitch}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.readReceiptsSub}
            </p>
          </div>
          <input
            type="checkbox"
            checked={userProfile.readReceipts}
            onChange={(e) => onUpdatePrivacySettings({ readReceipts: e.target.checked })}
            className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Data Export Button */}
      <div>
        <button
          onClick={handleDownloadData}
          className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>{t.downloadDataBtn}</span>
        </button>

        {downloadSuccess && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>DPDP Archive compiled: `sneh_user_data_export.json` ready.</span>
          </div>
        )}
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="pt-2 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Permanent Deletion
        </h4>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.deleteAccountBtn}</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500 text-xs space-y-3">
            <div className="flex items-start gap-2 text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                {t.deleteAccountWarning}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-white font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={onDeleteAccountConfirmed}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

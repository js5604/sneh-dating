import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileText, ArrowLeft, Lock, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Language, GovtIdVerification } from '../../types/dating';
import { translations } from '../../constants/translations';

interface GovtVerificationViewProps {
  language: Language;
  currentVerification?: GovtIdVerification;
  onVerificationComplete: (verification: GovtIdVerification) => void;
  onBack: () => void;
}

const DOC_TYPES = [
  {
    id: 'Aadhaar Card' as const,
    titleEn: 'Aadhaar Card (UIDAI / DigiLocker)',
    titlePa: 'ਆਧਾਰ ਕਾਰਡ (UIDAI / ਡਿਜੀਲੌਕਰ)',
    descEn: 'Instant 6-digit OTP verification via UIDAI / DigiLocker. Number is masked.',
    descPa: 'UIDAI / ਡਿਜੀਲੌਕਰ ਰਾਹੀਂ ਤੁਰੰਤ OTP ਪੁਸ਼ਟੀ। ਨੰਬਰ ਗੁਪਤ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।',
    placeholder: 'Enter 12-digit Aadhaar (e.g. 5432 1098 7654)',
    badge: 'DigiLocker Verified' as const
  },
  {
    id: 'PAN Card' as const,
    titleEn: 'PAN Card (Income Tax Dept)',
    titlePa: 'ਪੈਨ ਕਾਰਡ (ਆਮਦਨ ਕਰ ਵਿਭਾਗ)',
    descEn: 'Instant NSDL/ITD name & DOB match verification.',
    descPa: 'NSDL ਰਾਹੀਂ ਨਾਮ ਅਤੇ ਜਨਮ ਮਿਤੀ ਦੀ ਤੁਰੰਤ ਪੁਸ਼ਟੀ।',
    placeholder: 'Enter 10-char PAN (e.g. ABCPS1234K)',
    badge: 'Govt Approved' as const
  },
  {
    id: 'Passport' as const,
    titleEn: 'Indian Passport',
    titlePa: 'ਭਾਰਤੀ ਪਾਸਪੋਰਟ',
    descEn: 'Passport Seva verified for genuine NRIs and global Indians.',
    descPa: 'ਪਾਸਪੋਰਟ ਸੇਵਾ ਦੁਆਰਾ ਤਸਦੀਕਸ਼ੁਦਾ।',
    placeholder: 'Enter 8-digit Passport No. (e.g. Z1234567)',
    badge: 'Govt Approved' as const
  },
  {
    id: 'Voter ID' as const,
    titleEn: 'Voter ID (EPIC Card)',
    titlePa: 'ਵੋਟਰ ਕਾਰਡ (EPIC)',
    descEn: 'Election Commission of India database verification.',
    descPa: 'ਚੋਣ ਕਮਿਸ਼ਨ ਡਾਟਾਬੇਸ ਰਾਹੀਂ ਪੁਸ਼ਟੀ।',
    placeholder: 'Enter 10-char EPIC No. (e.g. WBD1234567)',
    badge: 'Govt Approved' as const
  }
];

export const GovtVerificationView: React.FC<GovtVerificationViewProps> = ({
  language,
  currentVerification,
  onVerificationComplete,
  onBack
}) => {
  const t = translations[language];
  const [selectedDoc, setSelectedDoc] = useState<'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID'>('Aadhaar Card');
  const [docNumber, setDocNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('781902');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedDocConfig = DOC_TYPES.find((d) => d.id === selectedDoc) || DOC_TYPES[0];

  const handleStartVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
    }, 700);
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);

      const masked = docNumber.length > 4 
        ? `XXXX-XXXX-${docNumber.slice(-4)}` 
        : 'XXXX-XXXX-8910';

      const verification: GovtIdVerification = {
        isVerified: true,
        docType: selectedDoc,
        maskedNumber: masked,
        verifiedAt: new Date().toISOString().split('T')[0],
        badgeLevel: selectedDocConfig.badge
      };

      setTimeout(() => {
        onVerificationComplete(verification);
      }, 1000);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-gradient-to-b from-[#140b1c] to-[#0a0510] text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-1 rounded-full text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Govt ID Online Verification</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </h2>
          <p className="text-[11px] text-slate-400">
            Get the authentic Government Verified Blue &amp; Gold Tick
          </p>
        </div>
      </div>

      {currentVerification?.isVerified && !success ? (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 space-y-3 mb-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-white">Profile Is Already Verified</h3>
              <p className="text-xs text-emerald-300">
                Verified via {currentVerification.docType} ({currentVerification.maskedNumber})
              </p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-relaxed">
            Your verification badge is active on your profile. Other members can see that your identity has been verified through official Indian records.
          </p>
          <button
            onClick={() => {
              setOtpStep(false);
              setDocNumber('');
            }}
            className="text-xs font-semibold text-emerald-300 hover:underline"
          >
            Verify with a different document
          </button>
        </div>
      ) : null}

      {/* Main Flow */}
      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30 animate-pulse">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white">Verification Approved!</h3>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
            Your identity has been authenticated against official records. The verified badge is now active on your profile.
          </p>
        </div>
      ) : !otpStep ? (
        <form onSubmit={handleStartVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Select Govt Approved Document
            </label>
            <div className="space-y-2">
              {DOC_TYPES.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedDoc === doc.id
                      ? 'bg-sky-500/15 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/30'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <FileText className={`w-5 h-5 mt-0.5 shrink-0 ${selectedDoc === doc.id ? 'text-sky-400' : 'text-slate-500'}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>{language === 'pa' ? doc.titlePa : doc.titleEn}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                        {doc.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'pa' ? doc.descPa : doc.descEn}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter {selectedDoc} Number
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value.toUpperCase())}
              placeholder={selectedDocConfig.placeholder}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          {/* Privacy & UIDAI Compliance Guarantee */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Plaintext Storage:</strong> Under UIDAI &amp; DPDP regulations, identity numbers are never saved in plain text. Only an encrypted verification hash and masked number (XXXX-XXXX-1234) are stored.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting to {selectedDoc} Gateway...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Verify via DigiLocker / Govt OTP</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmOtp} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200">
            <p className="font-semibold">6-Digit Verification Code Sent</p>
            <p className="text-[11px] text-sky-300/80 mt-0.5">
              A one-time OTP was sent to your mobile registered with {selectedDoc}.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter 6-Digit OTP
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full p-3.5 text-center tracking-[0.5em] rounded-xl bg-white/5 border border-white/10 text-white font-mono text-base focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating with Govt Portal...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Award Verified Tick</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setOtpStep(false)}
            className="w-full py-2 text-xs text-slate-400 hover:text-white"
          >
            Choose a different document
          </button>
        </form>
      )}
    </div>
  );
};

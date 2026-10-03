import React, { useState, useEffect } from 'react';
import { Smartphone, KeyRound, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface AuthViewProps {
  language: Language;
  onAuthenticated: (phoneNumber: string) => void;
  onBack: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  language,
  onAuthenticated,
  onBack
}) => {
  const t = translations[language];
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(30);
  const [resendCount, setResendCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setTimer(30);
      setOtpCode('849201'); // Pre-fill sample OTP for convenience
    }, 600);
  };

  const handleResend = () => {
    if (timer > 0) return;
    if (resendCount >= 3) {
      setError('Too many OTP attempts. Rate limit engaged for 15 minutes.');
      return;
    }
    setResendCount((prev) => prev + 1);
    setTimer(30);
    setError(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated(`+91${phoneNumber}`);
    }, 500);
  };

  const handleSocialAuth = (provider: 'Google' | 'Facebook') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated(`+919876543210`);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#140b1c] to-[#0a0510] text-slate-100 overflow-y-auto">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          {otpSent ? <KeyRound className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
        </div>

        <h2 className="text-xl font-bold text-white mb-1.5">
          {otpSent ? t.enterOtpTitle : t.authTitle}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          {otpSent ? `${t.otpSub}${phoneNumber}` : t.authSub}
        </p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Indian Mobile Number
              </label>
              <div className="flex items-center rounded-xl bg-white/5 border border-white/10 overflow-hidden focus-within:border-rose-500">
                <span className="px-3 py-3 text-xs font-semibold text-amber-300 bg-white/5 border-r border-white/10 shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.mobilePlaceholder}
                  className="flex-1 p-3 bg-transparent text-white font-mono text-sm focus:outline-none"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Protected by Firebase App Check &amp; Play Integrity
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{t.sendOtp}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full p-3.5 text-center tracking-[0.5em] rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg focus:outline-none focus:border-rose-500"
                required
              />
              <div className="flex items-center justify-between text-xs mt-2 text-slate-400">
                <span>
                  {timer > 0 ? `${t.resendOtpIn}${timer}s` : 'Code expired'}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`text-xs font-semibold ${
                    timer === 0 ? 'text-amber-400 hover:underline' : 'text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {t.resendBtn}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>{t.verifyProceed}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full py-2 text-xs text-slate-400 hover:text-white"
            >
              Change Mobile Number
            </button>
          </form>
        )}

        {/* Social Authentication */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {t.orDivider}
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSocialAuth('Google')}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{t.googleLogin}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('Facebook')}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>{t.facebookLogin}</span>
          </button>
        </div>
      </div>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white"
        >
          Back
        </button>
      </div>
    </div>
  );
};

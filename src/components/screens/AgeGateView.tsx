import React, { useState } from 'react';
import { ShieldAlert, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface AgeGateViewProps {
  language: Language;
  onVerified: (calculatedAge: number, dob: string) => void;
  onBack: () => void;
}

export const AgeGateView: React.FC<AgeGateViewProps> = ({
  language,
  onVerified,
  onBack
}) => {
  const t = translations[language];
  const [day, setDay] = useState('14');
  const [month, setMonth] = useState('08');
  const [year, setYear] = useState('1998');
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const birthYear = parseInt(year, 10);
    const birthMonth = parseInt(month, 10) - 1;
    const birthDay = parseInt(day, 10);

    if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) {
      setError('Please enter a valid date of birth.');
      return;
    }

    const birthDate = new Date(birthYear, birthMonth, birthDay);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError(t.underageError);
      return;
    }

    if (!consentGiven) {
      setError('Please provide affirmative consent under the DPDP Act.');
      return;
    }

    onVerified(age, `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#140b1c] to-[#0a0510] text-slate-100 overflow-y-auto">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1.5">
          {t.ageGateTitle}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          {t.ageGateSub}
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.dobLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="DD"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="p-3 text-center rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                required
              />
              <input
                type="number"
                placeholder="MM"
                min="1"
                max="12"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="p-3 text-center rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                required
              />
              <input
                type="number"
                placeholder="YYYY"
                min="1940"
                max="2008"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="p-3 text-center rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Calculated Age: ~{Math.max(0, new Date().getFullYear() - (parseInt(year) || 2000))} years
            </p>
          </div>

          {/* Statutory DPDP Consent Checkbox (Never pre-ticked) */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mt-4">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="accent-rose-500 w-4 h-4 rounded mt-0.5"
              />
              <span className="text-xs text-slate-300 leading-snug">
                {t.ageConsent}
              </span>
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
            >
              {t.continueBtn}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

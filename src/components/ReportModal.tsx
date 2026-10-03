import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MatchProfile, SafetyReportSubmission } from '../types/dating';

interface ReportModalProps {
  targetProfile: MatchProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: SafetyReportSubmission, blockAlso: boolean) => void;
}

const REPORT_CATEGORIES = [
  'Scam / Demanding Money or UPI',
  'Harassment or Offensive Language',
  'Suspected Underage User (Under 18)',
  'Fake Profile / Impersonation',
  'Unwanted Explicit Content',
  'Hate Speech or Caste/Religious Bias',
  'Extortion or Blackmail Threat',
  'Other Policy Violation'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  targetProfile,
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [selectedCategory, setSelectedCategory] = useState(REPORT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [blockUserAlso, setBlockUserAlso] = useState(true);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reportId = `REP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const submission: SafetyReportSubmission = {
      id: reportId,
      reportedUserId: targetProfile.id,
      reportedUserName: targetProfile.name,
      category: selectedCategory,
      description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Received'
    };
    setSubmittedReportId(reportId);
    onSubmitReport(submission, blockUserAlso);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-[#1a1222] border border-white/10 p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base">Report &amp; Protect</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedReportId ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Report Submitted</h4>
            <p className="text-xs text-slate-300">
              Your grievance reference ID is:
            </p>
            <div className="py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 font-mono text-sm text-amber-300 inline-block">
              {submittedReportId}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our 24/7 Trust &amp; Safety team will review this case within 24 hours under the statutory Indian IT Rules. {targetProfile.name} will not be notified of who reported them.
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            <div>
              <p className="text-xs text-slate-300">
                Reporting <span className="font-semibold text-rose-300">{targetProfile.name}</span> ({targetProfile.city})
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reason for Report
              </label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {REPORT_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-rose-500/20 border-rose-500/60 text-white'
                        : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportCategory"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-rose-500"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Help us understand the context or attach screenshots..."
                className="w-full h-20 p-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={blockUserAlso}
                onChange={(e) => setBlockUserAlso(e.target.checked)}
                className="accent-rose-500 rounded"
              />
              <span>Also immediately block {targetProfile.name} from contacting me</span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

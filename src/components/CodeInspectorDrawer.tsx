import React, { useState } from 'react';
import { Code2, Copy, Check, FileText, Shield, Layers, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { kotlinCodeSnippets } from '../constants/kotlinSnippets';
import { AppScreen } from '../types/dating';

interface CodeInspectorDrawerProps {
  activeScreen: AppScreen;
  isOpen: boolean;
  onToggle: () => void;
}

export const CodeInspectorDrawer: React.FC<CodeInspectorDrawerProps> = ({
  activeScreen,
  isOpen,
  onToggle
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'rules' | 'architecture'>('compose');

  // Match active screen to appropriate snippet
  const getSnippetKey = (): string => {
    switch (activeScreen) {
      case 'discovery': return 'discovery';
      case 'chat':
      case 'matches': return 'chat';
      case 'safety': return 'safety';
      case 'privacy':
      case 'settings': return 'privacy';
      default: return 'discovery';
    }
  };

  const currentSnippet = kotlinCodeSnippets[getSnippetKey()] || kotlinCodeSnippets.discovery;
  const rulesSnippet = kotlinCodeSnippets.firestoreRules;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-xl bg-[#0e0915] border-l border-white/10 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#150d20]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>Android Code &amp; Architecture</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Native Kotlin</span>
            </h3>
            <p className="text-[11px] text-slate-400">Jetpack Compose • MVVM • Firebase • DPDP</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 transition-colors"
        >
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-[#120a1b] px-4 pt-2 gap-2">
        <button
          onClick={() => setActiveTab('compose')}
          className={`pb-2 px-3 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'compose'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Active UI ({currentSnippet.fileName})</span>
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-2 px-3 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'rules'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Firestore Rules</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-2 px-3 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'architecture'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>System Specs</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {activeTab === 'compose' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-400 bg-white/5 p-2 rounded-lg text-[11px]">
              <span className="truncate">{currentSnippet.filePath}</span>
              <button
                onClick={() => handleCopy(currentSnippet.code)}
                className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/15 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed text-[11px]">
              {currentSnippet.code}
            </div>

            <div className="font-sans text-xs text-slate-300 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
              <span className="font-semibold text-rose-300 block mb-1">Architecture Note:</span>
              {currentSnippet.explanation}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-400 bg-white/5 p-2 rounded-lg text-[11px]">
              <span>firestore.rules</span>
              <button
                onClick={() => handleCopy(rulesSnippet.code)}
                className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/15 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Rules'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-amber-300 overflow-x-auto whitespace-pre leading-relaxed text-[11px]">
              {rulesSnippet.code}
            </div>

            <div className="font-sans text-xs text-slate-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
              <span className="font-semibold text-amber-300 block mb-1">Security Enforcement:</span>
              {rulesSnippet.explanation}
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="font-sans space-y-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Complete Project Files in /android</span>
              </h4>
              <p className="text-slate-400 text-xs">
                The full native Android Gradle project has been synthesized in <code className="text-rose-300">/android</code>:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><code className="text-amber-300">android/build.gradle.kts</code> &amp; <code className="text-amber-300">app/build.gradle.kts</code></li>
                <li><code className="text-amber-300">AndroidManifest.xml</code> (Privacy-first permissions)</li>
                <li><code className="text-amber-300">res/values/strings.xml</code> (Full English locale)</li>
                <li><code className="text-amber-300">res/values-pa/strings.xml</code> (Full Punjabi ਪੰਜਾਬੀ locale)</li>
                <li><code className="text-amber-300">domain/model/Models.kt</code> &amp; <code className="text-amber-300">domain/repository/Repositories.kt</code></li>
                <li><code className="text-amber-300">ui/theme/Theme.kt</code> (Material 3 Dynamic / Dark / Light)</li>
                <li><code className="text-amber-300">ui/screens/discovery/DiscoveryScreen.kt</code></li>
                <li><code className="text-amber-300">ui/screens/chat/ChatScreen.kt</code></li>
                <li><code className="text-amber-300">ui/screens/safety/SafetyCenterScreen.kt</code></li>
                <li><code className="text-amber-300">ui/screens/privacy/PrivacyDashboardScreen.kt</code></li>
                <li><code className="text-amber-300">android/README.md</code> (All 11 production requirements detailed)</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">Indian Statutory &amp; DPDP Safeguards</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                • <strong>Approximate Location:</strong> Never broadcasts exact coordinates. Calculates approximate kilometers using regional geo-buckets.<br/>
                • <strong>Scam Heuristics:</strong> Real-time automated interception for UPI requests, suspicious bank transfers, and OTP phishing.<br/>
                • <strong>Grievance Mechanism:</strong> Immediate Report ID generation matching India IT Rules 2021 with 24h turnaround commitment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

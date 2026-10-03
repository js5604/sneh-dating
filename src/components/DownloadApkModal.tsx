import React, { useState } from 'react';
import { Smartphone, Download, Check, Copy, ExternalLink, X, Terminal, Sparkles, ShieldCheck, FileArchive, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { triggerDirectZipDownload } from '../utils/downloadZip';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isAndroid } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'zip' | 'direct' | 'build'>('zip');

  if (!isOpen) return null;

  const gradleCommand = `cd android\n./gradlew assembleDebug`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const success = triggerDirectZipDownload();
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#170e22] border border-rose-500/30 p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>Download Sneh Full Project ZIP</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Complete native Android &amp; web application bundle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('zip')}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 'zip'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Download ZIP
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 'direct'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Tap Install
          </button>
          <button
            onClick={() => setActiveTab('build')}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 'build'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Android Studio
          </button>
        </div>

        {/* Tab 1: Direct In-Browser Download ZIP Archive */}
        {activeTab === 'zip' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/30 text-xs space-y-2 text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero-Server In-Browser Download</span>
              </div>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                Generates and saves the full 112-file project directly inside your browser so it never fails with a 404 or URL not found error.
              </p>
            </div>

            {/* In-Browser Direct Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4 stroke-[2.5px]" />
              <span>Click to Download sneh-dating-app-full-source.zip</span>
            </button>

            {downloadSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Download started! Check your browser's Downloads folder.</span>
              </div>
            )}

            {/* Package Contents breakdown */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
              <span className="font-semibold text-white block">Archive Contents:</span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span><strong>/android/</strong>: Complete Kotlin Compose Android Studio project</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span><strong>/.github/workflows/build-apk.yml</strong>: Automated cloud APK builder</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span><strong>/src/</strong>: Full frontend, types, screens &amp; components</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span><strong>firestore.rules</strong>: India DPDP &amp; owner security rules</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: 1-Tap Direct Install on Android Phone (WebAPK / PWA) */}
        {activeTab === 'direct' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Instant Android App Installation (WebAPK)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Google Chrome and Samsung Internet on Android automatically generate a verified native <strong>.apk</strong> package when you install Sneh directly from the browser!
              </p>
            </div>

            {isInstallable ? (
              <button
                onClick={install}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Install Sneh App on this Device</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <span className="font-semibold text-white block">How to Install on Your Android Phone:</span>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                  <li>Open the live app in Chrome on your phone.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> menu in the top-right corner.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Android will immediately install Sneh with the custom icon, splash screen, and full-screen experience!</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Local Gradle / Android Studio Build */}
        {activeTab === 'build' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              Open the unzipped <code className="text-amber-300">/android</code> folder directly in <strong>Android Studio</strong> or run via terminal:
            </p>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-rose-400" />
                  <span>Build Command</span>
                </span>
                <button
                  onClick={() => handleCopy(gradleCommand)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-white/10 text-[10px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-emerald-300 text-xs overflow-x-auto whitespace-pre">
                {gradleCommand}
              </pre>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5">
              <span className="font-semibold text-white block">Output Location:</span>
              <p className="font-mono text-[11px] text-amber-300 break-all">
                android/app/build/outputs/apk/debug/app-debug.apk
              </p>
              <p className="text-[11px] text-slate-400">
                Transfer this APK to any Android phone to install immediately!
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

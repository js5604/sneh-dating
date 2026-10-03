import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, Check, Sparkles, X, Share2, Layers, ShieldCheck, Copy, ArrowRight, Monitor, ExternalLink, QrCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SetWallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterFullscreen: () => void;
}

export const SetWallpaperModal: React.FC<SetWallpaperModalProps> = ({
  isOpen,
  onClose,
  onEnterFullscreen,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'homescreen' | 'system_wallpaper'>('homescreen');
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Get current live URL
  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-sh4vkamzih2ny73pb7fo3z-470889263258.asia-southeast1.run.app';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    How to Install on Android
                  </h3>
                  <p className="text-xs text-white/60">
                    2 easy methods: Standalone Home App or System Live Wallpaper
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs (Functional interactive segmented control) */}
            <div className="p-3 bg-slate-950/40 border-b border-white/5 flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('homescreen')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'homescreen'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Method 1: Direct Android App (PWA)
              </button>
              <button
                onClick={() => setActiveTab('system_wallpaper')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'system_wallpaper'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Method 2: System OS Live Wallpaper
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'homescreen' ? (
                /* Tab 1: PWA Installation */
                <div className="space-y-4">
                  {/* Direct Native Install CTA */}
                  {isInstallable && !isInstalled && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/20 to-blue-600/20 border border-sky-400/40 space-y-3">
                      <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>Ready to Install Directly</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Your Android device detected the app manifest. Tap below to install <strong>AetherLive</strong> with its custom app icon directly to your home screen.
                      </p>
                      <button
                        onClick={handleNativeInstall}
                        className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-98 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Install AetherLive on Android Now</span>
                      </button>
                    </div>
                  )}

                  {isInstalled && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 font-semibold">
                      <Check className="w-4 h-4" />
                      <span>Already installed on this device in Standalone mode!</span>
                    </div>
                  )}

                  {/* Manual Instructions for Chrome / Samsung Internet */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>Manual 2-Step Installation in Chrome / Browser</span>
                    </h4>
                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/30">
                        <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                        <div>
                          Open this link on your phone in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong>, and tap the <strong>Three Dots (⋮)</strong> menu in the top-right corner.
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/30">
                        <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                        <div>
                          Tap <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>). Confirm the prompt.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fullscreen Ambient Mode */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-amber-400" />
                      <span>Instant Fullscreen Ambient Wallpaper</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Launches edge-to-edge on your phone with no browser bars. Excellent for desk docks, nightstands, and living room smart displays.
                    </p>
                    <button
                      onClick={() => {
                        onEnterFullscreen();
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Launch Fullscreen Ambient Screen</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Tab 2: System OS Live Wallpaper Instructions */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Set as True Android Live Wallpaper</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Android supports running interactive web live wallpapers directly behind your app icons and widgets. Follow these 4 steps:
                    </p>

                    {/* Steps */}
                    <div className="space-y-2.5 text-xs text-slate-300 pt-1">
                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                        <div>
                          On your Android phone, install a free live wallpaper loader app from the Play Store, such as <strong>"Web Live Wallpaper"</strong> or <strong>"Wallpaper Engine for Android"</strong>.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                        <div>
                          Copy your live AetherLive URL:
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={appUrl}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[11px] text-white/80 font-mono truncate"
                            />
                            <button
                              onClick={handleCopyUrl}
                              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
                            >
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                        <div>
                          Open the live wallpaper app, tap <strong>"Add Web Wallpaper"</strong> (or <strong>"Enter URL"</strong>), paste the URL, and tap Save.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[11px] font-bold shrink-0">4</span>
                        <div>
                          Tap <strong>"Apply / Set Wallpaper"</strong> and choose <strong>"Home Screen and Lock Screen"</strong>. Done!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Link Share & Copy */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Live Wallpaper URL:</span>
                <button
                  onClick={handleCopyUrl}
                  className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Share Link'}</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50">Supports all Android 11+ phones & tablets</span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

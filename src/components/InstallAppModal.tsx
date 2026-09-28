import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  X,
  Share,
  PlusSquare,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  HardDriveDownload,
  Apple,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/10 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">Install StackPipeline</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Android & iOS PWA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Install as a high-performance standalone app on your mobile home screen.
              </p>
            </div>
          </div>

          {/* Quick 1-Click Install CTA if browser supports prompt */}
          {isInstallable && !isInstalled && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-200 font-medium">
                  Instant 1-Click Installation Available on this browser!
                </span>
              </div>
              <button
                onClick={handleNativeInstall}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Install Now
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-emerald-300 font-medium">
                StackPipeline is already installed as a standalone app on your device!
              </span>
            </div>
          )}
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'android'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android (APK / PWA)
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'ios'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            iOS (iPhone / iPad)
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'desktop'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            Desktop (Mac/PC)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono mb-1 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  How to Install on Android
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Android supports Progressive Web Apps natively without requiring a sideloaded APK. Once installed, it behaves exactly like a native APK from Google Play — with full home screen integration, fast offline caching, and zero address bar clutter.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block">Open in Chrome or Samsung Internet</span>
                    Visit <code className="text-emerald-400 font-mono">stack-pipeline-studio.pages.dev</code> on your Android device.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block">Tap Menu or Install Prompt</span>
                    Tap the <strong>three dots menu (⋮)</strong> in Chrome at top right, or click the <strong>"Install App"</strong> button above.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block">Select "Install app" or "Add to Home screen"</span>
                    Android will create the StackPipeline app icon directly on your launcher. It launches full-screen and works offline!
                  </div>
                </div>
              </div>

              {/* Developer APK Packaging Note */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300 block mb-1">Want a signed APK for Google Play Store?</span>
                Because this app follows all PWA standards (manifest.json, service worker, 512px icons), you can generate a Google Play Store APK/AAB in 1 click using{' '}
                <a
                  href="https://www.pwabuilder.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  PWABuilder.com
                  <ExternalLink className="w-3 h-3" />
                </a>.
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono mb-1 flex items-center gap-2">
                  <Apple className="w-3.5 h-3.5 text-cyan-400" />
                  Install on iPhone & iPad (Safari)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Apple iOS allows web applications to be installed directly to the home screen as standalone apps with custom icons, gesture navigation, and offline cache support.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block flex items-center gap-1.5">
                      Tap the Share Button in Safari
                      <Share className="w-3.5 h-3.5 text-cyan-400" />
                    </span>
                    Open this site in <strong>Safari</strong> on iOS and tap the <strong>Share</strong> button at the bottom navigation bar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block flex items-center gap-1.5">
                      Tap "Add to Home Screen"
                      <PlusSquare className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                    Scroll down the share sheet menu and tap <strong>"Add to Home Screen"</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block">Confirm & Launch</span>
                    Tap <strong>Add</strong> in the top-right corner. The StackPipeline icon will appear on your iPhone/iPad home screen alongside your native apps!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono mb-1 flex items-center gap-2">
                  <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" />
                  Install on Mac, Windows & Linux
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Run StackPipeline in its own standalone desktop window with native OS taskbar and dock integration.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <strong className="text-slate-200 block mb-1">Google Chrome & Brave:</strong>
                  Click the <strong>Install icon</strong> in the address bar (on the right next to bookmark star), or open Menu (⋮) &gt; <em>"Save and share"</em> &gt; <em>"Install StackPipeline"</em>.
                </div>
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <strong className="text-slate-200 block mb-1">Microsoft Edge:</strong>
                  Click the <strong>App available icon</strong> in the URL bar, or open Settings &gt; <em>"Apps"</em> &gt; <em>"Install this site as an app"</em>.
                </div>
              </div>
            </div>
          )}

          {/* Benefits Grid */}
          <div className="border-t border-slate-800/80 pt-4">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              App Features & Benefits
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Offline Caching</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Browser URL Bar</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Home Screen Launcher</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>12-Hour Autopilot Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            PWA Standalone Engine · Service Worker Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC<{
  className?: string;
  variant?: 'compact' | 'full';
  onOpenModal: () => void;
}> = ({ className = '', variant = 'compact', onOpenModal }) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();

  // If already installed in standalone mode, show a subtle active badge or hide
  if (isInstalled) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInstallable) {
      install().then((success) => {
        if (!success) {
          onOpenModal();
        }
      });
    } else {
      onOpenModal();
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all ${className}`}
      >
        <Smartphone className="w-4 h-4" />
        <span>Install App (APK/iOS)</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition ${className}`}
      title="Install StackPipeline on Android or iOS"
    >
      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">App</span>
    </button>
  );
};

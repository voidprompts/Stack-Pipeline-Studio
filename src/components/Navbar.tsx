import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Search,
  FileCode,
  ShieldCheck,
  FolderGit2,
  Eye,
  EyeOff,
  Terminal,
  Zap,
  Bookmark,
  Mail,
  Rss,
  BookOpen,
  Menu,
  X,
  Download,
  Smartphone,
} from 'lucide-react';
import { PWAInstallButton } from './InstallAppModal';

interface NavbarProps {
  onOpenBookmarks?: () => void;
  onOpenNewsletter?: () => void;
  onOpenRSS?: () => void;
  onOpenInstallApp?: () => void;
  savedCount?: number;
  activeView: 'blog' | 'tutorial' | 'matrix' | 'studio';
  setActiveView: (view: 'blog' | 'tutorial' | 'matrix' | 'studio') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBookmarks,
  onOpenNewsletter,
  onOpenRSS,
  onOpenInstallApp,
  savedCount = 0,
  activeView,
  setActiveView,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="global-navbar print:hidden sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => {
              setActiveView('blog');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-slate-100 tracking-tight text-base">
                <span>StackPipeline</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded hidden sm:inline">
                  BLOG SSG
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 leading-none hidden sm:block">
                Enterprise B2B Architecture · AdSense Ready
              </div>
            </div>
          </div>

          {/* Desktop Navigation Views */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveView('blog')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'blog'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Articles &amp; Guides</span>
            </button>
            <button
              onClick={() => setActiveView('tutorial')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'tutorial'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Pipeline Walkthrough
            </button>
            <button
              onClick={() => setActiveView('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              SaaS Matrix &amp; Reviews
            </button>
            <button
              onClick={() => setActiveView('studio')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'studio'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Studio &amp; Flowchart
            </button>
          </nav>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button (Android / iOS / Desktop) */}
          {onOpenInstallApp && (
            <PWAInstallButton
              onOpenModal={onOpenInstallApp}
              className="cursor-pointer"
            />
          )}

          {/* Saved Articles Reading Library */}
          {onOpenBookmarks && (
            <button
              onClick={onOpenBookmarks}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                savedCount > 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Open your saved reading library"
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedCount > 0 ? 'fill-current text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Library</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] font-mono">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          {/* Newsletter Subscribe CTA */}
          {onOpenNewsletter && (
            <button
              onClick={onOpenNewsletter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Subscribe to weekly technical architecture dispatch"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Newsletter</span>
            </button>
          )}

          {/* RSS Feed CTA */}
          {onOpenRSS && (
            <button
              onClick={onOpenRSS}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Syndication RSS & Atom feed"
            >
              <Rss className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">RSS</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle mobile navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3 shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveView('blog');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                activeView === 'blog'
                  ? 'bg-slate-800 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Articles &amp; Guides</span>
            </button>

            <button
              onClick={() => {
                setActiveView('tutorial');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                activeView === 'tutorial'
                  ? 'bg-slate-800 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Walkthrough</span>
            </button>

            <button
              onClick={() => {
                setActiveView('matrix');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-slate-800 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>SaaS Matrix</span>
            </button>

            <button
              onClick={() => {
                setActiveView('studio');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                activeView === 'studio'
                  ? 'bg-slate-800 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Testing Studio</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
            {onOpenInstallApp && (
              <button
                onClick={() => {
                  onOpenInstallApp();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Install Mobile App (Android APK / iOS)</span>
              </button>
            )}

            {onOpenBookmarks && (
              <button
                onClick={() => {
                  onOpenBookmarks();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reading Library {savedCount > 0 ? `(${savedCount})` : ''}</span>
              </button>
            )}

            {onOpenNewsletter && (
              <button
                onClick={() => {
                  onOpenNewsletter();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Newsletter</span>
              </button>
            )}

            {onOpenRSS && (
              <button
                onClick={() => {
                  onOpenRSS();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-1.5"
              >
                <Rss className="w-3.5 h-3.5 text-amber-400" />
                <span>RSS Feed</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

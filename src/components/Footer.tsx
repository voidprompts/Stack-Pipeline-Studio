import React from 'react';
import { Layers, ExternalLink, Linkedin, Github, Smartphone } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'privacy' | 'terms' | 'affiliate' | 'editorial') => void;
  onOpenNewsletter?: () => void;
  onOpenRSS?: () => void;
  onOpenBookmarks?: () => void;
  onOpenInstallApp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenNewsletter,
  onOpenRSS,
  onOpenBookmarks,
  onOpenInstallApp,
}) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-100 text-sm tracking-tight">StackPipeline</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs">
              The premier engineering publication and benchmarking reference for enterprise B2B SaaS integrations, API topologies, and automated data workflows.
            </p>

            {/* Official Profiles */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/stack-pipeline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-[11px]"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/voidprompts/Stack-Pipeline-Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-[11px]"
              >
                <Github className="w-3.5 h-3.5 text-slate-200" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Quick Legal & Compliance Links */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-200 font-bold">
              Legal &amp; Compliance
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('affiliate')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  FTC Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy &amp; Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Terms of Service &amp; License
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('editorial')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  E-E-A-T Editorial Standards
                </button>
              </li>
            </ul>
          </div>

          {/* Publisher & Syndication */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-200 font-bold">
              Publisher &amp; Resources
            </div>
            <ul className="space-y-2">
              {onOpenInstallApp && (
                <li>
                  <button
                    onClick={onOpenInstallApp}
                    className="hover:text-emerald-400 text-emerald-400 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Install Mobile App (PWA / APK)</span>
                  </button>
                </li>
              )}
              {onOpenNewsletter && (
                <li>
                  <button
                    onClick={onOpenNewsletter}
                    className="hover:text-emerald-400 text-emerald-400/90 transition-colors text-left font-semibold cursor-pointer"
                  >
                    Weekly Architecture Newsletter
                  </button>
                </li>
              )}
              {onOpenBookmarks && (
                <li>
                  <button
                    onClick={onOpenBookmarks}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
                  >
                    <span>Saved Reading Library</span>
                  </button>
                </li>
              )}
              <li>
                {onOpenRSS ? (
                  <button
                    onClick={onOpenRSS}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
                  >
                    <span>RSS 2.0 Syndication</span>
                  </button>
                ) : (
                  <a
                    href="/rss.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-300"
                  >
                    <span>RSS 2.0 Feed</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>Sitemap Index</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with FTC Mandatory Notice */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © 2026 StackPipeline. All rights reserved. Software names and logos are trademarks of their respective owners.
          </p>
          <p className="text-slate-400 text-center md:text-right">
            Affiliate Disclosure: Some outbound links may earn StackPipeline a referral commission at no additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
};

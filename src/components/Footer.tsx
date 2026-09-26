import React from 'react';
import { Layers, ShieldAlert, FileText, Scale, Award, Globe, ExternalLink, Linkedin, Github } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'privacy' | 'terms' | 'affiliate' | 'editorial') => void;
  onOpenAdSenseCompliance: () => void;
  onOpenSEOInspector: () => void;
  onOpenNewsletter?: () => void;
  onOpenRSS?: () => void;
  onOpenBookmarks?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenAdSenseCompliance,
  onOpenSEOInspector,
  onOpenNewsletter,
  onOpenRSS,
  onOpenBookmarks,
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
              The premier B2B SaaS automation and workflow orchestration reference. Built on ultra-fast static site generation (SSG) with strict Google AdSense, FTC affiliate, and E-E-A-T useful content compliance.
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Edge Global CDN: 100% Uptime
              </span>
              <span>·</span>
              <span>Lighthouse 100/100</span>
              <span>·</span>
              <span>CLS = 0.00</span>
            </div>

            {/* Official Profiles & Repository */}
            <div className="flex items-center gap-3 pt-1">
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
                href="https://github.com/voidprompts/StackPipeline"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-[11px]"
              >
                <Github className="w-3.5 h-3.5 text-slate-200" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

            {/* Quick Legal & Compliance Links */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-200 font-bold">
              Legal & Compliance
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onOpenLegal('affiliate')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  FTC Affiliate Disclosure (16 CFR § 255)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Privacy Policy & DART Cookie
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Terms of Service & API License
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('editorial')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  E-E-A-T Editorial Review Standards
                </button>
              </li>
              {onOpenNewsletter && (
                <li>
                  <button
                    onClick={onOpenNewsletter}
                    className="hover:text-emerald-400 text-emerald-400/90 transition-colors text-left font-semibold"
                  >
                    Weekly Architecture Newsletter
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Crawler & Ad Exchange Directives */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-200 font-bold">
              Publisher & Syndication
            </div>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-400/90 font-semibold"
                >
                  <span>RSS 2.0 Feed (xml)</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70" />
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>sitemap.xml (Live Index)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              {onOpenBookmarks && (
                <li>
                  <button
                    onClick={onOpenBookmarks}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
                  >
                    <span>Saved Reading Library</span>
                  </button>
                </li>
              )}
              <li>
                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>public/ads.txt</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>public/robots.txt</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="/api/download-zip"
                  download="stackpipeline-complete-project.zip"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400 font-semibold"
                >
                  <span>Download Project (ZIP)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenSEOInspector}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>SEO Schema &amp; SERP Inspector</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdSenseCompliance}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>AdSense Status & Verification</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with FTC Mandatory Notice */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © 2026 StackPipeline (stackpipeline.com). All trademarks, logos, and software names are the property of their respective owners.
          </p>
          <p className="text-slate-400 text-center md:text-right">
            Affiliate Disclaimer: Outbound links may earn StackPipeline a referral commission at no additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
};

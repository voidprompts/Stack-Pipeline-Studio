import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface AdSenseBannerProps {
  placement: 'header_leaderboard' | 'in_content' | 'sidebar_sticky' | 'footer';
  slotId?: string;
  showAds: boolean;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  placement,
  slotId = '5829103921',
  showAds,
}) => {
  if (!showAds) {
    return (
      <div className="my-4 p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-500 font-mono">
        [AdSense Slot Disabled in Clean View · Placement: {placement}]
      </div>
    );
  }

  const placementConfig = {
    header_leaderboard: {
      height: 'min-h-[90px]',
      dimensionText: '728x90 Leaderboard (Responsive)',
      contextText: 'Top of Page · Above First Contentful Paint',
    },
    in_content: {
      height: 'min-h-[250px]',
      dimensionText: 'Responsive In-Article Rectangle',
      contextText: 'Injected after Step 2 · High Engagement Zone',
    },
    sidebar_sticky: {
      height: 'min-h-[400px]',
      dimensionText: '300x600 Half Page / 300x250 Medium Rectangle',
      contextText: 'Sticky Sidebar · 85%+ Viewability Score',
    },
    footer: {
      height: 'min-h-[90px]',
      dimensionText: '728x90 Bottom Anchor',
      contextText: 'Footer Banner · Zero CLS Reserved Boundary',
    },
  }[placement];

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 w-full rounded-xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-3 shadow-inner flex flex-col items-center justify-center transition-all ${placementConfig.height}`}
    >
      <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800/60 text-[10px] uppercase font-mono tracking-wider text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Google AdSense Verified Slot · ca-pub-9284719038291048
        </span>
        <span className="text-slate-400">Slot #{slotId}</span>
      </div>

      {/* Simulated Live Responsive Ad Rendering */}
      <div className="w-full py-4 px-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 rounded-lg border border-slate-800/50 my-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            Ad
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono mb-0.5">Sponsored · cloudflare.com/developer-platform</div>
            <div className="text-sm font-semibold text-slate-200">
              Deploy Static Sites Globally on Cloudflare Pages Edge
            </div>
            <div className="text-xs text-slate-400 mt-1 max-w-xl">
              Zero cold starts, automatic Git deployments, and unlimited free bandwidth for high-traffic B2B web applications.
            </div>
          </div>
        </div>

        <a
          href="https://pages.cloudflare.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          Start Building Free
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="w-full flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
        <span>{placementConfig.dimensionText}</span>
        <span>{placementConfig.contextText}</span>
      </div>
    </aside>
  );
};

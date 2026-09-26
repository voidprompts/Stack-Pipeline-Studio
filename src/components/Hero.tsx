import React, { useState } from 'react';
import { IntegrationTutorial } from '../types';
import { Search, ArrowRight, Zap, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroProps {
  tutorials: IntegrationTutorial[];
  selectedTutorialId: string;
  onSelectTutorial: (id: string) => void;
  onOpenRewrittenPrompt: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  tutorials,
  selectedTutorialId,
  onSelectTutorial,
  onOpenRewrittenPrompt,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTutorials = tutorials.filter(
    (t) =>
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.softwareA.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.softwareB.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section className="pt-8 pb-10 border-b border-slate-800/60">
      {/* Top Value Proposition Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Astro 5.x Jamstack
          </span>
          <span className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AdSense & ads.txt Certified
          </span>
          <span className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            100/100 Core Web Vitals
          </span>
        </div>

        <button
          onClick={onOpenRewrittenPrompt}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-medium group"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inspect Master Architectural Specification</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Headline */}
      <div className="max-w-4xl">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
          B2B SaaS Integration & Automation Architecture
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
          Production-grade tutorials connecting modern B2B software stacks with zero runtime bloat. 
          Real webhook code, rate-limit governance, deduplication logic, and instant JSON blueprints.
        </p>
      </div>

      {/* Interactive Quick-Switch Tutorial Bar */}
      <div className="mt-8 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Active Programmatic Tutorials:</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {filteredTutorials.length} Complete Guides
            </span>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by software name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredTutorials.map((tut) => {
            const isSelected = tut.id === selectedTutorialId;
            return (
              <button
                key={tut.id}
                onClick={() => onSelectTutorial(tut.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 text-slate-100 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/15 rounded-bl-full flex items-start justify-end p-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1 line-clamp-1">
                  {tut.architectureType}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100 leading-snug line-clamp-1">
                  {tut.softwareA.name} to {tut.softwareB.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{tut.difficulty} · {tut.estimatedMinutes}m</span>
                  <span className="text-emerald-400 font-mono text-[9px]">E-E-A-T Verified</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

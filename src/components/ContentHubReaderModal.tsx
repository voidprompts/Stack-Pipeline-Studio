import React, { useState, useEffect, useMemo } from 'react';
import { ToolComparison, ToolAlternativesHub } from '../types';
import { getToolOfficialUrl } from '../data/saasWebsites';
import {
  CANONICAL_SITE_URL,
  getCanonicalCompareUrl,
  getCanonicalAlternativesUrl,
} from '../data/canonicalConfig';
import {
  X,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  GitCompare,
  Layers,
  ChevronDown,
  Share2,
  Printer,
} from 'lucide-react';

interface ContentHubReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison?: ToolComparison | null;
  alternativesHub?: ToolAlternativesHub | null;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'affiliate' | 'editorial') => void;
}

export const ContentHubReaderModal: React.FC<ContentHubReaderModalProps> = ({
  isOpen,
  onClose,
  comparison,
  alternativesHub,
  onOpenLegal,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedShare, setCopiedShare] = useState(false);

  // Compute canonical deep-link URL for sharing and social distribution
  const shareUrl = useMemo(() => {
    if (comparison) {
      return getCanonicalCompareUrl(comparison.slug);
    }
    if (alternativesHub) {
      return getCanonicalAlternativesUrl(alternativesHub.slug);
    }
    return CANONICAL_SITE_URL;
  }, [comparison, alternativesHub]);

  const handleShare = async () => {
    const title = comparison ? comparison.title : alternativesHub?.title || 'StackPipeline Comparison';
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this architecture benchmark on StackPipeline: ${title}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Dynamically update OpenGraph, Twitter tags, and address bar when viewing a comparison or alternatives hub
  useEffect(() => {
    if (!isOpen || (!comparison && !alternativesHub)) return;

    const originalTitle = document.title;
    const targetTitle = comparison ? comparison.title : alternativesHub?.title || '';
    const targetDesc = comparison ? comparison.metaDescription : alternativesHub?.metaDescription || '';
    const targetSlug = comparison ? comparison.slug : alternativesHub?.slug || '';
    const brandedTitle = `${targetTitle} | StackPipeline`;
    const canonicalUrl = comparison ? getCanonicalCompareUrl(targetSlug) : getCanonicalAlternativesUrl(targetSlug);
    const socialImageUrl = `${CANONICAL_SITE_URL}/og/${targetSlug}.svg`;

    document.title = brandedTitle;

    // Keep browser address bar in exact sync with opened modal
    if (typeof window !== 'undefined') {
      const paramKey = comparison ? 'compare' : 'alternatives';
      const currentVal = new URLSearchParams(window.location.search).get(paramKey);
      if (currentVal !== targetSlug) {
        window.history.replaceState(null, '', `?${paramKey}=${targetSlug}`);
      }
    }

    const cleanups: Array<() => void> = [];

    const setMeta = (attributeKey: 'name' | 'property', attributeVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${attributeKey}="${attributeVal}"]`) as HTMLMetaElement | null;
      const existed = !!el;
      const originalValue = el ? el.getAttribute('content') : null;

      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeKey, attributeVal);
        el.setAttribute('data-dynamic-meta', 'true');
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);

      cleanups.push(() => {
        if (existed && originalValue !== null) {
          el?.setAttribute('content', originalValue);
        } else if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };

    setMeta('name', 'description', targetDesc);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:title', brandedTitle);
    setMeta('property', 'og:description', targetDesc);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:site_name', 'StackPipeline');
    setMeta('property', 'og:image', socialImageUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', brandedTitle);
    setMeta('name', 'twitter:description', targetDesc);
    setMeta('name', 'twitter:image', socialImageUrl);

    return () => {
      document.title = originalTitle;
      cleanups.reverse().forEach((fn) => fn());
    };
  }, [isOpen, comparison, alternativesHub]);

  if (!isOpen || (!comparison && !alternativesHub)) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              {comparison ? <GitCompare className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                  {comparison ? 'Head-to-Head Comparison' : 'Top Alternatives Hub'}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Autonomously Evaluated · AdSense &amp; E-E-A-T Verified
                </span>
              </div>
              <h2 id="reader-modal-title" className="text-base sm:text-lg font-bold text-slate-100 truncate">
                {comparison ? comparison.title : alternativesHub?.title}
              </h2>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Share or copy direct link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
              title="Print clean architecture report"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* COMPARISON VIEW */}
          {comparison && (
            <div className="space-y-6">
              {/* Meta & Verdict Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Executive Architectural Verdict</span>
                </div>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {comparison.verdictSummary}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Winner: <strong className="text-emerald-400">{comparison.toolA.name}</strong></span>
                  <span>·</span>
                  <span>Evaluated: {comparison.publishDate}</span>
                  <span>·</span>
                  <span>Audited by: {comparison.technicalReviewer.name}</span>
                </div>
              </div>

              {/* Head-to-Head Card Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-100">{comparison.toolA.name}</h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{comparison.toolA.startingPrice}</span>
                  </div>
                  <p className="text-xs text-slate-400">{comparison.toolA.tagline}</p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">Strengths:</div>
                    {comparison.prosConsA.pros.map((p, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`/go/${comparison.toolA.slug || comparison.toolA.name.toLowerCase()}`}
                    target="_blank"
                    rel="sponsored noopener"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    Visit {comparison.toolA.name} (Official Website)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-100">{comparison.toolB.name}</h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{comparison.toolB.startingPrice}</span>
                  </div>
                  <p className="text-xs text-slate-400">{comparison.toolB.tagline}</p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">Strengths:</div>
                    {comparison.prosConsB.pros.map((p, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`/go/${comparison.toolB.slug || comparison.toolB.name.toLowerCase()}`}
                    target="_blank"
                    rel="sponsored noopener"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Visit {comparison.toolB.name} (Official Website)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Technical API Benchmark Showdown */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Technical API &amp; Webhook Benchmarks</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">{comparison.toolA.name} Rate Limit</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">{comparison.apiBenchmark.rateLimitA}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">{comparison.toolB.name} Rate Limit</div>
                    <div className="text-slate-200 font-bold text-sm mt-0.5">{comparison.apiBenchmark.rateLimitB}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">Webhook Latency</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">{comparison.apiBenchmark.webhookLatencyA}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">Unit Cost / 10k Ops</div>
                    <div className="text-amber-400 font-bold text-sm mt-0.5">{comparison.apiBenchmark.costPer10kEvents}</div>
                  </div>
                </div>
              </div>

              {/* Feature Matrix Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-100">Architectural Feature Matrix</h3>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Evaluation Parameter</th>
                        <th className="p-3">{comparison.toolA.name}</th>
                        <th className="p-3">{comparison.toolB.name}</th>
                        <th className="p-3 text-right">Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                      {comparison.featureMatrix.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-900/80">
                          <td className="p-3 font-semibold text-slate-200">{row.feature}</td>
                          <td className="p-3 text-slate-300">{row.toolAValue}</td>
                          <td className="p-3 text-slate-300">{row.toolBValue}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              row.advantage === 'toolA'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : row.advantage === 'toolB'
                                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {row.advantage === 'toolA' ? comparison.toolA.name : row.advantage === 'toolB' ? comparison.toolB.name : 'Parity'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Migration Checklist */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold">Zero-Downtime Migration Checklist</h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {comparison.migrationChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center shrink-0 font-mono mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ALTERNATIVES HUB VIEW */}
          {alternativesHub && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                  {alternativesHub.category} Category Benchmark
                </div>
                <h3 className="text-base font-bold text-slate-100">{alternativesHub.h1}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{alternativesHub.metaDescription}</p>
                <div className="pt-2 text-xs font-mono text-slate-400">
                  <strong>Decision Rule:</strong> {alternativesHub.decisionFlow}
                </div>
              </div>

              {/* Ranked Alternatives Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-100">Top Ranked Alternatives to {alternativesHub.primaryTool.name}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {alternativesHub.alternatives.map((alt) => (
                    <div
                      key={alt.rank}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-900/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold font-mono flex items-center justify-center">
                            #{alt.rank}
                          </span>
                          <h4 className="text-sm font-bold text-slate-100">{alt.tool.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {alt.tool.startingPrice}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Migration: {alt.migrationDifficulty}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-300 font-medium">✓ Why Better: {alt.whyBetter}</p>
                        <p className="text-xs text-slate-400">⚠ Caveat: {alt.whyWorse}</p>
                        <p className="text-[11px] font-mono text-slate-500">{alt.pricingComparison}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <a
                          href={`/go/${alt.tool.slug || alt.tool.name.toLowerCase()}`}
                          target="_blank"
                          rel="sponsored noopener"
                          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                        >
                          Explore {alt.tool.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Criteria */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold">Standardized Benchmark Criteria</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {alternativesHub.selectionCriteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Frequently Asked Questions */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Frequently Asked Questions (Schema.org / FAQPage)</span>
            </h3>
            <div className="space-y-2">
              {(comparison ? comparison.faq : alternativesHub?.faq || []).map((faq, idx) => (
                <div key={idx} className="border border-slate-800 rounded-lg bg-slate-950/60 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-3 text-left text-xs font-semibold text-slate-200 flex items-center justify-between hover:bg-slate-900 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-3 pb-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex-1 pr-2">
            <p className="text-[11px] leading-relaxed text-slate-400">
              <strong className="text-slate-300">FTC Disclosure:</strong> Content contains sponsored affiliate links (<code className="text-emerald-400 font-mono text-[10px]">rel="sponsored noopener"</code>). StackPipeline may earn compensation from qualified partner sign-ups at zero additional cost to you.
              {onOpenLegal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenLegal('affiliate');
                  }}
                  className="ml-1.5 text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer font-medium"
                >
                  View Full Affiliate Disclosure
                </button>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Share or copy direct link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Share Guide</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

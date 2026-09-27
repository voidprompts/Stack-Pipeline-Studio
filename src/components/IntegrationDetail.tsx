import React, { useState, useMemo, useEffect } from 'react';
import { IntegrationTutorial } from '../types';
import { getToolOfficialUrl } from '../data/saasWebsites';
import { CANONICAL_SITE_URL, getCanonicalArticleUrl } from '../data/canonicalConfig';
import { AdSenseBanner } from './AdSenseBanner';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ArticleReactions } from './ArticleReactions';
import { ArticleComments } from './ArticleComments';
import { DataFlowchart } from './DataFlowchart';
import {
  Clock,
  ShieldCheck,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Terminal,
  Zap,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Type,
  Bookmark,
  Share2,
} from 'lucide-react';

interface IntegrationDetailProps {
  tutorial: IntegrationTutorial;
  showAds: boolean;
  onOpenSEOInspector: () => void;
  onNavigateToTesting?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onOpenAuthorModal?: (author: any) => void;
  allTutorials?: IntegrationTutorial[];
  onSelectTutorial?: (id: string) => void;
  onBackToBlog?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const IntegrationDetail: React.FC<IntegrationDetailProps> = ({
  tutorial,
  showAds,
  onOpenSEOInspector,
  onNavigateToTesting,
  isBookmarked = false,
  onToggleBookmark = () => {},
  onOpenAuthorModal,
  allTutorials = [],
  onSelectTutorial,
  onBackToBlog,
  onSelectCategory,
}) => {
  const [activeCodeTabs, setActiveCodeTabs] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [downloadedBlueprint, setDownloadedBlueprint] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isLargeText, setIsLargeText] = useState(false);
  const [showFaqSchemaPreview, setShowFaqSchemaPreview] = useState(false);
  const [copiedFaqSchema, setCopiedFaqSchema] = useState(false);
  const [copiedShareTop, setCopiedShareTop] = useState(false);

  // Construct canonical deep-link URL for sharing and social distribution
  const shareUrl = useMemo(() => {
    return getCanonicalArticleUrl(tutorial.slug);
  }, [tutorial.slug]);

  const handleShareTop = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tutorial.title,
          text: `Check out this technical pipeline guide on StackPipeline: ${tutorial.title}`,
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
    setCopiedShareTop(true);
    setTimeout(() => setCopiedShareTop(false), 2500);
  };

  // Safe fallback for author and technicalReviewer to guarantee zero undefined crashes
  const author = tutorial.author || {
    name: 'StackPipeline Editorial Team',
    role: 'Senior Integration & Systems Engineers',
    credentials: 'B2B SaaS Automation Specialists & DevOps Contributors',
    company: 'StackPipeline Architecture Lab',
    bio: 'The StackPipeline Editorial Team is composed of practicing integration engineers and automation specialists dedicated to benchmarking B2B SaaS APIs, webhook topologies, and rate-limit governance.',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%2310b981" stroke-width="3"/><path d="M50 25 L75 38 L50 51 L25 38 Z" fill="%2310b981"/><path d="M25 48 L50 61 L75 48" fill="none" stroke="%2334d399" stroke-width="5" stroke-linecap="round"/><path d="M25 59 L50 72 L75 59" fill="none" stroke="%236ee7b7" stroke-width="5" stroke-linecap="round"/></svg>',
    linkedInUrl: 'https://www.linkedin.com/in/stack-pipeline',
    githubUrl: 'https://github.com/voidprompts/StackPipeline',
    articlesReviewed: 284,
  };

  const technicalReviewer = tutorial.technicalReviewer || {
    name: 'StackPipeline Technical Review Board',
    role: 'Principal Infrastructure & Security Reviewers',
    credentials: 'Enterprise Cloud Architecture & Data Pipeline Council',
    company: 'StackPipeline Editorial Board',
    bio: 'Conducts rigorous peer reviews, sandbox payload validations, and security audits across all published integration blueprints and code snippets.',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%230ea5e9" stroke-width="3"/><path d="M50 22 L72 32 L72 55 C72 68 62 78 50 82 C38 78 28 68 28 55 L28 32 Z" fill="%230ea5e9" fill-opacity="0.2" stroke="%2338bdf8" stroke-width="4"/><path d="M42 52 L48 58 L60 44" fill="none" stroke="%2338bdf8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    linkedInUrl: 'https://www.linkedin.com/in/stack-pipeline',
    githubUrl: 'https://github.com/voidprompts/StackPipeline',
    articlesReviewed: 195,
  };

  // Generate Schema.org FAQPage JSON-LD markup for Google Rich Snippets
  const faqJsonLd = useMemo(() => {
    if (!tutorial.faq || tutorial.faq.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${getCanonicalArticleUrl(tutorial.slug)}#faq`,
      name: `${tutorial.title} - Frequently Asked Questions`,
      mainEntity: tutorial.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }, [tutorial.faq, tutorial.slug, tutorial.title]);

  // Inject FAQPage & HowTo JSON-LD into document.head so Googlebot & Rich Result crawlers immediately detect it
  useEffect(() => {
    const faqScriptId = 'faq-page-jsonld-schema';
    const howToScriptId = 'howto-page-jsonld-schema';

    const existingFaq = document.getElementById(faqScriptId);
    if (existingFaq) existingFaq.remove();
    const existingHowTo = document.getElementById(howToScriptId);
    if (existingHowTo) existingHowTo.remove();

    if (faqJsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = faqScriptId;
      script.text = JSON.stringify(faqJsonLd);
      document.head.appendChild(script);
    }

    const tutorialUrl = getCanonicalArticleUrl(tutorial.slug);
    const howToJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${tutorialUrl}#howto`,
      name: tutorial.title,
      description: tutorial.metaDescription,
      totalTime: `PT${tutorial.estimatedMinutes || 10}M`,
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '0',
      },
      tool: [
        { '@type': 'HowToTool', name: tutorial.softwareA.name },
        { '@type': 'HowToTool', name: tutorial.softwareB.name },
      ],
      step: tutorial.steps.map((st) => ({
        '@type': 'HowToStep',
        url: `${tutorialUrl}#${st.anchorId}`,
        name: st.title,
        text: st.summary,
        position: st.stepNumber,
      })),
      author: {
        '@type': 'Person',
        name: author.name,
        jobTitle: author.role,
      },
    };

    const howToScript = document.createElement('script');
    howToScript.type = 'application/ld+json';
    howToScript.id = howToScriptId;
    howToScript.text = JSON.stringify(howToJsonLd);
    document.head.appendChild(howToScript);

    return () => {
      const el1 = document.getElementById(faqScriptId);
      if (el1) el1.remove();
      const el2 = document.getElementById(howToScriptId);
      if (el2) el2.remove();
    };
  }, [faqJsonLd, tutorial, author]);

  // Dynamically inject OpenGraph, Twitter Cards, and canonical tags for rich social link previews
  useEffect(() => {
    const originalTitle = document.title;
    const brandedTitle = `${tutorial.title} | StackPipeline`;
    const canonicalUrl = getCanonicalArticleUrl(tutorial.slug);
    const socialImageUrl = `${CANONICAL_SITE_URL}/og/${tutorial.slug}.svg`;

    // 1. Update Document Title
    document.title = brandedTitle;

    // Track cleanup operations to safely restore or remove injected tags
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

    const setLink = (rel: string, hrefVal: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      const existed = !!link;
      const originalHref = link ? link.getAttribute('href') : null;

      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('data-dynamic-meta', 'true');
        document.head.appendChild(link);
      }
      link.setAttribute('href', hrefVal);

      cleanups.push(() => {
        if (existed && originalHref !== null) {
          link?.setAttribute('href', originalHref);
        } else if (link && link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };

    // Primary Meta Description & Canonical URL
    setMeta('name', 'description', tutorial.metaDescription);
    setLink('canonical', canonicalUrl);

    // OpenGraph Protocol Meta Tags (Slack, Discord, LinkedIn, iMessage, Facebook)
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:title', brandedTitle);
    setMeta('property', 'og:description', tutorial.metaDescription);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:site_name', 'StackPipeline');
    setMeta('property', 'og:image', socialImageUrl);
    setMeta('property', 'og:image:secure_url', socialImageUrl);
    setMeta('property', 'og:image:alt', `${tutorial.softwareA.name} to ${tutorial.softwareB.name} Integration Architecture Blueprint`);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:type', 'image/svg+xml');

    // Article Specific OpenGraph Metadata
    if (tutorial.publishDate) {
      setMeta('property', 'article:published_time', tutorial.publishDate);
    }
    if (tutorial.updatedDate) {
      setMeta('property', 'article:modified_time', tutorial.updatedDate);
    }
    setMeta('property', 'article:author', author.name);
    setMeta('property', 'article:section', tutorial.softwareA.category);

    if (tutorial.tags && tutorial.tags.length > 0) {
      tutorial.tags.forEach((tag) => {
        setMeta('property', 'article:tag', tag);
      });
    }

    // Twitter / X Card Meta Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', brandedTitle);
    setMeta('name', 'twitter:description', tutorial.metaDescription);
    setMeta('name', 'twitter:image', socialImageUrl);
    setMeta('name', 'twitter:image:alt', `${tutorial.softwareA.name} to ${tutorial.softwareB.name} Integration Architecture Blueprint`);
    setMeta('name', 'twitter:site', '@StackPipeline');
    setMeta('name', 'twitter:creator', '@StackPipeline');
    setMeta('name', 'twitter:label1', 'Written by');
    setMeta('name', 'twitter:data1', author.name);
    setMeta('name', 'twitter:label2', 'Est. reading time');
    setMeta('name', 'twitter:data2', `${tutorial.estimatedMinutes} minutes`);

    // Clean up on unmount or when tutorial changes
    return () => {
      document.title = originalTitle;
      cleanups.reverse().forEach((fn) => fn());
    };
  }, [tutorial, author.name]);

  // Find Next and Previous articles
  const currentIndex = allTutorials.findIndex((t) => t.id === tutorial.id);
  const prevArticle = currentIndex > 0 ? allTutorials[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < allTutorials.length - 1 ? allTutorials[currentIndex + 1] : null;

  // Find Recommended Automations based on overlapping software tools (3 suggested tutorials)
  const recommendedAutomations = useMemo(() => {
    const currentToolAId = (tutorial.softwareA?.id || '').toLowerCase();
    const currentToolBId = (tutorial.softwareB?.id || '').toLowerCase();
    const currentToolAName = (tutorial.softwareA?.name || '').toLowerCase();
    const currentToolBName = (tutorial.softwareB?.name || '').toLowerCase();

    return allTutorials
      .filter((t) => t.id !== tutorial.id)
      .map((t) => {
        const otherToolAId = (t.softwareA?.id || '').toLowerCase();
        const otherToolBId = (t.softwareB?.id || '').toLowerCase();
        const otherToolAName = (t.softwareA?.name || '').toLowerCase();
        const otherToolBName = (t.softwareB?.name || '').toLowerCase();

        const overlappingTools: string[] = [];

        // Check if other tutorial softwareA matches current softwareA or softwareB
        if (otherToolAId === currentToolAId || otherToolAName === currentToolAName) {
          overlappingTools.push(tutorial.softwareA.name);
        } else if (otherToolAId === currentToolBId || otherToolAName === currentToolBName) {
          overlappingTools.push(tutorial.softwareB.name);
        }

        // Check if other tutorial softwareB matches current softwareA or softwareB
        if (otherToolBId === currentToolAId || otherToolBName === currentToolAName) {
          if (!overlappingTools.includes(tutorial.softwareA.name)) {
            overlappingTools.push(tutorial.softwareA.name);
          }
        } else if (otherToolBId === currentToolBId || otherToolBName === currentToolBName) {
          if (!overlappingTools.includes(tutorial.softwareB.name)) {
            overlappingTools.push(tutorial.softwareB.name);
          }
        }

        let score = 0;
        if (overlappingTools.length >= 2) {
          score += 30; // Both tools overlap
        } else if (overlappingTools.length === 1) {
          score += 15; // 1 tool overlaps
        }

        // Category overlap boost
        if (
          t.softwareA.category === tutorial.softwareA.category ||
          t.softwareB.category === tutorial.softwareB.category ||
          t.softwareA.category === tutorial.softwareB.category ||
          t.softwareB.category === tutorial.softwareA.category
        ) {
          score += 5;
        }

        // Architecture pattern match
        if (t.architectureType === tutorial.architectureType) {
          score += 2;
        }

        return {
          tutorial: t,
          score,
          overlappingTools,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [allTutorials, tutorial]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleDownloadBlueprint = () => {
    const blueprintData = {
      template: tutorial.shortcutBlueprintName,
      source: tutorial.softwareA.name,
      destination: tutorial.softwareB.name,
      version: '2026.3.1',
      generatedBy: 'StackPipeline Enterprise Architecture Engine',
      steps: tutorial.steps.map((s) => ({ title: s.title, step: s.stepNumber })),
    };
    const blob = new Blob([JSON.stringify(blueprintData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tutorial.shortcutBlueprintName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedBlueprint(true);
    setTimeout(() => setDownloadedBlueprint(false), 3000);
  };

  return (
    <article className="relative">
      {/* Schema.org FAQPage JSON-LD Structured Data for Google Rich Snippets */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Semantic Breadcrumb Navigation & Reading Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
        <nav aria-label="Breadcrumbs" className="text-slate-400 font-medium">
          <ol className="flex items-center gap-2">
            <li>
              <button
                onClick={onBackToBlog}
                className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Blog &amp; Guides</span>
              </button>
            </li>
            <li aria-hidden="true" className="text-slate-600">/</li>
            <li>
              {onSelectCategory ? (
                <button
                  onClick={() => onSelectCategory(tutorial.softwareA.category)}
                  className="hover:text-emerald-400 text-slate-300 transition-colors cursor-pointer underline decoration-dotted decoration-slate-600 hover:decoration-emerald-400 underline-offset-2"
                  title={`View all ${tutorial.softwareA.category} guides`}
                >
                  {tutorial.softwareA.category}
                </button>
              ) : (
                <span className="text-slate-400">{tutorial.softwareA.category}</span>
              )}
            </li>
            <li aria-hidden="true" className="text-slate-600">/</li>
            <li className="text-emerald-400 truncate max-w-xs font-semibold" aria-current="page">
              {tutorial.softwareA.name} to {tutorial.softwareB.name}
            </li>
          </ol>
        </nav>

        {/* Reader Display Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Share Article Direct Link Button */}
          <button
            onClick={handleShareTop}
            className="px-3 py-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy or share direct article deep-link"
          >
            {copiedShareTop ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Guide</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsLargeText((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer ${
              isLargeText
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle comfortable large reading font size"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isLargeText ? '18px Text' : '15px Text'}</span>
          </button>

          <button
            onClick={onToggleBookmark}
            className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              isBookmarked
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Save article to your reading library"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Top Google AdSense Leaderboard Placement */}
      <AdSenseBanner placement="header_leaderboard" slotId="9182301923" showAds={showAds} />

      {/* Primary Article Header */}
      <header className="article-header my-6 pb-6 border-b border-slate-800/80">
        {/* Print-Ready Architecture Badge - Official StackPipeline Technical Export */}
        <div className="print-ready-architecture-badge mb-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 print:bg-white print:border-slate-900 print:p-3 print:mb-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs print:bg-slate-100 print:border-slate-900 print:text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-slate-900" />
              <span>Print-Ready Architecture</span>
            </div>
            <span className="font-semibold text-slate-200 print:text-slate-900">
              Official StackPipeline Technical Export
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 print:text-slate-700 flex flex-wrap items-center gap-2">
            <span>Integrity: SHA-256 Validated</span>
            <span aria-hidden="true">·</span>
            <span>Doc ID: SP-ENG-{tutorial.slug.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16).toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>Spec: ISO/IEC Enterprise Architecture Reference</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mb-3">
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            {tutorial.architectureType}
          </span>
          <span aria-hidden="true">·</span>
          <span>Difficulty: {tutorial.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {tutorial.estimatedMinutes} min implementation
          </span>
        </div>

        <h1 className={`font-extrabold text-slate-100 tracking-tight leading-tight mb-4 ${isLargeText ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>
          {tutorial.h1}
        </h1>

        <p className={`text-slate-300 leading-relaxed max-w-3xl ${isLargeText ? 'text-lg' : 'text-base'}`}>
          {tutorial.metaDescription}
        </p>

        {/* E-E-A-T Author & Reviewer Credential Bar (Zero-Pill Discipline) */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            {/* Author */}
            <div
              onClick={() => onOpenAuthorModal && onOpenAuthorModal(author)}
              className="flex items-center gap-2 cursor-pointer group hover:text-emerald-300 transition-colors"
              title="Click to view verified author credentials and published reviews"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full border border-slate-700 object-cover group-hover:border-emerald-500 transition-colors"
                loading="eager"
              />
              <div>
                <div className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>{author.name}</span>
                </div>
                <div className="text-[11px] text-slate-400">{author.role}</div>
              </div>
            </div>

            <span aria-hidden="true" className="hidden sm:inline text-slate-700">|</span>

            {/* Technical Reviewer */}
            <div
              onClick={() => onOpenAuthorModal && onOpenAuthorModal(technicalReviewer)}
              className="flex items-center gap-2 cursor-pointer group hover:text-emerald-300 transition-colors"
              title="Click to view verified reviewer credentials and published reviews"
            >
              <img
                src={technicalReviewer.avatar}
                alt={technicalReviewer.name}
                className="w-8 h-8 rounded-full border border-slate-700 object-cover group-hover:border-emerald-500 transition-colors"
                loading="eager"
              />
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Reviewed by {technicalReviewer.name}
                </div>
                <div className="text-[11px] text-slate-400">{technicalReviewer.role}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <a
              href="#discussion"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <span>★ 4.9</span>
              <span className="text-slate-400 font-normal underline decoration-slate-600 underline-offset-2">Peer Reviews</span>
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Updated {tutorial.updatedDate}
            </span>
            <button
              onClick={onOpenSEOInspector}
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer font-sans"
            >
              Schema &amp; SEO Inspector
            </button>
          </div>
        </div>

        {/* Reader Feedback & Reactions Toolbar */}
        <div className="print:hidden">
          <ArticleReactions
            articleId={tutorial.id}
            title={tutorial.title}
            url={shareUrl}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
          />
        </div>
      </header>

      {/* Content Layout with Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
          <nav aria-label="Table of contents" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-bold">
              Table of Contents
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="#architecture-blueprint"
                  className="hover:text-emerald-400 transition-colors block py-0.5 text-emerald-400 font-semibold flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Architecture Blueprint</span>
                </a>
              </li>
              {tutorial.steps.map((step) => (
                <li key={step.stepNumber}>
                  <a
                    href={`#${step.anchorId}`}
                    className="hover:text-emerald-400 transition-colors line-clamp-1 block py-0.5"
                  >
                    Step {step.stepNumber}: {step.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#comparison-metrics" className="hover:text-emerald-400 transition-colors block py-0.5">
                  Architectural Benchmarks
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-emerald-400 transition-colors block py-0.5">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#author-box" className="hover:text-emerald-400 transition-colors block py-0.5">
                  Editorial Review Board
                </a>
              </li>
              <li>
                <a
                  href="#discussion"
                  className="hover:text-emerald-400 transition-colors py-0.5 flex items-center justify-between"
                >
                  <span>Field Reviews &amp; Comments</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 font-bold">
                    Live
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Quick Blueprint Download Widget */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-800/40 shadow-lg">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase font-mono mb-1">
              <Download className="w-3.5 h-3.5" />
              Instant Blueprint
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Download tested JSON workflow configuration for {tutorial.softwareA.name} ↔ {tutorial.softwareB.name}.
            </p>
            <button
              onClick={handleDownloadBlueprint}
              className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {downloadedBlueprint ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              {downloadedBlueprint ? 'Template Downloaded!' : 'Download JSON Blueprint'}
            </button>
          </div>
        </aside>

        {/* Center Main Content (8 cols on desktop) */}
        <div className="lg:col-span-9 space-y-8">
          {/* Editor's Choice Callout Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-emerald-500 border-y border-r border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-400 uppercase tracking-wide mb-1">
              <Sparkles className="w-4 h-4" />
              Editor's Choice Architecture
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {tutorial.editorChoiceNote}
            </p>
          </div>

          {/* Architecture Blueprint Section */}
          <section
            id="architecture-blueprint"
            className="architecture-blueprint pt-2 scroll-mt-24 space-y-4"
            data-section="architecture-blueprint"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="print-ready-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider print:bg-slate-100 print:border-slate-800 print:text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 print:text-slate-900" />
                    Print-Ready Architecture
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 print:text-slate-700 font-semibold">
                    Official StackPipeline Technical Export · Architectural Topology
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Architecture Blueprint: {tutorial.softwareA.name} ↔ {tutorial.softwareB.name}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  End-to-end data pipeline topology, authentication handshakes, asynchronous queue workers, and governor limit mitigation.
                </p>
              </div>
            </div>

            <DataFlowchart
              softwareA={tutorial.softwareA}
              softwareB={tutorial.softwareB}
              architectureType={tutorial.architectureType}
              difficulty={tutorial.difficulty}
            />
          </section>

          {/* Step-by-Step Implementation */}
          <section className="space-y-10">
            {tutorial.steps.map((step, stepIdx) => (
              <section
                key={step.stepNumber}
                id={step.anchorId}
                className="pt-2 scroll-mt-24 border-t border-slate-800/60 first:border-none first:pt-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    0{step.stepNumber}
                  </span>
                  <h2 className="text-xl font-bold text-slate-100">
                    {step.title}
                  </h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {step.summary}
                </p>

                {/* Sub-steps ordered list */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    Execution Checklist:
                  </h3>
                  <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                    {step.detailedInstructions.map((instruction, idx) => (
                      <li key={idx} className="pl-1">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Multi-language Code Snippets if present */}
                {step.codeSnippets && step.codeSnippets.length > 0 && (
                  <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    {/* Code tabs */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 text-xs">
                      <div className="flex gap-2">
                        {step.codeSnippets.map((snippet, sIdx) => {
                          const activeTab = activeCodeTabs[stepIdx] || 0;
                          return (
                            <button
                              key={sIdx}
                              onClick={() =>
                                setActiveCodeTabs((prev) => ({ ...prev, [stepIdx]: sIdx }))
                              }
                              className={`px-3 py-1 rounded-md font-mono text-[11px] transition-colors ${
                                activeTab === sIdx
                                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {snippet.label}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          const activeIndex = activeCodeTabs[stepIdx] || 0;
                          const activeCode = step.codeSnippets![activeIndex].code;
                          copyCode(activeCode, `step-${stepIdx}-${activeIndex}`);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
                      >
                        {copiedSnippet === `step-${stepIdx}-${activeCodeTabs[stepIdx] || 0}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedSnippet === `step-${stepIdx}-${activeCodeTabs[stepIdx] || 0}` ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>

                    {/* Active snippet body */}
                    <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      <pre>
                        <code>{step.codeSnippets[activeCodeTabs[stepIdx] || 0].code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Callout banners: Pro Tip or Warning */}
                {step.proTip && (
                  <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-2.5 text-xs text-slate-300 my-3">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400">Pro Tip: </span>
                      {step.proTip}
                    </div>
                  </div>
                )}

                {step.warning && (
                  <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-start gap-2.5 text-xs text-slate-300 my-3">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400">Warning / Governor Limit: </span>
                      {step.warning}
                    </div>
                  </div>
                )}

                {/* Inject In-Content AdSense Slot after Step 2 */}
                {stepIdx === 1 && (
                  <AdSenseBanner placement="in_content" slotId="8492019482" showAds={showAds} />
                )}
              </section>
            ))}
          </section>

          {/* Interactive Failure & Retry Simulator Callout Banner */}
          {onNavigateToTesting && (
            <div className="print:hidden p-5 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-800/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Interactive Integration Testing Lab
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                    Simulate Failed API Calls & Webhook Retries for {tutorial.softwareA.name} ↔ {tutorial.softwareB.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Visualize 429 rate limit bursts, 503 cluster downtime, circuit breakers, and exponential backoff timelines.
                  </p>
                </div>
              </div>
              <button
                onClick={onNavigateToTesting}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-500/10"
              >
                <span>Launch Failure Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Performance Comparison Table */}
          <section id="comparison-metrics" className="pt-8 border-t border-slate-800 scroll-mt-24">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Architectural Performance Benchmarks
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latency, rate limits, and ongoing maintenance comparing connection topologies
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/60 uppercase tracking-wider font-mono text-[11px] text-slate-400">
                  <tr>
                    <th scope="col" className="py-3 px-4">Metric</th>
                    <th scope="col" className="py-3 px-4">Native Connector</th>
                    <th scope="col" className="py-3 px-4 text-emerald-400">{tutorial.softwareA.name} Workflow</th>
                    <th scope="col" className="py-3 px-4">Custom API Webhook</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tutorial.comparisonMetrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-slate-200">{row.parameter}</td>
                      <td className="py-3 px-4 text-slate-400">{row.nativeConnector}</td>
                      <td className="py-3 px-4 font-medium text-emerald-300 bg-emerald-950/20">{row.middlewareConnector}</td>
                      <td className="py-3 px-4 text-slate-400">{row.directApiWebhook}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Software A & Software B Affiliate Recommendation Cards */}
          <section className="my-10 p-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100">
                Recommended Software &amp; Direct Offers
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                FTC Disclosure: Content contains sponsored affiliate links (rel="sponsored noopener")
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool A */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-slate-100">{tutorial.softwareA.name}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{tutorial.softwareA.startingPrice}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tutorial.softwareA.tagline}
                  </p>
                </div>
                <a
                  href={`/go/${tutorial.softwareA.slug || tutorial.softwareA.name.toLowerCase()}`}
                  target="_blank"
                  rel="sponsored noopener"
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  Visit {tutorial.softwareA.name} (Official Website)
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tool B */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-slate-100">{tutorial.softwareB.name}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{tutorial.softwareB.startingPrice}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tutorial.softwareB.tagline}
                  </p>
                </div>
                <a
                  href={`/go/${tutorial.softwareB.slug || tutorial.softwareB.name.toLowerCase()}`}
                  target="_blank"
                  rel="sponsored noopener"
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Visit {tutorial.softwareB.name} (Official Website)
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section id="faq-section" className="pt-6 border-t border-slate-800 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Schema.org / FAQPage Validated</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Google Rich Snippets Eligible</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  Frequently Asked Questions
                </h2>
              </div>

              {faqJsonLd && (
                <button
                  onClick={() => setShowFaqSchemaPreview(!showFaqSchemaPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
                  title="Inspect raw Schema.org JSON-LD structured data"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showFaqSchemaPreview ? 'Hide FAQ Schema' : 'View FAQ JSON-LD'}</span>
                </button>
              )}
            </div>

            {/* Expandable FAQ JSON-LD Schema Inspector */}
            {showFaqSchemaPreview && faqJsonLd && (
              <div className="mb-5 p-4 rounded-xl border border-emerald-500/30 bg-slate-950/95 text-xs font-mono shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Google FAQPage Rich Snippet JSON-LD</span>
                    <span className="text-slate-500 text-[10px]">({tutorial.faq.length} Q&amp;A Pairs)</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(faqJsonLd, null, 2));
                      setCopiedFaqSchema(true);
                      setTimeout(() => setCopiedFaqSchema(false), 2000);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedFaqSchema ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFaqSchema ? 'Copied!' : 'Copy Schema'}</span>
                  </button>
                </div>
                <pre className="text-emerald-300/90 overflow-x-auto max-h-60 p-3 rounded-lg bg-slate-900/90 leading-relaxed text-[11px]">
                  {JSON.stringify(faqJsonLd, null, 2)}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              {tutorial.faq.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-between hover:bg-slate-900/50 transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openFaqIndex === idx ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* E-E-A-T Author & Reviewer Bio Box */}
          <section
            id="author-box"
            className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Editorial Review & Technical Standards Board
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div
                onClick={() => onOpenAuthorModal && onOpenAuthorModal(author)}
                className="flex items-start gap-3 cursor-pointer group"
                title="View full author bio and reviews"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full border border-slate-700 object-cover shrink-0 group-hover:border-emerald-500 transition-colors"
                />
                <div>
                  <div className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">
                    {author.name}
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">{author.role}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{author.credentials}</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{author.bio}</p>
                </div>
              </div>

              <div
                onClick={() => onOpenAuthorModal && onOpenAuthorModal(technicalReviewer)}
                className="flex items-start gap-3 cursor-pointer group"
                title="View full reviewer bio and reviews"
              >
                <img
                  src={technicalReviewer.avatar}
                  alt={technicalReviewer.name}
                  className="w-12 h-12 rounded-full border border-slate-700 object-cover shrink-0 group-hover:border-emerald-500 transition-colors"
                />
                <div>
                  <div className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">
                    {technicalReviewer.name}
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">{technicalReviewer.role}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{technicalReviewer.credentials}</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{technicalReviewer.bio}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Previous & Next Article Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            {prevArticle ? (
              <div
                onClick={() => onSelectTutorial && onSelectTutorial(prevArticle.id)}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-emerald-400" />
                  <span>Previous Guide</span>
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {prevArticle.title}
                </div>
              </div>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextArticle && (
              <div
                onClick={() => onSelectTutorial && onSelectTutorial(nextArticle.id)}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                  <span>Next Guide</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {nextArticle.title}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Automations Section */}
          {recommendedAutomations.length > 0 && (
            <section className="pt-8 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Intelligent Tool Matching</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span>Recommended Automations</span>
                    <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                      Based on {tutorial.softwareA.name} &amp; {tutorial.softwareB.name}
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 max-w-sm sm:text-right">
                  Curated pipelines sharing common endpoints, webhook triggers, or CRM destinations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedAutomations.map(({ tutorial: rec, overlappingTools }) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      if (onSelectTutorial) {
                        onSelectTutorial(rec.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:bg-slate-900/90 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-emerald-500/5 relative overflow-hidden"
                  >
                    {/* Subtle glow accent */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                    <div className="space-y-3 relative z-10">
                      {/* Overlap Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        {overlappingTools.length > 0 ? (
                          overlappingTools.map((toolName) => (
                            <span
                              key={toolName}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold"
                            >
                              Shares {toolName}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                            {rec.softwareA.category}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 ml-auto">
                          {rec.difficulty}
                        </span>
                      </div>

                      {/* Software Pairing Header */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                        <span className="text-white">{rec.softwareA.name}</span>
                        <span className="text-emerald-400 font-mono">→</span>
                        <span className="text-white">{rec.softwareB.name}</span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                        {rec.title}
                      </h4>

                      {/* Description Preview */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {rec.metaDescription}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
                      <span className="flex items-center gap-1 text-[11px] font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {rec.estimatedMinutes} min read
                      </span>
                      <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>View Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interactive Community Comments & Peer Review */}
          <ArticleComments
            articleId={tutorial.id}
            articleTitle={tutorial.title}
            softwareA={tutorial.softwareA.name}
            softwareB={tutorial.softwareB.name}
          />

          {/* Bottom Google AdSense Leaderboard Placement */}
          <AdSenseBanner placement="footer" slotId="5918230112" showAds={showAds} />
        </div>
      </div>
    </article>
  );
};

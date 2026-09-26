import React, { useState, useEffect, useMemo } from 'react';
import { INTEGRATION_TUTORIALS } from './data/integrationTutorials';
import { SAAS_TOOLS } from './data/saasTools';
import { Navbar } from './components/Navbar';
import { BlogIndex } from './components/BlogIndex';
import { IntegrationDetail } from './components/IntegrationDetail';
import { SaaSComparisonMatrix } from './components/SaaSComparisonMatrix';
import { ProgrammaticStudio } from './components/ProgrammaticStudio';
import { Footer } from './components/Footer';
import { SEOInspectorModal } from './components/SEOInspectorModal';
import { AdSenseComplianceModal } from './components/AdSenseComplianceModal';
import { CodebaseExportModal } from './components/CodebaseExportModal';
import { RewrittenPromptModal } from './components/RewrittenPromptModal';
import { LegalModal } from './components/LegalModal';
import { PlatformEvaluationModal } from './components/PlatformEvaluationModal';
import { AutonomousEngineModal } from './components/AutonomousEngineModal';
import { ContentHubReaderModal } from './components/ContentHubReaderModal';
import { AuthorProfileModal } from './components/AuthorProfileModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { RSSFeedModal } from './components/RSSFeedModal';
import { NewsletterModal } from './components/NewsletterModal';
import { SoftwareTool, IntegrationTutorial, Author, ToolComparison, ToolAlternativesHub, UnifiedArticle } from './types';
import { Calculator, Sparkles, FolderGit2, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'blog' | 'tutorial' | 'matrix' | 'studio'>('blog');
  const [allTools, setAllTools] = useState<SoftwareTool[]>(SAAS_TOOLS);
  const [allTutorials, setAllTutorials] = useState<IntegrationTutorial[]>(INTEGRATION_TUTORIALS);
  const [allComparisons, setAllComparisons] = useState<ToolComparison[]>([]);
  const [allAlternatives, setAllAlternatives] = useState<ToolAlternativesHub[]>([]);
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>(
    INTEGRATION_TUTORIALS[0].id
  );
  const [showAds, setShowAds] = useState<boolean>(true);

  // Bookmarking / Reading Library State (Saved to localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stackpipeline_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('stackpipeline_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore storage quota error
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modals & Drawers
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isCodebaseModalOpen, setIsCodebaseModalOpen] = useState(false);
  const [isAdSenseModalOpen, setIsAdSenseModalOpen] = useState(false);
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isAutonomousModalOpen, setIsAutonomousModalOpen] = useState(false);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<ToolComparison | null>(null);
  const [selectedAlternativesHub, setSelectedAlternativesHub] = useState<ToolAlternativesHub | null>(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isRSSOpen, setIsRSSOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'affiliate' | 'editorial'>('privacy');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Background Content Sync with Autonomous Engine
  useEffect(() => {
    const syncEngineContent = async () => {
      try {
        const res = await fetch('/api/autonomous-engine/content');
        if (res.ok) {
          const data = await res.json();
          // Sync tutorials
          if (data.tutorials && data.tutorials.length > 0) {
            setAllTutorials((prev) => {
              const existingIds = new Set(prev.map((t) => t.id));
              const newItems = data.tutorials.filter((t: any) => !existingIds.has(t.id));
              if (newItems.length > 0) {
                return [...newItems, ...prev];
              }
              return prev;
            });
          }
          // Sync comparisons (e.g. Make vs Zapier, Census vs Hightouch)
          if (data.comparisons && data.comparisons.length > 0) {
            setAllComparisons((prev) => {
              const existingIds = new Set(prev.map((c) => c.id));
              const newItems = data.comparisons.filter((c: any) => !existingIds.has(c.id));
              if (newItems.length > 0) {
                return [...newItems, ...prev];
              }
              return prev;
            });
          }
          // Sync alternatives (e.g. Zapier Alternatives, Segment Alternatives)
          if (data.alternatives && data.alternatives.length > 0) {
            setAllAlternatives((prev) => {
              const existingIds = new Set(prev.map((a) => a.id));
              const newItems = data.alternatives.filter((a: any) => !existingIds.has(a.id));
              if (newItems.length > 0) {
                return [...newItems, ...prev];
              }
              return prev;
            });
          }
        }
      } catch {
        // silent sync fallback
      }
    };

    syncEngineContent();
    const interval = setInterval(syncEngineContent, 4000);
    return () => clearInterval(interval);
  }, []);

  // Unified stream of all publication articles (How-Tos, Comparisons, Alternatives)
  const allArticles: UnifiedArticle[] = useMemo(() => {
    const list: UnifiedArticle[] = [];

    // 1. Integration tutorials
    allTutorials.forEach((tut) => {
      list.push({
        id: tut.id,
        slug: tut.slug,
        title: tut.title,
        h1: tut.h1,
        metaDescription: tut.metaDescription,
        archetype: 'integration',
        category: tut.softwareA.category || 'Workflow Automation',
        softwareA: tut.softwareA,
        softwareB: tut.softwareB,
        author: tut.author,
        technicalReviewer: tut.technicalReviewer,
        publishDate: tut.publishDate,
        updatedDate: tut.updatedDate,
        estimatedMinutes: tut.estimatedMinutes,
        difficulty: tut.difficulty,
        tags: tut.tags || [tut.softwareA.name, tut.softwareB.name, tut.architectureType],
        originalTutorial: tut,
      });
    });

    // 2. Comparisons (e.g. Make vs Zapier)
    allComparisons.forEach((comp) => {
      list.push({
        id: comp.id,
        slug: comp.slug,
        title: comp.title,
        h1: comp.h1,
        metaDescription: comp.metaDescription,
        archetype: 'comparison',
        category: comp.toolA.category || 'Workflow Automation',
        softwareA: comp.toolA,
        softwareB: comp.toolB,
        author: comp.author,
        technicalReviewer: comp.technicalReviewer,
        publishDate: comp.publishDate,
        updatedDate: comp.publishDate,
        estimatedMinutes: 12,
        difficulty: 'Intermediate',
        tags: ['Comparison', 'Benchmark', comp.toolA.name, comp.toolB.name, 'iPaaS', 'Showdown'],
        originalComparison: comp,
      });
    });

    // 3. Alternatives Hubs (e.g. Zapier Alternatives, Segment Alternatives)
    allAlternatives.forEach((alt) => {
      list.push({
        id: alt.id,
        slug: alt.slug,
        title: alt.title,
        h1: alt.h1,
        metaDescription: alt.metaDescription,
        archetype: 'alternatives',
        category: alt.category || alt.primaryTool.category || 'Workflow Automation',
        softwareA: alt.primaryTool,
        author: alt.author,
        technicalReviewer: alt.technicalReviewer,
        publishDate: alt.publishDate,
        updatedDate: alt.publishDate,
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        tags: ['Alternatives', alt.primaryTool.name, 'Buyer Guide', alt.category],
        originalAlternatives: alt,
      });
    });

    // Sort newest first
    return list.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [allTutorials, allComparisons, allAlternatives]);

  const handleSelectArticle = (article: UnifiedArticle) => {
    if (article.archetype === 'comparison' && article.originalComparison) {
      setSelectedComparison(article.originalComparison);
      setSelectedAlternativesHub(null);
      setIsReaderModalOpen(true);
    } else if (article.archetype === 'alternatives' && article.originalAlternatives) {
      setSelectedAlternativesHub(article.originalAlternatives);
      setSelectedComparison(null);
      setIsReaderModalOpen(true);
    } else if (article.originalTutorial) {
      setSelectedTutorialId(article.originalTutorial.id);
      setActiveView('tutorial');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Interactive ROI Calculator State
  const [monthlyLeads, setMonthlyLeads] = useState(2500);
  const [manualEntryMinutes, setManualEntryMinutes] = useState(4);
  const [hourlyWage, setHourlyWage] = useState(35);

  const hoursSavedPerMonth = Math.round((monthlyLeads * manualEntryMinutes) / 60);
  const dollarsSavedPerMonth = hoursSavedPerMonth * hourlyWage;
  const netRoiRatio = Math.round(dollarsSavedPerMonth / 20); // compared to $20/mo Zapier Starter

  const currentTutorial =
    allTutorials.find((t) => t.id === selectedTutorialId) ||
    allTutorials[0];

  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'affiliate' | 'editorial') => {
    setLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  const handleOpenAuthorModal = (author: Author) => {
    setSelectedAuthor(author);
    setIsAuthorModalOpen(true);
  };

  const handleLoadTutorialFromStudio = (slug: string) => {
    const found = allTutorials.find((t) => t.slug === slug || t.id === slug);
    if (found) {
      setSelectedTutorialId(found.id);
    }
    setActiveView('tutorial');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (view: 'blog' | 'tutorial' | 'matrix' | 'studio') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTutorial = (id: string) => {
    setSelectedTutorialId(id);
    setActiveView('tutorial');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlatformAdded = (newTool: SoftwareTool, newGuide?: IntegrationTutorial) => {
    // Add new tool if not already present
    setAllTools((prev) => {
      if (prev.some((t) => t.id === newTool.id || t.slug === newTool.slug)) {
        return prev;
      }
      return [newTool, ...prev];
    });

    // Add new guide if provided
    if (newGuide) {
      const safeGuide: IntegrationTutorial = {
        ...newGuide,
        author: newGuide.author || {
          name: 'StackPipeline Editorial Team',
          role: 'Senior Integration & Systems Engineers',
          credentials: 'B2B SaaS Automation Specialists & DevOps Contributors',
          company: 'StackPipeline Architecture Lab',
          bio: 'The StackPipeline Editorial Team is composed of practicing integration engineers and automation specialists dedicated to benchmarking B2B SaaS APIs, webhook topologies, and rate-limit governance.',
          avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%2310b981" stroke-width="3"/><path d="M50 25 L75 38 L50 51 L25 38 Z" fill="%2310b981"/><path d="M25 48 L50 61 L75 48" fill="none" stroke="%2334d399" stroke-width="5" stroke-linecap="round"/><path d="M25 59 L50 72 L75 59" fill="none" stroke="%236ee7b7" stroke-width="5" stroke-linecap="round"/></svg>',
          linkedInUrl: 'https://www.linkedin.com/in/stack-pipeline',
          githubUrl: 'https://github.com/voidprompts/StackPipeline',
          articlesReviewed: 284,
        },
        technicalReviewer: newGuide.technicalReviewer || {
          name: 'StackPipeline Technical Review Board',
          role: 'Principal Infrastructure & Security Reviewers',
          credentials: 'Enterprise Cloud Architecture & Data Pipeline Council',
          company: 'StackPipeline Editorial Board',
          bio: 'Conducts rigorous peer reviews, sandbox payload validations, and security audits across all published integration blueprints and code snippets.',
          avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%230ea5e9" stroke-width="3"/><path d="M50 22 L72 32 L72 55 C72 68 62 78 50 82 C38 78 28 68 28 55 L28 32 Z" fill="%230ea5e9" fill-opacity="0.2" stroke="%2338bdf8" stroke-width="4"/><path d="M42 52 L48 58 L60 44" fill="none" stroke="%2338bdf8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          linkedInUrl: 'https://www.linkedin.com/in/stack-pipeline',
          githubUrl: 'https://github.com/voidprompts/StackPipeline',
          articlesReviewed: 195,
        },
      };
      setAllTutorials((prev) => {
        if (prev.some((g) => g.id === safeGuide.id || g.slug === safeGuide.slug)) {
          return prev;
        }
        return [safeGuide, ...prev];
      });
      setSelectedTutorialId(safeGuide.id);
      setActiveView('tutorial');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Banner announcing rewritten prompt & prompt deliverables */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-950 border-b border-emerald-800/40 px-4 py-2 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-slate-300">
          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            BLOG &amp; EDITORIAL PUBLICATION SSG
          </span>
          <span>
            Enterprise automation and architecture guides with verified E-E-A-T credentials, comments, RSS syndication &amp; AdSense integration.
          </span>
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 underline font-semibold ml-1 cursor-pointer"
          >
            Review Prompt Specification →
          </button>
          <button
            onClick={() => setIsAutonomousModalOpen(true)}
            className="flex items-center gap-1.5 text-emerald-300 hover:text-white font-mono text-[11px] bg-emerald-500/15 hover:bg-emerald-500/25 px-2 py-0.5 rounded border border-emerald-500/30 cursor-pointer ml-1 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Auto-Pilot Engine Active →</span>
          </button>
        </div>
      </div>

      {/* Global Navigation Header */}
      <Navbar
        onOpenRewrittenPrompt={() => setIsPromptModalOpen(true)}
        onOpenCodebaseExport={() => setIsCodebaseModalOpen(true)}
        onOpenAdSenseCompliance={() => setIsAdSenseModalOpen(true)}
        onOpenSEOInspector={() => setIsSEOModalOpen(true)}
        onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
        onOpenAutonomousEngine={() => setIsAutonomousModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onOpenRSS={() => setIsRSSOpen(true)}
        savedCount={bookmarkedIds.length}
        showAds={showAds}
        onToggleAds={() => setShowAds(!showAds)}
        activeView={activeView}
        setActiveView={handleNavigateView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View Routing */}
        {activeView === 'blog' && (
          <div>
            <BlogIndex
              articles={allArticles}
              tutorials={allTutorials}
              onSelectTutorial={handleSelectTutorial}
              onSelectArticle={handleSelectArticle}
              initialCategory={selectedCategoryFilter}
              onOpenComparison={(comp) => {
                setSelectedComparison(comp);
                setSelectedAlternativesHub(null);
                setIsReaderModalOpen(true);
              }}
              onOpenAlternatives={(alt) => {
                setSelectedAlternativesHub(alt);
                setSelectedComparison(null);
                setIsReaderModalOpen(true);
              }}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
              onOpenNewsletter={() => setIsNewsletterOpen(true)}
              onOpenRSS={() => setIsRSSOpen(true)}
              onOpenAuthorModal={handleOpenAuthorModal}
            />
          </div>
        )}

        {activeView === 'tutorial' && (
          <div className="mt-8">
            <IntegrationDetail
              tutorial={currentTutorial}
              showAds={showAds}
              onOpenSEOInspector={() => setIsSEOModalOpen(true)}
              onNavigateToTesting={() => {
                setActiveView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isBookmarked={bookmarkedIds.includes(currentTutorial.id)}
              onToggleBookmark={() => toggleBookmark(currentTutorial.id)}
              onOpenAuthorModal={handleOpenAuthorModal}
              allTutorials={allTutorials}
              onSelectTutorial={handleSelectTutorial}
              onBackToBlog={() => {
                setSelectedCategoryFilter('all');
                setActiveView('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectCategory={(category) => {
                setSelectedCategoryFilter(category);
                setActiveView('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* In-Article Affiliate Cost Savings Calculator */}
            <section className="my-16 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">
                      Automated Pipeline ROI &amp; Savings Calculator
                    </h3>
                    <p className="text-xs text-slate-400">
                      Quantify engineering and operational hours saved by replacing manual spreadsheet data transfers
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  Interactive Conversion Tool
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    Monthly Incoming Records / Leads: <span className="text-emerald-400 font-bold">{monthlyLeads.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="20000"
                    step="100"
                    value={monthlyLeads}
                    onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>200</span>
                    <span>10,000</span>
                    <span>20,000+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    Manual Handling Time per Record: <span className="text-emerald-400 font-bold">{manualEntryMinutes} mins</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={manualEntryMinutes}
                    onChange={(e) => setManualEntryMinutes(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 min</span>
                    <span>8 mins</span>
                    <span>15 mins</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    Internal Operator Hourly Wage: <span className="text-emerald-400 font-bold">${hourlyWage}/hr</span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>$15/hr</span>
                    <span>$60/hr</span>
                    <span>$120/hr</span>
                  </div>
                </div>
              </div>

              {/* Calculated Metrics Display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Hours Reclaimed / Mo</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {hoursSavedPerMonth.toLocaleString()} hrs
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Estimated Monthly Savings</div>
                  <div className="text-2xl font-black text-white mt-1">
                    ${dollarsSavedPerMonth.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Software ROI Ratio</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {netRoiRatio}x ROI
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Based on automating {currentTutorial.softwareA.name} to {currentTutorial.softwareB.name} with instant trigger hooks.
                </p>
                <a
                  href={currentTutorial.softwareA.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  Start Automating with {currentTutorial.softwareA.name} Free
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </section>
          </div>
        )}

        {activeView === 'matrix' && (
          <div className="mt-6">
            <SaaSComparisonMatrix
              tools={allTools}
              onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
            />
          </div>
        )}

        {activeView === 'studio' && (
          <div className="mt-6">
            <ProgrammaticStudio
              tools={allTools}
              onLoadTutorialIntoView={handleLoadTutorialFromStudio}
              onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <AutonomousEngineModal
        isOpen={isAutonomousModalOpen}
        onClose={() => setIsAutonomousModalOpen(false)}
        onSelectTutorial={handleSelectTutorial}
        onOpenComparison={(comp) => {
          setSelectedComparison(comp);
          setSelectedAlternativesHub(null);
          setIsReaderModalOpen(true);
        }}
        onOpenAlternatives={(alt) => {
          setSelectedAlternativesHub(alt);
          setSelectedComparison(null);
          setIsReaderModalOpen(true);
        }}
      />

      <ContentHubReaderModal
        isOpen={isReaderModalOpen}
        onClose={() => setIsReaderModalOpen(false)}
        comparison={selectedComparison}
        alternativesHub={selectedAlternativesHub}
      />

      <PlatformEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        onPlatformAdded={handlePlatformAdded}
        onViewGuide={handleSelectTutorial}
      />
      
      <RewrittenPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

      <CodebaseExportModal
        isOpen={isCodebaseModalOpen}
        onClose={() => setIsCodebaseModalOpen(false)}
      />

      <AdSenseComplianceModal
        isOpen={isAdSenseModalOpen}
        onClose={() => setIsAdSenseModalOpen(false)}
      />

      <SEOInspectorModal
        isOpen={isSEOModalOpen}
        onClose={() => setIsSEOModalOpen(false)}
        tutorial={currentTutorial}
      />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalTab}
      />

      {/* Publication Modals & Drawers */}
      <AuthorProfileModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        author={selectedAuthor}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedIds={bookmarkedIds}
        allTutorials={allTutorials}
        allArticles={allArticles}
        onSelectTutorial={handleSelectTutorial}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={toggleBookmark}
        onClearAll={() => setBookmarkedIds([])}
      />

      <RSSFeedModal
        isOpen={isRSSOpen}
        onClose={() => setIsRSSOpen(false)}
        tutorials={allTutorials}
        articles={allArticles}
      />

      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onOpenAdSenseCompliance={() => setIsAdSenseModalOpen(true)}
        onOpenSEOInspector={() => setIsSEOModalOpen(true)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onOpenRSS={() => setIsRSSOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />
    </div>
  );
}

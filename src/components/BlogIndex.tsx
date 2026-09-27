import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Bookmark,
  ShieldCheck,
  Rss,
  Mail,
  ChevronRight,
  Flame,
  X,
  Tag,
  CheckCircle2,
  GitCompare,
  Layers,
  Zap,
  Sparkles,
  ExternalLink,
  Share2,
  Check,
} from 'lucide-react';
import { IntegrationTutorial, UnifiedArticle, ToolComparison, ToolAlternativesHub } from '../types';

interface BlogIndexProps {
  articles?: UnifiedArticle[];
  tutorials?: IntegrationTutorial[];
  onSelectTutorial: (id: string) => void;
  onSelectArticle?: (article: UnifiedArticle) => void;
  onOpenComparison?: (comparison: ToolComparison) => void;
  onOpenAlternatives?: (hub: ToolAlternativesHub) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onOpenNewsletter: () => void;
  onOpenRSS: () => void;
  onOpenAuthorModal: (author: any) => void;
  initialCategory?: string;
}

export const BlogIndex: React.FC<BlogIndexProps> = ({
  articles,
  tutorials = [],
  onSelectTutorial,
  onSelectArticle,
  onOpenComparison,
  onOpenAlternatives,
  bookmarkedIds,
  onToggleBookmark,
  onOpenNewsletter,
  onOpenRSS,
  onOpenAuthorModal,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<'all' | 'integration' | 'comparison' | 'alternatives'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'quickest' | 'deepest'>('latest');
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleShareCard = (e: React.MouseEvent, article: UnifiedArticle) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://stackpipeline.com';
    let url = `${origin}/?article=${article.originalTutorial?.slug || article.slug}`;
    if (article.archetype === 'comparison') {
      url = `${origin}/?compare=${article.originalComparison?.slug || article.slug}`;
    } else if (article.archetype === 'alternatives') {
      url = `${origin}/?alternatives=${article.originalAlternatives?.slug || article.slug}`;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedCardId(article.id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Normalize all publications into a unified stream
  const allArticles: UnifiedArticle[] = useMemo(() => {
    if (articles && articles.length > 0) {
      return articles;
    }
    return tutorials.map((tut) => ({
      id: tut.id,
      slug: tut.slug,
      title: tut.title,
      h1: tut.h1,
      metaDescription: tut.metaDescription,
      archetype: 'integration' as const,
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
    }));
  }, [articles, tutorials]);

  // Keyboard shortcut: Pressing '/' focuses search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Archetype distribution counts
  const archetypeCounts = useMemo(() => {
    return {
      all: allArticles.length,
      integration: allArticles.filter((a) => a.archetype === 'integration').length,
      comparison: allArticles.filter((a) => a.archetype === 'comparison').length,
      alternatives: allArticles.filter((a) => a.archetype === 'alternatives').length,
    };
  }, [allArticles]);

  // Distinct categories available in articles
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allArticles.forEach((a) => {
      if (a.category) cats.add(a.category);
      if (a.softwareA?.category) cats.add(a.softwareA.category);
      if (a.softwareB?.category) cats.add(a.softwareB.category);
    });
    return Array.from(cats);
  }, [allArticles]);

  // Distinct popular tool names across all articles for quick filter chips
  const popularTools = useMemo(() => {
    const toolSet = new Set<string>();
    allArticles.forEach((a) => {
      if (a.softwareA?.name) toolSet.add(a.softwareA.name);
      if (a.softwareB?.name) toolSet.add(a.softwareB.name);
    });
    const priority = ['Make', 'Zapier', 'HubSpot', 'Supabase', 'BigQuery', 'Segment', 'Census', 'Hightouch', 'Stripe'];
    const sorted = Array.from(toolSet).sort((a, b) => {
      const idxA = priority.indexOf(a);
      const idxB = priority.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
    return sorted.slice(0, 8);
  }, [allArticles]);

  // Filter and sort articles by search query, archetype, category, and difficulty
  const filteredArticles = useMemo(() => {
    return allArticles
      .filter((a) => {
        const q = searchQuery.toLowerCase().trim();
        let matchesSearch = true;

        if (q) {
          const titleLower = a.title.toLowerCase();
          const descLower = a.metaDescription.toLowerCase();
          const toolALower = a.softwareA.name.toLowerCase();
          const toolBLower = a.softwareB?.name?.toLowerCase() || '';
          const catLower = a.category.toLowerCase();
          const tagLower = (a.tags || []).join(' ').toLowerCase();

          // 1. Direct phrase or substring match
          const directMatch =
            titleLower.includes(q) ||
            descLower.includes(q) ||
            toolALower.includes(q) ||
            toolBLower.includes(q) ||
            catLower.includes(q) ||
            tagLower.includes(q);

          // 2. Multi-word phrase matching (e.g. "make vs zapier" or "zapier alternatives")
          const terms = q.split(/\s+/).filter(Boolean);
          const allTermsMatch = terms.every(
            (t) =>
              titleLower.includes(t) ||
              descLower.includes(t) ||
              toolALower.includes(t) ||
              toolBLower.includes(t) ||
              catLower.includes(t) ||
              tagLower.includes(t) ||
              (t === 'vs' && a.archetype === 'comparison') ||
              (t === 'alternatives' && a.archetype === 'alternatives')
          );

          matchesSearch = directMatch || allTermsMatch;
        }

        const matchesArchetype =
          selectedArchetype === 'all' || a.archetype === selectedArchetype;

        const matchesCat =
          selectedCategory === 'all' ||
          a.category === selectedCategory ||
          a.softwareA?.category === selectedCategory ||
          a.softwareB?.category === selectedCategory;

        const matchesDiff =
          selectedDifficulty === 'all' || a.difficulty === selectedDifficulty;

        return matchesSearch && matchesArchetype && matchesCat && matchesDiff;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        }
        if (sortBy === 'quickest') {
          return a.estimatedMinutes - b.estimatedMinutes;
        }
        if (sortBy === 'deepest') {
          return b.estimatedMinutes - a.estimatedMinutes;
        }
        return 0;
      });
  }, [allArticles, searchQuery, selectedArchetype, selectedCategory, selectedDifficulty, sortBy]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedArchetype !== 'all' ||
    selectedCategory !== 'all' ||
    selectedDifficulty !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedArchetype('all');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSortBy('latest');
  };

  const handleCardClick = (article: UnifiedArticle) => {
    if (onSelectArticle) {
      onSelectArticle(article);
    } else if (article.archetype === 'comparison' && article.originalComparison && onOpenComparison) {
      onOpenComparison(article.originalComparison);
    } else if (article.archetype === 'alternatives' && article.originalAlternatives && onOpenAlternatives) {
      onOpenAlternatives(article.originalAlternatives);
    } else {
      onSelectTutorial(article.originalTutorial?.id || article.id);
    }
  };

  // Flagship article
  const featuredArticle = allArticles[0];

  return (
    <div className="space-y-8">
      {/* 
        ======================================================================
        TOP SEARCH & ARCHETYPE CONTROLS
        ======================================================================
      */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl backdrop-blur-md sticky top-16 z-20 space-y-4">
        {/* Archetype Quick Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedArchetype('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              selectedArchetype === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Formats ({archetypeCounts.all})</span>
          </button>

          <button
            onClick={() => setSelectedArchetype('integration')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              selectedArchetype === 'integration'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Integration Blueprints ({archetypeCounts.integration})</span>
          </button>

          <button
            onClick={() => setSelectedArchetype('comparison')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              selectedArchetype === 'comparison'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-400" />
            <span>Head-to-Head (VS) ({archetypeCounts.comparison})</span>
          </button>

          <button
            onClick={() => setSelectedArchetype('alternatives')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              selectedArchetype === 'alternatives'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Alternatives Hubs ({archetypeCounts.alternatives})</span>
          </button>
        </div>

        {/* Main Search Input & Primary Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search Input Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, tool (e.g. Make vs Zapier, Segment, HubSpot), or format..."
              value={searchQuery}
              aria-label="Search articles by title, tool, or format"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-20 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />

            {/* Clear & Keyboard Shortcut indicator */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 rounded shadow-xs">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Secondary Controls: Category, Difficulty, Sort */}
          <div className="flex items-center gap-2">
            {/* Category Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
              >
                <option value="all">All Domains</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
              >
                <option value="latest">Latest</option>
                <option value="quickest">Quick Reads</option>
                <option value="deepest">Deep Benchmarks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick-Filter Chips & Result Count Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3 text-emerald-400" />
              Quick filter:
            </span>

            {/* Reset / All Chip */}
            <button
              onClick={resetAllFilters}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                !hasActiveFilters
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All ({allArticles.length})
            </button>

            {/* Popular Tools Chips */}
            {popularTools.map((tool) => {
              const isActive = searchQuery.toLowerCase() === tool.toLowerCase();
              return (
                <button
                  key={tool}
                  onClick={() => {
                    if (isActive) {
                      setSearchQuery('');
                    } else {
                      setSearchQuery(tool);
                      searchInputRef.current?.focus();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {tool}
                </button>
              );
            })}
          </div>

          {/* Results Match Count & Reset Button */}
          <div className="flex items-center gap-2 ml-auto text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              Showing <strong className="text-emerald-400">{filteredArticles.length}</strong> of{' '}
              {allArticles.length} publications
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-slate-400 hover:text-emerald-400 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 
        Hero Section (Only shown when not actively filtering)
      */}
      {!hasActiveFilters && featuredArticle && (
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950 p-6 sm:p-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 uppercase font-bold tracking-wider">
                The StackPipeline Engineering Publication
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Peer-Reviewed Architecture Guides &amp; Benchmarks
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              High-Throughput Webhooks, Real-Time ETL &amp; SaaS Architectures
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Battle-tested technical tutorials, verified API rate-limit benchmarks, and idempotent integration blueprints written by senior platform engineers for modern engineering and RevOps teams.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={onOpenNewsletter}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Get Weekly Dispatch</span>
              </button>

              <button
                onClick={onOpenRSS}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Rss className="w-4 h-4 text-amber-400" />
                <span>RSS / Atom Feed</span>
              </button>
            </div>
          </div>

          {/* Highlighted Flagship Editorial Card */}
          <div className="mt-8 pt-8 border-t border-slate-800/80">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured Architecture Breakdown</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5 sm:p-6 transition-all hover:border-emerald-500/40">
              <div className="lg:col-span-8 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="text-emerald-400 font-semibold uppercase">{featuredArticle.archetype}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredArticle.softwareA.name} {featuredArticle.softwareB ? `vs/to ${featuredArticle.softwareB.name}` : ''}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {featuredArticle.estimatedMinutes} min implementation
                  </span>
                </div>

                <h2
                  onClick={() => handleCardClick(featuredArticle)}
                  className="text-xl sm:text-2xl font-black text-slate-100 hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
                >
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {featuredArticle.metaDescription}
                </p>

                <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                  <div
                    onClick={() => onOpenAuthorModal(featuredArticle.author)}
                    className="flex items-center gap-2 cursor-pointer hover:text-emerald-300 transition-colors"
                  >
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                    />
                    <span className="font-semibold text-slate-200">{featuredArticle.author.name}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span>Updated {featuredArticle.updatedDate || featuredArticle.publishDate}</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2.5">
                <button
                  onClick={() => handleCardClick(featuredArticle)}
                  className="w-full sm:w-auto lg:w-full px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Read Publication</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleBookmark(featuredArticle.id)}
                  className={`w-full sm:w-auto lg:w-full px-4 py-2 border text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    bookmarkedIds.includes(featuredArticle.id)
                      ? 'bg-slate-800 border-emerald-500/50 text-emerald-300'
                      : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>{bookmarkedIds.includes(featuredArticle.id) ? 'Saved in Library' : 'Save for Later'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter Status Feedback Banner when Searching */}
      {hasActiveFilters && (
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Active Filter:{' '}
              {searchQuery && (
                <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 mr-1.5">
                  "{searchQuery}"
                </strong>
              )}
              {selectedArchetype !== 'all' && (
                <strong className="text-purple-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 mr-1.5 uppercase">
                  Format: {selectedArchetype}
                </strong>
              )}
              {selectedCategory !== 'all' && (
                <strong className="text-emerald-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 mr-1.5">
                  Category: {selectedCategory}
                </strong>
              )}
              {selectedDifficulty !== 'all' && (
                <strong className="text-amber-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 mr-1.5">
                  Level: {selectedDifficulty}
                </strong>
              )}
              — Found {filteredArticles.length} matching {filteredArticles.length === 1 ? 'publication' : 'publications'}
            </span>
          </div>
          <button
            onClick={resetAllFilters}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 
        ======================================================================
        UNIFIED ARTICLE GRID (HOW-TOS, SHOWDOWNS, ALTERNATIVES)
        ======================================================================
      */}
      <section className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30 text-slate-400 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No publications matched your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any guides or comparisons matching "{searchQuery}". Try searching for another tool name (e.g., Make, Zapier, Segment, HubSpot) or reset your filters.
            </p>
            <div className="pt-2">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const isSaved = bookmarkedIds.includes(article.id);
              return (
                <article
                  key={article.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between p-5 group shadow-sm relative"
                >
                  <div className="space-y-3">
                    {/* Header: Archetype Badge & Bookmark */}
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                      {article.archetype === 'comparison' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                          <GitCompare className="w-3 h-3 text-purple-400" />
                          <span>VS Showdown</span>
                        </span>
                      ) : article.archetype === 'alternatives' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-amber-400" />
                          <span>Alternatives Hub</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>Integration Blueprint</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleShareCard(e, article)}
                          className="p-1 rounded text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Copy direct shareable link"
                        >
                          {copiedCardId === article.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onToggleBookmark(article.id)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isSaved ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={isSaved ? 'Saved in library' : 'Save article'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Software Pair / Entity Line */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                      {article.archetype === 'comparison' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-bold">{article.softwareA.name}</span>
                          <span className="text-purple-400 font-bold font-mono px-1 py-0.2 rounded bg-purple-500/10 text-[10px]">VS</span>
                          <span className="text-white font-bold">{article.softwareB?.name}</span>
                          <span className="text-slate-500 text-[10px]">({article.category})</span>
                        </div>
                      ) : article.archetype === 'alternatives' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-bold">{article.softwareA.name}</span>
                          <span className="text-amber-400 text-[11px] font-mono">· Top Ranked Replacements</span>
                          <span className="text-slate-500 text-[10px]">({article.category})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-bold">{article.softwareA.name}</span>
                          <span className="text-slate-600">→</span>
                          <span className="text-white font-bold">{article.softwareB?.name}</span>
                          <span className="text-slate-500 text-[10px]">({article.category})</span>
                        </div>
                      )}
                    </div>

                    {/* Article Title */}
                    <h3
                      onClick={() => handleCardClick(article)}
                      className="text-base font-bold text-slate-100 hover:text-emerald-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                    >
                      {article.title}
                    </h3>

                    {/* Article Summary */}
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {article.metaDescription}
                    </p>
                  </div>

                  {/* Footer with Author & Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div
                      onClick={() => onOpenAuthorModal(article.author)}
                      className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors"
                      title="View author profile & credentials"
                    >
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-5 h-5 rounded-full border border-slate-700 object-cover"
                      />
                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[100px]">
                        {article.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.estimatedMinutes}m
                      </span>

                      <button
                        onClick={() => handleCardClick(article)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer border ${
                          article.archetype === 'comparison'
                            ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20'
                            : article.archetype === 'alternatives'
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {article.archetype === 'comparison' ? 'Compare' : article.archetype === 'alternatives' ? 'View Hub' : 'Read'}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

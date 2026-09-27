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

  // 12-Hour Background Autonomous Auto-Pilot Cadence
  useEffect(() => {
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

    // Load any previously persisted autonomous articles from localStorage
    try {
      const savedDynamicTutorials = localStorage.getItem('stackpipeline_dynamic_tutorials');
      if (savedDynamicTutorials) {
        const parsed = JSON.parse(savedDynamicTutorials);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllTutorials((prev) => {
            const existing = new Set(prev.map((t) => t.id));
            const fresh = parsed.filter((t: any) => !existing.has(t.id));
            return fresh.length > 0 ? [...fresh, ...prev] : prev;
          });
        }
      }
    } catch {
      // ignore
    }

    const runAutonomousAutopilotTick = async () => {
      const now = Date.now();
      const lastRun = localStorage.getItem('stackpipeline_autopilot_last_run');
      const timeSinceLastRun = lastRun ? now - Number(lastRun) : TWELVE_HOURS_MS + 1;

      // 1. Try syncing with server backend if available
      try {
        const res = await fetch('/api/autonomous-engine/content');
        if (res.ok) {
          const data = await res.json();
          if (data.tutorials?.length > 0) {
            setAllTutorials((prev) => {
              const existing = new Set(prev.map((t) => t.id));
              const fresh = data.tutorials.filter((t: any) => !existing.has(t.id));
              return fresh.length > 0 ? [...fresh, ...prev] : prev;
            });
          }
          if (data.comparisons?.length > 0) {
            setAllComparisons((prev) => {
              const existing = new Set(prev.map((c) => c.id));
              const fresh = data.comparisons.filter((c: any) => !existing.has(c.id));
              return fresh.length > 0 ? [...fresh, ...prev] : prev;
            });
          }
          if (data.alternatives?.length > 0) {
            setAllAlternatives((prev) => {
              const existing = new Set(prev.map((a) => a.id));
              const fresh = data.alternatives.filter((a: any) => !existing.has(a.id));
              return fresh.length > 0 ? [...fresh, ...prev] : prev;
            });
          }
        }
      } catch {
        // Fallback for static environments
      }

      // 2. Client-side autonomous generation if 12 hours elapsed
      if (timeSinceLastRun >= TWELVE_HOURS_MS) {
        try {
          const candidateTools = [
            { name: 'Linear', category: 'Productivity' as const, partner: 'Slack' },
            { name: 'Supabase', category: 'Database' as const, partner: 'BigQuery' },
            { name: 'ClickUp', category: 'Productivity' as const, partner: 'HubSpot' },
            { name: 'Stripe', category: 'Billing & Payments' as const, partner: 'Salesforce' },
            { name: 'Datadog', category: 'Data Warehouse' as const, partner: 'PagerDuty' },
            { name: 'Retool', category: 'Workflow Automation' as const, partner: 'PostgreSQL' },
          ];

          // Pick an unpublished candidate
          setAllTutorials((prev) => {
            const existingSlugs = new Set(prev.map((t) => t.slug));
            const pick = candidateTools.find((c) => !existingSlugs.has(`connect-${c.name.toLowerCase()}-to-${c.partner.toLowerCase()}`));
            if (!pick) return prev;

            const newTutorial: IntegrationTutorial = {
              id: `connect-${pick.name.toLowerCase()}-to-${pick.partner.toLowerCase()}`,
              slug: `connect-${pick.name.toLowerCase()}-to-${pick.partner.toLowerCase()}`,
              title: `How to Connect ${pick.name} to ${pick.partner}: High-Throughput Automated Architecture`,
              h1: `How to Connect ${pick.name} to ${pick.partner}: Production Guide`,
              metaDescription: `Architect-verified guide connecting ${pick.name} to ${pick.partner}. Includes idempotency tokens, rate limit throttles, and verified payloads.`,
              softwareA: {
                id: pick.name.toLowerCase(),
                name: pick.name,
                slug: pick.name.toLowerCase(),
                category: pick.category,
                logoColor: 'from-emerald-500 to-teal-500',
                badge: 'Verified Enterprise',
                tagline: `High-availability ${pick.category} system with stream hooks.`,
                rating: 4.9,
                reviewCount: 1420,
                startingPrice: '$19/mo',
                freeTier: true,
                webhookSupport: true,
                apiRateLimit: '120 req/min',
                nativeIntegrationsCount: 380,
                affiliateUrl: `https://stackpipeline.com/go/${pick.name.toLowerCase()}?ref=stackpipeline`,
                affiliatePartnerId: `SP-${pick.name.toUpperCase().slice(0, 4)}-9901`,
                pros: ['Real-time webhook events', 'Granular OAuth token scoping', 'Exponential retry support'],
                cons: ['Burst quotas on high concurrency', 'Cursor-based pagination required'],
                bestFor: 'Modern operations and software engineering teams.',
                description: `${pick.name} is an enterprise-grade platform engineered for programmatic automated workflows.`,
              },
              softwareB: {
                id: pick.partner.toLowerCase(),
                name: pick.partner,
                slug: pick.partner.toLowerCase(),
                category: 'CRM',
                logoColor: 'from-cyan-500 to-blue-600',
                badge: 'Core Sink',
                tagline: 'Enterprise data hub and CRM.',
                rating: 4.8,
                reviewCount: 2310,
                startingPrice: '$45/mo',
                freeTier: true,
                webhookSupport: true,
                apiRateLimit: '100 req/min',
                nativeIntegrationsCount: 520,
                affiliateUrl: `https://stackpipeline.com/go/${pick.partner.toLowerCase()}?ref=stackpipeline`,
                affiliatePartnerId: `SP-${pick.partner.toUpperCase().slice(0, 4)}-9901`,
                pros: ['Reliable REST endpoints', 'Deep field mapping', 'Audit logs'],
                cons: ['Governor rate limit triggers'],
                bestFor: 'Revenue operations and customer data teams.',
                description: `${pick.partner} acts as the persistent system of record.`,
              },
              difficulty: 'Intermediate',
              estimatedMinutes: 9,
              author: {
                name: 'StackPipeline Editorial Team',
                role: 'Senior Integration & Systems Engineers',
                credentials: 'B2B SaaS Automation Specialists & DevOps Contributors',
                company: 'StackPipeline Architecture Lab',
                bio: 'The StackPipeline Editorial Team consists of practicing integration engineers and DevOps contributors specializing in API middleware and rate-limit governance.',
                avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><path d="M50 25 L75 38 L50 51 L25 38 Z" fill="%2310b981"/></svg>',
                linkedInUrl: 'https://www.linkedin.com/in/stack-pipeline',
                githubUrl: 'https://github.com/voidprompts/StackPipeline',
                articlesReviewed: 310,
              },
              technicalReviewer: {
                name: 'StackPipeline Technical Review Board',
                role: 'Principal Infrastructure Reviewers',
                credentials: 'Enterprise Cloud Architecture Council',
                company: 'StackPipeline Editorial Board',
                bio: 'Conducts rigorous security verification and sandbox payload simulations on all architecture guides.',
                avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><circle cx="50" cy="50" r="25" fill="%230ea5e9"/></svg>',
                linkedInUrl: 'https://www.linkedin.com/in/stack-pipeline',
                githubUrl: 'https://github.com/voidprompts/StackPipeline',
                articlesReviewed: 220,
              },
              publishDate: new Date().toISOString().split('T')[0],
              updatedDate: new Date().toISOString().split('T')[0],
              schemaType: 'HowTo',
              editorChoiceNote: `Recommended Architecture: Buffered queue with HMAC validation to decouple ${pick.name} webhook bursts from ${pick.partner} rate limits.`,
              shortcutBlueprintName: `${pick.name.toLowerCase()}_to_${pick.partner.toLowerCase()}_blueprint.json`,
              architectureType: 'Event-Driven Webhook',
              comparisonMetrics: [
                { parameter: 'Sync Latency', nativeConnector: '15-60s', middlewareConnector: '< 2.5s', directApiWebhook: '< 200ms', winner: 'direct' },
                { parameter: 'Rate Limits', nativeConnector: 'Standard quotas', middlewareConnector: 'Leaky bucket buffer', directApiWebhook: 'Custom throttle', winner: 'middleware' },
                { parameter: 'Payload Customization', nativeConnector: 'Fixed fields', middlewareConnector: 'Complete JSON transform', directApiWebhook: 'Full REST control', winner: 'middleware' },
                { parameter: 'Error Handling', nativeConnector: 'Silent drops', middlewareConnector: 'Dead-letter queue & retry', directApiWebhook: 'Custom catch blocks', winner: 'middleware' },
              ],
              steps: [
                {
                  stepNumber: 1,
                  title: `Configure ${pick.name} Webhook Subscription`,
                  anchorId: `step-1-configure-${pick.name.toLowerCase()}`,
                  summary: 'Provision an event subscription with signature validation.',
                  detailedInstructions: [
                    `Access your ${pick.name} Developer Settings and create a new Webhook Subscription.`,
                    `Select relevant event triggers and provide your endpoint URL.`,
                    `Store your webhook signing secret in a secure environment variable.`
                  ],
                  codeSnippets: [
                    {
                      language: 'typescript',
                      label: 'Signature Verification',
                      code: `// 1. Verify incoming ${pick.name} HMAC-SHA256 signature\nimport crypto from 'crypto';\nexport function verifyWebhook(rawPayload: string, signatureHeader: string, secret: string): boolean {\n  const expected = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex');\n  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));\n}`
                    }
                  ],
                  proTip: 'Always compare signature hashes with timingSafeEqual to avoid timing attack vulnerabilities.',
                },
                {
                  stepNumber: 2,
                  title: `Transform and Idempotently Push to ${pick.partner}`,
                  anchorId: `step-2-transform-${pick.partner.toLowerCase()}`,
                  summary: 'Cleanse properties, enforce deduplication keys, and dispatch payloads.',
                  detailedInstructions: [
                    `Normalize date timestamps to ISO-8601 UTC format.`,
                    `Construct an idempotency key using the origin record ID and event timestamp.`,
                    `Dispatch the cleansed entity with exponential retry support.`
                  ],
                  codeSnippets: [
                    {
                      language: 'typescript',
                      label: 'Idempotent Dispatch',
                      code: `// 2. Dispatch cleaned record with idempotency barrier\nconst idempotencyKey = \`evt_\${payload.id}_\${payload.updatedAt}\`;\nawait fetch('https://api.${pick.partner.toLowerCase()}.com/v1/records', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ' + process.env.API_TOKEN,\n    'Content-Type': 'application/json',\n    'X-Idempotency-Key': idempotencyKey\n  },\n  body: JSON.stringify(transformedPayload)\n});`
                    }
                  ],
                  proTip: 'Idempotency keys prevent double-charging or duplicate record creation if timeouts occur during retries.',
                },
              ],
              faq: [
                { question: `Does ${pick.name} retry failed webhooks?`, answer: 'Yes, exponential backoff is triggered automatically when non-2xx status codes are received.' },
                { question: `How do I avoid duplicate entries in ${pick.partner}?`, answer: 'Enforce unique email/ID deduplication constraints in payload schemas before dispatch.' },
              ],
            };

            const updated = [newTutorial, ...prev];
            try {
              localStorage.setItem('stackpipeline_dynamic_tutorials', JSON.stringify([newTutorial]));
            } catch {
              // ignore
            }
            return updated;
          });

          localStorage.setItem('stackpipeline_autopilot_last_run', String(now));
        } catch {
          // ignore
        }
      }
    };

    runAutonomousAutopilotTick();
    // Schedule background run every 12 hours
    const timer = setInterval(runAutonomousAutopilotTick, TWELVE_HOURS_MS);
    return () => clearInterval(timer);
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
      {/* Global Navigation Header */}
      <Navbar
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onOpenRSS={() => setIsRSSOpen(true)}
        savedCount={bookmarkedIds.length}
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

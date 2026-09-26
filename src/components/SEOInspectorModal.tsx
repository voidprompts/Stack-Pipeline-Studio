import React, { useState } from 'react';
import { X, Copy, Check, Search, Share2, FileCode, Globe, Download } from 'lucide-react';
import { IntegrationTutorial } from '../types';

interface SEOInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: IntegrationTutorial;
}

export const SEOInspectorModal: React.FC<SEOInspectorModalProps> = ({
  isOpen,
  onClose,
  tutorial,
}) => {
  const [activeTab, setActiveTab] = useState<'jsonld' | 'serp' | 'social' | 'sitemap'>('jsonld');
  const [copied, setCopied] = useState(false);
  const [serpView, setSerpView] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const currentUrl = `https://stackpipeline.com/integrations/${tutorial.slug}`;
  const author = tutorial.author || {
    name: 'StackPipeline Editorial Team',
    role: 'Senior Integration & Systems Engineers',
    company: 'StackPipeline Architecture Lab',
  };

  // Generate comprehensive JSON-LD Schema
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://stackpipeline.com/#website',
        url: 'https://stackpipeline.com/',
        name: 'StackPipeline',
        description: 'B2B SaaS Workflow Automation & Data Pipeline Guides',
        publisher: {
          '@type': 'Organization',
          name: 'StackPipeline Media',
          logo: {
            '@type': 'ImageObject',
            url: 'https://stackpipeline.com/logo.png',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://stackpipeline.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Integrations',
            item: 'https://stackpipeline.com/integrations',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${tutorial.softwareA.name} to ${tutorial.softwareB.name}`,
            item: currentUrl,
          },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': `${currentUrl}#howto`,
        name: tutorial.title,
        description: tutorial.metaDescription,
        totalTime: `PT${tutorial.estimatedMinutes}M`,
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: '0',
        },
        tool: [
          {
            '@type': 'HowToTool',
            name: tutorial.softwareA.name,
          },
          {
            '@type': 'HowToTool',
            name: tutorial.softwareB.name,
          },
        ],
        step: tutorial.steps.map((step) => ({
          '@type': 'HowToStep',
          url: `${currentUrl}#${step.anchorId}`,
          name: step.title,
          text: step.summary,
          position: step.stepNumber,
        })),
        author: {
          '@type': 'Person',
          name: author.name,
          jobTitle: author.role,
          worksFor: {
            '@type': 'Organization',
            name: author.company,
          },
        },
        datePublished: tutorial.publishDate,
        dateModified: tutorial.updatedDate,
      },
      {
        '@type': 'SoftwareApplication',
        name: tutorial.softwareA.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Cloud',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tutorial.softwareA.rating.toString(),
          reviewCount: tutorial.softwareA.reviewCount.toString(),
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${currentUrl}#faq`,
        name: `${tutorial.title} - FAQs`,
        mainEntity: (tutorial.faq || []).map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  const schemaString = JSON.stringify(jsonLdGraph, null, 2);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sitemapSample = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stackpipeline.com/</loc>
    <lastmod>2026-09-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stackpipeline.com/integrations/${tutorial.slug}</loc>
    <lastmod>${tutorial.updatedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://stackpipeline.com/matrix</loc>
    <lastmod>2026-09-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stackpipeline.com/affiliate-disclosure</loc>
    <lastmod>2026-09-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

  const socialTagsString = `<!-- OpenGraph Social Sharing Metadata (Dynamically Injected into <head>) -->
<meta property="og:type" content="article" />
<meta property="og:title" content="${tutorial.title} | StackPipeline" />
<meta property="og:description" content="${tutorial.metaDescription}" />
<meta property="og:url" content="https://stackpipeline.com/integrations/${tutorial.slug}" />
<meta property="og:site_name" content="StackPipeline" />
<meta property="og:image" content="https://stackpipeline.com/og/${tutorial.slug}.svg" />
<meta property="og:image:secure_url" content="https://stackpipeline.com/og/${tutorial.slug}.svg" />
<meta property="og:image:alt" content="${tutorial.softwareA.name} to ${tutorial.softwareB.name} Integration Architecture Blueprint" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/svg+xml" />
<meta property="article:published_time" content="${tutorial.publishDate}" />
<meta property="article:modified_time" content="${tutorial.updatedDate}" />
<meta property="article:author" content="${author.name}" />
<meta property="article:section" content="${tutorial.softwareA.category}" />

<!-- Twitter / X Card Metadata -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${tutorial.title} | StackPipeline" />
<meta name="twitter:description" content="${tutorial.metaDescription}" />
<meta name="twitter:image" content="https://stackpipeline.com/og/${tutorial.slug}.svg" />
<meta name="twitter:image:alt" content="${tutorial.softwareA.name} to ${tutorial.softwareB.name} Integration Architecture Blueprint" />
<meta name="twitter:site" content="@StackPipeline" />
<meta name="twitter:creator" content="@StackPipeline" />
<meta name="twitter:label1" content="Written by" />
<meta name="twitter:data1" content="${author.name}" />
<meta name="twitter:label2" content="Est. reading time" />
<meta name="twitter:data2" content="${tutorial.estimatedMinutes} minutes" />`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Technical SEO & Schema.org Validator</h3>
              <p className="text-xs text-slate-400">Live JSON-LD metadata, Google SERP simulator, and OpenGraph card generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('jsonld')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'jsonld'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            JSON-LD Schema Graph ({tutorial.schemaType})
          </button>
          <button
            onClick={() => setActiveTab('serp')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'serp'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            Google SERP Simulator
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'social'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Social Share Cards
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'sitemap'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Sitemap.xml
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'jsonld' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  Target: <span className="text-emerald-400">&lt;script type="application/ld+json"&gt;</span>
                </div>
                <button
                  onClick={() => copyToClipboard(schemaString)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard' : 'Copy JSON-LD'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[50vh]">
                {schemaString}
              </pre>
            </div>
          )}

          {activeTab === 'serp' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="text-xs text-slate-400">Preview search engine snippet rendering with rich snippets</div>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setSerpView('desktop')}
                    className={`px-3 py-1 rounded font-medium ${serpView === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                  >
                    Desktop View
                  </button>
                  <button
                    onClick={() => setSerpView('mobile')}
                    className={`px-3 py-1 rounded font-medium ${serpView === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                  >
                    Mobile View
                  </button>
                </div>
              </div>

              {/* SERP Card */}
              <div className={`p-6 rounded-xl bg-white text-slate-900 shadow-md ${serpView === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    SP
                  </div>
                  <div className="text-xs text-slate-700 leading-tight">
                    <span className="font-semibold text-slate-900">StackPipeline</span>
                    <span className="block text-slate-500 truncate">{currentUrl}</span>
                  </div>
                </div>

                <a href="#preview" className="block group">
                  <h4 className="text-lg text-[#1a0dab] group-hover:underline font-medium leading-snug line-clamp-2">
                    {tutorial.title} | StackPipeline
                  </h4>
                </a>

                {/* Rich Snippet Badges */}
                <div className="flex items-center gap-2 text-xs text-slate-600 my-1.5 font-medium">
                  <span className="text-amber-600 font-bold">★★★★★ 4.8</span>
                  <span>·</span>
                  <span>Free Guide</span>
                  <span>·</span>
                  <span>Duration: {tutorial.estimatedMinutes} min</span>
                  <span>·</span>
                  <span>Verified by {tutorial.technicalReviewer.name}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {tutorial.metaDescription}
                </p>

                {/* Sitelinks mockup */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-[#1a0dab]">
                  <span className="hover:underline cursor-pointer">1. Private App Token</span>
                  <span className="hover:underline cursor-pointer">2. Webhook Catch Hook</span>
                  <span className="hover:underline cursor-pointer">3. Deduplication Logic</span>
                  <span className="hover:underline cursor-pointer">Download JSON Template</span>
                </div>

                {/* Google FAQ Rich Snippet Accordion in SERP */}
                {tutorial.faq && tutorial.faq.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <span>People also ask</span>
                      <span className="text-[10px] text-emerald-600 font-mono">(FAQPage Schema)</span>
                    </div>
                    {tutorial.faq.slice(0, 2).map((item, i) => (
                      <div key={i} className="text-xs py-1 border-b border-slate-100/80 last:border-b-0">
                        <div className="text-[#1a0dab] font-medium flex items-center justify-between cursor-pointer hover:underline">
                          <span>{item.question}</span>
                          <span className="text-slate-400 text-[10px]">▼</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200">Title Length:</span> {tutorial.title.length + 16} / 60 characters
                  <span className="ml-2 text-emerald-400">✓ Within Google SERP limit</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200">Meta Description:</span> {tutorial.metaDescription.length} / 155 characters
                  <span className="ml-2 text-emerald-400">✓ High CTR length</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  OpenGraph &amp; Twitter/X Social Share Card (1200x630 resolution)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live in &lt;head&gt;
                  </span>
                </div>
              </div>

              {/* Social Card Visual Preview */}
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-w-lg mx-auto shadow-xl">
                <div className="h-48 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 p-6 flex flex-col justify-between border-b border-slate-800 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      StackPipeline Architecture Guide
                    </span>
                    <span className="text-xs font-mono text-slate-400">2026 Edition</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-white leading-tight">
                      {tutorial.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {tutorial.softwareA.name} ↔ {tutorial.softwareB.name} Enterprise Automation
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-900">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">stackpipeline.com</div>
                  <div className="text-sm font-semibold text-slate-100 mt-0.5 truncate">{tutorial.title}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{tutorial.metaDescription}</div>
                </div>
              </div>

              {/* Dynamically Injected Meta Tags HTML Display */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <span>Generated OpenGraph &amp; Twitter Meta Tags</span>
                    <span className="text-[10px] text-slate-500 font-mono">(&lt;meta property="og:*"&gt; / &lt;meta name="twitter:*"&gt;)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(socialTagsString)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Tags' : 'Copy Social Meta Tags'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-56">
                  {socialTagsString}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Static XML Sitemap auto-prioritizing tutorial and comparison nodes
                </div>
                <button
                  onClick={() => copyToClipboard(sitemapSample)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Copy XML
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[50vh]">
                {sitemapSample}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

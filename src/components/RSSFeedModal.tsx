import React, { useState } from 'react';
import { X, Rss, Copy, Check, Download, ExternalLink, Globe } from 'lucide-react';
import { IntegrationTutorial, UnifiedArticle } from '../types';

interface RSSFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorials?: IntegrationTutorial[];
  articles?: UnifiedArticle[];
}

export const RSSFeedModal: React.FC<RSSFeedModalProps> = ({
  isOpen,
  onClose,
  tutorials = [],
  articles,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedType, setFeedType] = useState<'rss' | 'atom'>('rss');

  if (!isOpen) return null;

  // Use articles if available, else map tutorials
  const feedItems: UnifiedArticle[] = articles || tutorials.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    archetype: 'integration' as const,
    metaDescription: t.metaDescription,
    category: t.softwareA.category || 'Workflow Automation',
    softwareA: t.softwareA,
    softwareB: t.softwareB,
    author: t.author,
    publishDate: t.publishDate,
    estimatedMinutes: t.estimatedMinutes,
    tags: t.tags || [],
  }));

  // Generate dynamic RSS 2.0 XML
  const generateRssXml = () => {
    const items = feedItems
      .map(
        (t) => `    <item>
      <title><![CDATA[${t.title}]]></title>
      <link>https://stackpipeline.com/${t.archetype === 'comparison' ? 'comparisons' : t.archetype === 'alternatives' ? 'alternatives' : 'integrations'}/${t.slug}</link>
      <guid isPermaLink="true">https://stackpipeline.com/item/${t.id}</guid>
      <pubDate>${new Date(t.publishDate).toUTCString()}</pubDate>
      <description><![CDATA[${t.metaDescription}]]></description>
      <author>${t.author.name}</author>
      <category>${t.category}</category>
    </item>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>StackPipeline Engineering &amp; B2B SaaS Architecture</title>
    <link>https://stackpipeline.com</link>
    <description>Peer-reviewed B2B SaaS integrations, architectural showdowns, and alternatives buyer guides.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://stackpipeline.com/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
  };

  // Generate dynamic Atom XML
  const generateAtomXml = () => {
    const entries = feedItems
      .map(
        (t) => `  <entry>
    <title>${t.title}</title>
    <link href="https://stackpipeline.com/${t.archetype === 'comparison' ? 'comparisons' : t.archetype === 'alternatives' ? 'alternatives' : 'integrations'}/${t.slug}"/>
    <id>urn:uuid:${t.id}</id>
    <updated>${new Date(t.publishDate).toISOString()}</updated>
    <summary>${t.metaDescription}</summary>
    <author>
      <name>${t.author.name}</name>
    </author>
    <category term="${t.category}"/>
  </entry>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>StackPipeline Engineering &amp; B2B SaaS Architecture</title>
  <subtitle>Peer-reviewed B2B SaaS integrations, architectural showdowns, and alternatives buyer guides.</subtitle>
  <link href="https://stackpipeline.com/feed.atom" rel="self"/>
  <link href="https://stackpipeline.com/"/>
  <id>https://stackpipeline.com/</id>
  <updated>${new Date().toISOString()}</updated>
${entries}
</feed>`;
  };

  const xmlContent = feedType === 'rss' ? generateRssXml() : generateAtomXml();

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = feedType === 'rss' ? 'feed.xml' : 'feed.atom';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rss-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rss-modal-title" className="text-base sm:text-lg font-bold text-slate-100">
                RSS &amp; Atom Syndication Feed
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Real-time syndicate feed for {feedItems.length} published publications
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 font-mono">
              <button
                onClick={() => setFeedType('rss')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  feedType === 'rss' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                RSS 2.0 (.xml)
              </button>
              <button
                onClick={() => setFeedType('atom')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  feedType === 'atom' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Atom 1.0 (.atom)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-mono flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied XML' : 'Copy Feed'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-3.5 max-h-72 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap">{xmlContent}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

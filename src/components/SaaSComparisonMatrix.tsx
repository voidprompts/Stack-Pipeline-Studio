import React, { useState, useMemo } from 'react';
import { SAAS_TOOLS } from '../data/saasTools';
import { SoftwareTool } from '../types';
import { getToolOfficialUrl } from '../data/saasWebsites';
import { Search, ExternalLink, ChevronDown, ChevronUp, Star, Zap, Check, X } from 'lucide-react';

interface SaaSComparisonMatrixProps {
  tools?: SoftwareTool[];
  onSelectSoftware?: (tool: SoftwareTool) => void;
}

export const SaaSComparisonMatrix: React.FC<SaaSComparisonMatrixProps> = ({
  tools = SAAS_TOOLS,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'rating' | 'integrations' | 'name'>('rating');

  const categories = [
    'All',
    'Workflow Automation',
    'CRM',
    'Billing & Payments',
    'Data Enrichment',
    'Customer Data Platform',
    'Data Warehouse',
    'Database',
    'Customer Support',
    'Productivity & Alerting',
    'Productivity',
  ];

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortKey === 'rating') return b.rating - a.rating;
      if (sortKey === 'integrations') return b.nativeIntegrationsCount - a.nativeIntegrationsCount;
      return a.name.localeCompare(b.name);
    });
  }, [tools, searchQuery, selectedCategory, sortKey]);

  const toggleExpand = (id: string) => {
    setExpandedToolId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="my-12">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Commercial Evaluation Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">B2B SaaS Integration & Automation Matrix</h2>
          <p className="text-xs text-slate-400 mt-1">
            Independent evaluations, rate-limit thresholds, and verified affiliate pricing benchmarks
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools, APIs, CRM..."
              value={searchQuery}
              aria-label="Search tools by name, category, or features"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Sort:</span>
            <select
              value={sortKey}
              aria-label="Sort software tools"
              onChange={(e) => setSortKey(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="rating">Rating (Highest)</option>
              <option value="integrations">Integrations Count</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/70 uppercase tracking-wider font-mono text-[11px] text-slate-400">
            <tr>
              <th scope="col" className="py-4 px-4">Software Platform</th>
              <th scope="col" className="py-4 px-4">Category</th>
              <th scope="col" className="py-4 px-4">Rating (E-E-A-T)</th>
              <th scope="col" className="py-4 px-4">Starting Price</th>
              <th scope="col" className="py-4 px-4">Webhooks</th>
              <th scope="col" className="py-4 px-4">API Rate Limits</th>
              <th scope="col" className="py-4 px-4">Connectors</th>
              <th scope="col" className="py-4 px-4 text-right">Affiliate Offer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTools.map((tool) => {
              const isExpanded = expandedToolId === tool.id;
              return (
                <React.Fragment key={tool.id}>
                  <tr
                    onClick={() => toggleExpand(tool.id)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.logoColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                        >
                          {tool.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            {tool.name}
                            <span className="text-[10px] font-mono text-slate-400">
                              ({tool.badge})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{tool.tagline}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium">{tool.category}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{tool.rating}</span>
                        <span className="text-slate-400 text-[10px] font-normal">({tool.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-200">
                      {tool.startingPrice}
                      {tool.freeTier && <span className="block text-[10px] text-emerald-400 font-sans">Free tier avail.</span>}
                    </td>
                    <td className="py-4 px-4">
                      {tool.webhookSupport ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" /> Instant
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <X className="w-3.5 h-3.5" /> Polling only
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      {tool.apiRateLimit}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-300">
                      {tool.nativeIntegrationsCount.toLocaleString()}+
                    </td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href={tool.websiteUrl || getToolOfficialUrl(tool.slug || tool.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                        title={`Visit official ${tool.name} website`}
                      >
                        Visit Site
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* Expanded Breakdown Row */}
                  {isExpanded && (
                    <tr className="bg-slate-950/80">
                      <td colSpan={8} className="p-6 border-y border-slate-800/80">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
                              Key Strengths (Pros)
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {tool.pros.map((pro, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
                              Known Trade-offs (Cons)
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {tool.cons.map((con, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-amber-400 font-bold shrink-0">·</span>
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                                Optimal Enterprise Use Case
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {tool.bestFor}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400">
                              Affiliate Partner Tracking ID: <span className="font-mono text-emerald-400">{tool.affiliatePartnerId}</span>
                              <p className="mt-0.5">Complies with 16 CFR § 255 sponsored disclosures.</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

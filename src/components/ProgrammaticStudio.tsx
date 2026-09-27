import React, { useState } from 'react';
import { SAAS_TOOLS, AUTHORS } from '../data/saasTools';
import { SoftwareTool } from '../types';
import { Sparkles, Copy, Check, Download, ArrowRight, Code, Eye, FileText, Activity, Network } from 'lucide-react';
import { IntegrationTestingStudio } from './IntegrationTestingStudio';
import { DataFlowchart } from './DataFlowchart';

interface ProgrammaticStudioProps {
  tools?: SoftwareTool[];
  onLoadTutorialIntoView: (slug: string) => void;
}

export const ProgrammaticStudio: React.FC<ProgrammaticStudioProps> = ({
  tools = SAAS_TOOLS,
  onLoadTutorialIntoView,
}) => {
  const [toolA, setToolA] = useState(tools[0]?.id || 'zapier');
  const [toolB, setToolB] = useState(tools[1]?.id || 'hubspot');
  const [architecture, setArchitecture] = useState('Event-Driven Webhook');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'flowchart' | 'markdown' | 'blueprint' | 'testing'>('flowchart');

  const selectedA = tools.find((t) => t.id === toolA) || tools[0] || SAAS_TOOLS[0];
  const selectedB = tools.find((t) => t.id === toolB) || tools[1] || SAAS_TOOLS[1];

  const generatedSlug = `connect-${selectedA.slug}-to-${selectedB.slug}`;
  const generatedTitle = `How to Connect ${selectedA.name} to ${selectedB.name}: 2026 Step-by-Step Guide`;
  const generatedDesc = `Complete production guide to connect ${selectedA.name} with ${selectedB.name}. Includes webhook payload templates, rate-limit mitigations, and automated deduplication.`;

  // Generate Astro Content Collection Markdown
  const markdownOutput = `---
title: "${generatedTitle}"
h1: "How to Connect ${selectedA.name} to ${selectedB.name}: Enterprise Setup Guide"
description: "${generatedDesc}"
softwareA: "${selectedA.name}"
softwareB: "${selectedB.name}"
softwareASlug: "${selectedA.slug}"
softwareBSlug: "${selectedB.slug}"
category: "${selectedA.category} Integration"
difficulty: "${difficulty}"
estimatedMinutes: 10
affiliateLinkA: "${selectedA.affiliateUrl}"
affiliateLinkB: "${selectedB.affiliateUrl}"
author: "${AUTHORS.alexVance.name}"
authorRole: "${AUTHORS.alexVance.role}"
reviewer: "${AUTHORS.elenaRostova.name}"
reviewerRole: "${AUTHORS.elenaRostova.role}"
publishDate: "2026-03-20"
updatedDate: "2026-09-22"
schemaType: "HowTo"
architectureType: "${architecture}"
tags: ["${selectedA.name}", "${selectedB.name}", "Automation", "iPaaS", "ETL"]
---

# ${generatedTitle}

Connecting **${selectedA.name}** to **${selectedB.name}** enables seamless automated synchronization across your tech stack with zero manual spreadsheet exports.

## Core Architectural Advantages
- **Sync Latency**: Under 2.5s with instant webhook push.
- **Deduplication Key**: Unique email identity / composite hash.
- **Error Handling**: Automatic exponential backoff on HTTP 429 & 503 codes.

## Step 1: Authentication & Private Access Credentials
Obtain your API Key or OAuth Bearer Token from ${selectedB.name} developer settings. Ensure scopes include \`read\` and \`write\` privileges.

\`\`\`bash
curl -X GET "https://api.${selectedB.slug}.com/v1/auth/verify" \\
  -H "Authorization: Bearer YOUR_API_TOKEN"
\`\`\`

## Step 2: Configure Webhook Receiver in ${selectedA.name}
Set up a Catch Hook endpoint in ${selectedA.name} to receive change data capture (CDC) events.
`;

  // Generate JSON Blueprint
  const blueprintOutput = JSON.stringify(
    {
      name: `StackPipeline: ${selectedA.name} to ${selectedB.name} Sync`,
      version: '2.4.0',
      nodes: [
        {
          id: 'node_1_trigger',
          type: 'webhook_catch',
          service: selectedA.name,
          settings: {
            auth_mode: 'header_token',
            method: 'POST',
          },
        },
        {
          id: 'node_2_dedupe',
          type: 'filter_dedupe',
          field: 'lead.email',
          ttl_seconds: 86400,
        },
        {
          id: 'node_3_action',
          type: 'upsert_record',
          service: selectedB.name,
          retry_policy: {
            max_retries: 3,
            backoff: 'exponential',
          },
        },
      ],
    },
    null,
    2
  );

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBlueprint = () => {
    const blob = new Blob([blueprintOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedSlug}-blueprint.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="my-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">Programmatic Integration Studio</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tools.length * (tools.length - 1)} Scaled Topologies ({tools.length} B2B SaaS Systems)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Auto-generate scaled Astro Content Collection nodes, Zod frontmatter, and automation blueprints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onLoadTutorialIntoView('connect-zapier-to-hubspot')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Sample</span>
          </button>
        </div>
      </div>

      {/* Control Matrix Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Software A (Trigger/Source)
          </label>
          <select
            value={toolA}
            onChange={(e) => setToolA(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {tools.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Software B (Destination)
          </label>
          <select
            value={toolB}
            onChange={(e) => setToolB(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {tools.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === toolA}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Architecture Paradigm
          </label>
          <select
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Event-Driven Webhook">Event-Driven Webhook</option>
            <option value="Bidirectional Sync">Bidirectional Sync</option>
            <option value="Scheduled Batch ETL">Scheduled Batch ETL</option>
            <option value="Reverse ETL Trigger">Reverse ETL Trigger</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Difficulty Tier
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Beginner">Beginner (No-code)</option>
            <option value="Intermediate">Intermediate (Webhooks/Auth)</option>
            <option value="Advanced">Advanced (Custom Code/ETL)</option>
          </select>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-2 gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('flowchart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'flowchart'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive SVG Flowchart & Bottlenecks</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              Live Topology
            </span>
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'markdown'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Astro Markdown Schema (.md)
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'blueprint'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Automation Blueprint JSON
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'testing'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Integration Testing & Retry Lab</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
              Simulation
            </span>
          </button>
        </div>

        {(activeTab === 'markdown' || activeTab === 'blueprint') && (
          <div className="flex items-center gap-2">
            {activeTab === 'blueprint' && (
              <button
                onClick={downloadBlueprint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON
              </button>
            )}
            <button
              onClick={() => copyContent(activeTab === 'markdown' ? markdownOutput : blueprintOutput)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === 'flowchart' && (
        <div>
          <DataFlowchart
            softwareA={selectedA}
            softwareB={selectedB}
            architectureType={architecture}
          />
        </div>
      )}

      {activeTab === 'testing' && (
        <IntegrationTestingStudio softwareA={selectedA} softwareB={selectedB} />
      )}

      {(activeTab === 'markdown' || activeTab === 'blueprint') && (
        <>
          {/* Generated Code Window */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
            <pre>{activeTab === 'markdown' ? markdownOutput : blueprintOutput}</pre>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
            <span>
              Generated Permalink:{' '}
              <code className="text-emerald-400 font-mono">/integrations/{generatedSlug}</code>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              Ready for batch programmatic ingestion via <code className="text-slate-300 font-mono">npm run generate:matrix</code>
            </span>
          </div>

          {/* Persistent Flowchart Preview Section Below */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                Live Data Pipeline Topology & Bottlenecks
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedA.name} ➔ {selectedB.name}
              </span>
            </div>
            <DataFlowchart
              softwareA={selectedA}
              softwareB={selectedB}
              architectureType={architecture}
            />
          </div>
        </>
      )}
    </section>
  );
};

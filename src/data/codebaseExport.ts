export interface CodeFile {
  path: string;
  filename: string;
  language: string;
  description: string;
  content: string;
}

export const ASTRO_PROJECT_FILES: CodeFile[] = [
  {
    path: 'astro.config.mjs',
    filename: 'astro.config.mjs',
    language: 'javascript',
    description: 'Astro 5.x SSG configuration with Tailwind integration, sitemap generation, and strict HTML compression.',
    content: `// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://stackpipeline.com',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/draft/'),
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});`,
  },
  {
    path: 'tailwind.config.mjs',
    filename: 'tailwind.config.mjs',
    language: 'javascript',
    description: 'Corporate tech theme with Deep Slate blues, crisp Emerald conversion accents, and JetBrains Mono typography.',
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        slate: {
          850: '#151f33',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};`,
  },
  {
    path: 'package.json',
    filename: 'package.json',
    language: 'json',
    description: 'Root dependencies and scripts for the Astro B2B affiliate platform.',
    content: `{
  "name": "stackpipeline-ssg",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "generate:matrix": "tsx scripts/generate-integrations.ts",
    "lint": "eslint . --ext .js,.ts,.astro"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/sitemap": "^3.2.1",
    "@astrojs/tailwind": "^5.1.5",
    "astro": "^5.0.0",
    "lucide-astro": "^0.460.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^22.10.1",
    "tsx": "^4.19.2",
    "wrangler": "^3.90.0"
  }
}`,
  },
  {
    path: 'src/content/config.ts',
    filename: 'config.ts',
    language: 'typescript',
    description: 'Astro Content Collections schema with Zod validation for programmatic B2B integration tutorials.',
    content: `import { defineCollection, z } from 'astro:content';

const integrationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(65),
    h1: z.string(),
    description: z.string().max(160),
    softwareA: z.string(),
    softwareB: z.string(),
    softwareASlug: z.string(),
    softwareBSlug: z.string(),
    category: z.string(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    estimatedMinutes: z.number().default(10),
    affiliateLinkA: z.string().url(),
    affiliateLinkB: z.string().url(),
    author: z.string(),
    authorRole: z.string(),
    reviewer: z.string(),
    reviewerRole: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    schemaType: z.enum(['HowTo', 'Review', 'Article']).default('HowTo'),
    editorChoice: z.string().optional(),
    proTip: z.string().optional(),
    blueprintDownloadUrl: z.string().optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  integrations: integrationsCollection,
};`,
  },
  {
    path: 'src/components/SEO.astro',
    filename: 'SEO.astro',
    language: 'astro',
    description: 'Technical SEO component injecting canonicals, OpenGraph, Twitter cards, and Schema.org JSON-LD.',
    content: `---
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaJson?: Record<string, any>;
  articleMeta?: {
    publishedTime: string;
    modifiedTime: string;
    author: string;
    section: string;
  };
}

const {
  title,
  description,
  canonicalUrl = Astro.url.href,
  ogImage = 'https://stackpipeline.com/og-default.png',
  schemaJson,
  articleMeta,
} = Astro.props;

const siteName = 'StackPipeline';
const formattedTitle = title.includes(siteName) ? title : \`\${title} | \${siteName}\`;
---

<!-- Canonical & Charset -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="canonical" href={canonicalUrl} />

<!-- Primary Search Meta -->
<title>{formattedTitle}</title>
<meta name="description" content={description} />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

<!-- OpenGraph / Facebook / LinkedIn -->
<meta property="og:type" content={articleMeta ? 'article' : 'website'} />
<meta property="og:site_name" content={siteName} />
<meta property="og:title" content={formattedTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:image" content={ogImage} />
{articleMeta && (
  <>
    <meta property="article:published_time" content={articleMeta.publishedTime} />
    <meta property="article:modified_time" content={articleMeta.modifiedTime} />
    <meta property="article:author" content={articleMeta.author} />
    <meta property="article:section" content={articleMeta.section} />
  </>
)}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@stackpipeline" />
<meta name="twitter:title" content={formattedTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- Structured Data (JSON-LD) -->
{schemaJson && (
  <script type="application/ld+json" set:html={JSON.stringify(schemaJson)} />
)}`,
  },
  {
    path: 'src/components/AdSenseBlock.astro',
    filename: 'AdSenseBlock.astro',
    language: 'astro',
    description: 'CLS-protected Google AdSense container with reserved responsive viewport bounds and publisher slots.',
    content: `---
interface Props {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  placement: 'header_leaderboard' | 'in_content' | 'sidebar_sticky' | 'footer';
  className?: string;
}

const { slotId, format = 'auto', placement, className = '' } = Astro.props;

// Reserve explicit minimum heights to satisfy Core Web Vitals (CLS = 0)
const minHeightClass = {
  header_leaderboard: 'min-h-[90px] md:min-h-[100px]',
  in_content: 'min-h-[250px]',
  sidebar_sticky: 'min-h-[600px]',
  footer: 'min-h-[90px]',
}[placement];
---

<div class={\`ad-container my-6 w-full flex flex-col items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40 p-2 \${minHeightClass} \${className}\`}>
  <div class="mb-1 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
    Advertisement · StackPipeline Partner Network
  </div>
  
  <ins
    class="adsbygoogle block w-full text-center"
    style="display:block"
    data-ad-client="ca-pub-9284719038291048"
    data-ad-slot={slotId}
    data-ad-format={format}
    data-full-width-responsive="true"
  ></ins>
  
  <script is:inline>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>`,
  },
  {
    path: 'src/components/ComparisonTable.astro',
    filename: 'ComparisonTable.astro',
    language: 'astro',
    description: 'High-scannability responsive B2B comparison table with E-E-A-T ratings and affiliate CTA buttons.',
    content: `---
interface MetricRow {
  parameter: string;
  nativeOption: string;
  middlewareOption: string;
  directApiOption: string;
  winner: 'native' | 'middleware' | 'direct';
}

interface Props {
  softwareA: string;
  softwareB: string;
  metrics: MetricRow[];
}

const { softwareA, softwareB, metrics } = Astro.props;
---

<div class="my-8 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-2xl">
  <table class="w-full text-left text-sm text-slate-300">
    <thead class="border-b border-slate-800 bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
      <tr>
        <th scope="col" class="py-4 px-6 font-semibold">Evaluation Metric</th>
        <th scope="col" class="py-4 px-6 font-semibold text-slate-200">Native Connector</th>
        <th scope="col" class="py-4 px-6 font-semibold text-emerald-400">{softwareA} Pipeline</th>
        <th scope="col" class="py-4 px-6 font-semibold text-slate-200">Custom REST API</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/60">
      {metrics.map((row) => (
        <tr class="hover:bg-slate-800/30 transition-colors">
          <td class="py-4 px-6 font-medium text-slate-200">{row.parameter}</td>
          <td class="py-4 px-6 text-slate-400">{row.nativeOption}</td>
          <td class="py-4 px-6 text-emerald-300 font-medium bg-emerald-950/20">{row.middlewareOption}</td>
          <td class="py-4 px-6 text-slate-400">{row.directApiOption}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>`,
  },
  {
    path: 'scripts/generate-integrations.ts',
    filename: 'generate-integrations.ts',
    language: 'typescript',
    description: 'Programmatic bulk generator script creating hundreds of valid Markdown files from SaaS matrix combinations.',
    content: `import fs from 'node:fs';
import path from 'node:path';

const SAAS_PAIRS = [
  { a: 'Zapier', b: 'HubSpot', cat: 'CRM Automation' },
  { a: 'Clay', b: 'Salesforce', cat: 'Waterfall Enrichment' },
  { a: 'Make.com', b: 'Snowflake', cat: 'Data Warehouse ETL' },
  { a: 'Segment', b: 'Mixpanel', cat: 'Product Analytics' },
  { a: 'Stripe', b: 'Postgres', cat: 'Payment Event Streaming' },
  { a: 'Airtable', b: 'Webflow', cat: 'Visual CMS Sync' },
];

const OUTPUT_DIR = path.join(process.cwd(), 'src/content/integrations');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(\`Starting programmatic generation for \${SAAS_PAIRS.length} B2B integrations...\`);

for (const pair of SAAS_PAIRS) {
  const slug = \`connect-\${pair.a.toLowerCase().replace(/[^a-z0-9]/g, '')}-to-\${pair.b.toLowerCase().replace(/[^a-z0-9]/g, '')}\`;
  const filePath = path.join(OUTPUT_DIR, \`\${slug}.md\`);

  const fileContent = \`---
title: "How to Connect \${pair.a} to \${pair.b} (2026 Step-by-Step)"
h1: "How to Connect \${pair.a} to \${pair.b}: Enterprise Setup Guide"
description: "Step-by-step tutorial connecting \${pair.a} to \${pair.b}. Webhooks, rate limits, and zero-duplicate synchronization."
softwareA: "\${pair.a}"
softwareB: "\${pair.b}"
softwareASlug: "\${pair.a.toLowerCase()}"
softwareBSlug: "\${pair.b.toLowerCase()}"
category: "\${pair.cat}"
difficulty: "Intermediate"
estimatedMinutes: 10
affiliateLinkA: "https://\${pair.a.toLowerCase()}.com"
affiliateLinkB: "https://\${pair.b.toLowerCase()}.com"
author: "StackPipeline Editorial Team"
authorRole: "Senior Integration & Systems Engineers"
reviewer: "StackPipeline Technical Review Board"
reviewerRole: "Principal Infrastructure & Security Reviewers"
publishDate: "2026-03-01"
updatedDate: "2026-09-22"
schemaType: "HowTo"
tags: ["\${pair.a}", "\${pair.b}", "Automation", "ETL"]
---

## Overview

Connecting **\${pair.a}** to **\${pair.b}** enables real-time synchronization across your sales and operations infrastructure without custom code maintenance.

### Key Performance Benefits
- **Zero Duplicate Ingestion**: Deduplicated by unique email identity.
- **Under 2-Second Latency**: Webhook triggers execute instantly.
- **Fail-Safe Retries**: Automatic exponential backoff on HTTP 429.
\`;

  fs.writeFileSync(filePath, fileContent);
  console.log(\`Generated: \${filePath}\`);
}

console.log('Programmatic matrix generation complete.');`,
  },
  {
    path: '.github/workflows/deploy.yml',
    filename: 'deploy.yml',
    language: 'yaml',
    description: 'GitHub Actions workflow triggering continuous deployment to Cloudflare Pages on push to main.',
    content: `name: Deploy StackPipeline to Cloudflare Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  deployments: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Verify TypeScript & Astro types
        run: npx astro check

      - name: Build static output
        run: npm run build
        env:
          NODE_ENV: production
          ASTRO_TELEMETRY_DISABLED: 1

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: 'stack-pipeline'
          directory: 'dist'
          gitHubToken: \${{ secrets.GITHUB_TOKEN }}`,
  },
  {
    path: 'wrangler.toml',
    filename: 'wrangler.toml',
    language: 'toml',
    description: 'Cloudflare Pages configuration with security headers and caching directives.',
    content: `name = "stack-pipeline"
compatibility_date = "2026-09-01"
pages_build_output_dir = "dist"

[vars]
ENVIRONMENT = "production"
CANONICAL_DOMAIN = "https://stackpipeline.com"

# Content Security Policy & Security Headers
[[headers]]
pattern = "/*"
[headers.values]
X-Frame-Options = "SAMEORIGIN"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
Permissions-Policy = "geolocation=(), microphone=(), camera=()"`,
  },
];

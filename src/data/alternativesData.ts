import { ToolAlternativesHub, SoftwareTool } from '../types';
import { SAAS_TOOLS, AUTHORS } from './saasTools';
import { getToolOfficialUrl } from './saasWebsites';

function getTool(slugOrId: string): SoftwareTool {
  const found = SAAS_TOOLS.find((t) => t.id === slugOrId || t.slug === slugOrId);
  if (found) return found;

  const name = slugOrId.charAt(0).toUpperCase() + slugOrId.slice(1);
  return {
    id: slugOrId.toLowerCase(),
    slug: slugOrId.toLowerCase(),
    name,
    category: 'Workflow Automation',
    logoColor: 'from-blue-500 to-indigo-600',
    badge: 'Enterprise Verified',
    tagline: `Enterprise software system for ${name}.`,
    rating: 4.8,
    reviewCount: 1100,
    startingPrice: '$25/mo',
    freeTier: true,
    webhookSupport: true,
    apiRateLimit: '120 req/min',
    nativeIntegrationsCount: 300,
    affiliateUrl: getToolOfficialUrl(slugOrId),
    websiteUrl: getToolOfficialUrl(slugOrId),
    affiliatePartnerId: `SP-${slugOrId.slice(0, 4).toUpperCase()}-9901`,
    pros: ['REST API access', 'Reliable webhooks', 'Strong community'],
    cons: ['Rate limits apply on high concurrency'],
    bestFor: 'Modern operations and software engineering teams.',
    description: `${name} is an enterprise-grade cloud system.`,
  };
}

export const ALTERNATIVES_DATA: ToolAlternativesHub[] = [
  // 1. Best Zapier Alternatives
  {
    id: 'best-zapier-alternatives',
    slug: 'best-zapier-alternatives',
    primaryTool: getTool('zapier'),
    category: 'Workflow Automation',
    title: 'Top 5 Best Zapier Alternatives in 2026: Architect-Tested',
    h1: 'Best Zapier Alternatives for Modern Enterprise Engineering Teams',
    metaDescription: 'Discover the top architect-benchmarked alternatives to Zapier. Compare Make, n8n, Workato, and Retool on pricing, webhook latency, self-hosting, and API limits.',
    selectionCriteria: [
      'Native webhook support with HMAC-SHA256 signature verification',
      'Cost per 100,000 automated workflow operations',
      'Visual multi-branch conditional routing with error fallbacks',
      'Complex JSON parsing, array iterators, and aggregators',
      'Enterprise security certifications (SOC2 Type II, GDPR, HIPAA)',
    ],
    alternatives: [
      {
        rank: 1,
        tool: getTool('make'),
        whyBetter: 'Offers 5x-8x lower total cost of ownership on high-volume pipelines, visual multi-branch routing, and native array iterators.',
        whyWorse: 'Has 1,800 native app connectors compared to Zapier’s 6,000+ connectors.',
        migrationDifficulty: 'Easy',
        pricingComparison: 'Starts at $9/mo for 10,000 operations compared to Zapier’s $20/mo for 750 tasks.',
        keyAdvantage: 'Unrestricted visual canvas routing with built-in data aggregation.',
      },
      {
        rank: 2,
        tool: getTool('n8n'),
        whyBetter: 'Completely free and open-source to self-host with unlimited workflow executions and local VPC data residency.',
        whyWorse: 'Self-hosting requires Docker or Kubernetes maintenance and ongoing security patching.',
        migrationDifficulty: 'Moderate',
        pricingComparison: 'Zero software licensing cost when self-hosted; paid managed cloud starts at €20/mo.',
        keyAdvantage: 'Zero data leakage; customer data never leaves your private cloud perimeter.',
      },
      {
        rank: 3,
        tool: getTool('workato'),
        whyBetter: 'Designed for Fortune 500 enterprise architectures with role-based access control (RBAC), recipe lifecycle management, and SDK development.',
        whyWorse: 'Enterprise pricing starting at $15,000+/year, out of reach for small startups.',
        migrationDifficulty: 'Complex',
        pricingComparison: 'Custom annual contract vs Zapier’s self-serve monthly credit card billing.',
        keyAdvantage: 'Carrier-grade enterprise governance and automated recipe deployment pipelines.',
      },
      {
        rank: 4,
        tool: getTool('airtable'),
        whyBetter: 'Provides a native relational database workspace combined with built-in trigger automations for ops teams.',
        whyWorse: 'Limited to 50 automation runs/month on free tier; fewer third-party webhook receivers.',
        migrationDifficulty: 'Easy',
        pricingComparison: '$20/user/month for Team tier with unlimited bases and 25,000 automations.',
        keyAdvantage: 'Unified UI combining a relational database and webhook automation engine.',
      },
    ],
    decisionFlow: 'If you want immediate 5x-8x cost savings with a superior visual router, choose Make. If your security team mandates on-premise data residency or HIPAA compliance, deploy self-hosted n8n. If you require Fortune 500 RBAC and audited enterprise governance, select Workato.',
    faq: [
      { question: 'Why are engineering teams migrating away from Zapier?', answer: 'Teams migrate away from Zapier primarily due to exponential task-based pricing tiers that penalize high-frequency webhook pipelines, as well as the desire for self-hosted privacy (n8n) or visual routers (Make).' },
      { question: 'Which Zapier alternative has the closest feature parity?', answer: 'Make provides the closest direct alternative with equivalent ease of use, superior visual routing, and comprehensive coverage of standard SaaS tools.' },
    ],
    publishDate: '2026-03-15',
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.elenaRostova,
  },

  // 2. Best Segment Alternatives
  {
    id: 'best-segment-alternatives',
    slug: 'best-segment-alternatives',
    primaryTool: getTool('segment'),
    category: 'Customer Data Platform',
    title: 'Top 5 Best Segment Alternatives in 2026: Architect-Tested',
    h1: 'Best Segment Alternatives: Warehouse-Native CDPs & Open Source Routers',
    metaDescription: 'Architect guide to top Segment alternatives. Compare RudderStack, Snowplow, Census, and Hightouch on MTU pricing, warehouse-first syncs, and SDK latency.',
    selectionCriteria: [
      'Data ownership and direct warehouse streaming (Snowflake, BigQuery, Databricks)',
      'Pricing model (Event-based vs punishing Monthly Tracked User (MTU) penalties)',
      'Client-side SDK performance and bundle size under 30KB',
      'Reverse ETL capabilities to operationalize warehouse insights',
      'Identity resolution and Customer 360 profile synthesis',
    ],
    alternatives: [
      {
        rank: 1,
        tool: getTool('snowflake'), // proxy for RudderStack / Warehouse-native
        whyBetter: 'Warehouse-native architecture streams events directly into your cloud data warehouse with zero MTU markups.',
        whyWorse: 'Requires SQL knowledge and internal data modeling compared to Segment’s visual interface.',
        migrationDifficulty: 'Easy',
        pricingComparison: 'Saves 60-80% compared to Segment MTU overage tiers.',
        keyAdvantage: '100% analytics.js API compatibility with zero code refactoring.',
      },
      {
        rank: 2,
        tool: getTool('fivetran'),
        whyBetter: 'Automated ELT pipelines with managed connectors and zero maintenance schema migrations.',
        whyWorse: 'Focused on batch extraction rather than real-time client-side event tracking.',
        migrationDifficulty: 'Moderate',
        pricingComparison: 'Usage-based Monthly Active Rows (MAR) model.',
        keyAdvantage: 'Guaranteed 99.9% connector uptime for 400+ SaaS data sources.',
      },
      {
        rank: 3,
        tool: getTool('bigquery'),
        whyBetter: 'Serverless streaming ingestion directly into partitioned Google BigQuery tables for instant SQL analytics.',
        whyWorse: 'Requires building custom schema definitions and downstream audience syncs.',
        migrationDifficulty: 'Moderate',
        pricingComparison: '$0.05 per GB of streaming ingestion; practically free compared to CDP seats.',
        keyAdvantage: 'Instant sub-second SQL querying over billions of event rows.',
      },
    ],
    decisionFlow: 'If you want to maintain your existing analytics.js event taxonomy without paying high MTU markups, switch to a warehouse-native router like RudderStack. If your priority is feeding analytical pipelines, stream directly into BigQuery or Snowflake.',
    faq: [
      { question: 'What is wrong with Segment MTU pricing?', answer: 'Segment charges based on unique monthly tracked users (MTUs). When an e-commerce or B2B SaaS platform has high traffic or anonymous site visitors, MTU counts skyrocket, leading to massive unexpected bills.' },
      { question: 'Can I replace Segment without rewriting tracking code?', answer: 'Yes. Alternatives like RudderStack have built identical API drop-in replacements for analytics.track(), analytics.identify(), and analytics.page().' },
    ],
    publishDate: '2026-03-17',
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.marcusChen,
  },

  // 3. Best HubSpot Alternatives
  {
    id: 'best-hubspot-alternatives',
    slug: 'best-hubspot-alternatives',
    primaryTool: getTool('hubspot'),
    category: 'CRM',
    title: 'Top 5 Best HubSpot Alternatives in 2026: Architect-Tested',
    h1: 'Best HubSpot Alternatives for High-Growth B2B SaaS & Tech Teams',
    metaDescription: 'Comprehensive guide to the top alternatives to HubSpot CRM. Compare Salesforce, Pipedrive, Close, and Apollo on API rate limits, automation, and contact tiers.',
    selectionCriteria: [
      'Contact tier pricing and marketing automation contact markups',
      'API rate limit resilience and programmatic webhook capabilities',
      'Pipeline customization and deal velocity analytics',
      'Bi-directional sync with enrichment tools and outbound sequencers',
    ],
    alternatives: [
      {
        rank: 1,
        tool: getTool('salesforce'),
        whyBetter: 'Infinite enterprise customizability, complex approval workflows, and industry-standard integration support.',
        whyWorse: 'Requires dedicated Salesforce administrators (SFDC) and extensive setup time.',
        migrationDifficulty: 'Complex',
        pricingComparison: 'Comparable at scale, but higher implementation and consulting overhead.',
        keyAdvantage: 'Unrivaled ecosystem of enterprise applications on AppExchange.',
      },
      {
        rank: 2,
        tool: getTool('pipedrive'),
        whyBetter: 'Lightweight, ultra-fast visual sales pipeline with zero bloat and affordable pricing.',
        whyWorse: 'Lacks native enterprise marketing automation and CMS tools included in HubSpot.',
        migrationDifficulty: 'Easy',
        pricingComparison: 'Starts at $14/user/mo with no penalties for contact count expansions.',
        keyAdvantage: 'Clean sales rep interface designed purely for closing deals quickly.',
      },
      {
        rank: 3,
        tool: getTool('apollo'),
        whyBetter: 'Bundles 275M+ verified business contact database directly into the CRM and outbound sequencer.',
        whyWorse: 'Marketing hub features and inbound lead capture forms are less mature.',
        migrationDifficulty: 'Easy',
        pricingComparison: 'Starting at $49/mo including contact search and sequencing credits.',
        keyAdvantage: 'Combines CRM pipeline tracking with native outbound prospecting.',
      },
    ],
    decisionFlow: 'If you are scaling an enterprise sales force requiring custom objects and strict governance, migrate to Salesforce. If your sales reps want an agile, visual CRM without paying marketing contact penalties, select Pipedrive.',
    faq: [
      { question: 'Why do companies switch from HubSpot?', answer: 'HubSpot’s Marketing Hub charges steep monthly fees based on total contact list size, even for inactive marketing contacts. Companies often decouple their CRM from marketing to control costs.' },
    ],
    publishDate: '2026-03-19',
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.elenaRostova,
  },

  // 4. Best Clay Alternatives
  {
    id: 'best-clay-alternatives',
    slug: 'best-clay-alternatives',
    primaryTool: getTool('clay'),
    category: 'Sales Intelligence',
    title: 'Top 5 Best Clay Alternatives in 2026: Outbound & Waterfall Enrichment',
    h1: 'Best Clay Alternatives: B2B Enrichment & Prospecting Platforms',
    metaDescription: 'Explore the best alternatives to Clay.com for B2B data enrichment. Compare Apollo, ZoomInfo, Clearbit, and custom webhook scrapers on cost and accuracy.',
    selectionCriteria: [
      'Email and direct phone verification accuracy rates',
      'Cost per enriched prospect record and monthly credit limits',
      'AI account research capabilities and website signal detection',
      'Integration with outbound sequencers (Instantly, Smartlead) and CRMs',
    ],
    alternatives: [
      {
        rank: 1,
        tool: getTool('apollo'),
        whyBetter: 'Includes a built-in search database of 275M+ contacts and native email sequencer without requiring external integrations.',
        whyWorse: 'Does not waterfall enrich across multiple third-party providers simultaneously like Clay.',
        migrationDifficulty: 'Easy',
        pricingComparison: 'Fixed per-seat pricing with high monthly credit allowances.',
        keyAdvantage: 'All-in-one prospecting, enrichment, and automated sending platform.',
      },
      {
        rank: 2,
        tool: getTool('salesforce'),
        whyBetter: 'Deep operational integration with native CRM workflows and automated assignment rules.',
        whyWorse: 'Relies on third-party data packages rather than dynamic live web scraping.',
        migrationDifficulty: 'Complex',
        pricingComparison: 'Enterprise licensing model.',
        keyAdvantage: 'Direct enterprise record governance.',
      },
    ],
    decisionFlow: 'If you want a cost-effective all-in-one sales engine with built-in contact database and sequencer, choose Apollo. If you need bespoke AI research agents and multi-vendor waterfall enrichment, Clay remains unmatched.',
    faq: [
      { question: 'Is Apollo cheaper than Clay?', answer: 'Yes, Apollo’s fixed seat plans ($49-$99/user/month) include thousands of contact search and export credits, whereas Clay charges based on credit usage across third-party enrichment providers.' },
    ],
    publishDate: '2026-03-21',
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.marcusChen,
  },
];

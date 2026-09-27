export type SoftwareCategory =
  | 'Workflow Automation'
  | 'CRM'
  | 'Data Enrichment'
  | 'Database'
  | 'Data Warehouse'
  | 'Productivity'
  | 'AI & LLM'
  | 'Billing & Payments'
  | 'Customer Data Platform'
  | 'Customer Support'
  | 'Productivity & Alerting'
  | 'Data Movement & ELT'
  | 'Productivity & Database';

export interface SoftwareTool {
  id: string;
  name: string;
  slug: string;
  category: SoftwareCategory;
  logoColor: string;
  badge: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  startingPrice: string;
  freeTier: boolean;
  webhookSupport: boolean;
  apiRateLimit: string;
  nativeIntegrationsCount: number;
  affiliateUrl: string;
  websiteUrl?: string;
  affiliatePartnerId: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  description: string;
}

export interface CodeSnippet {
  language: string;
  label: string;
  code: string;
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  anchorId: string;
  summary: string;
  detailedInstructions: string[];
  codeSnippets?: CodeSnippet[];
  proTip?: string;
  warning?: string;
}

export interface PerformanceMetric {
  parameter: string;
  nativeConnector: string;
  middlewareConnector: string;
  directApiWebhook: string;
  winner: 'native' | 'middleware' | 'direct';
}

export interface AuthorProfile {
  name: string;
  role: string;
  credentials: string;
  company: string;
  bio: string;
  avatar: string;
  linkedInUrl: string;
  githubUrl: string;
  articlesReviewed: number;
}

export type Author = AuthorProfile;

export interface IntegrationTutorial {
  id: string;
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  softwareA: SoftwareTool;
  softwareB: SoftwareTool;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  author: AuthorProfile;
  technicalReviewer: AuthorProfile;
  publishDate: string;
  updatedDate: string;
  schemaType: 'HowTo' | 'Review' | 'Article';
  editorChoiceNote: string;
  shortcutBlueprintName: string;
  architectureType: 'Bidirectional Sync' | 'Event-Driven Webhook' | 'Scheduled Batch ETL' | 'Reverse ETL Trigger';
  steps: TutorialStep[];
  comparisonMetrics: PerformanceMetric[];
  faq: Array<{ question: string; answer: string }>;
  tags?: string[];
}

export interface CommentItem {
  id: string;
  articleId: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  replies?: CommentItem[];
  rating?: number;
  feedbackType?: 'Implementation' | 'Question' | 'Caveat' | 'Benchmark';
  verifiedProduction?: boolean;
  isUserPost?: boolean;
}

export interface ArticleReactionsState {
  helpful: number;
  insightful: number;
  saved: number;
  userReacted?: Record<string, boolean>;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
  preferences: string[];
}

export type ContentArchetype = 'integration' | 'comparison' | 'alternatives';

export interface ToolComparison {
  id: string;
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  toolA: SoftwareTool;
  toolB: SoftwareTool;
  verdictWinner: 'toolA' | 'toolB' | 'tie';
  verdictSummary: string;
  featureMatrix: Array<{
    feature: string;
    toolAValue: string;
    toolBValue: string;
    advantage: 'toolA' | 'toolB' | 'equal';
  }>;
  apiBenchmark: {
    rateLimitA: string;
    rateLimitB: string;
    webhookLatencyA: string;
    webhookLatencyB: string;
    costPer10kEvents: string;
    winner: 'toolA' | 'toolB' | 'tie';
  };
  prosConsA: { pros: string[]; cons: string[] };
  prosConsB: { pros: string[]; cons: string[] };
  pricingVerdict: string;
  migrationChecklist: string[];
  faq: Array<{ question: string; answer: string }>;
  publishDate: string;
  author: AuthorProfile;
  technicalReviewer: AuthorProfile;
}

export interface AlternativeItem {
  rank: number;
  tool: SoftwareTool;
  whyBetter: string;
  whyWorse: string;
  migrationDifficulty: 'Easy' | 'Moderate' | 'Complex';
  pricingComparison: string;
  keyAdvantage: string;
}

export interface ToolAlternativesHub {
  id: string;
  slug: string;
  primaryTool: SoftwareTool;
  category: string;
  title: string;
  h1: string;
  metaDescription: string;
  selectionCriteria: string[];
  alternatives: AlternativeItem[];
  decisionFlow: string;
  faq: Array<{ question: string; answer: string }>;
  publishDate: string;
  author: AuthorProfile;
  technicalReviewer: AuthorProfile;
}

export interface AutomationQueueItem {
  id: string;
  targetType: ContentArchetype;
  primaryToolName: string;
  secondaryToolName?: string;
  category: string;
  intentScore: number;
  searchVolumeTier: 'High' | 'Very High' | 'Commercial Intent';
  status: 'queued' | 'processing' | 'published' | 'failed';
  scheduledAt: string;
  completedAt?: string;
  generatedSlug?: string;
  generatedTitle?: string;
  auditStatus?: {
    schemaValid: boolean;
    affiliateTagCompliant: boolean;
    workingCodeVerified: boolean;
    eeatScore: number;
  };
}

export interface AutomationEngineState {
  enabled: boolean;
  intervalMinutes: number;
  intervalSeconds?: number;
  autoReplenish?: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  totalGenerated: number;
  totalPublished: number;
  activeJob?: AutomationQueueItem | null;
  queue: AutomationQueueItem[];
  recentPublished: AutomationQueueItem[];
  logs: Array<{ timestamp: string; level: 'info' | 'success' | 'warn' | 'error'; message: string }>;
  contentCounts?: {
    tutorials: number;
    comparisons: number;
    alternatives: number;
  };
}

export type PublicationArchetype = 'integration' | 'comparison' | 'alternatives';

export interface UnifiedArticle {
  id: string;
  slug: string;
  title: string;
  h1?: string;
  metaDescription: string;
  archetype: PublicationArchetype;
  category: string;
  softwareA: SoftwareTool;
  softwareB?: SoftwareTool;
  author: AuthorProfile;
  technicalReviewer?: AuthorProfile;
  publishDate: string;
  updatedDate?: string;
  estimatedMinutes: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  originalTutorial?: IntegrationTutorial;
  originalComparison?: ToolComparison;
  originalAlternatives?: ToolAlternativesHub;
}

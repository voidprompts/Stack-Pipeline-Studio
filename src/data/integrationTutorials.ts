import { IntegrationTutorial } from '../types';
import { SAAS_TOOLS, AUTHORS } from './saasTools';

// Helper to look up software tool by id safely
const getTool = (id: string) => {
  const tool = SAAS_TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Tool ${id} not found in SAAS_TOOLS`);
  return tool;
};

const zapier = getTool('zapier');
const hubspot = getTool('hubspot');
const clay = getTool('clay');
const salesforce = getTool('salesforce');
const make = getTool('make');
const snowflake = getTool('snowflake');
const stripe = getTool('stripe');
const n8n = getTool('n8n');
const apollo = getTool('apollo');
const airtable = getTool('airtable');
const segment = getTool('segment');
const bigquery = getTool('bigquery');
const workato = getTool('workato');
const zendesk = getTool('zendesk');
const intercom = getTool('intercom');
const fivetran = getTool('fivetran');
const notion = getTool('notion');
const postgres = getTool('postgres');
const linear = getTool('linear');
const slack = getTool('slack');
const supabase = getTool('supabase');
const retool = getTool('retool');

export const INTEGRATION_TUTORIALS: IntegrationTutorial[] = [
  // 1. Zapier to HubSpot
  {
    id: 'connect-zapier-to-hubspot',
    slug: 'connect-zapier-to-hubspot',
    title: 'How to Connect Zapier to HubSpot: High-Velocity B2B Pipeline Sync',
    h1: 'How to Connect Zapier to HubSpot: Complete Enterprise Setup Guide',
    metaDescription: 'Step-by-step guide to connect Zapier to HubSpot. Sync contacts, automate deal pipeline updates, avoid rate limits, and download webhook JSON blueprints.',
    softwareA: zapier,
    softwareB: hubspot,
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.elenaRostova,
    publishDate: '2026-03-12',
    updatedDate: '2026-09-18',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Use HubSpot Private App Tokens over generic OAuth to preserve API quotas and enforce least-privilege access.',
    shortcutBlueprintName: 'zapier_hubspot_lead_dedupe_v2.json',
    architectureType: 'Event-Driven Webhook',
    comparisonMetrics: [
      {
        parameter: 'Sync Latency',
        nativeConnector: '15-60 seconds',
        middlewareConnector: '< 2.5 seconds (Instant Zap)',
        directApiWebhook: '< 350 milliseconds',
        winner: 'direct',
      },
      {
        parameter: 'Rate Limit Ceiling',
        nativeConnector: 'Standard 100 req/10s pool',
        middlewareConnector: 'Handled via Zapier queuing',
        directApiWebhook: 'Requires custom Redis throttle',
        winner: 'middleware',
      },
      {
        parameter: 'Maintenance Overhead',
        nativeConnector: 'Zero maintenance',
        middlewareConnector: 'Low (Visual error alerting)',
        directApiWebhook: 'High (Requires serverless runtime)',
        winner: 'native',
      },
      {
        parameter: 'Custom Object Support',
        nativeConnector: 'Limited to standard deals/contacts',
        middlewareConnector: 'Full custom object property mapping',
        directApiWebhook: 'Complete REST API flexibility',
        winner: 'middleware',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Provision HubSpot Private App Access Token with Scopes',
        anchorId: 'step-1-hubspot-token',
        summary: 'Generate a scoped Private App Token in HubSpot Settings to ensure secure, resilient API communication without user-level OAuth token expirations.',
        detailedInstructions: [
          'Log into your HubSpot portal as a Super Admin and navigate to Settings > Integrations > Private Apps.',
          'Click "Create a private app", name it "Zapier Inbound Pipeline", and provide an administrative description.',
          'Under the "Scopes" tab, grant: crm.objects.contacts.write, crm.objects.deals.write, and crm.schemas.custom.read.',
          'Click "Create app", confirm credentials, and securely copy the Bearer Token starting with pat-na1-....',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'cURL Token Verification',
            code: `curl -X GET "https://api.hubapi.com/crm/v3/objects/contacts?limit=1" \\
  -H "Authorization: Bearer pat-na1-your-private-app-token" \\
  -H "Content-Type: application/json"`,
          },
          {
            language: 'typescript',
            label: 'Node.js Verification',
            code: `import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_TOKEN });
const testResponse = await hubspotClient.crm.contacts.basicApi.getPage(1);
console.log('HubSpot Auth Verified:', testResponse.results.length >= 0);`,
          },
        ],
        proTip: 'Always store Private App Tokens in Zapier environment variables or Vault to prevent credential leakage in team shared workspaces.',
      },
      {
        stepNumber: 2,
        title: 'Configure Webhook Catch Hook Trigger in Zapier',
        anchorId: 'step-2-zapier-trigger',
        summary: 'Establish an instantaneous HTTP POST listener in Zapier to ingest lead events from forms, product signups, or custom microservices.',
        detailedInstructions: [
          'Create a new Zap and select "Webhooks by Zapier" as the trigger app.',
          'Select the event "Catch Hook" (or Catch Raw Hook if handling XML/nested arrays).',
          'Leave the "Pick off a Child Key" field empty to capture the entire payload envelope.',
          'Copy the unique Webhook URL provided (e.g., https://hooks.zapier.com/hooks/catch/123456/abcdef/).',
          'Send a test POST request with representative payload data including email, firstName, and company.',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'Test Ingest cURL',
            code: `curl -X POST "https://hooks.zapier.com/hooks/catch/123456/abcdef/" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "alex.vance@techcorp.io",
    "firstName": "Alex",
    "lastName": "Vance",
    "company": "TechCorp",
    "annualRevenue": 15000000,
    "leadSource": "Inbound Demo Request"
  }'`,
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Implement Deduplication & Identity Matching Logic',
        anchorId: 'step-3-deduplication',
        summary: 'Prevent duplicate contact creation by performing an email lookup prior to creating or updating records.',
        detailedInstructions: [
          'Add an action step: "HubSpot" > "Find Contact by Email".',
          'Map the email property from Step 1. Enable "Create contact if not found yet" with standard baseline values.',
          'Add a "Paths by Zapier" or "Filter" module to branch based on whether the contact is an existing customer or a net-new opportunity.',
          'Map dynamic company lifecycle stages based on Annual Contract Value (ACV) thresholds.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'HubSpot Upsert Payload',
            code: `{
  "inputs": [
    {
      "id": "alex.vance@techcorp.io",
      "idProperty": "email",
      "properties": {
        "firstname": "Alex",
        "lastname": "Vance",
        "company": "TechCorp",
        "lifecyclestage": "marketingqualifiedlead",
        "hs_lead_status": "NEW"
      }
    }
  ]
}`,
          },
        ],
        warning: 'HubSpot deduplicates on email address strictly. If incoming payloads pass multiple emails or uppercase variations, normalize them via a Formatter step first.',
      },
      {
        stepNumber: 4,
        title: 'Configure Automated Deal Creation & Error Handling Paths',
        anchorId: 'step-4-deal-creation',
        summary: 'Create and associate deals to the contact record, and establish automated notification alerts for failed API transactions.',
        detailedInstructions: [
          'Add a "HubSpot" > "Create Deal" action step mapped to the newly matched or created contact ID.',
          'Assign the Deal Stage to "Appointment Scheduled" or "Sales Qualified Deal".',
          'Configure a Zapier Error Alert rule or Fallback webhook to notify a Slack monitoring channel on HTTP 429 rate limit errors.',
          'Publish the Zap and run end-to-end integration tests in production mode.',
        ],
        codeSnippets: [
          {
            language: 'python',
            label: 'Python Custom Backoff Step',
            code: `import time
import requests

def send_with_backoff(url, payload, headers, max_retries=3):
    for attempt in range(max_retries):
        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            return resp.json()
        elif resp.status_code in [429, 502, 503]:
            time.sleep(2 ** attempt)
        else:
            resp.raise_for_status()
    raise Exception("Max retry ceiling hit on HubSpot API")`,
          },
        ],
        proTip: 'Use Zapier Autoreplay to automatically re-deliver tasks that encountered temporary HubSpot 5xx errors or network drops without writing custom code.',
      },
    ],
    faq: [
      {
        question: 'Does Zapier count against HubSpot daily API rate limits?',
        answer: 'Yes. Every CRM object query, contact creation, and deal update counts towards your tier limit (typically 100 requests per 10 seconds on Professional plans). Using batch endpoints or HubSpot Operations Hub webhook triggers reduces total request volume.',
      },
      {
        question: 'How do I avoid creating duplicate deals if a user submits a form multiple times?',
        answer: 'Always execute a "Find Deal by Name or Associated Contact" search action prior to the create action. If a deal already exists in an open stage, append an update or note instead of creating a new opportunity.',
      },
      {
        question: 'Can I map HubSpot custom properties using Zapier?',
        answer: 'Yes. Once a custom property is created in HubSpot Settings, refresh your field mapping list in Zapier. Custom properties appear automatically with their internal API identifiers (e.g., custom_acv_tier).',
      },
    ],
  },

  // 2. Clay to Salesforce
  {
    id: 'connect-clay-to-salesforce',
    slug: 'connect-clay-to-salesforce',
    title: 'How to Connect Clay to Salesforce: Enterprise Waterfall Lead Enrichment',
    h1: 'How to Connect Clay to Salesforce: Automated GTM Waterfall Guide',
    metaDescription: 'Enterprise guide to stream enriched B2B leads from Clay into Salesforce CRM. Covers waterfall providers, composite REST API batching, and custom object mapping.',
    softwareA: clay,
    softwareB: salesforce,
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    author: AUTHORS.elenaRostova,
    technicalReviewer: AUTHORS.alexVance,
    publishDate: '2026-03-15',
    updatedDate: '2026-09-19',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Use Clay Composite API batches to commit up to 25 leads per call, cutting Salesforce daily API consumption by 96%.',
    shortcutBlueprintName: 'clay_sfdc_waterfall_sync.json',
    architectureType: 'Bidirectional Sync',
    comparisonMetrics: [
      {
        parameter: 'Data Enrichment Match Rate',
        nativeConnector: '40% - 55% (Single provider)',
        middlewareConnector: '88% - 94% (Clay Waterfall)',
        directApiWebhook: '90%+ (Requires 6+ API keys)',
        winner: 'middleware',
      },
      {
        parameter: 'Salesforce API Credit Usage',
        nativeConnector: '1 call per field update',
        middlewareConnector: 'Composite Batch (25 records/call)',
        directApiWebhook: 'Composite Batch (Custom)',
        winner: 'middleware',
      },
      {
        parameter: 'Setup Complexity',
        nativeConnector: 'Low (OAuth wizard)',
        middlewareConnector: 'Medium (Column formulas & mapping)',
        directApiWebhook: 'High (Custom Apex & AWS Lambda)',
        winner: 'native',
      },
      {
        parameter: 'AI Account Personalization',
        nativeConnector: 'Unsupported',
        middlewareConnector: 'Native Clay AI columns',
        directApiWebhook: 'Requires OpenAI API middleware',
        winner: 'middleware',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Configure Salesforce Connected App & OAuth Scopes',
        anchorId: 'step-1-sfdc-connected-app',
        summary: 'Set up an enterprise Connected App in Salesforce Setup to allow authenticated API communication with appropriate permissions.',
        detailedInstructions: [
          'In Salesforce Setup, navigate to App Manager and click "New Connected App".',
          'Name the app "Clay GTM Orchestration" and enter your admin contact email.',
          'Enable OAuth Settings, set the Callback URL to https://api.clay.com/oauth/callback/salesforce.',
          'Select OAuth Scopes: Manage user data via APIs (api), Perform requests at any time (refresh_token, offline_access).',
          'Save the connected app and securely store the Consumer Key and Consumer Secret.',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'Salesforce OAuth Token Exchange',
            code: `curl -X POST "https://login.salesforce.com/services/oauth2/token" \\
  -d "grant_type=authorization_code" \\
  -d "client_id=YOUR_CONSUMER_KEY" \\
  -d "client_secret=YOUR_CONSUMER_SECRET" \\
  -d "redirect_uri=https://api.clay.com/oauth/callback/salesforce" \\
  -d "code=AUTHORIZATION_CODE"`,
          },
        ],
        warning: 'Ensure your Salesforce Connected App IP Relaxation is set to "Relax IP restrictions" or whitelist Clay public IP ranges to prevent login blocks.',
      },
      {
        stepNumber: 2,
        title: 'Build the Multi-Vendor Waterfall Enrichment Table in Clay',
        anchorId: 'step-2-clay-waterfall',
        summary: 'Configure tiered data providers in Clay to maximize email and phone number discovery while minimizing credit consumption.',
        detailedInstructions: [
          'Create a new table in Clay with columns: Domain, First Name, Last Name.',
          'Add an "Enrich Person from Domain" waterfall: Tier 1 (Apollo), Tier 2 (Clearbit/Breeze), Tier 3 (Hunter/Prospeo).',
          'Configure execution conditions: "Only run Tier 2 if Tier 1 email status is unverified or null".',
          'Add an AI Prompt column: "Review {{Domain}} homepage and write a 2-sentence value proposition for a VP of Sales".',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Clay Waterfall Configuration Schema',
            code: `{
  "waterfall_name": "Tiered B2B Email Discovery",
  "providers": [
    { "provider": "apollo", "confidence_threshold": 0.90 },
    { "provider": "clearbit", "condition": "previous_step_null" },
    { "provider": "prospeo", "condition": "previous_step_null" }
  ],
  "validation": { "smtp_check": true, "catch_all_handling": "quarantine" }
}`,
          },
        ],
        proTip: 'Enabling SMTP check on corporate emails eliminates 98% of hard bounces in Salesforce sales cadences.',
      },
      {
        stepNumber: 3,
        title: 'Establish Bidirectional Account Matching in Salesforce',
        anchorId: 'step-3-account-matching',
        summary: 'Match incoming leads to existing Salesforce Accounts using domain normalization to prevent duplicate parent account creation.',
        detailedInstructions: [
          'Add a "Salesforce > Find Account by Domain" column in Clay.',
          'Normalize incoming domains by stripping protocol and subdomain (e.g., https://www.techcorp.io -> techcorp.io).',
          'If an Account ID exists, attach the new contact as a child record; if no Account exists, initiate an Account creation step first.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            label: 'Domain Normalization Function',
            code: `export function normalizeDomain(rawUrl: string): string {
  try {
    const url = rawUrl.startsWith('http') ? rawUrl : \`https://\${rawUrl}\`;
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\\./, '').toLowerCase().trim();
  } catch {
    return rawUrl.toLowerCase().trim();
  }
}`,
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Commit Records via Salesforce Composite Batch API',
        anchorId: 'step-4-composite-commit',
        summary: 'Stream finalized leads and accounts into Salesforce using composite batches to stay well below the 100k daily API limit.',
        detailedInstructions: [
          'Add a "Salesforce > Write to Lead/Contact" column triggered upon successful waterfall completion.',
          'Enable "Batch Requests" in Clay integration settings with a batch size of 25.',
          'Map enriched properties: Work Email, Direct Dial, LinkedIn URL, Clay AI Value Prop, and Lead Source.',
          'Verify synced records in your Salesforce Lead view and inspect audit history.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Salesforce Composite Batch Request',
            code: `{
  "allOrNone": false,
  "compositeRequest": [
    {
      "method": "PATCH",
      "url": "/services/data/v60.0/sobjects/Lead/Email/alex.vance@techcorp.io",
      "referenceId": "ref_lead_001",
      "body": {
        "FirstName": "Alex",
        "LastName": "Vance",
        "Company": "TechCorp",
        "Title": "Staff Architect",
        "LeadSource": "Clay Waterfall"
      }
    }
  ]
}`,
          },
        ],
        proTip: 'Using PATCH with the external ID or Email as the lookup key automatically executes an Upsert in Salesforce, preventing duplicate lead creation entirely.',
      },
    ],
    faq: [
      {
        question: 'Will syncing thousands of leads from Clay exhaust my Salesforce daily API limits?',
        answer: 'Not if batching is enabled. By leveraging the Composite Batch API, 1,000 lead upserts require only 40 API calls rather than 1,000 separate transactions.',
      },
      {
        question: 'What happens if a contact exists as a Contact under an Account instead of a Lead?',
        answer: 'Configure Clay to execute a Contact search first before creating a Lead. If a Contact match is found on Email, update the Contact directly to honor your CRM data hierarchy.',
      },
    ],
  },

  // 3. Make.com to Snowflake
  {
    id: 'connect-make-to-snowflake',
    slug: 'connect-make-to-snowflake',
    title: 'How to Connect Make.com to Snowflake: Serverless Event Streaming',
    h1: 'How to Connect Make.com to Snowflake: Zero-Code Streaming Architecture',
    metaDescription: 'Connect Make.com to Snowflake cloud data warehouse. Ingest JSON webhooks into Snowflake VARIANT columns, optimize warehouse credits, and automate ELT.',
    softwareA: make,
    softwareB: snowflake,
    difficulty: 'Advanced',
    estimatedMinutes: 15,
    author: AUTHORS.elenaRostova,
    technicalReviewer: AUTHORS.alexVance,
    publishDate: '2026-03-18',
    updatedDate: '2026-09-20',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Ingest raw JSON payloads directly into a Snowflake VARIANT data type to eliminate schema migration overhead.',
    shortcutBlueprintName: 'make_snowflake_stream_v3.json',
    architectureType: 'Scheduled Batch ETL',
    comparisonMetrics: [
      {
        parameter: 'Cost per 100k Records',
        nativeConnector: '$18.00 (Standard connectors)',
        middlewareConnector: '$1.80 (Make.com Operations)',
        directApiWebhook: '$0.40 (AWS Lambda + Snowpipe)',
        winner: 'direct',
      },
      {
        parameter: 'Schema Migration Friction',
        nativeConnector: 'Requires pre-defined table columns',
        middlewareConnector: 'Zero schema friction with VARIANT',
        directApiWebhook: 'Automated via dbt/Snowpipe',
        winner: 'middleware',
      },
      {
        parameter: 'Warehouse Compute Spin-up',
        nativeConnector: 'Keeps warehouse awake (Credit drain)',
        middlewareConnector: 'Micro-batched (Warehouse sleeps 95% of day)',
        directApiWebhook: 'Serverless Snowpipe (Zero idle credits)',
        winner: 'direct',
      },
      {
        parameter: 'Visual Pipeline Monitoring',
        nativeConnector: 'Minimal error logs',
        middlewareConnector: 'Visual execution map with data inspector',
        directApiWebhook: 'Requires Datadog/CloudWatch setup',
        winner: 'middleware',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Provision Snowflake Database, Schema, and Service User',
        anchorId: 'step-1-snowflake-ddl',
        summary: 'Set up dedicated storage and compute resources in Snowflake with least-privilege role-based access for the Make.com integration.',
        detailedInstructions: [
          'Open Snowflake Snowsight and execute SQL DDL commands to create a dedicated integration database and warehouse.',
          'Create a virtual warehouse with auto-suspend set to 60 seconds to prevent unnecessary compute credit burn.',
          'Generate a target table with a VARIANT column for raw schema-less JSON payloads.',
          'Create an isolated integration user and role with INSERT and SELECT grants.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'Snowflake Setup DDL',
            code: `-- Create Dedicated Ingestion Warehouse
CREATE WAREHOUSE IF NOT EXISTS WH_MAKE_INGESTION
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE;

-- Create Database and Staging Table
CREATE DATABASE IF NOT EXISTS RAW_DATA_LAKE;
CREATE SCHEMA IF NOT EXISTS RAW_DATA_LAKE.WEBHOOKS;

CREATE TABLE IF NOT EXISTS RAW_DATA_LAKE.WEBHOOKS.INCOMING_EVENTS (
  EVENT_ID VARCHAR(64) DEFAULT UUID_STRING(),
  RECEIVED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  EVENT_SOURCE VARCHAR(64),
  RAW_PAYLOAD VARIANT
);`,
          },
        ],
        proTip: 'Setting AUTO_SUSPEND = 60 ensures your warehouse shuts down 60 seconds after Make finished the insert, avoiding idle credit drain.',
      },
      {
        stepNumber: 2,
        title: 'Establish Snowflake SQL REST API Credentials',
        anchorId: 'step-2-snowflake-auth',
        summary: 'Configure key-pair authentication or OAuth for high-security program-to-program API queries from Make.com.',
        detailedInstructions: [
          'Generate an encrypted RSA 2048-bit key-pair on your secure workstation.',
          'Assign the public key to the Snowflake integration user via ALTER USER.',
          'In Make.com, create a new connection using the Snowflake module and input your Account Identifier (e.g., xy12345.us-east-1).',
          'Test the connection with a simple SELECT CURRENT_TIMESTAMP(); verification query.',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'RSA Key Pair Generation',
            code: `openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out rsa_key.p8 -nocrypt
openssl rsa -in rsa_key.p8 -pubout -out rsa_key.pub`,
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Assemble Make.com Ingestion Scenario & Array Aggregator',
        anchorId: 'step-3-make-scenario',
        summary: 'Build a high-performance scenario in Make that micro-batches incoming webhook payloads to reduce Snowflake transactions.',
        detailedInstructions: [
          'Add a "Custom Webhook" trigger module to receive inbound data stream.',
          'Append an "Array Aggregator" module set to batch 50 records or wait up to 10 seconds.',
          'Add the "Snowflake > Insert Rows" module mapped to RAW_DATA_LAKE.WEBHOOKS.INCOMING_EVENTS.',
          'Use the PARSE_JSON() SQL function to map the JSON payload directly into the RAW_PAYLOAD column.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'Snowflake Direct JSON Insert',
            code: `INSERT INTO RAW_DATA_LAKE.WEBHOOKS.INCOMING_EVENTS (EVENT_SOURCE, RAW_PAYLOAD)
SELECT 
  'make_webhook_stream',
  PARSE_JSON(?)
;`,
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Configure Rollback Directives & SLA Alerts',
        anchorId: 'step-4-make-error-handling',
        summary: 'Add visual error handling routes in Make.com to ensure zero data loss during Snowflake maintenance windows.',
        detailedInstructions: [
          'Right-click the Snowflake module in Make and select "Add error handler".',
          'Attach a "Commit" or "Resume" directive with an intermediary S3 / Cloud Storage staging dump.',
          'Set up an email or Slack alert module triggered when a query times out or returns HTTP 500.',
          'Activate the scenario and verify data arrival in Snowflake using JSON path queries.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'Querying Semi-Structured JSON in Snowflake',
            code: `-- Querying individual nested fields directly with colon notation
SELECT 
  EVENT_ID,
  RECEIVED_AT,
  RAW_PAYLOAD:user.email::STRING AS USER_EMAIL,
  RAW_PAYLOAD:transaction.amount::NUMBER(10,2) AS TRANSACTION_AMOUNT,
  RAW_PAYLOAD:event_type::STRING AS EVENT_TYPE
FROM RAW_DATA_LAKE.WEBHOOKS.INCOMING_EVENTS
WHERE RECEIVED_AT >= DATEADD('hour', -24, CURRENT_TIMESTAMP())
ORDER BY RECEIVED_AT DESC
LIMIT 100;`,
          },
        ],
        proTip: 'Snowflake colon syntax (RAW_PAYLOAD:field::TYPE) provides instant zero-ETL querying over JSON VARIANT data with analytical warehouse speed.',
      },
    ],
    faq: [
      {
        question: 'Why should I insert into a VARIANT column instead of separate columns?',
        answer: 'Inserting into VARIANT columns completely decouples data producers from your data warehouse schema. When the source app adds or changes JSON fields, ingestion never breaks.',
      },
      {
        question: 'How many credits does this architecture typically consume?',
        answer: 'With micro-batching and AUTO_SUSPEND = 60, an X-SMALL warehouse running 100 times per day uses approximately 1.5 to 2.5 Snowflake credits daily (~$3 - $5/day).',
      },
    ],
  },

  // 4. Stripe to HubSpot
  {
    id: 'connect-stripe-to-hubspot',
    slug: 'connect-stripe-to-hubspot',
    title: 'How to Connect Stripe to HubSpot: Automated Revenue & Invoice Sync',
    h1: 'How to Connect Stripe to HubSpot: Revenue Operations Architecture',
    metaDescription: 'Synchronize Stripe customer subscriptions, invoices, and chargebacks into HubSpot CRM. Automate closed-won deal updates and calculate Net MRR in real time.',
    softwareA: stripe,
    softwareB: hubspot,
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.elenaRostova,
    publishDate: '2026-03-21',
    updatedDate: '2026-09-22',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Listen for invoice.payment_succeeded and customer.subscription.deleted events to update HubSpot MRR properties and deal stages with zero manual reconciliation.',
    shortcutBlueprintName: 'stripe_hubspot_revenue_sync.json',
    architectureType: 'Event-Driven Webhook',
    comparisonMetrics: [
      {
        parameter: 'Revenue Sync Latency',
        nativeConnector: '10-30 minutes',
        middlewareConnector: '< 2.0 seconds (Instant Webhook)',
        directApiWebhook: '< 250 milliseconds',
        winner: 'direct',
      },
      {
        parameter: 'Refund & Dispute Handling',
        nativeConnector: 'Often missed or requires manual entry',
        middlewareConnector: 'Automated deal stage rollback',
        directApiWebhook: 'Full chargeback state machine',
        winner: 'middleware',
      },
      {
        parameter: 'Custom Subscription Metrics',
        nativeConnector: 'Standard MRR only',
        middlewareConnector: 'Multi-currency, tier, and LTV calculation',
        directApiWebhook: 'Complete customization',
        winner: 'middleware',
      },
      {
        parameter: 'Data Security (PCI Compliance)',
        nativeConnector: 'Tokenized (Zero cardholder storage)',
        middlewareConnector: 'PCI-DSS out of scope (Metadata only)',
        directApiWebhook: 'Requires PCI audit if storing raw payload',
        winner: 'middleware',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Configure Stripe Webhook Endpoint with Cryptographic Signatures',
        anchorId: 'step-1-stripe-webhook',
        summary: 'Create a secured webhook listener in the Stripe Developer Dashboard to receive signed invoice and customer lifecycle events.',
        detailedInstructions: [
          'Navigate to Stripe Dashboard > Developers > Webhooks > Add destination.',
          'Set your endpoint URL to your ingestion listener or middleware endpoint.',
          'Subscribe to specific events: invoice.payment_succeeded, customer.subscription.created, customer.subscription.deleted, and charge.refunded.',
          'Save and copy the Signing Secret starting with whsec_... to verify webhook authenticity.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            label: 'Stripe Signature Verification',
            code: `import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export function verifyStripeSignature(rawBody: Buffer, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}`,
          },
        ],
        proTip: 'Always verify the Stripe-Signature header using the official SDK. This ensures no unauthorized actor can spoof invoice payment events into your CRM.',
      },
      {
        stepNumber: 2,
        title: 'Create HubSpot Custom Properties for MRR, ARR, and Subscription Status',
        anchorId: 'step-2-hubspot-properties',
        summary: 'Establish dedicated RevOps properties on the HubSpot Contact, Company, and Deal objects to store recurring financial metrics.',
        detailedInstructions: [
          'In HubSpot Settings > Data Management > Properties, select "Company properties".',
          'Create: Monthly Recurring Revenue (mrr) as a Number (Currency) property.',
          'Create: Stripe Customer ID (stripe_customer_id) as Single-line text with unique value constraint.',
          'Create: Subscription Plan Tier (subscription_plan) as a Dropdown Select.',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'Create Property via HubSpot API',
            code: `curl -X POST "https://api.hubapi.com/crm/v3/properties/companies" \\
  -H "Authorization: Bearer pat-na1-your-private-app-token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "stripe_customer_mrr",
    "label": "Stripe Monthly Recurring Revenue",
    "type": "number",
    "fieldType": "number",
    "groupName": "financial_information"
  }'`,
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Map Stripe Invoices to HubSpot Closed-Won Deals',
        anchorId: 'step-3-deal-reconciliation',
        summary: 'Automatically update existing pipeline deals to "Closed Won" upon the first successful subscription invoice payment.',
        detailedInstructions: [
          'Extract customer.email from the invoice.payment_succeeded payload.',
          'Search for open deals associated with that contact email.',
          'Update dealstage to "closedwon" and set amount to the invoice total divided by 100 (converting cents to dollars).',
          'Append a timeline note with a direct link to the Stripe customer portal for sales reps.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'HubSpot Deal Update Payload',
            code: `{
  "properties": {
    "dealstage": "closedwon",
    "amount": "250.00",
    "closedate": "2026-03-22T20:00:00Z",
    "stripe_invoice_id": "in_1N4rXYZ8921",
    "payment_status": "PAID"
  }
}`,
          },
        ],
        warning: 'Remember that Stripe amounts are formatted in integer cents ($250.00 is represented as 25000). Always divide by 100 before updating HubSpot deal amount.',
      },
      {
        stepNumber: 4,
        title: 'Implement Automated Churn & Refund Rollbacks',
        anchorId: 'step-4-churn-automation',
        summary: 'Establish automated notifications and deal updates when a customer cancels their subscription or requests a charge refund.',
        detailedInstructions: [
          'Listen for customer.subscription.deleted events from Stripe.',
          'Lookup the company record in HubSpot via stripe_customer_id.',
          'Set stripe_customer_mrr to 0 and update customer_lifecycle_stage to "Former Customer".',
          'Trigger an immediate task assignment for the Customer Success manager to conduct a churn exit interview.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            label: 'Node.js Churn Handler',
            code: `export async function handleSubscriptionCanceled(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const stripeCustomerId = event.data.object.customer as string;
  
  await hubspotClient.crm.companies.basicApi.update(stripeCustomerId, {
    properties: {
      stripe_customer_mrr: "0",
      customer_lifecycle_stage: "churned_customer",
      churn_date: new Date().toISOString()
    }
  }, 'stripe_customer_id');
}`,
          },
        ],
      },
    ],
    faq: [
      {
        question: 'How do I handle multi-currency subscriptions in Stripe?',
        answer: 'Store the raw currency code (e.g., usd, eur, gbp) in a dedicated HubSpot property. If HubSpot multi-currency is enabled, map the corporate currency and let HubSpot handle exchange rates.',
      },
      {
        question: 'Does Stripe automatically retry failed subscription charges?',
        answer: 'Yes, Stripe Smart Retries retry failed invoices multiple times over several days. Only update HubSpot deal stages to "Lost" or "Payment Failed" after the invoice is marked uncollectible.',
      },
    ],
  },

  // 5. n8n to PostgreSQL
  {
    id: 'connect-n8n-to-postgres',
    slug: 'connect-n8n-to-postgres',
    title: 'How to Connect n8n to PostgreSQL: Event-Driven CDC & Workflow Pipeline',
    h1: 'How to Connect n8n to PostgreSQL: High-Throughput Pipeline Guide',
    metaDescription: 'Build self-hosted, scalable automation workflows connecting n8n with PostgreSQL. Implement connection pooling, transaction rollbacks, and JSONB upserts.',
    softwareA: n8n,
    softwareB: postgres,
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    author: AUTHORS.marcusChen,
    technicalReviewer: AUTHORS.elenaRostova,
    publishDate: '2026-03-20',
    updatedDate: '2026-09-22',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Use PostgreSQL ON CONFLICT (id) DO UPDATE (UPSERT) within an n8n Postgres Node to guarantee idempotent, race-condition-free writes.',
    shortcutBlueprintName: 'n8n_postgres_idempotent_pipeline.json',
    architectureType: 'Event-Driven Webhook',
    comparisonMetrics: [
      {
        parameter: 'Operating Cost at 1M Tasks/mo',
        nativeConnector: 'N/A',
        middlewareConnector: 'Free (Self-Hosted n8n)',
        directApiWebhook: 'Low (Custom Node.js server)',
        winner: 'middleware',
      },
      {
        parameter: 'Data Privacy / Compliance',
        nativeConnector: 'Third-party cloud storage',
        middlewareConnector: '100% On-Premise / VPC (HIPAA / GDPR)',
        directApiWebhook: '100% On-Premise',
        winner: 'middleware',
      },
      {
        parameter: 'Custom SQL & JSONB Querying',
        nativeConnector: 'Restricted to basic tables',
        middlewareConnector: 'Full Postgres SQL, triggers, and RLS',
        directApiWebhook: 'Full SQL access',
        winner: 'middleware',
      },
      {
        parameter: 'Execution Time Limits',
        nativeConnector: '30-second hard cutoff',
        middlewareConnector: 'No timeout limit on self-hosted instances',
        directApiWebhook: 'Configurable',
        winner: 'middleware',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Provision PostgreSQL Database & Dedicated Automation Role',
        anchorId: 'step-1-postgres-role',
        summary: 'Create a secured PostgreSQL user with restricted schema privileges and SSL enforcement.',
        detailedInstructions: [
          'Connect to your PostgreSQL or Supabase cluster as a superuser.',
          'Create a dedicated role n8n_worker with a cryptographically generated password.',
          'Grant CONNECT on your production database and USAGE on the target schema.',
          'Enable SSL required mode to secure all transit communication.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'PostgreSQL Role Setup',
            code: `CREATE ROLE n8n_worker WITH LOGIN PASSWORD 'Secured_Cluster_Token_9841!';
GRANT CONNECT ON DATABASE analytics_db TO n8n_worker;
GRANT USAGE ON SCHEMA app_data TO n8n_worker;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA app_data TO n8n_worker;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_data GRANT SELECT, INSERT, UPDATE ON TABLES TO n8n_worker;`,
          },
        ],
        proTip: 'Always connect n8n through a connection pooler like PgBouncer on port 6543 (transaction mode) when executing high-frequency webhook bursts.',
      },
      {
        stepNumber: 2,
        title: 'Configure PostgreSQL Credential in n8n',
        anchorId: 'step-2-n8n-credential',
        summary: 'Register the PostgreSQL database credentials inside n8n credential vault with SSL enabled.',
        detailedInstructions: [
          'In n8n, navigate to Credentials > New Credential > Postgres.',
          'Enter Host, Port (5432 or 6543), Database Name, User (n8n_worker), and Password.',
          'Set SSL Mode to "Require" or "Verify-Full".',
          'Click "Save" and test the connection against PostgreSQL.',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'Docker Compose Environment for n8n + Postgres',
            code: `services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_DEFAULT_BINARY_DATA_MODE=filesystem
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n_meta
      - DB_POSTGRESDB_USER=n8n_admin
      - DB_POSTGRESDB_PASSWORD=secret_meta_pass`,
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Build the Webhook Ingestion & Transform Workflow',
        anchorId: 'step-3-n8n-workflow',
        summary: 'Create an n8n workflow with a Webhook node, Code data transformation, and Postgres Upsert node.',
        detailedInstructions: [
          'Add a "Webhook" node with HTTP Method POST and path /v1/ingest/lead.',
          'Add a "Code" node running JavaScript to clean and format customer attributes.',
          'Add the "Postgres" node and select the operation "Execute a SQL Query".',
          'Use an atomic ON CONFLICT DO UPDATE statement to prevent duplicate rows.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'PostgreSQL Idempotent Upsert Query',
            code: `INSERT INTO app_data.leads (
  external_id,
  email,
  first_name,
  last_name,
  company,
  lead_score,
  metadata
) VALUES (
  $1, $2, $3, $4, $5, $6, $7::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  lead_score = EXCLUDED.lead_score,
  metadata = app_data.leads.metadata || EXCLUDED.metadata,
  updated_at = CURRENT_TIMESTAMP
RETURNING id, external_id, created_at;`,
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Configure Database Transactions & Error Trigger Nodes',
        anchorId: 'step-4-n8n-error-trigger',
        summary: 'Attach an Error Trigger node in n8n to log failed database queries and rollback partial transactions.',
        detailedInstructions: [
          'Create an auxiliary workflow triggered by the "Error Trigger" node in n8n.',
          'Extract error message, failed node name, and input JSON from the execution payload.',
          'Save failed queries to an audit table app_data.dead_letter_queue.',
          'Send an instant notification alert to your DevOps Slack channel with a 1-click retry execution link.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'Dead Letter Queue Table Schema',
            code: `CREATE TABLE IF NOT EXISTS app_data.dead_letter_queue (
  id SERIAL PRIMARY KEY,
  failed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  workflow_id VARCHAR(64),
  execution_id VARCHAR(64),
  error_message TEXT,
  raw_payload JSONB
);`,
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Can n8n run complex multi-statement SQL transactions?',
        answer: 'Yes. By using the "Execute a SQL Query" operation inside the Postgres node, you can wrap multiple statements inside BEGIN; ... COMMIT; transaction blocks.',
      },
      {
        question: 'How many concurrent webhook executions can a self-hosted n8n instance handle?',
        answer: 'In queue mode (using Redis and worker processes), a single $20/mo VPS can comfortably process 150 to 300 webhook executions per second without dropping requests.',
      },
    ],
  },

  // 6. Apollo.io to Salesforce
  {
    id: 'connect-apollo-to-salesforce',
    slug: 'connect-apollo-to-salesforce',
    title: 'How to Connect Apollo.io to Salesforce: Dual-Sync Lead Enrichment',
    h1: 'How to Connect Apollo.io to Salesforce: Complete CRM Setup Guide',
    metaDescription: 'Step-by-step setup to connect Apollo.io to Salesforce CRM. Configure bi-directional field mapping, prevent duplicate contacts, and automate outbound SDR workflows.',
    softwareA: apollo,
    softwareB: salesforce,
    difficulty: 'Intermediate',
    estimatedMinutes: 11,
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.marcusChen,
    publishDate: '2026-03-19',
    updatedDate: '2026-09-22',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Set Apollo to "Update Salesforce only when field is empty" to preserve manual rep notes while backfilling verified phones and titles.',
    shortcutBlueprintName: 'apollo_salesforce_enrichment_rules.json',
    architectureType: 'Bidirectional Sync',
    comparisonMetrics: [
      {
        parameter: 'Data Coverage (Direct Dials)',
        nativeConnector: 'Apollo Native Integration (Full access)',
        middlewareConnector: 'Custom webhook push via Zapier',
        directApiWebhook: 'Direct Apollo REST API',
        winner: 'native',
      },
      {
        parameter: 'Duplicate Prevention',
        nativeConnector: 'Salesforce standard matching rules',
        middlewareConnector: 'Pre-flight fuzzy matching',
        directApiWebhook: 'Apex trigger deduplication',
        winner: 'middleware',
      },
      {
        parameter: 'Bidirectional Activity Sync',
        nativeConnector: 'Native (Syncs emails, calls, notes)',
        middlewareConnector: 'Requires complex activity schemas',
        directApiWebhook: 'Requires custom task logging',
        winner: 'native',
      },
      {
        parameter: 'Credit Consumption Governance',
        nativeConnector: 'Admin export throttle settings',
        middlewareConnector: 'Configurable logic filters',
        directApiWebhook: 'API key quota enforcement',
        winner: 'native',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Authenticate Apollo.io with Salesforce via OAuth 2.0',
        anchorId: 'step-1-apollo-oauth',
        summary: 'Link your Apollo organization to your Salesforce production environment with administrative read/write permissions.',
        detailedInstructions: [
          'In Apollo.io, navigate to Settings > Integrations > Salesforce.',
          'Click "Connect" and choose "Production" (or Sandbox for staging evaluation).',
          'Log in with your Salesforce System Administrator credentials and grant access.',
          'Verify that the connection status displays green with valid API credentials.',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'Salesforce API Limits Verification',
            code: `curl -X GET "https://your-instance.my.salesforce.com/services/data/v60.0/limits" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`,
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Configure Contact and Lead Field Mapping Hierarchy',
        anchorId: 'step-2-apollo-field-mapping',
        summary: 'Map Apollo verified properties to Salesforce standard and custom fields with strict overwrite rules.',
        detailedInstructions: [
          'In Apollo Salesforce Settings, navigate to "Field Mappings" > "Contact Fields".',
          'Map: Apollo Mobile Phone -> Salesforce MobilePhone (Set rule: "Only if empty in Salesforce").',
          'Map: Apollo Seniority & Department -> Salesforce custom fields Apollo_Seniority__c and Apollo_Department__c.',
          'Set Owner Assignment: "Assign to existing Salesforce Account Owner if match exists".',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Field Overwrite Policy Rules',
            code: `{
  "overwrite_rules": {
    "Email": "never_overwrite",
    "MobilePhone": "update_if_salesforce_is_blank",
    "JobTitle": "always_overwrite_with_verified",
    "LinkedIn_URL__c": "update_if_salesforce_is_blank"
  }
}`,
          },
        ],
        warning: 'Setting fields to "Always overwrite" can overwrite customer direct numbers manually entered by Account Executives. Always set phone numbers to "Update only if empty".',
      },
      {
        stepNumber: 3,
        title: 'Establish Account Matching and Lead Conversion Rules',
        anchorId: 'step-3-account-matching-rules',
        summary: 'Configure Apollo to look for existing Accounts before creating orphaned Leads in Salesforce.',
        detailedInstructions: [
          'In Apollo Sync settings, toggle ON "Check for existing Salesforce Contact before creating a Lead".',
          'Set duplicate matching field to Primary Email and Normalized Website Domain.',
          'Enable "Auto-create Account if company does not exist" with default Lead Source = "Apollo Outbound".',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            label: 'Deduplication Matcher Logic',
            code: `export interface MatchResult {
  matchFound: boolean;
  salesforceId?: string;
  recordType?: 'Contact' | 'Lead' | 'Account';
}

export function evaluateDeduplication(email: string, domain: string, existingRecords: any[]): MatchResult {
  const contact = existingRecords.find(r => r.email === email && r.type === 'Contact');
  if (contact) return { matchFound: true, salesforceId: contact.id, recordType: 'Contact' };

  const lead = existingRecords.find(r => r.email === email && r.type === 'Lead');
  if (lead) return { matchFound: true, salesforceId: lead.id, recordType: 'Lead' };

  return { matchFound: false };
}`,
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Activate Bi-Directional Sequence & Task Logging',
        anchorId: 'step-4-activity-sync',
        summary: 'Log sent emails, opened pitches, and recorded calls automatically to the Salesforce Activity Timeline.',
        detailedInstructions: [
          'Under Apollo Integrations > Salesforce > Activity Settings, enable "Log Emails to Salesforce Tasks".',
          'Enable "Log Completed Calls as Tasks" with disposition mapping (e.g., Connected, Left Voicemail, Wrong Number).',
          'Test by adding a prospect to an Apollo sequence and checking for corresponding Task creation in Salesforce.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Salesforce Task Object Payload',
            code: `{
  "Subject": "Email: Follow up on enterprise automation stack",
  "Status": "Completed",
  "Priority": "Normal",
  "TaskSubtype": "Email",
  "Description": "Prospect opened email 3 times and clicked pricing link.",
  "WhoId": "0038b0000301aXYZ"
}`,
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Does Apollo automatically credit back export limits on bounced emails?',
        answer: 'Yes. If an Apollo verified email results in a hard bounce within 30 days, Apollo automatically refunds the export credit to your team balance.',
      },
      {
        question: 'Can sales reps push prospects directly from LinkedIn using the Apollo Chrome extension into Salesforce?',
        answer: 'Yes. When viewing a LinkedIn profile, reps click "Save to Salesforce" in the Apollo widget. It enriches the contact and creates the Salesforce lead instantly.',
      },
    ],
  },

  // 7. Airtable to Slack
  {
    id: 'connect-airtable-to-slack',
    slug: 'connect-airtable-to-slack',
    title: 'How to Connect Airtable to Slack: Real-Time Team Alerting Dispatcher',
    h1: 'How to Connect Airtable to Slack: Automated Workflow Notification Guide',
    metaDescription: 'Connect Airtable bases to Slack channels with interactive Block Kit messages. Trigger instant notifications on status changes, new records, and SLA warnings.',
    softwareA: airtable,
    softwareB: getTool('slack'),
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.elenaRostova,
    publishDate: '2026-03-20',
    updatedDate: '2026-09-22',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Use Slack Block Kit JSON formatted inside Airtable Automations to deliver interactive action buttons directly inside channel alerts.',
    shortcutBlueprintName: 'airtable_slack_block_kit_dispatcher.json',
    architectureType: 'Event-Driven Webhook',
    comparisonMetrics: [
      {
        parameter: 'Message Formatting Richness',
        nativeConnector: 'Plain text only',
        middlewareConnector: 'Full Slack Block Kit (Buttons, dropdowns, dividers)',
        directApiWebhook: 'Full Slack Block Kit',
        winner: 'middleware',
      },
      {
        parameter: 'Notification Latency',
        nativeConnector: '< 5 seconds',
        middlewareConnector: '< 2.5 seconds',
        directApiWebhook: '< 300 milliseconds',
        winner: 'direct',
      },
      {
        parameter: 'Ease of Setup',
        nativeConnector: 'No-code wizard in 3 minutes',
        middlewareConnector: 'Low-code configuration',
        directApiWebhook: 'Requires custom serverless code',
        winner: 'native',
      },
      {
        parameter: 'Channel Routing Dynamism',
        nativeConnector: 'Fixed single channel',
        middlewareConnector: 'Dynamic channel routing based on record tags',
        directApiWebhook: 'Dynamic routing',
        winner: 'middleware',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create an Incoming Webhook in Slack Workspace',
        anchorId: 'step-1-slack-webhook',
        summary: 'Generate an authenticated incoming webhook URL targeting your team announcements or alert channel.',
        detailedInstructions: [
          'Navigate to api.slack.com/apps and click "Create New App" > "From scratch".',
          'Name the app "Airtable Dispatcher" and select your workspace.',
          'Navigate to "Incoming Webhooks", toggle the feature ON, and click "Add New Webhook to Workspace".',
          'Select the destination channel (e.g., #pipeline-alerts or #deal-desk) and copy the Webhook URL.',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'Test Slack Webhook cURL',
            code: `curl -X POST "https://hooks.slack.com/services/T000/B000/XXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Alert: New enterprise deal added to Airtable pipeline!"
  }'`,
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Configure Airtable Automation Trigger on View Entry',
        anchorId: 'step-2-airtable-trigger',
        summary: 'Trigger notifications only when records meet specific qualifying criteria, such as reaching a "Ready for Review" status.',
        detailedInstructions: [
          'In Airtable, create a filtered view named "Urgent Alerts" (e.g., Status = "Escalated" AND Deal Size > $10,000).',
          'Click the "Automations" tab in the top navigation.',
          'Select trigger: "When a record enters a view", selecting your target table and the "Urgent Alerts" view.',
          'Click "Test trigger" on a sample record.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Airtable Automation Step Definition',
            code: `{
  "trigger": {
    "type": "record_entered_view",
    "view_name": "Urgent Alerts",
    "table": "Opportunities"
  }
}`,
          },
        ],
        proTip: 'Triggering on "When a record enters a view" rather than "When record is updated" prevents spamming Slack on intermediate keystroke edits.',
      },
      {
        stepNumber: 3,
        title: 'Format Rich Block Kit Interactive Notification Cards',
        anchorId: 'step-3-block-kit-formatting',
        summary: 'Design an interactive Slack message with header, key fields, and a 1-click button linking back to Airtable.',
        detailedInstructions: [
          'Add an action step in Airtable: "Send Slack message" (or "Send incoming webhook" for full Block Kit).',
          'Select JSON body and structure the blocks array with section text and actions.',
          'Map dynamic record variables: {Record Title}, {Deal Value}, and {Assigned Owner}.',
          'Add an action button with url pointing to {Record URL}.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Slack Block Kit Payload',
            code: `{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚀 New Enterprise Opportunity Logged"
      }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Account:*\\nAcme Corp" },
        { "type": "mrkdwn", "text": "*Estimated ARR:*\\n$85,000" },
        { "type": "mrkdwn", "text": "*Owner:*\\nStackPipeline Team" },
        { "type": "mrkdwn", "text": "*Priority:*\\nHigh" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "Open in Airtable" },
          "url": "https://airtable.com/app123/tbl456/rec789",
          "style": "primary"
        }
      ]
    }
  ]
}`,
          },
        ],
      },
      {
        stepNumber: 4,
        title: 'Test and Activate Continuous Automation',
        anchorId: 'step-4-airtable-test-activate',
        summary: 'Run a live end-to-end delivery test to ensure Slack formatting displays perfectly on both desktop and mobile apps.',
        detailedInstructions: [
          'Click "Test action" in Airtable and verify message delivery in the Slack channel.',
          'Verify button clicks redirect to the correct Airtable record view.',
          'Toggle the Automation status to "ON" in the top right corner.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            label: 'TypeScript Block Kit Validator',
            code: `export function validateBlockKit(blocks: any[]): boolean {
  if (!Array.isArray(blocks) || blocks.length === 0) return false;
  return blocks.every(b => typeof b.type === 'string');
}`,
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Can I mention individual Slack users by their email address in Airtable messages?',
        answer: 'Yes. Use the Slack syntax <@U12345678> if you have their Slack user ID, or configure a lookup formula in Airtable that translates user emails to Slack IDs.',
      },
      {
        question: 'Is there a rate limit for messages sent from Airtable to Slack?',
        answer: 'Slack incoming webhooks enforce a rate limit of 1 message per second per channel. If batching hundreds of records at once, insert a delay or consolidate them into a digest.',
      },
    ],
  },

  // 8. Segment to BigQuery
  {
    id: 'connect-segment-to-bigquery',
    slug: 'connect-segment-to-bigquery',
    title: 'How to Connect Segment to BigQuery: High-Volume Event Ingestion Pipeline',
    h1: 'How to Connect Twilio Segment to Google BigQuery: Warehouse Setup',
    metaDescription: 'Enterprise guide to stream customer event analytics from Twilio Segment into Google BigQuery. Partitioning strategies, IAM security, and SQL deduplication.',
    softwareA: segment,
    softwareB: bigquery,
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    author: AUTHORS.elenaRostova,
    technicalReviewer: AUTHORS.marcusChen,
    publishDate: '2026-03-21',
    updatedDate: '2026-09-22',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Configure BigQuery date-partitioning on loaded_at to minimize query scanning costs across millions of tracked events.',
    shortcutBlueprintName: 'segment_bigquery_warehouse_sync.json',
    architectureType: 'Scheduled Batch ETL',
    comparisonMetrics: [
      {
        parameter: 'Event Ingestion Latency',
        nativeConnector: 'Hourly batch or daily',
        middlewareConnector: 'Segment Streaming (1-5 minutes)',
        directApiWebhook: 'BigQuery Storage Write API (< 1 sec)',
        winner: 'direct',
      },
      {
        parameter: 'Infrastructure Overhead',
        nativeConnector: 'Zero management (Automated table creation)',
        middlewareConnector: 'Low',
        directApiWebhook: 'High (Cloud Functions & Pub/Sub)',
        winner: 'native',
      },
      {
        parameter: 'Query Cost Optimization',
        nativeConnector: 'Automatic date partitioning',
        middlewareConnector: 'Configurable',
        directApiWebhook: 'Manual DDL management',
        winner: 'native',
      },
      {
        parameter: 'Schema Drift Resilience',
        nativeConnector: 'Automatic column additions',
        middlewareConnector: 'Schema auto-mapping',
        directApiWebhook: 'Requires DDL migrations',
        winner: 'native',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Provision Google Cloud Service Account & BigQuery Dataset',
        anchorId: 'step-1-gcp-service-account',
        summary: 'Create an isolated GCP Service Account with least-privilege BigQuery User and Data Editor roles.',
        detailedInstructions: [
          'In Google Cloud Console, navigate to IAM & Admin > Service Accounts > Create Service Account.',
          'Name it "segment-warehouse-ingest" and assign roles: BigQuery Data Editor and BigQuery Job User.',
          'Create a new JSON key file and securely download it.',
          'In BigQuery Studio, create a new Dataset named segment_prod in your preferred multi-region (e.g., US or EU).',
        ],
        codeSnippets: [
          {
            language: 'bash',
            label: 'GCP CLI Role Binding',
            code: `gcloud projects add-iam-policy-binding your-gcp-project-id \\
  --member="serviceAccount:segment-warehouse-ingest@your-gcp-project-id.iam.gserviceaccount.com" \\
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding your-gcp-project-id \\
  --member="serviceAccount:segment-warehouse-ingest@your-gcp-project-id.iam.gserviceaccount.com" \\
  --role="roles/bigquery.jobUser"`,
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Connect BigQuery as a Destination in Twilio Segment',
        anchorId: 'step-2-segment-destination',
        summary: 'Add BigQuery into your Segment Workspace and upload the GCP service account credentials.',
        detailedInstructions: [
          'In Segment, navigate to Connections > Destinations > Add Destination > Google BigQuery.',
          'Paste your GCP Project ID, BigQuery Dataset ID (segment_prod), and upload the service account JSON key.',
          'Select your sync frequency (Hourly or Every 12 Hours).',
          'Enable the destination and test connection handshake.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Segment Connection Spec',
            code: `{
  "destination_type": "google_bigquery",
  "project_id": "analytics-prod-2026",
  "dataset_id": "segment_prod",
  "sync_frequency": "hourly",
  "location": "US"
}`,
          },
        ],
      },
      {
        stepNumber: 3,
        title: 'Implement Date-Partitioning and Clustering Strategy',
        anchorId: 'step-3-bigquery-partitioning',
        summary: 'Configure partition policies on event tables to prevent high billing on analytical queries.',
        detailedInstructions: [
          'Segment automatically creates separate tables for each track() event name (e.g., user_signed_up, checkout_completed).',
          'Verify that tables are partitioned by DAY on the loaded_at or timestamp column.',
          'Cluster high-cardinality tables by user_id to accelerate single-customer funnel analysis.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'Optimized Funnel Query with Partition Pruning',
            code: `-- Querying partitioned events efficiently
SELECT 
  DATE(timestamp) AS event_date,
  COUNT(DISTINCT user_id) AS active_users,
  COUNTIF(event = 'Completed Purchase') AS total_purchases
FROM \`analytics-prod-2026.segment_prod.tracks\`
WHERE _PARTITIONDATE >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY event_date
ORDER BY event_date DESC;`,
          },
        ],
        proTip: 'Always use WHERE _PARTITIONDATE >= ... when querying Segment tables in BigQuery. This scans only recent partition files rather than the entire multi-terabyte historical archive.',
      },
      {
        stepNumber: 4,
        title: 'Automate SQL Deduplication with dbt or Scheduled Queries',
        anchorId: 'step-4-deduplication-query',
        summary: 'Eliminate duplicate event deliveries caused by client-side browser network retries using analytical window functions.',
        detailedInstructions: [
          'Segment ensures at-least-once delivery; occasional duplicate messages can occur.',
          'Set up a BigQuery Scheduled Query or dbt model using QUALIFY ROW_NUMBER() OVER (PARTITION BY id ORDER BY received_at DESC) = 1.',
          'Materialize clean tables into an analytics schema for production dashboards in Looker or Metabase.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'SQL Deduplication Window Query',
            code: `CREATE OR REPLACE TABLE \`analytics-prod-2026.analytics_clean.clean_tracks\` AS
SELECT *
FROM \`analytics-prod-2026.segment_prod.tracks\`
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY id 
  ORDER BY received_at DESC
) = 1;`,
          },
        ],
      },
    ],
    faq: [
      {
        question: 'How does BigQuery bill for Segment event ingestion?',
        answer: 'BigQuery charges for active storage ($0.02 per GB per month) and query computation ($6.25 per TB scanned). Ingestion via Segment batch loading is free on GCP.',
      },
      {
        question: 'What happens if a new tracking property is added to an existing track call?',
        answer: 'Segment automatically detects new schema properties and alters the BigQuery destination table by appending the new column without breaking data collection.',
      },
    ],
  },

  // 9. Linear to Slack (High-Throughput Engineering Triage)
  {
    id: 'connect-linear-to-slack',
    slug: 'connect-linear-to-slack',
    title: 'How to Connect Linear to Slack: High-Throughput Automated Architecture',
    h1: 'How to Connect Linear to Slack: Real-Time Incident & Issue Dispatch',
    metaDescription: 'Step-by-step enterprise guide connecting Linear to Slack. Configure HMAC webhook authentication, Block Kit message cards, and instant engineer routing.',
    softwareA: linear,
    softwareB: slack,
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.elenaRostova,
    publishDate: '2026-03-22',
    updatedDate: '2026-09-24',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Use Linear Webhook signatures (linear-signature header) and route urgent priority issues into dedicated Slack incident channels using Slack Block Kit.',
    shortcutBlueprintName: 'linear_slack_triage_v1.json',
    architectureType: 'Event-Driven Webhook',
    comparisonMetrics: [
      { parameter: 'Notification Speed', nativeConnector: '2-5 seconds', middlewareConnector: '< 500ms', directApiWebhook: '< 150ms', winner: 'direct' },
      { parameter: 'Filter Granularity', nativeConnector: 'Team-level only', middlewareConnector: 'Priority & Label filtered', directApiWebhook: 'Full JSON logic', winner: 'direct' },
      { parameter: 'Rich Interactive Cards', nativeConnector: 'Basic text snippet', middlewareConnector: 'Custom Block Kit layout', directApiWebhook: 'Full Block Kit buttons', winner: 'direct' },
      { parameter: 'Rate Limit Ceiling', nativeConnector: 'Slack 1 msg/sec/channel', middlewareConnector: 'Buffered queue batching', directApiWebhook: 'Exponential retry', winner: 'middleware' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Generate Linear Webhook Subscription with Signing Secret',
        anchorId: 'step-1-linear-webhook',
        summary: 'Register a webhook in Linear settings for Issue and Comment events, saving the secret token for payload verification.',
        detailedInstructions: [
          'Navigate to Linear Settings -> API -> Webhooks.',
          'Click New Webhook and select Issue created, Issue updated, and Comment created events.',
          'Provide your secure ingestion HTTPS endpoint URL.',
          'Copy the Webhook Secret key to verify HMAC-SHA256 signatures.',
        ],
        codeSnippets: [
          {
            language: 'typescript',
            label: 'HMAC-SHA256 Signature Verification',
            code: `import crypto from 'crypto';

export function verifyLinearWebhook(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody, 'utf8');
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}`,
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Transform Linear Payload into Slack Block Kit Format',
        anchorId: 'step-2-block-kit',
        summary: 'Format issue metadata (title, urgency, team, assignee) into an interactive Slack message card.',
        detailedInstructions: [
          'Filter out low-priority updates to prevent channel notification fatigue.',
          'Construct Slack Block Kit header, section fields, and action buttons linking directly to the Linear issue.',
          'Post the formatted JSON payload to the Slack Incoming Webhook URL.',
        ],
        codeSnippets: [
          {
            language: 'json',
            label: 'Slack Block Kit Payload',
            code: `{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚨 Urgent Issue: LIN-4820", "emoji": true }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Title:* API Rate Limiter Burst Bug" },
        { "type": "mrkdwn", "text": "*Priority:* Urgent (P1)" },
        { "type": "mrkdwn", "text": "*Assignee:* @elena" },
        { "type": "mrkdwn", "text": "*Team:* Infrastructure Core" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "Open in Linear" },
          "style": "primary",
          "url": "https://linear.app/team/issue/LIN-4820"
        }
      ]
    }
  ]
}`,
          },
        ],
      },
    ],
    faq: [
      { question: 'Does Slack rate limit incoming webhooks from Linear?', answer: 'Yes. Slack enforces a rate limit of approximately 1 message per second per channel. For high-volume engineering teams, buffer events in a queue like Redis or SQS.' },
      { question: 'Can engineers update Linear issue status directly from Slack?', answer: 'Yes, by creating a Slack Interactive App and subscribing to Block Kit action buttons, you can trigger GraphQL mutations in Linear via their API.' },
    ],
  },

  // 10. Supabase to BigQuery (CDC Data Warehouse Sync)
  {
    id: 'connect-supabase-to-bigquery',
    slug: 'connect-supabase-to-bigquery',
    title: 'How to Connect Supabase to BigQuery: Real-Time CDC & Analytics Pipeline',
    h1: 'How to Stream Supabase Postgres into Google BigQuery in Real Time',
    metaDescription: 'Step-by-step enterprise architecture guide streaming Supabase Postgres changes into Google BigQuery using logical replication and change data capture (CDC).',
    softwareA: supabase,
    softwareB: bigquery,
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    author: AUTHORS.marcusChen,
    technicalReviewer: AUTHORS.elenaRostova,
    publishDate: '2026-03-24',
    updatedDate: '2026-09-25',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Use Postgres WAL logical decoding (pgoutput) streaming to Google Cloud Pub/Sub and BigQuery Storage Write API for sub-second analytical latency.',
    shortcutBlueprintName: 'supabase_bigquery_cdc_pipeline.json',
    architectureType: 'Scheduled Batch ETL',
    comparisonMetrics: [
      { parameter: 'Sync Latency', nativeConnector: 'Hourly batch', middlewareConnector: '5-15 minutes', directApiWebhook: '< 1 second (CDC)', winner: 'direct' },
      { parameter: 'OLTP Database Impact', nativeConnector: 'Heavy SELECT scans', middlewareConnector: 'Incremental timestamp queries', directApiWebhook: 'Zero table scan (WAL stream)', winner: 'direct' },
      { parameter: 'Schema Evolution', nativeConnector: 'Manual table update', middlewareConnector: 'Semi-automated', directApiWebhook: 'Automatic BigQuery schema update', winner: 'direct' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Enable Logical Replication in Supabase Postgres',
        anchorId: 'step-1-supabase-wal',
        summary: 'Configure Supabase Postgres WAL level to logical and create a dedicated replication publication.',
        detailedInstructions: [
          'Ensure your Supabase project is on a tier supporting logical replication (Pro or Enterprise).',
          'Execute CREATE PUBLICATION bigquery_sync FOR ALL TABLES in the Supabase SQL editor.',
          'Generate secure database credentials dedicated exclusively to replication streaming.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'Enable Supabase Publication',
            code: `-- Enable logical replication publication
CREATE PUBLICATION bigquery_cdc_pub FOR TABLE 
  public.users, 
  public.subscriptions, 
  public.transactions;`,
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Stream CDC Events to BigQuery with Storage Write API',
        anchorId: 'step-2-bigquery-write',
        summary: 'Write append-only CDC changelogs into partitioned BigQuery tables with exactly-once stream semantics.',
        detailedInstructions: [
          'Create a partitioned table in BigQuery with _record_timestamp and _change_type (INSERT/UPDATE/DELETE).',
          'Deploy an ingestion worker (Cloud Run or Kafka Connect) connecting to Supabase via Postgres protocol.',
          'Stream changes via BigQuery Storage Write API in COMMITTED mode.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'BigQuery Partitioned Target Schema',
            code: `CREATE TABLE \`analytics-prod.supabase_cdc.transactions_raw\` (
  id STRING,
  user_id STRING,
  amount_cents INT64,
  currency STRING,
  status STRING,
  _cdc_operation STRING,
  _cdc_timestamp TIMESTAMP
)
PARTITION BY DATE(_cdc_timestamp)
CLUSTER BY user_id, status;`,
          },
        ],
      },
    ],
    faq: [
      { question: 'Does streaming CDC slow down production Postgres performance?', answer: 'No. Logical replication reads directly from the Write-Ahead Log (WAL) on disk, avoiding table-locking SELECT queries on your production database.' },
    ],
  },

  // 11. Retool to Postgres
  {
    id: 'connect-retool-to-postgres',
    slug: 'connect-retool-to-postgres',
    title: 'How to Connect Retool to Postgres: Enterprise RBAC & Admin Portal',
    h1: 'How to Connect Retool to PostgreSQL: Secure Internal Tooling Guide',
    metaDescription: 'Complete tutorial on connecting Retool to PostgreSQL. Configure SSL certificates, read-only replica roles, parameterized SQL queries, and audit logging.',
    softwareA: retool,
    softwareB: postgres,
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    author: AUTHORS.alexVance,
    technicalReviewer: AUTHORS.marcusChen,
    publishDate: '2026-03-25',
    updatedDate: '2026-09-25',
    schemaType: 'HowTo',
    editorChoiceNote: 'Recommended Architecture: Connect Retool to an isolated Read Replica with restricted schemas, using prepared statements to prevent SQL injection vulnerabilities.',
    shortcutBlueprintName: 'retool_postgres_admin_template.json',
    architectureType: 'Bidirectional Sync',
    comparisonMetrics: [
      { parameter: 'Query Performance', nativeConnector: 'Native TCP pool (< 50ms)', middlewareConnector: 'REST wrapper (150-300ms)', directApiWebhook: 'Custom API', winner: 'native' },
      { parameter: 'SQL Injection Safety', nativeConnector: 'Parameterized Prepared Statements', middlewareConnector: 'JSON field sanitization', directApiWebhook: 'ORM validation', winner: 'native' },
      { parameter: 'Audit Logging', nativeConnector: 'Retool Enterprise Audit Logs', middlewareConnector: 'Custom access logs', directApiWebhook: 'Server logs', winner: 'native' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Provision a Dedicated Retool Database Role in PostgreSQL',
        anchorId: 'step-1-postgres-role',
        summary: 'Create a least-privilege PostgreSQL role with specific table grants and connection limits.',
        detailedInstructions: [
          'Connect to your PostgreSQL database as superuser (postgres).',
          'Create a dedicated role: CREATE ROLE retool_operator WITH LOGIN PASSWORD \'...\';',
          'Grant SELECT permissions only on production business tables.',
        ],
        codeSnippets: [
          {
            language: 'sql',
            label: 'PostgreSQL Least-Privilege Role',
            code: `CREATE ROLE retool_user WITH LOGIN PASSWORD 'secure_entropy_key_2026!';
GRANT CONNECT ON DATABASE production_db TO retool_user;
GRANT USAGE ON SCHEMA public TO retool_user;
GRANT SELECT, UPDATE(status, tier) ON TABLE public.accounts TO retool_user;
ALTER ROLE retool_user CONNECTION LIMIT 10;`,
          },
        ],
      },
    ],
    faq: [
      { question: 'Does Retool support connecting to private Postgres databases behind a VPC?', answer: 'Yes. Retool provides Self-Hosted deployments and outbound IP address whitelisting, as well as an SSH bastion tunnel connector for private VPC databases.' },
    ],
  },
];

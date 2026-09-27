/**
 * Authoritative Directory of Official SaaS Web Portals & Documentation
 * Provides direct, working external links for all B2B platforms referenced across StackPipeline.
 */

export const SAAS_OFFICIAL_WEBSITES: Record<string, string> = {
  // Top Automation & Workflow
  zapier: 'https://zapier.com',
  make: 'https://www.make.com',
  n8n: 'https://n8n.io',
  workato: 'https://www.workato.com',
  retool: 'https://retool.com',
  appsmith: 'https://www.appsmith.com',
  postman: 'https://www.postman.com',

  // CRM & Sales
  hubspot: 'https://www.hubspot.com',
  salesforce: 'https://www.salesforce.com',
  pipedrive: 'https://www.pipedrive.com',
  close: 'https://www.close.com',
  activecampaign: 'https://www.activecampaign.com',
  gong: 'https://www.gong.io',
  apollo: 'https://www.apollo.io',
  clay: 'https://www.clay.com',

  // Project & Productivity
  linear: 'https://linear.app',
  clickup: 'https://clickup.com',
  asana: 'https://asana.com',
  jira: 'https://www.atlassian.com/software/jira',
  notion: 'https://www.notion.so',
  airtable: 'https://airtable.com',
  slack: 'https://slack.com',
  webflow: 'https://webflow.com',

  // Payments & Billing
  stripe: 'https://stripe.com',
  chargebee: 'https://www.chargebee.com',
  klaviyo: 'https://www.klaviyo.com',

  // Databases & Warehouses
  supabase: 'https://supabase.com',
  postgres: 'https://www.postgresql.org',
  postgresql: 'https://www.postgresql.org',
  snowflake: 'https://www.snowflake.com',
  bigquery: 'https://cloud.google.com/bigquery',

  // Data Integration & ELT / Reverse ETL
  fivetran: 'https://www.fivetran.com',
  airbyte: 'https://airbyte.com',
  census: 'https://www.getcensus.com',
  hightouch: 'https://hightouch.com',
  segment: 'https://segment.com',
  rudderstack: 'https://www.rudderstack.com',

  // Observability, Analytics & Support
  datadog: 'https://www.datadoghq.com',
  mixpanel: 'https://mixpanel.com',
  amplitude: 'https://amplitude.com',
  pagerduty: 'https://www.pagerduty.com',
  zendesk: 'https://www.zendesk.com',
  intercom: 'https://www.intercom.com',
};

export function getToolOfficialUrl(slugOrName: string): string {
  if (!slugOrName) return 'https://linear.app';
  const clean = slugOrName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');

  if (SAAS_OFFICIAL_WEBSITES[clean]) {
    return SAAS_OFFICIAL_WEBSITES[clean];
  }

  for (const [key, url] of Object.entries(SAAS_OFFICIAL_WEBSITES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return url;
    }
  }

  return `https://${clean}.com`;
}

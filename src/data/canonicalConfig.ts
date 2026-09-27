/**
 * Canonical Site Production Configuration
 * All share links, OpenGraph metadata, and external publication links reference this canonical domain.
 */
export const CANONICAL_SITE_URL = 'https://stack-pipeline-studio.pages.dev';

/**
 * Returns the canonical sharing URL for an integration tutorial guide
 */
export const getCanonicalArticleUrl = (slug: string): string => {
  return `${CANONICAL_SITE_URL}/?article=${encodeURIComponent(slug)}`;
};

/**
 * Returns the canonical sharing URL for a head-to-head comparison
 */
export const getCanonicalCompareUrl = (slug: string): string => {
  return `${CANONICAL_SITE_URL}/?compare=${encodeURIComponent(slug)}`;
};

/**
 * Returns the canonical sharing URL for an alternatives hub
 */
export const getCanonicalAlternativesUrl = (slug: string): string => {
  return `${CANONICAL_SITE_URL}/?alternatives=${encodeURIComponent(slug)}`;
};

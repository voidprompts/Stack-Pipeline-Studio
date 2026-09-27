import { IntegrationTutorial, ToolComparison, ToolAlternativesHub } from '../types';
import rawGeneratedData from './generatedAutopilotContent.json';

export const GENERATED_TUTORIALS: IntegrationTutorial[] = (rawGeneratedData.tutorials || []) as unknown as IntegrationTutorial[];
export const GENERATED_COMPARISONS: ToolComparison[] = (rawGeneratedData.comparisons || []) as unknown as ToolComparison[];
export const GENERATED_ALTERNATIVES: ToolAlternativesHub[] = (rawGeneratedData.alternatives || []) as unknown as ToolAlternativesHub[];

export const AUTOPILOT_METRICS = {
  lastGeneratedAt: rawGeneratedData.lastGeneratedAt,
  totalGenerated: rawGeneratedData.totalGenerated,
  totalPublished: rawGeneratedData.totalPublished,
  cadence: rawGeneratedData.cadence || '12-hour automated cron',
  publishedHistory: rawGeneratedData.publishedHistory || [],
};

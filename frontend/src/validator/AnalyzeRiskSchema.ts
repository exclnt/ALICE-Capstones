/* eslint-disable camelcase */
import { z } from 'zod';

export const AnalyzeRiskSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  day_of_month: z.number().int().min(1).max(31),
  hour_of_day: z.number().int().min(0).max(23),
  category: z.string(),
  amount: z.coerce.number().min(0),
  weekly_budget: z.coerce.number().min(0),
  segment: z.number().int().min(0),
});

export type AnalyzeRisk = z.infer<typeof AnalyzeRiskSchema>;

export const AnalyzeRiskResponseSchema = z.object({
  is_risky: z.boolean(),
  risk_level: z.enum(['low', 'medium', 'high']),
  nudge_message: z.string(),
});

export type AnalyzeRiskResponse = z.infer<typeof AnalyzeRiskResponseSchema>;

export const SegmentationSchema = z.object({
  segment_label: z.string(),
  segment_number: z.number(),
});

export type Segmentation = z.infer<typeof SegmentationSchema>;

/* eslint-disable camelcase */
import { z } from 'zod';

export const getHealthResponseSchema = z.object({
  status: z.string(),
});

export type GetHealthResponse = z.infer<typeof getHealthResponseSchema>;

export const getPredictBalanceResponseSchema = z.object({
  predictions: z.array(z.number()),
  warnings: z
    .array(
      z.object({
        day: z.number(),
        predicted_balance_normalized: z.number(),
        status: z.string(),
      })
    )
    .optional(),
});

export type PredictBalance = z.infer<typeof getPredictBalanceResponseSchema>;

export const allocationSchema = z.object({
  category: z.string(),
  current_pct: z.number(),
  optimal_pct: z.number(),
  optimal_amount: z.number(),
});

export const getBudgetOptimizationResponseSchema = z.object({
  allocations: z.array(allocationSchema),
  monthly_savings_potential: z.number(),
  status: z.string(),
});

export type BudgetOptimization = z.infer<typeof getBudgetOptimizationResponseSchema>;

export const BudgetOptimizationPayloadSchema = z.object({
  week: z.number(),
  month: z.number(),
});

export type BudgetOptimizationPayload = z.infer<typeof BudgetOptimizationPayloadSchema>;

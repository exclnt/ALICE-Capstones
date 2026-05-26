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

/* eslint-disable camelcase */
import { z } from 'zod';

export const TransactionSchema = z.object({
  title: z.string(),
  amount: z.coerce.number().int().min(0),
  category: z.string(),
  type: z.enum(['income', 'expense']),
  date: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;


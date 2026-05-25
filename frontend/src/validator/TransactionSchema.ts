/* eslint-disable camelcase */
import { z } from 'zod';

export const PostTransactionSchema = z.object({
  title: z.string(),
  amount: z.coerce.number().int().min(0),
  category: z.string(),
  type: z.enum(['income', 'expense']),
  date: z.string(),
});

export type PostTransaction = z.infer<typeof PostTransactionSchema>;

export const ThisWeekTotalExpenseSchema = z.object({
  totalExpense: z.number().min(0),
});

export type ThisWeekTotalExpense = z.infer<typeof ThisWeekTotalExpenseSchema>;
export const TransactionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.coerce.number(),
  category: z.enum([
    'Bills',
    'Entertainment',
    'Food',
    'Hobby',
    'Investment',
    'Shopping',
    'Transport',
  ]),
  type: z.enum(['income', 'expense']),
  transaction_date: z.string(),
});

export type TransactionItemType = z.infer<typeof TransactionItemSchema>;

export type TransactionCategory = TransactionItemType['category'];


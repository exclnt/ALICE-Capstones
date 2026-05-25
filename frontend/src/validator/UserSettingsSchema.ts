/* eslint-disable camelcase */
import { z } from 'zod';

export const UserSettingsSchema = z
  .object({
    monthly_income: z.coerce.number().int().min(0),
    weekly_budget: z.coerce.number().int().min(0),
  })
  .refine((data) => data.weekly_budget <= data.monthly_income, {
    message: 'Weekly budget cannot exceed monthly income',
    path: ['weekly_budget'],
  });

export type UserSettings = z.infer<typeof UserSettingsSchema>;

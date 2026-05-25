/* eslint-disable camelcase */
import { z } from 'zod';

export const UserSettingsSchema = z.object({
  monthly_income: z.coerce.number().int().min(0),
  weekly_budget: z.coerce.number().int().min(0),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

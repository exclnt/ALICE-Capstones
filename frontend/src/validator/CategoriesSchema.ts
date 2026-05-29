import { z } from 'zod';

export const CategoriesSchema = z.object({
  categories: z.array(z.string()),
});

export type Categories = z.infer<typeof CategoriesSchema>;

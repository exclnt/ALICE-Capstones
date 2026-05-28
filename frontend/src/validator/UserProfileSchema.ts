import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
  age: z.number().nullable().optional(),
  occupation: z.string().nullable().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UserProfileUpdateSchema = z.object({
  username: z.string(),
  age: z.number().min(10).max(120).nullable().optional(),
  occupation: z.string().nullable().optional(),
});

export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;

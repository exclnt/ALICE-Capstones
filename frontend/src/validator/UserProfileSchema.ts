import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UserProfileUpdateSchema = z.object({
  username: z.string(),
});

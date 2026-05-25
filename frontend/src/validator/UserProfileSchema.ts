import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
  //   avatar: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

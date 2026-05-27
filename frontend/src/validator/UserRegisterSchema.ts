import z from 'zod';

export const UserRegisterDataSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.string().optional(),
});

export type UserRegisterData = z.infer<typeof UserRegisterDataSchema>;

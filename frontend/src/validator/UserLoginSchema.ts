import z from 'zod';

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const UserLoginDataSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type UserLoginData = z.infer<typeof UserLoginDataSchema>;

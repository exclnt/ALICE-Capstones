/* eslint-disable camelcase */
import { z } from 'zod';

export const ChatBotRequestSchema = z.object({
  message: z.string(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        text: z.string(),
      })
    )
    .optional(),
});

export const ChatBotResponseSchema = z.object({
  user_id: z.string(),
  nama_user: z.string(),
  reply: z.string(),
});

export type ChatBotRequest = z.infer<typeof ChatBotRequestSchema>;
export type ChatBotResponse = z.infer<typeof ChatBotResponseSchema>;

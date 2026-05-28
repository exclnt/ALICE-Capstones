import { getHealthResponseSchema, type GetHealthResponse } from '../validator/AliceSchema';
import axios from 'axios';
import {
  ChatBotRequestSchema,
  ChatBotResponseSchema,
  type ChatBotRequest,
} from '../validator/ChatBotSchema';
import type { ApiResponse } from './apiClient';
import apiClient from './apiClient';

export const getHealth = async () => {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_ALICE_API_BASE_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const response = await apiClient.get<GetHealthResponse>('/health');
  return getHealthResponseSchema.parse(response.data);
};

export const postAliceChat = async (payload: ChatBotRequest) => {
  const parsedPayload = ChatBotRequestSchema.parse(payload);
  const response = await apiClient.post<ApiResponse<unknown>>('/alice/chat', parsedPayload);

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    data: ChatBotResponseSchema.parse(response.data.data),
  };
};

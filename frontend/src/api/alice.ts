import { getHealthResponseSchema, type GetHealthResponse } from '../validator/AliceSchema';
import axios from 'axios';

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

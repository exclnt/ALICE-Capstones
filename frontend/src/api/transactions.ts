import { TransactionSchema, type Transaction } from '../validator/TransactionSchema';
import apiClient, { type ApiResponse } from './apiClient';

export const postTransaction = async (payload: Transaction) => {
  const parsedPayload = TransactionSchema.parse(payload);

  const response = await apiClient.post<ApiResponse<{ transactionId: string }>>(
    '/transactions',
    parsedPayload
  );

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
  };
};

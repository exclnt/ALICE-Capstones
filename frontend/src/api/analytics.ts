import {
  BudgetOptimizationPayloadSchema,
  getBudgetOptimizationResponseSchema,
  getPredictBalanceResponseSchema,
  type BudgetOptimizationPayload,
} from '../validator/AliceSchema';
import {
  AnalyzeRiskResponseSchema,
  AnalyzeRiskSchema,
  SegmentationSchema,
  type AnalyzeRisk,
} from '../validator/AnalyzeRiskSchema';
import apiClient, { type ApiResponse } from './apiClient';

export const postAnalyzeRisk = async (payload: AnalyzeRisk) => {
  const parsedPayload = AnalyzeRiskSchema.parse(payload);
  const response = await apiClient.post<ApiResponse<unknown>>(
    '/transactions/analyze-risk',
    parsedPayload
  );

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    data: AnalyzeRiskResponseSchema.parse(response.data.data),
  };
};

export const getSegmentation = async () => {
  const response = await apiClient.post<ApiResponse<unknown>>('/users/me/segmentation');

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    data: SegmentationSchema.parse(response.data.data),
  };
};

export const getPredictBalance = async () => {
  const response = await apiClient.get<ApiResponse<unknown>>('/analytics/balance-forecast');

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    data: getPredictBalanceResponseSchema.parse(response.data.data),
  };
};

export const postBudgetOptimization = async (payload: BudgetOptimizationPayload) => {
  const parsedPayload = BudgetOptimizationPayloadSchema.parse(payload);
  const response = await apiClient.post<ApiResponse<unknown>>(
    '/analytics/budget-optimization',
    parsedPayload
  );

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    data: getBudgetOptimizationResponseSchema.parse(response.data.data),
  };
};

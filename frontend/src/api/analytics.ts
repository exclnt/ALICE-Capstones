import {
  AnalyzeRiskResponseSchema,
  AnalyzeRiskSchema,
  SegmentationSchema,
  type AnalyzeRisk,
  type Segmentation,
} from '../validator/AnalyzeRiskSchema';
import apiClient, { type ApiResponse } from './apiClient';

interface AnalyzeRiskPayload {
  aiResponse: unknown;
}

export const postAnalyzeRisk = async (payload: AnalyzeRisk) => {
  const parsedPayload = AnalyzeRiskSchema.parse(payload);
  const response = await apiClient.post<ApiResponse<AnalyzeRiskPayload>>(
    '/transactions/analyze-risk',
    parsedPayload
  );

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    aiResponse: AnalyzeRiskResponseSchema.parse(response.data.data.aiResponse),
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

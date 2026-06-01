import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getPredictBalance,
  getSegmentation,
  postAnalyzeRisk,
  postBudgetOptimization,
} from '../api/analytics';
import type { BudgetOptimizationPayload } from '../validator/AliceSchema';

export function usePredictTransaction() {
  return useMutation({
    mutationFn: postAnalyzeRisk,
  });
}

export function useSegmentation() {
  return useQuery({
    queryKey: ['segmentation'],
    queryFn: getSegmentation,
  });
}

export function usePredictBalance() {
  return useQuery({
    queryKey: ['predictBalance'],
    queryFn: getPredictBalance,
  });
}

export function useBudgetOptimization(payload?: BudgetOptimizationPayload) {
  return useQuery({
    queryKey: ['budgetOptimization', payload?.week, payload?.month],
    queryFn: () => postBudgetOptimization(payload!),
    enabled: !!payload?.week && !!payload?.month,
    staleTime: 1000 * 60 * 5,
  });
}

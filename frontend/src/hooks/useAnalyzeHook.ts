import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getPredictBalance,
  getSegmentation,
  postAnalyzeRisk,
  postBudgetOptimization,
} from '../api/analytics';

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

export function useBudgetOptimization() {
  return useMutation({
    mutationFn: postBudgetOptimization,
  });
}

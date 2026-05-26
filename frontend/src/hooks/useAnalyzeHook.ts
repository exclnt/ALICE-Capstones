import { useMutation, useQuery } from '@tanstack/react-query';
import { getPredictBalance, getSegmentation, postAnalyzeRisk } from '../api/analytics';

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

export function usePredictBalance(enabled: boolean = true) {
  return useQuery({
    queryKey: ['predictBalance'],
    queryFn: getPredictBalance,
    enabled: enabled,
  });
}

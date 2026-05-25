import { useMutation } from '@tanstack/react-query';
import { getSegmentation, postAnalyzeRisk } from '../api/analytics';

export function usePredictTransaction() {
  return useMutation({
    mutationFn: postAnalyzeRisk,
  });
}

export function useSegmentation() {
  return useMutation({
    mutationFn: getSegmentation,
  });
}

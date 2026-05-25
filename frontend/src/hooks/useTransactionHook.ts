import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getThisDayTransactions,
  getThisWeekTotalExpense,
  postTransaction,
} from '../api/transactions';

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'today'] });
    },
  });
}

export function useThisWeekTotalExpense() {
  return useQuery({
    queryKey: ['transactions', 'week-total'],
    queryFn: getThisWeekTotalExpense,
  });
}

export function useThisDayTransactions() {
  return useQuery({
    queryKey: ['transactions', 'today'],
    queryFn: getThisDayTransactions,
  });
}

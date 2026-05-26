import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getThisDayTransactions,
  getThisMonthTotalExpense,
  getThisWeekTotalExpense,
  getThisMonthTransactions,
  postTransaction,
  getTransactionsById,
  putTransactionsById,
  deleteTransactionsById,
} from '../api/transactions';
import type { PostTransaction } from '../validator/TransactionSchema';

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTransaction,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['lastAmount'], variables.amount);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useThisWeekTotalExpense() {
  return useQuery({
    queryKey: ['transactions', 'week-total'],
    queryFn: getThisWeekTotalExpense,
  });
}
export function useThisMonthTotalExpense() {
  return useQuery({
    queryKey: ['transactions', 'month-total'],
    queryFn: getThisMonthTotalExpense,
  });
}

export function useThisDayTransactions() {
  return useQuery({
    queryKey: ['transactions', 'today'],
    queryFn: getThisDayTransactions,
  });
}
export function useThisMonthTransactions() {
  return useQuery({
    queryKey: ['transactions', 'month'],
    queryFn: getThisMonthTransactions,
  });
}

export function useTransactionsById(id: null | string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => getTransactionsById(id),
    enabled: !!id && id !== 'null',
  });
}

export function usePutTransactionsById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: PostTransaction }) => {
      return putTransactionsById(id, payload);
    },

    onSuccess: (_, variables) => {
      if (variables.payload.amount) {
        queryClient.setQueryData(['lastAmount'], variables.payload.amount);
      }

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransactionsById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | null) => {
      return deleteTransactionsById(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}


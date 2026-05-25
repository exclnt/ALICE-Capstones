import { useMutation } from '@tanstack/react-query';
import { postTransaction } from '../api/transactions';

export function useAddTransaction() {
  return useMutation({
    mutationFn: postTransaction,
  });
}

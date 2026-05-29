import { useMutation, useQuery } from '@tanstack/react-query';
import { getHealth, postAliceChat } from '../api/alice';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  });
}

export function useAliceChat() {
  return useMutation({
    mutationFn: postAliceChat,
  });
}

import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../api/alice';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  });
}

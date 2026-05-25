import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/users';

export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });
}

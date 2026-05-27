import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, putUserProfile } from '../api/users';

export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUserProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

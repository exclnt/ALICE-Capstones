import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserSettings, putUserSettings } from '../api/users';
import { useQueryClient } from '@tanstack/react-query';

export function useUserSettings() {
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettings,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });
}

import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserSettings, putUserSettings } from '../api/users';

export function useUserSettings() {
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettings,
  });
}

export function useUpdateUserSettings() {
  return useMutation({
    mutationFn: putUserSettings,
  });
}

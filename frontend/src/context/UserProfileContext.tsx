import { createContext, use } from 'react';

export interface UserProfileContextType {
  id: string;
  username: string;
  avatar: string;
  email: string;
}

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = use(UserProfileContext);
  if (!context) throw new Error('UserProfile must be used within a StatusProvider');
  return context;
};

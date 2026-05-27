import { createContext, use } from 'react';

export type StatusType = 'loading' | 'success' | 'error' | 'idle';

interface StatusContextType {
  status: StatusType;
  message: string;
  statusCode?: number;
  showLoading: () => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string, code?: number) => void;
  hideStatus: () => void;
}

export const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatus = () => {
  const context = use(StatusContext);
  if (!context) throw new Error('useStatus must be used within a StatusProvider');
  return context;
};

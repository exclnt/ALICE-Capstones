import React from 'react';

export interface LoadingContextType {
  loading: boolean;
  toggleLoading: () => void;
}

export const LoadingContext = React.createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = React.use(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

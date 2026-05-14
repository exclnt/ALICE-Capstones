import React from 'react';
import { LoadingContext } from './LoadingContext';

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = React.useState(false);
  function toggleLoading() {
    setLoading((prevLoading) => !prevLoading);
  }

  const contextValue = React.useMemo(() => {
    return {
      loading,
      toggleLoading,
    };
  }, [loading]);

  return <LoadingContext value={contextValue}>{children}</LoadingContext>;
}

import { useEffect } from 'react';
import { extractError } from '../components/utils/ExtractApiError';
import { useStatus } from '../context/StatusContext';

type StatusHandlerParams = {
  pending?: boolean;
  error?: unknown;
  isError?: boolean;
  isSuccess?: boolean;
  successMessage?: string;
};

export function useStatusHandler({
  pending,
  error,
  isError,
  isSuccess,
  successMessage,
}: StatusHandlerParams) {
  const { showLoading, showError, showSuccess, hideStatus } = useStatus();

  useEffect(() => {
    if (pending) {
      showLoading();
      return;
    }

    if (isError && error) {
      const extracted = extractError(error);

      showError(extracted.message, extracted.statusCode);
      return;
    }

    if (isSuccess) {
      if (successMessage) {
        showSuccess(successMessage);
      } else {
        hideStatus();
      }
    }
  }, [
    pending,
    isError,
    error,
    isSuccess,
    successMessage,
    showLoading,
    showError,
    showSuccess,
    hideStatus,
  ]);
}

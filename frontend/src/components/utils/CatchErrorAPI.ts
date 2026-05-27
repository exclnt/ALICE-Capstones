import { AxiosError } from 'axios';

interface BackendError {
  message?: string;
}

interface CatchErrorApiProp {
  error: unknown;
  showError: (msg: string, code?: number) => void;
}

export default function CatchErrorAPI({ error, showError }: CatchErrorApiProp) {
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data as BackendError;
      const errorMessage = data.message || 'An error occurred with the request.';

      showError(errorMessage, error.response.status);
    } else if (error.request) {
      showError('Network error: Could not connect to the server.');
    } else {
      showError(error.message || 'Request configuration failed.');
    }
  } else {
    if (error instanceof Error) {
      showError(error.message);
    } else {
      showError('An unexpected network error occurred.');
    }
  }
}

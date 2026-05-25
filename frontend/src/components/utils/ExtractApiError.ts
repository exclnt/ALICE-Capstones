import axios from 'axios';

type ApiErrorResponse = {
  message: string;
};

export const extractError = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      message: error.response?.data?.message ?? error.message,
      statusCode: error.response?.status ?? 500,
    };
  }

  return {
    message: 'Unknown error',
    statusCode: 500,
  };
};

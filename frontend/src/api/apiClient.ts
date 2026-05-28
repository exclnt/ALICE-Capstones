import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface PromiseQueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: PromiseQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 401 && 
      originalRequest && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/authentications')
    ) {
      if (isRefreshing) {
        const token = await new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });

        if (token) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.set('Authorization', `Bearer ${token}`);
        }

        return apiClient(originalRequest);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.put<{ data: { accessToken: string } }>(
          `${BASE_URL}/authentications`,
          {
            refreshToken: refreshToken,
          }
        );

        const newAccessToken = response.data.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);

        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.warn('Refresh token expired or invalid. Logging out.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.location.href = '/login';

        processQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

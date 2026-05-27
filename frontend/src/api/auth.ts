import apiClient from './apiClient';
import type { ApiResponse } from './apiClient';
import {
  LoginResponseSchema,
  type LoginResponse,
  type UserLoginData,
} from '../validator/UserLoginSchema';
import type { UserRegisterData } from '../validator/UserRegisterSchema';

export const RegisterUser = async (userData: UserRegisterData) => {
  const response = await apiClient.post<ApiResponse<null>>('/users', userData);

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
  };
};

export const LoginUser = async (userData: UserLoginData) => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/authentications', userData);

  const parsed = LoginResponseSchema.parse(response.data.data);

  localStorage.setItem('accessToken', parsed.accessToken);
  localStorage.setItem('refreshToken', parsed.refreshToken);

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    accessToken: parsed.accessToken,
    refreshToken: parsed.refreshToken,
  };
};

export const LogoutUser = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    const response = await apiClient.delete<ApiResponse<null>>('/authentications', {
      data: { refreshToken },
    });

    return {
      status: response.data.status,
      message: response.data.message,
      statusCode: response.status,
    };
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const LoginWithGoogle = async (token: string) => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/google-auth/login', {
    token,
  });

  const parsed = LoginResponseSchema.parse(response.data.data);

  localStorage.setItem('accessToken', parsed.accessToken);
  localStorage.setItem('refreshToken', parsed.refreshToken);

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    accessToken: parsed.accessToken,
    refreshToken: parsed.refreshToken,
  };
};

export const RegisterWithGoogle = async (token: string) => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/google-auth/register', {
    token,
  });

  const parsed = LoginResponseSchema.parse(response.data.data);

  localStorage.setItem('accessToken', parsed.accessToken);
  localStorage.setItem('refreshToken', parsed.refreshToken);

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    accessToken: parsed.accessToken,
    refreshToken: parsed.refreshToken,
  };
};

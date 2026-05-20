import apiClient from './apiClient';

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export const RegisterUser = async (userData: UserRegistrationData) => {
  const response = await apiClient.post('/users', userData);
  return response;
};

export const LoginUser = async (userData: UserLoginData) => {
  const response = await apiClient.post('/authentications', userData);
  localStorage.setItem('accessToken', response.data.data.accessToken);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  return response;
};

export const LogoutUser = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  console.log(refreshToken);
  const response = await apiClient.delete('/authentications', {
    data: { refreshToken: refreshToken },
  });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return response;
};

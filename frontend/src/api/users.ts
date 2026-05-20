import apiClient from './apiClient';

export const getUserProfile = async () => {
  const response = await apiClient.get('/authentications');
  return response.data;
};

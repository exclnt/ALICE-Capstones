import apiClient, { type ApiResponse } from './apiClient';
import { UserSettingsSchema, type UserSettings } from '../validator/UserSettingsSchema';
import { UserProfileSchema } from '../validator/UserProfileSchema';

export const getUserProfile = async () => {
  const response = await apiClient.get<ApiResponse<unknown>>('/authentications');
  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    data: UserProfileSchema.parse(response.data.data),
  };
};

interface UserSettingsPayload {
  setting: unknown;
}

export const getUserSettings = async () => {
  const response = await apiClient.get<ApiResponse<UserSettingsPayload>>('/setting');
  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    setting: UserSettingsSchema.parse(response.data.data.setting),
  };
};

export const putUserSettings = async (payload: UserSettings) => {
  const parsedPayload = UserSettingsSchema.parse(payload);
  const response = await apiClient.put<ApiResponse<UserSettingsPayload>>('/setting', parsedPayload);
  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    setting: UserSettingsSchema.parse(response.data.data.setting),
  };
};

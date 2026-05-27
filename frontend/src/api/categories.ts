import apiClient, { type ApiResponse } from './apiClient';
import { CategoriesSchema, type Categories } from '../validator/CategoriesSchema';

export const getCategories = async () => {
  const response = await apiClient.get<ApiResponse<Categories>>('/categories');

  return {
    status: response.data.status,
    message: response.data.message,
    statusCode: response.status,
    categories: CategoriesSchema.parse(response.data.data).categories,
  };
};

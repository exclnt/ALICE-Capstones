import { InvariantError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import CategoriesRepositories from '../repositories/CategoriesRepositories.js';

export const getCategories = async (req, res, next) => {
  const categories = await CategoriesRepositories.getCategories();

  if (!categories) {
    return next(new InvariantError('Gagal mengambil kategori'));
  }

  return response(res, 200, 'Kategori berhasil diambil', {
    categories: categories,
  });
};

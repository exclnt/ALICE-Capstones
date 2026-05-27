import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import UserRepositories from '../repositories/UserRepositories.js';

export const getUser = async (req, res) => {
  const users = await UserRepositories.getAllUsers();

  return response(res, 200, 'Users berhasil ditampilkan', users);
};

export const createUser = async (req, res, next) => {
  const { username, password, email, role } = req.validated;

  const isNameExist = await UserRepositories.verifyNewUserEmail(email);

  if (isNameExist) {
    return next(
      new InvariantError('Gagal menambahkan user. Username sudah digunakan.'),
    );
  }

  const user = await UserRepositories.registerUser({
    username,
    email,
    password,
    role,
  });
  if (!user) {
    return next(new InvariantError('User gagal ditambahkan'));
  }

  return response(res, 201, 'User berhasil ditambahkan', user);
};

export const getUserByID = async (req, res, next) => {
  const { id } = req.params;

  const user = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil ditampilkan', user);
};

export const updateUserLogged = async (req, res, next) => {
  const userId = req.user.id;
  const data = req.validated.username;

  const dataUser = await UserRepositories.updateUser(userId, data);
  if (!dataUser) {
    return next(new NotFoundError('User tidak ditemukan'));
  }
  return response(res, 200, 'User berhasil diupdate', dataUser);
};

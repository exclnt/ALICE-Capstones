import {
  AuthentificationError,
  InvariantError,
} from '../../../exceptions/index.js';
import tokenManager from '../../../security/tokenManager.js';
import response from '../../../utils/response.js';
import { getAvatarPublicUrl } from '../../avatar/services/storage-services.js';
import UserRepositories from '../../users/repositories/UserRepositories.js';
import AuthentificationRepositories from '../repositories/AuthentificationRepositories.js';

export const login = async (req, res, next) => {
  const { email, password } = req.validated;

  const userId = await UserRepositories.verifyUserCredential(email, password);

  if (!userId) {
    return next(
      new AuthentificationError(
        'Kredensial yang Anda berikan salah, pastikan email dan password benar',
      ),
    );
  }

  const accessToken = tokenManager.generateAccessToken({ id: userId });
  console.log(accessToken);
  const refreshToken = tokenManager.generateRefreshToken({
    id: userId,
  });

  await AuthentificationRepositories.addRefreshToken(refreshToken);

  return response(res, 200, 'Authentication berhasil ditambahkan', {
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.validated;

  console.log('djs');
  const result =
    await AuthentificationRepositories.verifyRefreshToken(refreshToken);

  if (!result) {
    return next(new InvariantError('Refresh token tidak valid'));
  }

  const { id } = tokenManager.verifyRefreshToken(refreshToken);
  const accessToken = tokenManager.generateAccessToken({ id });

  return response(res, 200, 'Access Token berhasil diperbarui', {
    accessToken,
  });
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.validated;

  const result =
    await AuthentificationRepositories.verifyRefreshToken(refreshToken);

  if (!result) {
    return next(new InvariantError('Refresh token tidak valid'));
  }

  await AuthentificationRepositories.deleteRefreshToken(refreshToken);

  return response(res, 200, 'Refresh token berhasil dihapus');
};

export const getUserLogged = async (req, res) => {
  const userId = req.user.id;

  let avatarUrl = null;

  const user = await UserRepositories.getUserLogged(userId);

  if (!user) {
    return response(res, 404, 'user tidak ditemukan');
  }

  if (user.avatar) {
    avatarUrl = getAvatarPublicUrl(user.avatar);
  }

  return response(res, 200, 'mendapat user data logged', {
    ...user,
    avatar: avatarUrl,
  });
};

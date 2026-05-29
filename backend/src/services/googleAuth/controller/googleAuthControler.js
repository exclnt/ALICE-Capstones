import { verifyGoogleToken } from '../../../security/google.js';
import tokenManager from '../../../security/tokenManager.js';
import response from '../../../utils/response.js';
import GoogleAuthRepositories from '../repositories/GoogleAuthRepositories.js';
import AuthentificationRepositories from '../../authentifications/repositories/AuthentificationRepositories.js';
import {
  AuthentificationError,
  InvariantError,
} from '../../../exceptions/index.js';
import UserRepositories from '../../users/repositories/UserRepositories.js';

export async function loginGooggleHandler(req, res, next) {
  const { token } = req.body;

  const user = await verifyGoogleToken(token);

  const userId = await GoogleAuthRepositories.loginGoogle(user);

  if (!userId) {
    return next(
      new AuthentificationError(
        'User Tidak Ditemukan, pastikan akun google sudah terdaftar',
      ),
    );
  }

  const accessToken = tokenManager.generateAccessToken({ id: userId });

  const refreshToken = tokenManager.generateRefreshToken({
    id: userId,
  });

  await AuthentificationRepositories.addRefreshToken(refreshToken);

  return response(res, 200, 'mendapat user data logged google', {
    accessToken,
    refreshToken,
  });
}

export async function registerGoogleHandler(req, res, next) {
  const { token } = req.body;

  const user = await verifyGoogleToken(token);

  const isExist = await UserRepositories.verifyNewUserEmail(user.email);

  if (isExist) {
    return next(
      new InvariantError('Gagal menambahkan user. Email sudah digunakan.'),
    );
  }

  const register = await GoogleAuthRepositories.registerGoogle(user);

  if (!register) {
    return next(new InvariantError('Gagal menambahkan user.'));
  }

  const accessToken = tokenManager.generateAccessToken({ id: register.id });

  const refreshToken = tokenManager.generateRefreshToken({
    id: register.id,
  });

  await AuthentificationRepositories.addRefreshToken(refreshToken);

  return response(res, 200, 'mendapat user data registered google', {
    accessToken,
    refreshToken,
  });
}

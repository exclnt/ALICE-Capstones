import tokenManager from '../security/tokenManager.js';
import response from '../utils/response.js';

const authentificateTOken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token && token.indexOf('Bearer ') !== -1) {
    try {
      const user = await tokenManager.verifyAccessToken(
        token.split('Bearer ')[1],
        process.env.ACCESS_TOKEN_KEY,
      );
      req.user = user;
      return next();
    } catch (error) {
      return response(res, 401, error.message, null);
    }
  }

  return response(res, 401, 'Unauthorized', null);
};

export default authentificateTOken;

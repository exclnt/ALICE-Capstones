import Joi from 'joi';

export const userPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(100),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100),
  role: Joi.string().valid('user', 'admin').default('user'),
});

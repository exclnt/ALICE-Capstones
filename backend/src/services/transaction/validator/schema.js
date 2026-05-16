import Joi from 'joi';

const createTransactionSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.date().required(),
  category: Joi.string().required(),
  title: Joi.string().allow('').optional(),
  type: Joi.string().valid('income', 'expense').required(),
});

const updateTransactionSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.date().required(),
  category: Joi.string().required(),
  title: Joi.string().allow('').optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  // eslint-disable-next-line
  is_impulsive: Joi.bool().optional().default(false),
});

const getTransactionsSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  category: Joi.string().optional(),
  title: Joi.string().allow('').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  type: Joi.string().valid('income', 'expense').optional(),
});

export {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsSchema,
};

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
});

const getTransactionsSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  category: Joi.string().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
});

export {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsSchema,
};

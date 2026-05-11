import Joi from 'joi';

export const predictBalancePayload = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  category: Joi.string().optional(),
  title: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

export const predictRiskPayload = Joi.object({
  /* eslint-disable camelcase */
  day_of_week: Joi.number().integer().min(0).max(6).required(),
  day_of_month: Joi.number().integer().min(1).max(31).required(),
  hour_of_day: Joi.number().integer().min(0).max(23).required(),
  category: Joi.string().required(),
  amount: Joi.number().positive().required(),
  weekly_budget: Joi.number().positive().required(),
  segment: Joi.number().positive().required(),
  /* eslint-enable camelcase */
});

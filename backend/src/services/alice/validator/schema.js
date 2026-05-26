import Joi from 'joi';

export const predictBalancePayload = Joi.object({
  endDate: Joi.date()
    .iso()
    .optional()
    .default(() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
    }),
  startDate: Joi.date().iso().optional(),
});

export const predictRiskPayload = Joi.object({
  /* eslint-disable camelcase */
  day_of_week: Joi.number().integer().min(0).max(6).required(),
  day_of_month: Joi.number().integer().min(1).max(31).required(),
  hour_of_day: Joi.number().integer().min(0).max(23).required(),
  category: Joi.string().required(),
  amount: Joi.number().positive().required(),
  weekly_budget: Joi.number().positive().required(),
  segment: Joi.number().required(),
  /* eslint-enable camelcase */
});

export const budgetOptimizationPayload = Joi.object({
  endDate: Joi.date()
    .iso()
    .optional()
    .default(() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
    }),
  startDate: Joi.date().iso().optional(),
});

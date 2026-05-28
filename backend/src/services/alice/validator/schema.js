import Joi from 'joi';

export const predictBalancePayload = Joi.object({
  endDate: Joi.date()
    .iso()
    .optional()
    .default(() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
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
  weekly_budget: Joi.number().required(),
  segment: Joi.number().required(),
  /* eslint-enable camelcase */
});

export const budgetOptimizationPayload = Joi.object({
  endDate: Joi.date()
    .iso()
    .optional()
    .default(() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
        .toISOString()
        .split('T')[0];
    }),
  // endDate: Joi.date()
  //   .iso()
  //   .optional()
  //   .default(() => {
  //     return new Date().toISOString().split('T')[0];
  //   }),
  startDate: Joi.date().iso().optional(),
});

export const chatPayload = Joi.object({
  message: Joi.string().required(),
  history: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid('user', 'model').required(),
        text: Joi.string().required(),
      })
    )
    .optional()
    .default([]),
});

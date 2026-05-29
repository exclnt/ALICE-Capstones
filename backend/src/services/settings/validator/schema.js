import Joi from 'joi';

export const updateSettingPayloadSchema = Joi.object({
  // eslint-disable-next-line camelcase
  monthly_income: Joi.number().positive().required(),
  // eslint-disable-next-line camelcase
  weekly_budget: Joi.number().positive().required(),
  // eslint-disable-next-line camelcase
  financial_goal: Joi.string().allow('').optional(),
  // eslint-disable-next-line camelcase
  financial_problem: Joi.string().allow('').optional(),
});

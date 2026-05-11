// import { Routes } from 'express';
import { Router } from 'express';
import authetificate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import validateQuery from '../../../middlewares/validateQuery.js';
import { predictRiskPayload } from '../validator/schema.js';

const router = Router();

import {
  budgetOptimization,
  postSegmentation,
  predictBalance,
  predictRisk,
} from '../controller/analyticsController.js';

router.get('/analytics/balance-forecast', authetificate, predictBalance);
router.get(
  '/analytics/budget-recommendation',
  authetificate,
  budgetOptimization,
);
router.post('/sync-segment', authetificate, postSegmentation);
router.post(
  '/analytics/predict-risk',
  authetificate,
  validate(predictRiskPayload),
  predictRisk,
);

export default router;

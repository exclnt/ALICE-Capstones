// import { Routes } from 'express';
import { Router } from 'express';
import authetificate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import validateQuery from '../../../middlewares/validateQuery.js';
import {
  budgetOptimizationPayload,
  predictBalancePayload,
  predictRiskPayload,
} from '../validator/schema.js';

const router = Router();

import {
  budgetOptimization,
  postSegmentation,
  predictBalance,
  predictRisk,
} from '../controller/analyticsController.js';

/**
 * @swagger
 * /analytics/balance-forecast:
 *   get:
 *     summary: Forecast user balance using AI analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the balance forecast range (optional)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the balance forecast range (optional)
 *     responses:
 *       200:
 *         description: Predicted balance returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Prediksi saldo berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     predictions:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [0.68635, 0.689978, 0.692854, 0.694225, 0.697995, 0.701579, 0.705232, 0.707809, 0.712038, 0.713881]
 *                     warnings:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *       400:
 *         description: Bad request due to invalid query parameters
 *       401:
 *         description: Unauthorized request
 */
router.get(
  '/analytics/balance-forecast',
  authetificate,
  validateQuery(predictBalancePayload),
  predictBalance,
);

/**
 * @swagger
 * /analytics/budget-optimization:
 *   post:
 *     summary: Get budget optimization suggestions for the user
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the budget optimization range (optional)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the budget optimization range (optional)
 *     responses:
 *       200:
 *         description: Budget optimization data returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Prediksi saldo berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     allocations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           current_pct:
 *                             type: number
 *                           optimal_pct:
 *                             type: number
 *                           optimal_amount:
 *                             type: number
 *                     monthly_savings_potential:
 *                       type: number
 *                       example: 5205485
 *                     status:
 *                       type: string
 *                       example: success
 *       400:
 *         description: Bad request due to invalid query parameters
 *       401:
 *         description: Unauthorized request
 */
router.post(
  '/analytics/budget-optimization',
  authetificate,
  validateQuery(budgetOptimizationPayload),
  budgetOptimization,
);

/**
 * @swagger
 * /users/me/segmentation:
 *   post:
 *     summary: Run user segmentation based on transaction behavior
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User segmentation performed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Segmentation berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     latent_features:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [1.788, 2.8716]
 *                     segment_label:
 *                       type: string
 *                       example: Moderat
 *                     status:
 *                       type: string
 *                       example: success
 *       401:
 *         description: Unauthorized request
 */
router.post('/users/me/segmentation', authetificate, postSegmentation);

/**
 * @swagger
 * /transactions/analyze-risk:
 *   post:
 *     summary: Analyze transaction risk using AI
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day_of_week
 *               - day_of_month
 *               - hour_of_day
 *               - category
 *               - amount
 *               - weekly_budget
 *               - segment
 *             properties:
 *               day_of_week:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: Day of week index (0-6)
 *               day_of_month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *                 description: Day of month
 *               hour_of_day:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 23
 *                 description: Hour of day
 *               category:
 *                 type: string
 *                 description: Transaction category
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *               weekly_budget:
 *                 type: number
 *                 description: User weekly budget
 *               segment:
 *                 type: number
 *                 description: User segment identifier
 *     responses:
 *       200:
 *         description: Transaction risk prediction returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Prediksi risiko berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     aiResponse:
 *                       type: object
 *                       properties:
 *                         risk_probability:
 *                           type: number
 *                         is_risky:
 *                           type: boolean
 *                         risk_level:
 *                           type: string
 *                         nudge_message:
 *                           type: string
 *                         status:
 *                           type: string
 *                       example:
 *                         risk_probability: 1
 *                         is_risky: true
 *                         risk_level: HIGH
 *                         nudge_message: "⚠️ Hati-hati! Transaksi Bills sebesar Rp757,000 pada hari Selasa jam 8:00 terdeteksi berisiko (HIGH). Pertimbangkan untuk menunda pengeluaran ini."
 *                         status: success
 *       400:
 *         description: Bad request due to invalid payload
 *       401:
 *         description: Unauthorized request
 */
router.post(
  '/transactions/analyze-risk',
  authetificate,
  validate(predictRiskPayload),
  predictRisk,
);

export default router;

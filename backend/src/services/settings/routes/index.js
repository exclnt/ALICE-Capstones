import { Router } from 'express';
import {
  getSetting,
  updateSetting,
} from '../controllers/settingControllers.js';
import authetificate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { updateSettingPayloadSchema } from '../validator/schema.js';

const router = Router();

/**
 * @swagger
 * /setting:
 *   get:
 *     summary: Get user setting
 *     description: Retrieve the authenticated user's current settings.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User setting retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Pengaturan berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     setting:
 *                       type: object
 *                       properties:
 *                         monthly_income:
 *                           type: number
 *                           example: 5000000
 *                         weekly_budget:
 *                           type: number
 *                           example: 1250000
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-06-01T12:00:00Z"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.get('/setting', authetificate, getSetting);

/**
 * @swagger
 * /setting:
 *   put:
 *     summary: Update user setting
 *     description: Update the authenticated user's monthly income and weekly budget.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monthly_income
 *               - weekly_budget
 *             properties:
 *               monthly_income:
 *                 type: number
 *                 example: 5000000
 *               weekly_budget:
 *                 type: number
 *                 example: 1250000
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Pengaturan berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     setting:
 *                       type: object
 *                       properties:
 *                         monthly_income:
 *                           type: number
 *                           example: 5000000
 *                         weekly_budget:
 *                           type: number
 *                           example: 1250000
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-06-01T12:00:00Z"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/setting',
  validate(updateSettingPayloadSchema),
  authetificate,
  updateSetting,
);

export default router;

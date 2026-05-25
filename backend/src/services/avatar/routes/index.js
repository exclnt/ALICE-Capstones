import express from 'express';

import upload from '../storage/storage-config.js';

import { updateAvatarController } from '../controller/avatarControllers.js';
import authentificateTOken from '../../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /users/avatar:
 *   put:
 *     summary: Update user avatar
 *     description: Upload a new avatar image for the authenticated user.
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put(
  '/users/avatar',
  authentificateTOken,
  upload.single('avatar'),
  updateAvatarController,
);

export default router;

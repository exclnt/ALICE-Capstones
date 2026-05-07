import { Router } from 'express';
import validate from '../../../middlewares/validate.js';
import {
  deleteAuthenticationPayloadSchema,
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
} from '../validator/schema.js';
import {
  getUserLogged,
  login,
  logout,
  refreshToken,
} from '../controllers/AuthentificattionController.js';
import authetificate from '../../../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /authentications:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user and issue access and refresh tokens.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Authentication successful
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
 *                   example: Authentication berhasil ditambahkan
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/authentications',
  validate(postAuthenticationPayloadSchema),
  login,
);

/**
 * @swagger
 * /authentications:
 *   put:
 *     summary: Refresh access token
 *     description: Refresh the access token using a valid refresh token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Access token refreshed
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
 *                   example: Access Token berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/authentications',
  validate(putAuthenticationPayloadSchema),
  refreshToken,
);

/**
 * @swagger
 * /authentications:
 *   delete:
 *     summary: Logout user
 *     description: Logout the user by deleting the refresh token from storage.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: Refresh token berhasil dihapus
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/authentications',
  validate(deleteAuthenticationPayloadSchema),
  logout,
);

/**
 * @swagger
 * /authentications:
 *   get:
 *     summary: Get currently authenticated user
 *     description: Retrieve the logged-in user's profile using the access token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer access token, format `Bearer <token>`.
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: User is authenticated
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
 *                   example: User authenticated
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: c0a9wILNXwnRD3QH
 *                     username:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       401:
 *         description: Unauthorized
 */
router.get('/authentications', authetificate, getUserLogged);

export default router;

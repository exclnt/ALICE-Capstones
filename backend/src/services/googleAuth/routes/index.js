import { Router } from 'express';
import {
  loginGooggleHandler,
  registerGoogleHandler,
} from '../controller/googleAuthControler.js';

const router = Router();

/**
 * @swagger
 * /google-auth/login:
 *   post:
 *     summary: Login with Google
 *     description: Login dengan Google menggunakan ID Token. Untuk testing, lihat file `/docs/googleAuthTest.html`
 *     tags: [Google Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE..."
 *     responses:
 *       201:
 *         description: Google login successful
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
 *                   example: "Login dengan Google berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.post('/google-auth/login', loginGooggleHandler);

/**
 * @swagger
 * /google-auth/register:
 *   post:
 *     summary: Register with Google
 *     description: Register dengan Google menggunakan ID Token. Untuk testing, lihat file `/docs/googleAuthTest.html`
 *     tags: [Google Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE..."
 *     responses:
 *       201:
 *         description: Google registration successful
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
 *                   example: "Registrasi dengan Google berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict - User already exists
 */
router.post('/google-auth/register', registerGoogleHandler);

export default router;

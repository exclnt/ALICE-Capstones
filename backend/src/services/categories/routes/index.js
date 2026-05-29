import { Router } from 'express';
import { getCategories } from '../controllers/categoriesController.js';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get categories
 *     description: Retrieve a list of available transaction categories.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Food"
 *       500:
 *         description: Internal server error
 *
 */
router.get('/categories', getCategories);

export default router;

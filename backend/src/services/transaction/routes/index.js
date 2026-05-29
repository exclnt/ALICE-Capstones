import { Router } from 'express';
import validate from '../../../middlewares/validate.js';
import {
  createTransactionSchema,
  getExpenseSchema,
  getTransactionsSchema,
  updateTransactionSchema,
} from '../validator/schema.js';
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getTransactionById,
  getExpense,
} from '../controllers/transactionController.js';
import authetificate from '../../../middlewares/auth.js';
import validateQuery from '../../../middlewares/validateQuery.js';

const router = Router();

/**
 * @swagger
 * /transactions/expense:
 *   get:
 *     summary: Get expense transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering expense transactions
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering expense transactions
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category for filtering expense transactions
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of transactions per page
 *     responses:
 *       200:
 *         description: Expense transactions retrieved successfully
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
 *                   example: Data expense berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Expense transaction item
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/transactions/expense',
  authetificate,
  validateQuery(getExpenseSchema),
  getExpense,
);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - date
 *               - category
 *               - type
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Transaction date
 *               category:
 *                 type: string
 *                 description: Transaction category
 *               title:
 *                 type: string
 *                 description: Transaction title (optional)
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 description: Transaction type
 *     responses:
 *       201:
 *         description: Transaction created successfully
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
 *                   example: Transaksi berhasil ditambahkan
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionId:
 *                       type: string
 *                       description: ID of the created transaction
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/transactions',
  validate(createTransactionSchema),
  authetificate,
  createTransaction,
);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get user transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering transactions
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering transactions
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category for filtering transactions
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Type for filtering transactions
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of transactions per page
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                   example: Transaksi berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/transactions',
  validateQuery(getTransactionsSchema),
  authetificate,
  getTransactions,
);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - date
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Transaction date
 *               category:
 *                 type: string
 *                 description: Transaction category
 *               title:
 *                 type: string
 *                 description: Transaction title (optional)
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 description: Transaction type (optional)
 *     responses:
 *       200:
 *         description: Transaction updated successfully
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
 *                   example: Transaksi berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *                       description: Updated transaction details
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.put(
  '/transactions/:transactionId',
  validate(updateTransactionSchema),
  authetificate,
  updateTransaction,
);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction to delete
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
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
 *                   example: Transaksi berhasil dihapus
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.delete('/transactions/:transactionId', authetificate, deleteTransaction);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction to retrieve
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
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
 *                   example: Transaksi berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *                       description: Transaction details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get('/transactions/:transactionId', authetificate, getTransactionById);

export default router;

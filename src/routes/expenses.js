import express from 'express';
import {
  addExpenses,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  addManyExpenses,
  getExpenseByCategory,
} from '../controller/controller.js';
import { signUp } from '../controller/authController.js';
import { identification } from '../middlewares/identification.js';
const router = express.Router();

/**
 * @swagger
 * /expenses/:
 *   get:
 *     summary: Get all expenses
 *     description: Retrieves a list of all expenses for the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved expenses
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', identification, getExpenses);

/**
 * @swagger
 * /expenses/:
 *   post:
 *     summary: Add a new expense
 *     description: Adds a new expense for the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Dinner"
 *               amount:
 *                 type: number
 *                 example: 1500
 *               category:
 *                 type: string
 *                 example: "Food"
 *               date:
 *                 type: Date
 *                 example: "yyyy-mm-dd"
 *               description:
 *                 type: string
 *                 example: "Lunch at a restaurant"
 *     responses:
 *       200:
 *         description: Expense added successfully
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/', identification, addExpenses);

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     description: Retrieves a specific expense by its ID for the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the expense
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/:id', identification, getExpenseById);

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Update an expense by ID
 *     description: Updates details of a specific expense for the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Dinner"
 *               amount:
 *                 type: number
 *                 example: 2000
 *               category:
 *                 type: string
 *                 example: "Transport"
 *               date:
 *                 type: string
 *                 example: "17-03-2025"
 *               description:
 *                 type: string
 *                 example: "Cab ride"
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', identification, updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     description: Deletes a specific expense for the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', identification, deleteExpense);

/**
 * @swagger
 * /expenses/addMany:
 *   post:
 *     summary: Add multiple expenses
 *     description: Allows the authenticated user to add multiple expenses at once.
 *     tags:
 *       - Expenses
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "Movie Ticket"
 *                 amount:
 *                   type: number
 *                   example: 1200
 *                 category:
 *                   type: string
 *                   example: "Entertainment"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-03-13"
 *                 description:
 *                   type: string
 *                   example: "Movie tickets"
 *     responses:
 *       200:
 *         description: Expenses added successfully
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Internal server error
 */

router.post('/addMany', identification, addManyExpenses);

/**
 * @swagger
 * /expenses/category/{category}:
 *   get:
 *     summary: Get expenses by category
 *     description: Retrieves all expenses under a specific category for the authenticated user.
 *     tags:
 *       - Expenses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense category
 *     responses:
 *       200:
 *         description: Successfully retrieved expenses by category
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/category/:category', identification, getExpenseByCategory);

export default router;

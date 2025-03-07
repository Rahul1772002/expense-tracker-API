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
const router = express.Router();

router.get('/', getExpenses);
router.post('/', addExpenses);
router.get('/:id', getExpenseById);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.post('/addMany', addManyExpenses);
router.get('/category/:category', getExpenseByCategory);

export default router;

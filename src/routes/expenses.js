import express from 'express';
import { addExpenses, getExpenses,getExpenseById, updateExpense, deleteExpense } from '../controller/controller.js';
const router = express.Router();

router.get('/', getExpenses);
router.post('/', addExpenses);
router.get('/:id', getExpenseById)
router.patch('/:id', updateExpense)
router.delete('/:id',deleteExpense)



export default router;

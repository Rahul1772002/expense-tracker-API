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

router.get('/',identification, getExpenses);
router.post('/',identification, addExpenses);
router.get('/:id',identification, getExpenseById);
router.patch('/:id',identification,updateExpense);
router.delete('/:id',identification, deleteExpense);
router.post('/addMany',identification,addManyExpenses);
router.get('/category/:category',identification, getExpenseByCategory);


export default router;

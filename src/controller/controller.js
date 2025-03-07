import { expense } from '../models/expenses.js';
import mongoose from 'mongoose';

export async function getExpenses(req, res) {
  let data = await expense.find({});
  res.json(data);
}

export function homePage(req, res) {
  res.send('Hello this is home page');
}

export async function addExpenses(req, res) {
  let data = req.body;
  let newExpense = new expense(data);
  await newExpense.save();
  res.send('Document saved successfully....');
}

export async function getExpenseById(req, res) {
  let data = await expense.findById(req.params.id);
  res.json(data);
}

export async function updateExpense(req, res) {
  let data = await expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(data);
}

export async function deleteExpense(req, res) {
   expense.findByIdAndDelete(req.params.id).then(() => {
      res.send("Document has been deleted successfully...")
   }).catch((err) => {
      console.log(err)
   })
}

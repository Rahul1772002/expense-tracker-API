import { expense } from '../models/expenses.js';

export async function getExpenses(req, res) {
  try {
    let data = await expense.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
}

export function homePage(req, res) {
  res.send(`
    <h1>Welcome to Expense Tracker API</h1>
    <p>Available Routes:</p>
    <ul>
      <li>GET / - Get all expenses</li>
      <li>POST / - Add a new expense</li>
      <li>GET /:id - Get an expense by ID</li>
      <li>PATCH /:id - Update an expense</li>
      <li>DELETE /:id - Delete an expense</li>
      <li>POST /addMany - Add multiple expenses</li>
      <li>GET /category?category=value - Get expenses by category</li>
    </ul>
  `);
}

export async function addExpenses(req, res) {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    let newExpense = new expense(req.body);
    await newExpense.save();
    res
      .status(201)
      .json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
}

export async function getExpenseById(req, res) {
  try {
    let data = await expense.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense', error });
  }
}

export async function updateExpense(req, res) {
  try {
    let updatedExpense = await expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExpense)
      return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
}

export async function deleteExpense(req, res) {
  try {
    let deletedExpense = await expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense)
      return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
}

export async function addManyExpenses(req, res) {
  try {
    let data = req.body;
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'Provide an array of expenses' });
    }
    await expense.insertMany(data);
    res.status(201).json({ message: 'Expenses added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding multiple expenses', error });
  }
}

export async function getExpenseByCategory(req, res) {
  try {
    let category = req.params.category;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    let data = await expense.find({ category });
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: 'No expenses found for this category' });
    }
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching expenses by category', error });
  }
}

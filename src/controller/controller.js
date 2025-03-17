import { expense } from '../models/expenses.js';

export async function getExpenses(req, res) {
  try {
    const { id } = req.user;
    let data = await expense.find({ userId: id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching expenses', error });
  }
}

export function homePage(req, res) {
  return res.send(`
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
    const { id } = req.user;
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    let newExpense = new expense({ title, amount, category, date, userId: id });
    await newExpense.save();
    return res
      .status(200)
      .json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding expense', error });
  }
}

export async function getExpenseById(req, res) {
  try {
    let { id } = req.user;
    let data = await expense.find({ _id: req.params.id, userId: id });
    if (!data) return res.status(404).json({ message: 'Expense not found' });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching expense', error });
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.user;
    let updatedExpense = await expense.findByIdAndUpdate(
      { _id: req.params.id, userId: id },
      req.body,
      { new: true }
    );
    if (!updatedExpense)
      return res.status(404).json({ message: 'Expense not found' });
    return res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating expense', error });
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.user;
    let deletedExpense = await expense.findByIdAndDelete({
      _id: req.params.id,
      userId: id,
    });
    if (!deletedExpense)
      return res.status(404).json({ message: 'Expense not found' });
    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting expense', error });
  }
}

export async function addManyExpenses(req, res) {
  try {
    const { id } = req.user;
    let data = req.body;
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'Provide an array of expenses' });
    }

    const expensesWithUserId = data.map((expense) => ({
      ...expense,
      userId: id,
    }));

    await expense.insertMany(expensesWithUserId);
    return res.status(200).json({ message: 'Expenses added successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error adding multiple expenses', error });
  }
}

export async function getExpenseByCategory(req, res) {
  try {
    const { id } = req.user;
    let category = req.params.category;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    let data = await expense.find({ userId: id, category: category });
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: 'No expenses found for this category' });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching expenses by category', error });
  }
}

import User from '../../models/userModels.js';
import { expense } from '../../models/expenses.js';
import { getExpensesHandlerSchema } from '../../middlewares/validator.js';
import mongoose from 'mongoose';

export async function getExpensesHandler(call, callback) {
  const { id } = call.request;
  const { error, value } = getExpensesHandlerSchema.validate({ id });
  if (error) {
    return callback(null, {
      success: false,
      message: 'Enter valid email',
    });
  }
  const allExpenses = await expense.find({ userId: id });
  console.log(allExpenses);
  return callback(null, {
    allExpenses,
  });
}

export async function addExpenseHandler(call, callback) {
  try {
    const { sentExpense } = call.request;
    //console.log(id, title, amount, category, date, description);
    if (!sentExpense) {
      return callback(null, {
        success: false,
        message: 'expense data required',
      });
    }

    const { id, title, amount, category, date, description } = sentExpense;
    if (!id || !title || !amount || !category || !date || !description) {
      return callback(null, {
        success: false,
        message: 'all fields are required',
      });
    }

    const newExpense = new expense({
      userId: id,
      title,
      amount,
      category,
      date,
      description,
    });

    await newExpense.save();
    return callback(null, {
      success: true,
      message: 'Expense added successfully',
    });
  } catch (error) {
    console.log(error);
    return callback(null, {});
  }
}

export async function updateExpenseHandler(call, callback) {
  try {
    const { uExpense } = call.request;

    const { id, title, amount, category, date, description } = uExpense;

    const expenseResponse = await expense.findOneAndUpdate(
      { userId: id, title: title },
      //{
      { title, amount, category, date, description },
      //},
      {
        new: true,
      }
    );
    console.log(expenseResponse);
    if (expenseResponse) {
      return callback(null, {
        expenseResponse,
      });
    } else {
      return callback(null, {
        success: false,
        message: 'Could not update expense',
      });
    }
  } catch (error) {
    console.log(error);
    return callback(null, {
      success: false,
      message: 'Internal server error',
    });
  }
}

export async function deleteExpenseHandler(call, callback) {
  try {
    const { dExpense } = call.request;

    const { id, title, amount, category, date, description } = dExpense;

    const result = await expense.deleteOne({
      userId: id,
      title: title,
      amount: amount,
      category: category,
      date: date,
      description: description,
    });

    if (result) {
      return callback(null, {
        success: true,
        message: 'Expense has been deleted successfully',
      });
    } else {
      return callback(null, {
        success: false,
        message: 'Could not delete expense',
      });
    }
  } catch (error) {
    console.log(error);
    return callback(null, {
      success: false,
      message: 'Internal server error',
    });
  }
}

export async function febiHandler(call, callback) {
  try {
    const { id } = call.request;

    const expenses = await expense.find({ userId: id });
    if (expenses) {
      return callback(null, {
        expenses,
      });
    } else {
      return callback(null, {
        success: false,
        message: 'could not find expenses',
      });
    }
  } catch (error) {
    console.log(error);
    return callback(null, {
      error,
    });
  }
}

export async function febcHandler(call, callback) {
  try {
    const { id, category } = call.request;

    const expenses = await expense.find({ userId: id, category: category });

    if (expenses) {
      return callback(null, {
        expenses,
      });
    } else {
      return callback(null, {
        success: false,
        message: 'Could not find expenses',
      });
    }
  } catch (error) {
    return callback(null, {
      success: false,
      message: 'Internal server error',
    });
  }
}

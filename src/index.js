import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import express from 'express';
import mongoose from 'mongoose';
import expenseRoutes from './routes/expenses.js';
import { homePage } from './controller/controller.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('Database connected successfully....');
  })
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

app.get('/', homePage);
app.use('/expenses', expenseRoutes);

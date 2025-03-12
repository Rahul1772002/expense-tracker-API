import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import express from 'express';
import mongoose from 'mongoose';
import expenseRoutes from './routes/expenses.js';
import { homePage } from './controller/controller.js';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

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
app.use('/api/auth', authRoutes);

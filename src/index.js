import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import express from 'express';
import mongoose from 'mongoose';
import expenseRoutes from './routes/expenses.js';
import { homePage } from './controller/controller.js';
import authRoutes from './routes/authRoutes.js';
import helmet from 'helmet';
import cors from 'cors';
import swaggerJSdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node JS Expense-tracker API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

console.log(options.apis);

const swaggerSpec = swaggerJSdoc(options);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

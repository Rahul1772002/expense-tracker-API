# expense-tracker-API

### An API for managing expenses using Node.js, Express, and MongoDB.

## Installation

Clone the repository:

git clone https://github.com/Rahul1772002/expense-tracker-API.git

Navigate to the project directory:

cd expense-tracker-API

## Install dependencies:

npm install

## Start the server:

npm start

## API Routes

Base URL: http://localhost:5000

Authentication Routes

POST /signup - Register a new user

POST /login - Authenticate user and generate token

POST /logout - Logout user

POST /send-verification-code - Send email verification code

POST /verify-verification-code - Verify email verification code

POST /send-forgot-password-code - Send password reset code

POST /verify-forgot-password-code- Verify password reset code

PATCH /change-password - Update user password

Expenses Routes

GET / - Retrieve all expenses

POST / - Add a new expense

GET /:id - Retrieve a specific expense by ID

PATCH /:id - Update an expense by ID

DELETE /:id - Delete an expense by ID

POST /addMany - Add multiple expenses

GET /category/:category - Retrieve expenses by category

## Technologies Used

Node.js

Express.js

MongoDB

Mongoose

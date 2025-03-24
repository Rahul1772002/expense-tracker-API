# expense-tracker-API

### A robust and scalable API designed for seamless expense management, built with Node.js, Express, MongoDB, Mongoose, Redis, and gRPC, featuring secure authentication, optimized caching, and high-performance inter-service communication.

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

Documnentation route

/api-docs

## Technologies Used

Node.js

Express.js

MongoDB

Mongoose

Swagger

Redis

gRPC

### Redis Integration

Redis is used for caching expense data to improve API response times. It helps in reducing database queries by storing frequently accessed data in memory.

### Features:

Caching expenses for faster retrieval

Automatic cache invalidation on updates

Reducing database load for frequently accessed queries

### gRPC Integration

gRPC is used for efficient and fast inter-service communication, enabling structured communication between different parts of the system.

### Features:

Supports high-performance communication

Used for authentication services

Allows scalable and efficient remote procedure calls (RPC)

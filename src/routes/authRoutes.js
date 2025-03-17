import express from 'express';
import {
  changePassword,
  logIn,
  logOut,
  sendForgotPasswordCode,
  sendVerificationCode,
  signUp,
  validateVerificationCode,
  verifyForgotPasswordCode,
} from '../controller/authController.js';
import { identification } from '../middlewares/identification.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User Signup
 *     description: Register a new user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 */
router.post('/signup', signUp);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', logIn);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User Logout
 *     description: Logout the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', identification, logOut);

/**
 * @swagger
 * /api/auth/send-verification-code:
 *   post:
 *     summary: Send Verification Code
 *     description: Sends a verification code to the user's email
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification code sent
 *       500:
 *         description: Failed to send code
 */
router.post('/send-verification-code', identification, sendVerificationCode);

/**
 * @swagger
 * /api/auth/verify-verification-code:
 *   post:
 *     summary: Verify Verification Code
 *     description: Validates the verification code sent to the user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid code
 */
router.post(
  '/verify-verification-code',
  identification,
  validateVerificationCode
);

/**
 * @swagger
 * /api/auth/send-forgot-password-code:
 *   post:
 *     summary: Send Forgot Password Code
 *     description: Sends a password reset code to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset code sent
 *       500:
 *         description: Failed to send code
 */
router.post('/send-forgot-password-code', sendForgotPasswordCode);

/**
 * @swagger
 * /api/auth/verify-forgot-password-code:
 *   post:
 *     summary: Verify Forgot Password Code
 *     description: Verifies the password reset code sent to the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               providedCode:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid code
 */

router.post('/verify-forgot-password-code', verifyForgotPasswordCode);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change Password
 *     description: Allows authenticated users to change their password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 */
router.post('/change-password', identification, changePassword);
export default router;

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

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', identification, logOut);
router.post('/send-verification-code', identification, sendVerificationCode);
router.post(
  '/verify-verification-code',
  identification,
  validateVerificationCode
);
router.post('/send-forgot-password-code', sendForgotPasswordCode);
router.post('/verify-forgot-password-code', verifyForgotPasswordCode);
router.post('/change-password',identification,changePassword);
export default router;

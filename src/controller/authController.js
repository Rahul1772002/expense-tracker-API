import User from '../models/userModels.js';
import { compareHash, doHash, hmacProcess } from '../utils/hashing.js';
import {
  logInSchema,
  signUpSchema,
  validateverificationCodeSchema,
  verificationCodeSchema,
  forgotPasswordCodeSchema,
  verifyForgotPasswordCodeSchema,
  changePasswordSchema,
} from '../middlewares/validator.js';
import jwt from 'jsonwebtoken';
import transport from '../utils/sendMail.js';
import dotenv from 'dotenv';
import { compare } from 'bcrypt';
dotenv.config({ path: './config.env' });

export async function signUp(req, res) {
  try {
    const { email, password } = req.body;
    const { error, value } = signUpSchema.validate({ email, password });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists...' });
    }

    const hashedPassword = await doHash(password, 12);

    const newUser = new User({ email: email, password: hashedPassword });
    const result = await newUser.save();
    result.password = undefined;
    return res.status(200).json({
      success: true,
      message: 'Your account has been created successfully.....',
      result,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function logIn(req, res) {
  try {
    const { email, password } = req.body;
    const { error, value } = logInSchema.validate({ email, password });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: email }).select(
      '+password'
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User does not exists...' });
    }

    const result = await compareHash(password, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials...' });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('Authorization', 'Bearer ' + token, {
      expires: new Date(Date.now() + 1 * 3600000),
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
    });

    return res
      .status(200)
      .json({ success: true, token, message: 'Logged in successfully...' });
  } catch (error) {
    console.log(error);
  }
}

export async function logOut(req, res) {
  return res
    .clearCookie('Authorization')
    .status(200)
    .json({ success: true, message: 'Logged out successfully...' });
}

export async function sendVerificationCode(req, res) {
  try {
    const { email } = req.body;
    const { error, value } = verificationCodeSchema.validate({ email });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: email }).select(
      '+password'
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User does not exist..' });
    }
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: 'You are already verified' });
    }
    const verificationCode = Math.floor(Math.random() * 1000000).toString();

    const code = await transport.sendMail({
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: 'Verification Code',
      html: '<h1>' + verificationCode + '<h1>',
    });

    if (code.accepted[0] === existingUser.email) {
      const hashedValue = await hmacProcess(
        verificationCode,
        process.env.HMAC_KEY
      );
      existingUser.verificationCode = hashedValue;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: 'Code has been sent successfully...',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Could not send verification code...',
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function validateVerificationCode(req, res) {
  const { email, providedCode } = req.body;
  const { error, value } = validateverificationCodeSchema.validate({
    email,
    providedCode,
  });
  if (error) {
    return res.status(400).jason({
      success: false,
      message: error.details[0].message,
    });
  }

  const existingUser = await User.findOne({ email: email }).select(
    '+verificationCode +verificationCodeValidation  '
  );
  if (!existingUser) {
    return res
      .status(404)
      .json({ success: false, message: 'User not found..' });
  }
  if (existingUser.verified) {
    return res
      .status(400)
      .json({ success: false, message: 'You are already verified' });
  }

  if (
    !existingUser.verificationCode ||
    !existingUser.verificationCodeValidation
  ) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
  if (Date.now() - existingUser.verificationCodeValidation > 300000) {
    return res
      .status(410)
      .json({ success: false, message: 'Verification code expired..' });
  }

  const hashedCode = await hmacProcess(
    providedCode.toString(),
    process.env.HMAC_KEY
  );
  if (hashedCode === existingUser.verificationCode) {
    existingUser.verified = true;
    existingUser.verificationCode = undefined;
    existingUser.verificationCodeValidation = undefined;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: 'Your account has been verified',
      existingUser,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
}

export async function sendForgotPasswordCode(req, res) {
  try {
    const { email } = req.body;
    const { error, result } = forgotPasswordCodeSchema.validate({ email });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User does not exist' });
    }

    const fpcode = Math.floor(Math.random() * 1000000).toString();

    const info = await transport.sendMail({
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: 'Forgot Password Code',
      html: '<h3>' + fpcode + '</h3>',
    });

    if (info.accepted[0] === existingUser.email) {
      existingUser.forgotPasswordCode = await hmacProcess(
        fpcode,
        process.env.HMAC_KEY
      );
      existingUser.forgotPasswordCodeValidation = Date.now();
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: 'Code has been sent successfully' });
    } else {
      return res
        .status(500)
        .json({ success: false, message: 'Could not send code' });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function verifyForgotPasswordCode(req, res) {
  try {
    const { email, providedCode, newPassword } = req.body;

    const { error, value } = verifyForgotPasswordCodeSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: true, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: email }).select(
      '+forgotPasswordCode +forgotPasswordCodeValidation'
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong' });
    }

    if (Date.now() - existingUser.forgotPasswordCodeValidation > 300000) {
      return res
        .status(410)
        .json({ success: false, message: 'Code has expired' });
    }

    const hashedCode = await hmacProcess(
      providedCode.toString(),
      process.env.HMAC_KEY
    );

    if (hashedCode === existingUser.forgotPasswordCode) {
      const hashedPassword = await doHash(newPassword, 12);
      existingUser.password = hashedPassword;
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: 'New password has been set' });
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials..' });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function changePassword(req, res) {
  try {
    const { id, verified } = req.user;
    const { oldPassword, newPassword } = req.body;
    const { error, value } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    if (!verified) {
      return res
        .status(401)
        .json({ success: false, message: 'You are not verified...' });
    }

    const existingUser = await User.findOne({ _id: id }).select('+password');
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User does not exist' });
    }

    const result = await compareHash(oldPassword, existingUser.password);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect old password' });
    }

    const newHashedPassword = await doHash(newPassword, 12);
    existingUser.password = newHashedPassword;
    await existingUser.save();
    return res.status(200).json({
      success: true,
      message: 'Your password has been changed successfully...',
    });
  } catch (error) {
    console.log(error);
  }
}

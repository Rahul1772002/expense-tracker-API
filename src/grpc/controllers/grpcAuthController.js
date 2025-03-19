import dotenv from 'dotenv';
dotenv.config({ path: '../../../config.env' });
import grpc from '@grpc/grpc-js';
import { signUp, logIn } from '../../controller/authController.js';
import User from '../../models/userModels.js';
import jwt from 'jsonwebtoken';
import {
  logInSchema,
  verificationCodeSchema,
  validateverificationCodeSchema,
  forgotPasswordCodeSchema,
  verifyForgotPasswordCodeSchema,
  changePasswordSchemagrpc,
} from '../../middlewares/validator.js';
import { compareHash, doHash, hmacProcess } from '../../utils/hashing.js';
import transport from '../../utils/sendMail.js';

export async function signUpHandler(call, callback) {
  const req = { body: call.request };
  const res = {
    status: (code) => ({
      json: (data) => callback(null, data),
    }),
  };
  try {
    await signUp(req, res);
  } catch (error) {
    console.error(error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Internal server error',
    });
  }
}

export async function logInHandler(call, callback) {
  try {
    console.log('Debugging......................');
    const { email, password } = call.request;
    const { error, value } = logInSchema.validate({ email, password });
    if (error) {
      console.log(error);
      return callback(null, {
        code: grpc.status.INVALID_ARGUMENT,
        message: error.details[0].message,
      });
    }

    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser) {
      return callback(null, {
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }

    const result = await compareHash(password, existingUser.password);
    if (!result) {
      return callback(null, {
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
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
    console.log(token);

    return await callback(null, {
      success: true,
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      code: grpc.status.INTERNAL,
      message: 'Internal server error',
    });
  }
}

export async function logOutHandler(call, callback) {
  try {
    const { token } = call.request;
    console.log(token);
    if (!token) {
      return callback(null, {
        success: false,
        message: 'You are not loggged in...',
        token: '',
      });
    }
    return callback(null, {
      success: true,
      message: 'Logged out successfully....',
      token: '',
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      code: grpc.status.INTERNAL,
      message: 'Internal server error',
      token: '',
    });
  }
}

export async function sendVerificationCodeHandler(call, callback) {
  try {
    const { email } = call.request;
    const { error, value } = verificationCodeSchema.validate({ email });
    if (error) {
      return callback(null, {
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Enter valid email',
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return callback(null, {
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (existingUser.verified) {
      return callback(null, {
        code: grpc.status.ALREADY_EXISTS,
        message: 'You are already verified',
      });
    }

    const code = Math.floor(Math.random() * 1000000).toString();

    //console.log(process.env.SENDER_EMAIL_ADDRESS);

    //
    const info = await transport.sendMail({
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: 'Verification Code',
      html: '<h1>' + code + '<h1>',
    });
    // 2-second delay
    console.log(info);
    if (info.accepted[0] === existingUser.email) {
      existingUser.verificationCode = await hmacProcess(
        code,
        process.env.HMAC_KEY
      );
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return callback(null, {
        success: true,
        message: 'Code has been sent successfully...',
      });
    } else {
      return callback(null, {
        code: grpc.status.INTERNAL,
        message: 'Internal server error from try',
      });
    }
  } catch (error) {
    console.log(error);
    return callback(null, {
      code: grpc.status.INTERNAL,
      message: 'Internal server error from catch',
    });
  }
}

export async function verifyVerificationCodeHandler(call, callback) {
  try {
    const { email, providedCode } = call.request;
    const { error, value } = validateverificationCodeSchema.validate({
      email,
      providedCode,
    });
    if (error) {
      return callback(null, {
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Enter valid email or code',
      });
    }

    const existingUser = await User.findOne({ email }).select(
      '+verificationCode +verificationCodeValidation'
    );

    if (!existingUser) {
      return callback(null, {
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (existingUser.verified) {
      return callback(null, {
        success: false,
        message: 'You are already verified',
      });
    }

    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return callback(null, {
        success: false,
        message: 'Internal server error',
      });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 300000) {
      return callback(null, {
        success: false,
        message: 'Code has expired',
      });
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
      return callback(null, {
        success: true,
        message: 'Your account has been verified',
      });
    } else {
      return callback(null, {
        success: false,
        message: 'Invalid code provided',
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

export async function sendForgotPasswordCodeHandler(call, callback) {
  try {
    const { email } = call.request;
    const { error, value } = forgotPasswordCodeSchema.validate({ email });
    if (error) {
      return callback(null, {
        success: 'false',
        messaeg: 'Enter valid email',
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return callback(null, {
        success: false,
        message: 'User does not exist',
      });
    }

    const code = Math.floor(Math.random() * 1000000).toString();

    const info = await transport.sendMail({
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: 'Forgot password code',
      html: '<h3>' + code + '</h3>',
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCode = await hmacProcess(code, process.env.HMAC_KEY);
      existingUser.forgotPasswordCode = hashedCode;
      existingUser.forgotPasswordCodeValidation = Date.now();
      await existingUser.save();
      return callback(null, {
        success: true,
        message: 'Code has been sent successfully',
      });
    } else {
      return callback(null, {
        success: false,
        message: 'Could not send code',
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

export async function verifyForgotPasswordCodeHandler(call, callback) {
  try {
    const { email, providedCode, newPassword } = call.request;
    const { error, value } = verifyForgotPasswordCodeSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return callback(null, {
        success: false,
        message: error.details[0].message,
      });
    }

    const existingUser = await User.findOne({ email }).select(
      '+forgotPasswordCode +forgotPasswordCodeValidation'
    );

    if (!existingUser) {
      return callback(null, {
        success: false,
        message: 'User not found',
      });
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return callback(null, {
        success: false,
        message: 'Something went wrong',
      });
    }

    if (Date.now() - existingUser.forgotPasswordCodeValidation > 300000) {
      return callback(null, {
        success: false,
        message: 'Code has expired',
      });
    }

    const hashedCode = await hmacProcess(
      providedCode.toString(),
      process.env.HMAC_KEY
    );
    if (hashedCode === existingUser.forgotPasswordCode) {
      existingUser.password = await doHash(newPassword, 12);
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();
      return callback(null, {
        success: true,
        message: 'New password has been set successfully',
      });
    } else {
      return callback(null, {
        success: false,
        message: 'Invalid code',
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

export async function changePasswordHandler(call, callback) {
  try {
    const { email, oldPassword, newPassword } = call.request;
    const { error, value } = changePasswordSchemagrpc.validate({
      email,
      oldPassword,
      newPassword,
    });
    if (error) {
      return callback(null, {
        success: false,
        message: 'Enter valid email',
      });
    }

    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser) {
      return callback(null, {
        success: false,
        message: 'User not found',
      });
    }

    if (!existingUser.verified) {
      return callback(null, {
        success: false,
        message: 'You are not verified',
      });
    }

    const result = await compareHash(oldPassword, existingUser.password);
    if (!result) {
      return callback(null, {
        success: false,
        message: 'Incorrect old password',
      });
    }

    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return callback(null, {
      success: true,
      message: 'Password has been changed successfully',
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      success: false,
      message: 'Internal server error',
    });
  }
}

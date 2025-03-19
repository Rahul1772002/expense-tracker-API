import Joi from 'joi';

export const signUpSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),

  password: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)),
});

export const logInSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),

  password: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)),
});

export const verificationCodeSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
});

export const validateverificationCodeSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  providedCode: Joi.number().required(),
});

export const forgotPasswordCodeSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
});

export const verifyForgotPasswordCodeSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  providedCode: Joi.number().required(),
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)),
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)),
});

export const changePasswordSchemagrpc = Joi.object({
  email: Joi.string()
    .min(5)
    .max(60)
    .required()
    .email({
      tlds: { allow: ['com', 'net'] },
    }),
  oldPassword: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)),
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)),
});

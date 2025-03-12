import mongoose from 'mongoose';

 const authSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      minlength: [5, 'Email must have atleast 5 characters'],
      unique: [true, 'Email already exists'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password required'],
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValidation: {
      type: Number,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', authSchema)

export default User;
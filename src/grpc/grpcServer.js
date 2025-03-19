import dotenv from 'dotenv';
dotenv.config({ path: '../../config.env' });
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import {
  logInHandler,
  logOutHandler,
  signUpHandler,
  sendVerificationCodeHandler,
  verifyVerificationCodeHandler,
  sendForgotPasswordCodeHandler,
  verifyForgotPasswordCodeHandler,
  changePasswordHandler,
} from './controllers/grpcAuthController.js';
import mongoose from 'mongoose';
import { logOut, sendVerificationCode } from '../controller/authController.js';
const packageDefinition = protoLoader.loadSync(
  path.resolve('../proto/auth.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

async function main() {
  await mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log('Database connected successfully....');
    })
    .catch((err) => console.log(err));

  const server = new grpc.Server();
  server.addService(authProto.authService.service, {
    signUp: signUpHandler,
    logIn: logInHandler,
    logOut: logOutHandler,
    sendVerificationCode: sendVerificationCodeHandler,
    verifyVerificationCode: verifyVerificationCodeHandler,
    sendForgotPasswordCode: sendForgotPasswordCodeHandler,
    verifyForgotPasswordCode: verifyForgotPasswordCodeHandler,
    changePassword: changePasswordHandler,
  });

  server.bindAsync(
    'localhost:50001',
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log('Grpc server started on 5001');
      server.start();
    }
  );
}

main();

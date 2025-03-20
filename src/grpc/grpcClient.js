import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { response } from 'express';

import path from 'path';

const PROTO_PATH = '../proto/auth.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  enums: String,
  longs: String,
  oneofs: true,
});

const packagetDefinitionExpenses = protoLoader.loadSync(
  path.resolve('../proto/expenses.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;
const expenseProto = grpc.loadPackageDefinition(
  packagetDefinitionExpenses
).expenses;

const client = new authProto.authService(
  'localhost:50001',
  grpc.credentials.createInsecure()
);

const expenseClient = new expenseProto.expenseService(
  'localhost:50001',
  grpc.credentials.createInsecure()
);

// await client.signUp(
//   { email: 'rahulmsonawane177@gmail.com', password: 'Rahul@1234' },
//   (error, response) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log(response);
//     }
//   }
// );
// const metadata = new grpc.Metadata();
// await client.logIn(
//   { email: 'rahulmsonawane177@gmail.com', password: 'Rahul@12345' },
//   (error, response, trailer) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log(response.success, response.message);
//       console.log('Metadata received' + trailer.getMap());
//       const token = trailer.get('authorization')[0];

//       if (response.token) {
//         console.log('Token received: ' + token);
//       } else {
//         console.log('No token recieved');
//       }
//     }
//   }
// );

// setTimeout(() => {
//   client.logOut({ email: 'xyz@gmail.com', token }, (error, response) => {
//     if (error) {
//       console.log('Logout Error:', error);
//     } else {
//       token = response.token;
//       console.log('Logout Success:', response.success, response.message);
//     }
//   });
// }, 2000);

// await setTimeout(() => {
//   client.sendVerificationCode(
//     { email: 'rahulmsonawane177@gmail.com', token },
//     (error, response) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(response.success, response.message);
//       }
//     }
//   );
// }, 2000);

// await setTimeout(() => {
//   client.verifyVerificationCode(
//     { email: 'rahulmsonawane177@gmail.com', providedCode: 631370 },
//     (error, response) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(response.success, response.message);
//       }
//     }
//   );
// }, 2000);

// setTimeout(() => {
//   client.sendForgotPasswordCode(
//     { email: 'rahulmsonawane177@gmail.com' },
//     (error, response) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(response.success, response.message);
//       }
//     }
//   );
// }, 2000);

// await setTimeout(() => {
//   client.verifyForgotPasswordCode(
//     {
//       email: 'rahulmsonawane177@gmail.com',
//       providedCode: 770818,
//       newPassword: 'Rahul@12345',
//     },
//     (error, response) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(response.success, response.message);
//       }
//     }
//   );
// }, 2000);

// setTimeout(() => {
//   client.changePassword(
//     {
//       email: 'rahulmsonawane177@gmail.com',
//       oldPassword: 'Rahul@1234',
//       newPassword: 'Rahul@12345',
//     },
//     (error, response) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(response.success, response.message);
//       }
//     }
//   );
// }, 2000);

// expenseClient.getExpenses(
//   { id: '67d0129673e5dc0eb465abf3' },
//   (error, response) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log(response);
//     }
//   }
// );

// expenseClient.addExpense(
//   {
//     sentExpense: {
//       id: '67d0129673e5dc0eb465abf3',
//       title: 'Gift',
//       amount: 25500,
//       category: 'Other',
//       date: '2025-03-20',
//       description: 'Bought a gift for a friend',
//     },
//   },
//   (error, response) => {
//     if (error) {
//       console.log(error.details[0].message);
//     } else {
//       console.log(response.success, response.message);
//     }
//   }
// );

// expenseClient.updateExpense(
//   {
//     uExpense: {
//       id: '67d0129673e5dc0eb465abf3',
//       title: 'Gift',
//       amount: 255000,
//       category: 'Other',
//       date: '2025-03-20',
//       description: 'Bought gift for a friend',
//     },
//   },
//   (error, response) => {
//     if (error) {
//       console.log(error.details[0].message);
//     } else {
//       console.log(response);
//     }
//   }
// );

// expenseClient.deleteExpense(
//   {
//     dExpense: {
//       id: '67d0129673e5dc0eb465abf3',
//       title: 'Gift',
//       amount: 255000,
//       category: 'Other',
//       date: '2025-03-20',
//       description: 'Bought gift for a friend',
//     },
//   },
//   (error, response) => {
//     if (error) {
//       console.log(error.details[0].message);
//     } else {
//       console.log(response);
//     }
//   }
// );

// expenseClient.findExpenseById(
//   {
//     id: '67d0129673e5dc0eb465abf3',
//   },
//   (error, response) => {
//     if (error) {
//       console.log(error.details[0].message);
//     } else {
//       console.log(response);
//     }
//   }
// );

expenseClient.findExpenseByCategory(
  {
    id: '67d0129673e5dc0eb465abf3',
    category: 'Food',
  },
  (error, response) => {
    if (error) {
      console.log(error.details[0].message);
    } else {
      console.log(response);
    }
  }
);

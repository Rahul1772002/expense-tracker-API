import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../proto/auth.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  enums: String,
  longs: String,
  oneofs: true,
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

const client = new authProto.authService(
  'localhost:50001',
  grpc.credentials.createInsecure()
);

await client.signUp(
  { email: 'rahulmsonawane177@gmail.com', password: 'Rahul@1234' },
  (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  }
);

let token = null;
await client.logIn(
  { email: 'rahulmsonawane177@gmail.com', password: 'Rahul@12345' },
  (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log(response.success, response.message);
      if (response.token) {
        token = response.token;
        console.log('Token received: ' + token);
      } else {
        console.log('No token recieved');
      }
    }
  }
);

setTimeout(() => {
  client.logOut({ email: 'xyz@gmail.com', token }, (error, response) => {
    if (error) {
      console.log('Logout Error:', error);
    } else {
      token = response.token;
      console.log('Logout Success:', response.success, response.message);
    }
  });
}, 2000);

await setTimeout(() => {
  client.sendVerificationCode(
    { email: 'rahulmsonawane177@gmail.com', token },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.success, response.message);
      }
    }
  );
}, 2000);

await setTimeout(() => {
  client.verifyVerificationCode(
    { email: 'rahulmsonawane177@gmail.com', providedCode: 631370 },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.success, response.message);
      }
    }
  );
}, 2000);

setTimeout(() => {
  client.sendForgotPasswordCode(
    { email: 'rahulmsonawane177@gmail.com' },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.success, response.message);
      }
    }
  );
}, 2000);

await setTimeout(() => {
  client.verifyForgotPasswordCode(
    {
      email: 'rahulmsonawane177@gmail.com',
      providedCode: 770818,
      newPassword: 'Rahul@12345',
    },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.success, response.message);
      }
    }
  );
}, 2000);

setTimeout(() => {
  client.changePassword(
    {
      email: 'rahulmsonawane177@gmail.com',
      oldPassword: 'Rahul@1234',
      newPassword: 'Rahul@12345',
    },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.success, response.message);
      }
    }
  );
}, 2000);

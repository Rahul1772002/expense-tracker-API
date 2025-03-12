import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
const transport = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL_ADDRESS,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

export default transport;

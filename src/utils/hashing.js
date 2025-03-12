import bcrypt, { compare, hash } from 'bcrypt';
import { createHmac } from 'crypto';
export async function doHash(value, saltValue) {
  const result = hash(value, saltValue);
  return result;
}

export async function compareHash(password, hashedPassword) {
  const result = compare(password, hashedPassword);
  return result;
}

export async function hmacProcess(value, key) {
  const result = createHmac('sha256',key).update(value).digest('hex');
  return result;
}

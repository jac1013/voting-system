import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

export function encrypt(text) {
  const cipher = crypto.createCipheriv(
    algorithm,
    process.env.CONFIRMATION_HASH_SECRET,
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export function decrypt(hash) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    process.env.CONFIRMATION_HASH_SECRET,
    Buffer.from(hash.iv, 'hex'),
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

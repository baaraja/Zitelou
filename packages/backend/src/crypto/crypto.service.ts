import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly saltLength = 16;
  private readonly tagLength = 16;
  private readonly ivLength = 12;

  generateKeyPair() {
    const publicKey = randomBytes(32).toString('hex');
    const privateKey = randomBytes(32).toString('hex');
    return { publicKey, privateKey };
  }

  hashPrivateKey(privateKey: string): string {
    const salt = randomBytes(this.saltLength);
    const hash = scryptSync(privateKey, salt, 64);
    return Buffer.concat([salt, hash]).toString('hex');
  }

  verifyPrivateKeyHash(privateKey: string, hash: string): boolean {
    const buffer = Buffer.from(hash, 'hex');
    const salt = buffer.slice(0, this.saltLength);
    const storedHash = buffer.slice(this.saltLength);
    const derivedKey = scryptSync(privateKey, salt, 64);
    return derivedKey.equals(storedHash);
  }

  encryptMessage(message: string, sharedSecret: string): string {
    const iv = randomBytes(this.ivLength);
    const key = Buffer.from(sharedSecret, 'hex').slice(0, 32);
    const cipher = createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}.${authTag.toString('hex')}.${encrypted}`;
  }

  decryptMessage(encryptedMessage: string, sharedSecret: string): string {
    const [ivHex, tagHex, encrypted] = encryptedMessage.split('.');
    const key = Buffer.from(sharedSecret, 'hex').slice(0, 32);
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

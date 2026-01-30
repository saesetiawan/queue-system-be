import * as CryptoJS from 'crypto-js';
import { Injectable, Logger } from '@nestjs/common';

const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'supersecretkey';

@Injectable()
export class EncryptionService {
  logger = new Logger(EncryptionService.name);
  /**
   * Encrypt JSON payload to Base64 string
   */
  encrypt(payload: object): string {
    const json = JSON.stringify(payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    const ciphertext = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    return encodeURIComponent(ciphertext);
  }

  /**
   * Decrypt token and return JSON object
   */
  decrypt<T = any>(token: string): T | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(token), SECRET_KEY);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      this.logger.error('Decryption failed', error);
      return null;
    }
  }
}

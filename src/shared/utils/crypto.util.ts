import * as crypto from 'crypto';

export class CryptoUtil {
  static hashSha256(text: string) {
    //parse cpf key
    const hash = crypto.createHash('sha256');
    //encrypted
    return hash.update(text).digest('hex');
  }
}

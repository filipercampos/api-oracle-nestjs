import * as bcrypt from 'bcrypt';
/**
 * Encrupts and compare text with bcrypt
 */
export class BcryptUtil {
  /**
   * Generates a hash from a given string
   */
  static hash(data: string): Promise<string> {
    if (!data) throw new Error('hash: data is required');
    return bcrypt.hash(data, 10);
  }
  /**
   * Compares a given string with a hash
   */
  static compare(data: string, hash: string): Promise<boolean> {
    if (!data || !hash) throw new Error('compare: data and hash are required');
    return bcrypt.compare(data, hash);
  }
}

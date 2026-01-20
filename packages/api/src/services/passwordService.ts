import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const passwordService = {
  /**
   * Hash a password using bcrypt with cost factor 12
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Verify a password against a bcrypt hash
   */
  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};

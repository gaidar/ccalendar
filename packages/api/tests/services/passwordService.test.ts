import { describe, it, expect } from 'vitest';
import { passwordService } from '../../src/services/passwordService.js';

describe('passwordService', () => {
  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123';
      const hash = await passwordService.hash(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBe(60); // bcrypt hash length
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await passwordService.hash(password);
      const hash2 = await passwordService.hash(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verify', () => {
    it('should return true for matching password', async () => {
      const password = 'TestPassword123';
      const hash = await passwordService.hash(password);

      const result = await passwordService.verify(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestPassword123';
      const wrongPassword = 'WrongPassword123';
      const hash = await passwordService.hash(password);

      const result = await passwordService.verify(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = 'TestPassword123';
      const hash = await passwordService.hash(password);

      const result = await passwordService.verify('', hash);

      expect(result).toBe(false);
    });
  });
});

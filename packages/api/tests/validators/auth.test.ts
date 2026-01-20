import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  changePasswordSchema,
} from '../../src/validators/auth.js';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const data = {
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        password: 'Password123',
      };

      const result = registerSchema.parse(data);

      expect(result.email).toBe('john@example.com');
    });

    it('should trim name', () => {
      const data = {
        name: '  John Doe  ',
        email: 'john@example.com',
        password: 'Password123',
      };

      const result = registerSchema.parse(data);

      expect(result.name).toBe('John Doe');
    });

    it('should reject empty name', () => {
      const data = {
        name: '',
        email: 'john@example.com',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'PASSWORD123',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'PasswordABC',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass1',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const data = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject email longer than 120 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'a'.repeat(110) + '@example.com',
        password: 'Password123',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'any-password',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const data = {
        email: 'JOHN@EXAMPLE.COM',
        password: 'password',
      };

      const result = loginSchema.parse(data);

      expect(result.email).toBe('john@example.com');
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const data = {
        email: 'john@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe('passwordResetRequestSchema', () => {
    it('should validate valid email', () => {
      const validData = {
        email: 'john@example.com',
      };

      const result = passwordResetRequestSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const data = {
        email: 'JOHN@EXAMPLE.COM',
      };

      const result = passwordResetRequestSchema.parse(data);

      expect(result.email).toBe('john@example.com');
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
      };

      const result = passwordResetRequestSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe('passwordResetSchema', () => {
    it('should validate valid reset data', () => {
      const validData = {
        token: 'valid-token',
        password: 'NewPassword123',
      };

      const result = passwordResetSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const data = {
        token: '',
        password: 'NewPassword123',
      };

      const result = passwordResetSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should apply password validation rules', () => {
      const data = {
        token: 'valid-token',
        password: 'weak',
      };

      const result = passwordResetSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate valid change password data', () => {
      const validData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
      };

      const result = changePasswordSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject empty current password', () => {
      const data = {
        currentPassword: '',
        newPassword: 'NewPassword123',
      };

      const result = changePasswordSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should apply password validation rules to new password', () => {
      const data = {
        currentPassword: 'OldPassword123',
        newPassword: 'weak',
      };

      const result = changePasswordSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });
});

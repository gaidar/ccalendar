import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  renderTemplate,
  escapeHtml,
  validateTemplateData,
} from '../../../src/services/email/templateRenderer.js';

// Mock the logger to suppress warnings during tests
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe('templateRenderer', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      );
    });

    it('should escape ampersand', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape single quotes', () => {
      expect(escapeHtml("It's cool")).toBe('It&#39;s cool');
    });

    it('should return empty string for empty input', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should not modify text without special characters', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('renderTemplate', () => {
    it('should substitute simple variables', () => {
      const template = 'Hello, {{name}}!';
      const result = renderTemplate(template, { name: 'John' });
      expect(result).toBe('Hello, John!');
    });

    it('should substitute multiple variables', () => {
      const template = '{{greeting}}, {{name}}! Welcome to {{app}}.';
      const result = renderTemplate(template, {
        greeting: 'Hello',
        name: 'Jane',
        app: 'Country Calendar',
      });
      expect(result).toBe('Hello, Jane! Welcome to Country Calendar.');
    });

    it('should replace missing variables with empty string', () => {
      const template = 'Hello, {{name}}! Your email is {{email}}.';
      const result = renderTemplate(template, { name: 'John' });
      expect(result).toBe('Hello, John! Your email is .');
    });

    it('should escape HTML in variable values by default', () => {
      const template = 'Message: {{message}}';
      const result = renderTemplate(template, {
        message: '<script>alert("XSS")</script>',
      });
      expect(result).toBe(
        'Message: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      );
    });

    it('should not escape URLs', () => {
      const template = 'Visit: {{url}}';
      const result = renderTemplate(template, {
        url: 'https://example.com/path?query=value',
      });
      expect(result).toBe('Visit: https://example.com/path?query=value');
    });

    it('should not escape mailto links', () => {
      const template = 'Email: {{email}}';
      const result = renderTemplate(template, {
        email: 'mailto:test@example.com',
      });
      expect(result).toBe('Email: mailto:test@example.com');
    });

    it('should handle number values', () => {
      const template = 'You have {{count}} records.';
      const result = renderTemplate(template, { count: 42 });
      expect(result).toBe('You have 42 records.');
    });

    it('should handle boolean values', () => {
      const template = 'Status: {{active}}';
      const result = renderTemplate(template, { active: true });
      expect(result).toBe('Status: true');
    });

    it('should skip escaping when disabled', () => {
      const template = 'Content: {{html}}';
      const result = renderTemplate(
        template,
        { html: '<strong>Bold</strong>' },
        { escapeHtml: false }
      );
      expect(result).toBe('Content: <strong>Bold</strong>');
    });
  });

  describe('validateTemplateData', () => {
    it('should return valid when all required vars are present', () => {
      const result = validateTemplateData(
        ['name', 'email'],
        { name: 'John', email: 'john@example.com' }
      );
      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('should return invalid when vars are missing', () => {
      const result = validateTemplateData(
        ['name', 'email', 'phone'],
        { name: 'John' }
      );
      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(['email', 'phone']);
    });

    it('should treat null as missing', () => {
      const result = validateTemplateData(
        ['name'],
        { name: null }
      );
      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(['name']);
    });

    it('should treat undefined as missing', () => {
      const result = validateTemplateData(
        ['name'],
        { name: undefined }
      );
      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(['name']);
    });

    it('should accept empty string as present', () => {
      const result = validateTemplateData(
        ['name'],
        { name: '' }
      );
      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });
  });
});

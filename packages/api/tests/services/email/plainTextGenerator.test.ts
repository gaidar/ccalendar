import { describe, it, expect } from 'vitest';
import { generatePlainText } from '../../../src/services/email/plainTextGenerator.js';

describe('plainTextGenerator', () => {
  describe('generatePlainText', () => {
    it('should strip HTML tags', () => {
      const html = '<p>Hello <strong>World</strong>!</p>';
      const result = generatePlainText(html);
      expect(result).toBe('Hello World!');
    });

    it('should convert <br> to newlines', () => {
      const html = 'Line 1<br>Line 2<br/>Line 3<br />Line 4';
      const result = generatePlainText(html);
      expect(result).toBe('Line 1\nLine 2\nLine 3\nLine 4');
    });

    it('should convert block elements to newlines', () => {
      const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
      const result = generatePlainText(html);
      expect(result).toContain('Paragraph 1');
      expect(result).toContain('Paragraph 2');
    });

    it('should convert links to "text (url)" format', () => {
      const html = '<a href="https://example.com">Click here</a>';
      const result = generatePlainText(html);
      expect(result).toBe('Click here (https://example.com)');
    });

    it('should just show URL if link text matches URL', () => {
      const html = '<a href="https://example.com">https://example.com</a>';
      const result = generatePlainText(html);
      expect(result).toBe('https://example.com');
    });

    it('should convert hr to separator', () => {
      const html = 'Section 1<hr>Section 2';
      const result = generatePlainText(html);
      expect(result).toContain('---');
    });

    it('should decode common HTML entities', () => {
      const html = '&nbsp;&amp;&lt;&gt;&quot;&#39;&copy;';
      const result = generatePlainText(html);
      // Note: Leading space is trimmed by the function
      expect(result).toBe('&<>"\'(c)');
    });

    it('should decode numeric HTML entities', () => {
      const html = '&#65;&#66;&#67;'; // ABC
      const result = generatePlainText(html);
      expect(result).toBe('ABC');
    });

    it('should decode hex HTML entities', () => {
      const html = '&#x41;&#x42;&#x43;'; // ABC
      const result = generatePlainText(html);
      expect(result).toBe('ABC');
    });

    it('should normalize multiple spaces', () => {
      const html = 'Hello    World';
      const result = generatePlainText(html);
      expect(result).toBe('Hello World');
    });

    it('should normalize multiple newlines', () => {
      const html = 'Line 1<br><br><br><br>Line 2';
      const result = generatePlainText(html);
      expect(result).not.toContain('\n\n\n');
    });

    it('should trim whitespace', () => {
      const html = '  <p>  Hello  </p>  ';
      const result = generatePlainText(html);
      expect(result).toBe('Hello');
    });

    it('should handle empty string', () => {
      const result = generatePlainText('');
      expect(result).toBe('');
    });

    it('should handle complex email structure', () => {
      const html = `
        <div>
          <h1>Welcome!</h1>
          <p>Hello <strong>John</strong>,</p>
          <p>Click the button below:</p>
          <a href="https://example.com/confirm">Confirm Email</a>
          <hr>
          <p>Best regards,<br>The Team</p>
        </div>
      `;
      const result = generatePlainText(html);
      expect(result).toContain('Welcome!');
      expect(result).toContain('Hello John');
      expect(result).toContain('Confirm Email (https://example.com/confirm)');
      expect(result).toContain('---');
      expect(result).toContain('Best regards,');
      expect(result).toContain('The Team');
    });
  });
});

import { logger } from '../../utils/logger.js';

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Renders a template string by substituting {{variable}} placeholders
 * with values from the provided data object.
 *
 * @param template - The template string with {{variable}} placeholders
 * @param data - Object containing variable values
 * @param options - Optional settings for rendering
 * @returns The rendered template string
 */
export function renderTemplate(
  template: string,
  data: Record<string, string | number | boolean | undefined>,
  options: { escapeHtml?: boolean } = {}
): string {
  const { escapeHtml: shouldEscape = true } = options;

  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = data[key];

    if (value === undefined || value === null) {
      logger.warn(`Missing template variable: ${key}`);
      return '';
    }

    const stringValue = String(value);

    // Escape HTML unless it's a URL (contains :// or starts with mailto:)
    if (
      shouldEscape &&
      !stringValue.includes('://') &&
      !stringValue.startsWith('mailto:')
    ) {
      return escapeHtml(stringValue);
    }

    return stringValue;
  });
}

/**
 * Validates that all required variables are present in the data object
 */
export function validateTemplateData(
  requiredVars: string[],
  data: Record<string, unknown>
): { valid: boolean; missing: string[] } {
  const missing = requiredVars.filter(
    (varName) => data[varName] === undefined || data[varName] === null
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

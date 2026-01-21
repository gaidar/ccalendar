/**
 * Converts HTML email content to plain text
 *
 * Features:
 * - Strips HTML tags while preserving content
 * - Converts links to "text (url)" format
 * - Preserves line breaks and spacing
 * - Handles common HTML entities
 */
export function generatePlainText(html: string): string {
  let text = html;

  // Convert <br>, <br/>, <br /> to newlines
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // Convert block elements to newlines
  text = text.replace(/<\/?(p|div|h[1-6]|tr|li)(\s[^>]*)?>/gi, '\n');

  // Convert <hr> to horizontal separator
  text = text.replace(/<hr(\s[^>]*)?>/gi, '\n---\n');

  // Convert links: <a href="url">text</a> -> text (url)
  text = text.replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, (_, url, linkText) => {
    const cleanText = linkText.replace(/<[^>]*>/g, '').trim();
    if (cleanText && cleanText !== url) {
      return `${cleanText} (${url})`;
    }
    return url;
  });

  // Convert button-style links with special handling
  text = text.replace(
    /<a\s+[^>]*href=["']([^"']*)["'][^>]*class=["'][^"']*button[^"']*["'][^>]*>(.*?)<\/a>/gi,
    (_, url, linkText) => {
      const cleanText = linkText.replace(/<[^>]*>/g, '').trim();
      return `\n[ ${cleanText} ]\n${url}\n`;
    }
  );

  // Strip remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&copy;': '(c)',
    '&mdash;': '--',
    '&ndash;': '-',
    '&bull;': '*',
    '&hellip;': '...',
  };

  for (const [entity, replacement] of Object.entries(entities)) {
    text = text.replace(new RegExp(entity, 'gi'), replacement);
  }

  // Decode numeric HTML entities
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));

  // Normalize whitespace
  // Replace multiple spaces with single space
  text = text.replace(/[ \t]+/g, ' ');

  // Replace 3+ newlines with 2 newlines
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim each line
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  // Trim overall
  text = text.trim();

  return text;
}

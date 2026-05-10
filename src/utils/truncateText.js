/**
 * Truncate text to a given character limit, appending "...".
 * @param {string} text
 * @param {number} [limit=120]
 */
export const truncateText = (text = '', limit = 120) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + '…';
};

/**
 * Strip HTML tags from a string (for excerpt generation).
 * @param {string} html
 */
export const stripHtml = (html = '') =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

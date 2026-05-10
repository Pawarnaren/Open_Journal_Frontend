import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string or Date object to a human-readable string.
 * @param {string|Date} date
 * @param {string} [fmt='MMM d, yyyy']
 */
export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
  } catch {
    return String(date);
  }
};

/**
 * Returns a relative time string like "3 hours ago".
 * @param {string|Date} date
 */
export const timeAgo = (date) => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '';
  }
};

/**
 * Estimate read time for a given text (avg 200 wpm).
 * @param {string} text
 * @returns {string} e.g. "4 min read"
 */
export const readTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
};

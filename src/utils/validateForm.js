/**
 * Client-side form validators.
 * Each returns undefined (valid) or an error string.
 */

export const required = (value) =>
  value?.toString().trim() ? undefined : 'This field is required';

export const minLength = (min) => (value) =>
  !value || value.length < min ? `Minimum ${min} characters required` : undefined;

export const maxLength = (max) => (value) =>
  value && value.length > max ? `Maximum ${max} characters allowed` : undefined;

export const validEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? '') ? undefined : 'Enter a valid email address';

export const minPassword = (value) =>
  !value || value.length < 6 ? 'Password must be at least 6 characters' : undefined;

export const passwordsMatch = (password) => (confirm) =>
  confirm !== password ? 'Passwords do not match' : undefined;

/** Combine multiple validators and return the first error */
export const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined);

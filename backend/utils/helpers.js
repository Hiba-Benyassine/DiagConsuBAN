// utils/helpers.js
// Simple utility functions used across the backend

/**
 * Formats a JavaScript Date object into a readable string (YYYY-MM-DD HH:mm:ss).
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string.
 */
function formatDate(date) {
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Generates a random alphanumeric string of given length.
 * Useful for simple IDs or tokens (non‑secure).
 * @param {number} length - Desired length of the string.
 * @returns {string}
 */
function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
  formatDate,
  randomString,
};
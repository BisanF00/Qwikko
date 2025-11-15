/**
 * ===============================
 * String Helpers
 * ===============================
 * @module stringHelpers
 * @desc Utility functions for string manipulation.
 */

/**
 * Generate a URL-friendly slug from a store name
 * 
 * Converts the input string to lowercase, trims whitespace, replaces
 * spaces and non-alphanumeric characters with hyphens, and removes
 * leading or trailing hyphens.
 * 
 * @function generateSlug
 * @param {string} storeName - The original store name
 * @returns {string} URL-friendly slug
 * 
 * @example
 * const { generateSlug } = require('./stringHelpers');
 * const slug = generateSlug("My Awesome Store!");
 * console.log(slug); // "my-awesome-store"
 */
module.exports = function generateSlug(storeName) {
  return storeName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')  // Replace spaces and symbols with "-"
    .replace(/^-+|-+$/g, '');     // Remove "-" from start and end
}


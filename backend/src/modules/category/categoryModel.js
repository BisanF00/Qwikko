const pool = require('../../config/db');

/**
 * @module CategoryModel
 * @desc Handles database operations related to categories.
 */
 
/**
 * @function getAllCategories
 * @async
 * @desc Fetches all categories from the "categories" table.
 *
 * @returns {Promise<Array<Object>>} Returns an array of category objects.
 *
 * @example
 * const categories = await CategoryModel.getAllCategories();
 * console.log(categories);
 */
exports.getAllCategories = async () => {
  const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
  return result.rows;
};

/**
 * @function getCategoryById
 * @async
 * @desc Fetches a single category by its ID.
 *
 * @param {number} categoryId - The ID of the category to fetch
 * @returns {Promise<Object|null>} Returns the category object or null if not found
 *
 * @example
 * const category = await CategoryModel.getCategoryById(1);
 * console.log(category);
 */
exports.getCategoryById = async (categoryId) => {
  const result = await pool.query('SELECT * FROM categories WHERE id=$1', [categoryId]);
  return result.rows[0] || null;
};

/**
 * @function insertCategory
 * @async
 * @desc Inserts a new category into the database.
 *
 * @param {Object} categoryData - Data for the new category
 * @param {string} categoryData.name - Name of the category
 * @param {string} [categoryData.description] - Optional description
 *
 * @returns {Promise<Object>} Returns the inserted category object
 */
exports.insertCategory = async (categoryData) => {
  const { name, parent_id } = categoryData;
  const result = await pool.query(
    'INSERT INTO categories (name, parent_id) VALUES ($1, $2) RETURNING *',
    [name, parent_id || null]
  );
  return result.rows[0];
};

/**
 * @function updateCategory
 * @async
 * @desc Updates an existing category by ID.
 *
 * @param {number} categoryId - The ID of the category to update
 * @param {Object} categoryData - New data for the category
 * @param {string} [categoryData.name] - New name
 * @param {string} [categoryData.description] - New description
 *
 * @returns {Promise<Object|null>} Returns the updated category object or null if not found
 */
exports.updateCategory = async (categoryId, categoryData) => {
  const { name, parent_id } = categoryData;
  const result = await pool.query(
    'UPDATE categories SET name=$1, parent_id=$2, updated_at=NOW() WHERE id=$3 RETURNING *',
    [name, parent_id || null, categoryId]
  );
  return result.rows[0] || null;
};

/**
 * @function deleteCategory
 * @async
 * @desc Deletes a category by ID.
 *
 * @param {number} categoryId - The ID of the category to delete
 * @returns {Promise<boolean>} Returns true if deleted, false otherwise
 */
exports.deleteCategory = async (categoryId) => {
  const result = await pool.query('DELETE FROM categories WHERE id=$1 RETURNING *', [categoryId]);
  return result.rows.length > 0;
};

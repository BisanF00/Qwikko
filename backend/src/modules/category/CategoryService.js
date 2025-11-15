const CategoryModel = require('./categoryModel');

/**
 * @module CategoryService
 * @desc Contains business logic and service-level operations for categories.
 */

/**
 * @function listCategories
 * @desc Retrieves all categories from the database.
 *
 * @returns {Promise<Array<Object>>} Array of category objects
 */
exports.listCategories = async () => {
  return await CategoryModel.getAllCategories();
};

/**
 * @function getCategory
 * @desc Retrieves a category by ID.
 *
 * @param {number} categoryId - ID of the category
 * @returns {Promise<Object>} Category object
 * @throws {Error} Throws error if category not found
 */
exports.getCategory = async (categoryId) => {
  const category = await CategoryModel.getCategoryById(categoryId);
  if (!category) throw new Error('Category not found');
  return category;
};

/**
 * @function createCategory
 * @desc Creates a new category.
 *
 * @param {Object} data - Category data
 * @param {string} data.name - Name of the category
 * @param {string} [data.description] - Optional description
 * @returns {Promise<Object>} Created category object
 */
exports.createCategory = async (data) => {
  return await CategoryModel.insertCategory(data);
};

/**
 * @function modifyCategory
 * @desc Updates an existing category by ID.
 *
 * @param {number} categoryId - ID of the category
 * @param {Object} data - Updated category data
 * @returns {Promise<Object>} Updated category object
 * @throws {Error} Throws error if category not found
 */
exports.modifyCategory = async (categoryId, data) => {
  const updated = await CategoryModel.updateCategory(categoryId, data);
  if (!updated) throw new Error('Category not found');
  return updated;
};

/**
 * @function removeCategory
 * @desc Deletes a category by ID.
 *
 * @param {number} categoryId - ID of the category
 * @returns {Promise<void>}
 * @throws {Error} Throws error if category not found
 */
exports.removeCategory = async (categoryId) => {
  const deleted = await CategoryModel.deleteCategory(categoryId);
  if (!deleted) throw new Error('Category not found');
};

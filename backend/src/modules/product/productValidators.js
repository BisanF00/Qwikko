/**
 * ===============================
 * Product Validators
 * ===============================
 * @module ProductValidators
 * @desc Middleware to validate product input data before creating a new product.
 */

/**
 * Validate the request body for creating a product.
 * Ensures that required fields 'name' and 'price' are present and valid.
 *
 * @function createProductValidator
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing product data
 * @param {string} req.body.name - Name of the product (required)
 * @param {number} req.body.price - Price of the product (required, must be a number)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if validation passes, otherwise sends a 400 response with an error message
 *
 * @example
 * // Example usage in routes:
 * router.post("/products", createProductValidator, productController.createProduct);
 */
exports.createProductValidator = (req, res, next) => {
  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ message: "Price must be a number" });
  }

  next();
};

const productModel = require("./productModel");

/**
 * @module ProductService
 * @desc Handles business logic for products including creation, updating, and deletion.
 *       Interfaces with the productModel for database operations.
 */

/**
 * Create a new product for a vendor.
 *
 * @async
 * @function createProduct
 * @param {number} vendor_id - ID of the vendor creating the product
 * @param {Object} body - Product data including name, description, price, stock_quantity, category_id, images, variants
 * @returns {Promise<Object>} Created product
 * @throws {Error} If the database insertion fails
 *
 * @example
 * const product = await createProduct(1, { name: "T-Shirt", price: 25, stock_quantity: 50, category_id: 2 });
 */
exports.createProduct = async (vendor_id, body) => {
  const now = new Date();

  const productData = {
    ...body,
    vendor_id,
    created_at: now,
    updated_at: now,
  };

  const product = await productModel.insertProduct(productData);
  if (!product) throw new Error("Failed to create product");
  return product;
};

/**
 * Update an existing product for a vendor.
 *
 * @async
 * @function updateProduct
 * @param {number} vendor_id - ID of the vendor updating the product
 * @param {number} productId - ID of the product to update
 * @param {Object} body - Updated product data
 * @returns {Promise<Object>} Updated product
 * @throws {Error} If product not found or update fails
 *
 * @example
 * const updated = await updateProduct(1, 10, { price: 30 });
 */
exports.updateProduct = async (id, vendor_id, body, currentData) => {
  const updatedProduct = await productModel.updateProduct(id, vendor_id, {
    name: body.name ?? currentData.name,
    description: body.description ?? currentData.description,
    price: body.price ?? currentData.price,
    stock_quantity: body.stock_quantity ?? currentData.stock_quantity,
    images: body.images ?? currentData.images,
    category_id: body.category_id ?? currentData.category_id,
    variants: body.variants ?? currentData.variants,
  });

  if (!updatedProduct) throw new Error("Product not found or unauthorized");
  return updatedProduct;
};


/**
 * Delete a product for a vendor.
 *
 * @async
 * @function deleteProduct
 * @param {number} vendor_id - ID of the vendor deleting the product
 * @param {number} productId - ID of the product to delete
 * @returns {Promise<void>} Resolves when deletion is complete
 * @throws {Error} If product not found or deletion fails
 *
 * @example
 * await deleteProduct(1, 10);
 */
exports.deleteProduct = async (vendor_id, productId) => {
  await productModel.deleteProduct( vendor_id,productId);
};

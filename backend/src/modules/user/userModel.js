/**
 * ===============================
 * User Model
 * ===============================
 * @module UserModel
 * @desc Database operations for users, customers, vendors, delivery companies,
 *       and user-related FCM tokens.
 */

const pool = require('../../config/db');
const { generateSlug } = require('../../utils/stringHelpers');

/**
 * Insert a new user into the users table
 * @async
 * @function insertUser
 * @param {Object} userData - User data
 * @param {string} userData.name - Full name of the user
 * @param {string} userData.email - Email address
 * @param {string} userData.phone - Phone number
 * @param {string} userData.password_hash - Hashed password
 * @param {string} userData.role - Role of the user (customer/vendor/delivery)
 * @param {string} [userData.address] - Optional address
 * @returns {Promise<Object>} Newly created user record
 */
exports.insertUser = async ({ name, email, phone, password_hash, role, address }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role, address, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) RETURNING *`,
    [name, email, phone, password_hash, role, address]
  );
  return rows[0];
};

/**
 * Insert a new customer record linked to a user
 * @async
 * @function insertCustomer
 * @param {Object} customerData
 * @param {number|string} customerData.user_id - ID of the user
 * @returns {Promise<Object>} Newly created customer record
 */
exports.insertCustomer = async ({ user_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO customers (user_id, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *`,
    [user_id]
  );
  return rows[0];
};

/**
 * Insert a new vendor record linked to a user
 * @async
 * @function insertVendor
 * @param {Object} vendorData
 * @param {number|string} vendorData.user_id - ID of the user
 * @param {string} vendorData.store_name - Vendor store name
 * @param {string} [vendorData.description] - Optional description of the store
 * @returns {Promise<Object>} Newly created vendor record
 */
exports.insertVendor = async ({ user_id, store_name, description }) => {
  const store_slug = generateSlug(store_name);

  const { rows } = await pool.query(
    `INSERT INTO vendors (user_id, store_name, store_slug, description, created_at, updated_at) 
     VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING *`,
    [user_id, store_name, store_slug, description]
  );
  return rows[0];
};

/**
 * Insert a new delivery company record linked to a user
 * @async
 * @function insertDelivery
 * @param {Object} deliveryData
 * @param {number|string} deliveryData.user_id - ID of the user
 * @param {string} deliveryData.company_name - Name of the delivery company
 * @returns {Promise<Object>} Newly created delivery company record
 */
exports.insertDelivery = async ({ user_id, company_name }) => {
  const { rows } = await pool.query(
    `INSERT INTO delivery_companies (user_id, company_name, created_at, updated_at) VALUES ($1,$2,NOW(),NOW()) RETURNING *`,
    [user_id, company_name]
  );
  return rows[0];
};

/**
 * Update the FCM token for a specific user
 * @async
 * @function updateFcmToken
 * @param {number|string} userId - ID of the user
 * @param {string} fcmToken - New FCM token to be saved
 * @returns {Promise<Object>} Returns the updated user record
 */
exports.updateFcmToken = async (userId, fcmToken) => {
  const result = await pool.query(
    "UPDATE users SET fcm_token = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [fcmToken, userId]
  );
  return result.rows[0];
};

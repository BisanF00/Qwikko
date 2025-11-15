const pool = require("../../config/db");

/**
 * ===============================
 * Notification Model
 * ===============================
 * @module NotificationModel
 * @desc Database operations for notifications.
 */

/**
 * Insert a new notification into the database.
 * @async
 * @param {number} userId - ID of the user to receive the notification
 * @param {Object} payload - Notification details
 * @param {string} payload.title - Notification title
 * @param {string} payload.message - Notification body
 * @param {string} [payload.type="general"] - Type of notification
 * @returns {Promise<Object>} Newly created notification record
 */
exports.insertNotification = async (userId, { title, message, type }) => {
  const { rows } = await pool.query(
    `INSERT INTO notifications (user_id, title, message, type, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [userId, title, message, type || "general"]
  );
  return rows[0];
};

/**
 * Retrieve all notifications for a specific user.
 * @async
 * @param {number} userId - ID of the user
 * @returns {Promise<Array>} Array of notification objects
 */
exports.getNotificationsByUserId = async (userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

const fcmModel = require("./userService");

/**
 * ===============================
 * User FCM Token Controller
 * ===============================
 * @module FCMController
 * @desc Controller for handling user FCM token updates.
 */

/**
 * Update a user's FCM token
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string|number} req.params.id - User ID
 * @param {Object} req.body - Request body
 * @param {string} req.body.fcmToken - New FCM token
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success or error message
 */
exports.updateFcmToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ error: "fcmToken is required" });
    }

    const updatedUser = await fcmModel.updateFcmToken(id, fcmToken);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "FCM token updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating FCM token:", err);
    res.status(500).json({ error: err.message });
  }
};

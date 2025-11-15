const { body, validationResult } = require('express-validator');

/**
 * @module AuthValidators
 * @desc Middleware functions to validate user registration and login inputs.
 */

/**
 * @middleware validateRegister
 * @desc Validates registration data for all user roles (customer, vendor, delivery).
 *       - Ensures `name` is provided
 *       - Ensures `email` is valid
 *       - Ensures `password` is at least 6 characters long
 *       - Returns 400 with detailed error messages if validation fails
 *
 * @example
 * const express = require('express');
 * const router = express.Router();
 * const authController = require('./authController');
 * const { validateRegister } = require('./authValidators');
 *
 * router.post('/register/customer', validateRegister, authController.registerUser);
 *
 * @returns {Function} Express middleware function
 */
exports.validateRegister = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

/**
 * @middleware validateLogin
 * @desc Validates login data for all users.
 *       - Ensures `email` is valid
 *       - Ensures `password` is provided
 *       - Returns 400 with detailed error messages if validation fails
 *
 * @example
 * const express = require('express');
 * const router = express.Router();
 * const authController = require('./authController');
 * const { validateLogin } = require('./authValidators');
 *
 * router.post('/login', validateLogin, authController.login);
 *
 * @returns {Function} Express middleware function
 */
exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

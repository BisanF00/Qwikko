const express = require('express');
const router = express.Router();
const categoryController = require('./categoryController');
const { protect, authorizeRole } = require('../../middleware/authMiddleware');

/**
 * @module CategoryRoutes
 * @desc Express routes for managing categories
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints for managing categories
 */

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Admin-protected routes
router.post('/', protect, authorizeRole('admin'), categoryController.createCategory);
router.put('/:id', protect, authorizeRole('admin'), categoryController.updateCategory);
router.delete('/:id', protect, authorizeRole('admin'), categoryController.deleteCategory);

module.exports = router;

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Electronics
 *                       description:
 *                         type: string
 *                         example: Electronic items
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Electronic items
 *     responses:
 *       201:
 *         description: Category created successfully
 *   put:
 *     summary: Update a category by ID (Admin only)
 *     tags: [Categories]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *   delete:
 *     summary: Delete a category by ID (Admin only)
 *     tags: [Categories]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
*/
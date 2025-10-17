const express = require('express');
const ProductController = require('../controllers/product.controller');
const { validateBody, createProductSchema, updateProductSchema } = require('../validators/product.validator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Operations on products
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: "Create a new product"
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 */
router.post('/products', validateBody(createProductSchema), ProductController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: "Update a product"
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *   get:
 *     summary: "Get a product by ID"
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: "Search/list products"
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter products by name
 *       - in: query
 *         name: sku
 *         schema:
 *           type: string
 *         description: Filter products by SKU
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.patch('/products/:id', validateBody(updateProductSchema), ProductController.updateProduct);
router.get('/products/:id', ProductController.getProductById);
router.get('/products', ProductController.searchProducts);

module.exports = router;

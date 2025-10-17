const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Operations on orders
 *   - name: Internal
 *     description: Internal endpoints for Lambda orchestrator
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: "Create a new order"
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 */
router.post('/orders', orderController.create.bind(orderController));

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: "List/search orders (requires Authorization token)"
 *     tags: [Orders]
 *     security:
 *       - ServiceToken: []
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: integer
 *         description: Filter orders by customer ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/orders', orderController.search.bind(orderController));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: "Get order by ID"
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get('/orders/:id', orderController.getById.bind(orderController));

/**
 * @swagger
 * /orders/{id}/confirm:
 *   post:
 *     summary: "Confirm an order (requires X-Idempotency-Key header)"
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: X-Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique key to ensure idempotency
 *     responses:
 *       200:
 *         description: Order confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 */
router.post('/orders/:id/confirm', orderController.confirm.bind(orderController));

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     summary: "Cancel an order"
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order canceled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 */
router.post('/orders/:id/cancel', orderController.cancel.bind(orderController));

module.exports = router;

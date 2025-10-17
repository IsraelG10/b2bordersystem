const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/orders', orderController.create.bind(orderController));
router.get('/orders/:id', orderController.getById.bind(orderController));
router.get('/orders', orderController.search.bind(orderController));
router.post('/orders/:id/confirm', orderController.confirm.bind(orderController));
router.post('/orders/:id/cancel', orderController.cancel.bind(orderController));


module.exports = router;

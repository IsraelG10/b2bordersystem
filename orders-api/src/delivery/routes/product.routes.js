const express = require('express');
const ProductController = require('../controllers/product.controller');
const { validateBody, createProductSchema, updateProductSchema } = require('../validators/product.validator');

const router = express.Router();

router.post('/products', validateBody(createProductSchema), ProductController.createProduct);
router.patch('/products/:id', validateBody(updateProductSchema), ProductController.updateProduct);
router.get('/products/:id', ProductController.getProductById);
router.get('/products', ProductController.searchProducts);

module.exports = router;

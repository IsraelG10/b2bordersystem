const express = require('express');
const errorHandler = require('./delivery/middleware/errorHandler');
const productRoutes = require('./delivery/routes/product.routes');
const orderRoutes = require('./delivery/routes/order.routes');

const app = express();
app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use(errorHandler);

module.exports = app;

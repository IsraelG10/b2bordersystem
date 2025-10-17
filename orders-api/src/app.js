const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const errorHandler = require('./delivery/middleware/errorHandler');
const productRoutes = require('./delivery/routes/product.routes');
const orderRoutes = require('./delivery/routes/order.routes');

const app = express();
app.use(express.json());

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.use(errorHandler);

module.exports = app;

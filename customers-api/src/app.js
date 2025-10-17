const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const customerRoutes = require('./delivery/routes/customer.routes');
const errorHandler = require('./delivery/middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api', customerRoutes);
app.use(errorHandler);

module.exports = app;

const express = require('express');
const customerRoutes = require('./delivery/routes/customer.routes');
const errorHandler = require('./delivery/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api', customerRoutes);
app.use(errorHandler);

module.exports = app;

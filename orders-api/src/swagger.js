const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders API - B2B System',
      version: '1.0.0',
      description: 'API to manage orders and products in the B2B system',
    },
    servers: [
      { url: 'http://localhost:3002' },
    ],
    components: {
      securitySchemes: {
        ServiceToken: {
          type: 'apiKey',
          in: 'header',
          name: 'ServiceToken',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            sku: { type: 'string', example: 'PROD-001' },
            name: { type: 'string', example: 'Laptop XYZ' },
            price_cents: { type: 'integer', example: 150000 },
            stock: { type: 'integer', example: 10 },
            created_at: { type: 'string', format: 'date-time', example: '2025-10-16T14:00:00Z' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            customer_id: { type: 'integer', example: 123 },
            status: { type: 'string', example: 'CREATED' },
            total_cents: { type: 'integer', example: 25075 },
            created_at: { type: 'string', format: 'date-time', example: '2025-10-16T14:00:00Z' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            order_id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 456 },
            qty: { type: 'integer', example: 2 },
            unit_price_cents: { type: 'integer', example: 5050 },
            subtotal_cents: { type: 'integer', example: 10100 },
            created_at: { type: 'string', format: 'date-time', example: '2025-10-16T14:00:00Z' },
          },
        },
        IdempotencyKey: {
          type: 'object',
          properties: {
            idempotency_key: { type: 'string', example: 'abc123' },
            target_type: { type: 'string', example: 'order' },
            target_id: { type: 'integer', example: 1 },
            status: { type: 'string', example: 'completed' },
            response_body: { type: 'object' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, 'delivery/routes/*.js')],
};

const specs = swaggerJsdoc(options);
module.exports = specs;

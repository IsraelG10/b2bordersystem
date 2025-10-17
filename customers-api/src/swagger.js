const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customers API - B2B System',
      version: '1.0.0',
      description: 'API to manage customers in the B2B system',
    },
    servers: [
      { url: 'http://localhost:3001' }, // Cambia el puerto según tu Customers API
    ],
    components: {
      securitySchemes: {
        ServiceToken: { type: 'apiKey', in: 'header', name: 'ServiceToken' },
      },
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'ACME Corp' },
            email: { type: 'string', example: 'contact@acme.com' },
            phone: { type: 'string', example: '+593987654321' },
            created_at: { type: 'string', format: 'date-time', example: '2025-10-16T14:00:00Z' },
          },
        },
      },
    },
  },
  // 👈 Escanea tus rutas de Customers
  apis: [path.join(__dirname, 'delivery/routes/*.js')],
};

const specs = swaggerJsdoc(options);
module.exports = specs;

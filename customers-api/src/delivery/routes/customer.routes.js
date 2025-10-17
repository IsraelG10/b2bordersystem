const express = require('express');
const router = express.Router();

const CustomerRepository = require('../../infrastructure/customer.repository');
const CustomerUseCases = require('../../usecases/customer.usecases');
const CustomerController = require('../controllers/customer.controller');

const customerRepo = new CustomerRepository();
const customerUseCases = new CustomerUseCases(customerRepo);
const customerController = new CustomerController(customerUseCases);

/**
 * @swagger
 * tags:
 *   - name: Customers
 *     description: Operaciones sobre clientes
 *   - name: Internal
 *     description: Endpoints internos para comunicación con Lambda
 */

/**
 * POST /customers
 * @swagger
 * /customers:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/customers', customerController.createCustomer);

/**
 * /customers/{id} (GET, PUT, DELETE)
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Obtiene un cliente por ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID único del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Cliente no encontrado
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       400:
 *         description: Datos de entrada inválidos
 *   delete:
 *     summary: Elimina (soft delete) un cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente a eliminar
 *     responses:
 *       204:
 *         description: Cliente eliminado exitosamente (no devuelve contenido)
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/customers/:id', customerController.getCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

/**
 * GET /customers (Search)
 * @swagger
 * /customers:
 *   get:
 *     summary: Lista clientes con filtros opcionales
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de cliente (parcial)
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get('/customers', customerController.searchCustomers);

/**
 * GET /internal/customers/{id} (Interno)
 * @swagger
 * /internal/customers/{id}:
 *   get:
 *     summary: "[INTERNO] Obtiene los detalles de un cliente (requiere Authorization token)"
 *     tags: [Customers, Internal]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID único del cliente
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token para autorización
 *     responses:
 *       200:
 *         description: Detalles del cliente encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Token de servicio no válido
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/internal/customers/:id', (req, res, next) => {
  const token = req.headers['authorization']; // extraemos el token del header
  req.serviceToken = token; // opcional: pasarlo al controller
  return customerController.getInternalCustomer(req, res, next);
});

module.exports = router;

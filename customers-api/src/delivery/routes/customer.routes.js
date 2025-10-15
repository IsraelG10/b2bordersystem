const express = require('express');
const router = express.Router();

const CustomerRepository = require('../../infrastructure/customer.repository');
const CustomerUseCases = require('../../usecases/customer.usecases');
const CustomerController = require('../controllers/customer.controller');

const customerRepo = new CustomerRepository();
const customerUseCases = new CustomerUseCases(customerRepo);
const customerController = new CustomerController(customerUseCases);

router.post('/customers', customerController.createCustomer);
router.get('/customers/:id', customerController.getCustomer);
router.get('/customers', customerController.searchCustomers);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);
router.get('/internal/customers/:id', customerController.getInternalCustomer);

module.exports = router;

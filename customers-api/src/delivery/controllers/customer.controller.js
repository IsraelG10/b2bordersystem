const { createCustomerSchema, updateCustomerSchema } = require('../validators/customer.validator');

class CustomerController {
  constructor(customerUseCases) {
    this.customerUseCases = customerUseCases;
    this.createCustomer = this.createCustomer.bind(this);
    this.getCustomer = this.getCustomer.bind(this);
    this.searchCustomers = this.searchCustomers.bind(this);
    this.updateCustomer = this.updateCustomer.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
    this.getInternalCustomer = this.getInternalCustomer.bind(this);
  }

  async createCustomer(req, res, next) {
    try {
      const data = createCustomerSchema.parse(req.body);
      const customer = await this.customerUseCases.createCustomer(data);
      res.status(201).json(customer);
    } catch (err) { next(err); }
  }

  async getCustomer(req, res, next) {
    try {
      const customer = await this.customerUseCases.getCustomer(req.params.id);
      res.json(customer);
    } catch (err) { next(err); }
  }

  async searchCustomers(req, res, next) {
    try {
      const { search, cursor, limit } = req.query;
      const customers = await this.customerUseCases.searchCustomers({
        search,
        cursor: cursor ? Number(cursor) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.json(customers);
    } catch (err) { next(err); }
  }

  async updateCustomer(req, res, next) {
    try {
      const data = updateCustomerSchema.parse(req.body);
      const customer = await this.customerUseCases.updateCustomer(req.params.id, data);
      res.json(customer);
    } catch (err) { next(err); }
  }

  async deleteCustomer(req, res, next) {
    try {
      const result = await this.customerUseCases.deleteCustomer(req.params.id);
      res.json(result);
    } catch (err) { next(err); }
  }

  async getInternalCustomer(req, res, next) {
    try {
      const token = req.headers['authorization'];
      if (token !== `Bearer ${process.env.SERVICE_TOKEN}`) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const customer = await this.customerUseCases.getInternalCustomer(req.params.id);
      res.json(customer);
    } catch (err) { next(err); }
  }
}

module.exports = CustomerController;

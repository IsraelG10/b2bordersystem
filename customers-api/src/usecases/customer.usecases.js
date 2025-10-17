class CustomerUseCases {
  constructor(customerRepo) {
    this.customerRepo = customerRepo;
  }

  async createCustomer(data) {
    const existing = await this.customerRepo.findByEmail(data.email);
    if (existing) throw new Error('Email already exists');
    return this.customerRepo.create(data);
  }

  async getCustomer(id) {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new Error('Customer not found');
    return customer;
  }

  async searchCustomers(params) {
    return this.customerRepo.search(params);
  }

  async updateCustomer(id, data) {
    if (data.email) {
      const existing = await this.customerRepo.findByEmail(data.email);
      if (existing && existing.id !== id) throw new Error('Email already exists');
    }
    const updated = await this.customerRepo.update(id, data);
    if (!updated) throw new Error('Customer not found');
    return updated;
  }

  async deleteCustomer(id) {
    return this.customerRepo.delete(id);
  }

  async getInternalCustomer(id) {
    return this.getCustomer(id);
  }
}

module.exports = CustomerUseCases;

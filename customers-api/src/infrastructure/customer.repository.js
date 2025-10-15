const knex = require('./db');
const Customer = require('../domain/customer');

class CustomerRepository {
  async create(customer) {
    const [id] = await knex('customers').insert({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
    const row = await knex('customers').where({ id }).first();
    return new Customer(row);
  }

  async findById(id) {
    const row = await knex('customers').where({ id, deleted_at: null }).first();
    return row ? new Customer(row) : null;
  }

  async findByEmail(email) {
    const row = await knex('customers')
      .where({ email, deleted_at: null })
      .first();
    return row ? new Customer(row) : null;
  }

  async search({ search, cursor, limit }) {
    let query = knex('customers').whereNull('deleted_at');

    if (search) {
      query = query.andWhere(function () {
        this.where('name', 'like', `%${search}%`).orWhere(
          'email',
          'like',
          `%${search}%`
        );
      });
    }

    if (cursor) query = query.andWhere('id', '>', cursor);
    if (limit) query = query.limit(limit);

    const rows = await query.orderBy('id', 'asc');
    return rows.map((row) => new Customer(row));
  }

  async update(id, data) {
    await knex('customers')
      .where({ id, deleted_at: null })
      .update(data);
    const row = await knex('customers').where({ id }).first();
    return row ? new Customer(row) : null;
  }

  async delete(id) {
    await knex('customers')
      .where({ id, deleted_at: null })
      .update({ deleted_at: new Date() });
    return { success: true };
  }
}

module.exports = CustomerRepository;

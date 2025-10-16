const db = require('./db');
const Order = require('../domain/order');

class OrderRepository {
  // Crear una nueva orden
  async create(order) {
    const [id] = await db('orders').insert(order);
    return new Order({ id, ...order });
  }

  // Actualizar una orden (status, total_cents)
  async update(id, data) {
    await db('orders').where({ id }).update(data);
    const updated = await db('orders').where({ id }).first();
    return updated ? new Order(updated) : null;
  }

  async updateStatus(id, status) {
    if (!status) throw new Error('Status is required');
    await db('orders').where({ id }).update({ status });
    const updated = await db('orders').where({ id }).first();
    return updated ? new Order(updated) : null;
  }

  // Obtener orden por ID
  async findById(id) {
    const row = await db('orders').where({ id }).first();
    return row ? new Order(row) : null;
  }

  // Listar órdenes con filtros y paginación
  async search({ status, from, to, cursor = 0, limit = 10 }) {
    const query = db('orders')
      .where('id', '>', cursor)
      .orderBy('id')
      .limit(limit);

    if (status) query.andWhere('status', status);
    if (from) query.andWhere('created_at', '>=', from);
    if (to) query.andWhere('created_at', '<=', to);

    const rows = await query;
    return rows.map(row => new Order(row));
  }

}

module.exports = OrderRepository;

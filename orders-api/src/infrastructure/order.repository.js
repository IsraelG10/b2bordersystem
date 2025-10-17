const db = require('./db');
const Order = require('../domain/order');

class OrderRepository {
  // Crear una nueva orden
  async create(order, trx) {
    const query = trx ? trx('orders') : db('orders');
    const [id] = await query.insert(order);
    return new Order({ id, ...order });
  }

  async update(id, data, trx) {
    const query = trx ? trx('orders') : db('orders');
    await query.where({ id }).update(data); // actualiza
    const updatedRow = await query.where({ id }).first(); // luego consulta
    return updatedRow ? new Order(updatedRow) : null;
  }

  async updateStatus(id, status) {
      if (!status) throw new Error('Status is required');

      // 1. Actualiza
      await db('orders').where({ id }).update({ status });

      // 2. Obtiene la orden actualizada
      const updatedRow = await db('orders').where({ id }).first();
      return updatedRow ? new Order(updatedRow) : null;
  }

  // Obtener orden por ID
  async findById(id, trx) {
    const query = trx ? trx('orders') : db('orders');
    const row = await query.where({ id }).first();
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

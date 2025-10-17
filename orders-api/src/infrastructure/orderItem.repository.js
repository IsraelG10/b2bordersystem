const db = require('./db');
const OrderItem = require('../domain/orderItem');

class OrderItemRepository {
  // Crear múltiples items
  async createMany(items) {
    const ids = await db('order_items').insert(items);
    return items.map((item, idx) => new OrderItem({ id: ids[idx], ...item }));
  }

  // Obtener items de una orden
  async findByOrderId(orderId) {
    const rows = await db('order_items').where({ order_id: orderId });
    return rows.map(row => new OrderItem(row));
  }

  // Actualizar stock o qty si es necesario
  async update(id, data) {
    await db('order_items').where({ id }).update(data);
    const updated = await db('order_items').where({ id }).first();
    return updated ? new OrderItem(updated) : null;
  }
}

module.exports = OrderItemRepository;

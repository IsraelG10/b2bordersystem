const OrderRepository = require('../infrastructure/order.repository');
const OrderItemRepository = require('../infrastructure/orderItem.repository');
const ProductRepository = require('../infrastructure/product.repository');
const IdempotencyKeyRepository = require('../infrastructure/idempotencyKey.repository');
const axios = require('axios');
const db = require('../infrastructure/db');

class OrderUseCase {
  constructor() {
    this.orderRepo = new OrderRepository();
    this.orderItemRepo = new OrderItemRepository();
    this.productRepo = new ProductRepository();
    this.idempotencyRepo = new IdempotencyKeyRepository();
  }

  // Crear orden
  async create({ customer_id, items }) {
    // 1. Validar cliente en Customers API
    try {
      await axios.get(`${process.env.CUSTOMERS_API_URL}/api/internal/customers/${customer_id}`, {
        headers: { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` }
      });
    } catch (err) {
      throw new Error('Customer does not exist');
    }

    // 2. Validar stock y calcular total
    let total_cents = 0;
    const productsToUpdate = [];
    const orderItems = [];

    for (const item of items) {
      const product = await this.productRepo.findById(item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.stock < item.qty) throw new Error(`Insufficient stock for product ${product.id}`);

      total_cents += product.price_cents * item.qty;

      productsToUpdate.push({
        id: product.id,
        newStock: product.stock - item.qty
      });

      orderItems.push({
        product_id: product.id,
        qty: item.qty,
        unit_price_cents: product.price_cents,
        subtotal_cents: product.price_cents * item.qty
      });
    }

    // 3. Crear orden y items en transacción
    let order;
    await db.transaction(async trx => {
      const [orderId] = await trx('orders').insert({
        customer_id,
        status: 'CREATED',
        total_cents
      });

      // Leer la orden dentro de la transacción
      order = await this.orderRepo.findById(orderId, trx);

      if (!order || !order.id) {
        throw new Error('Order creation failed: invalid response');
      }

      for (const item of orderItems) {
        await trx('order_items').insert({
          order_id: orderId,
          ...item
        });
      }

      for (const p of productsToUpdate) {
        await trx('products').where({ id: p.id }).update({ stock: p.newStock });
      }
    });

    return order;
  }

  // Obtener orden por ID incluyendo items
  async getById(id) {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new Error('Order not found');

    const items = await this.orderItemRepo.findByOrderId(id);
    return { ...order, items };
  }

  // Listar órdenes con filtros
  async search(params) {
    return this.orderRepo.search(params);
  }

  // Confirmar orden
    async confirm({ id, idempotencyKey }) {
      const existing = await this.idempotencyRepo.findByKey(idempotencyKey);
      if (existing) return existing.response_body;

      const order = await this.orderRepo.findById(id);
      if (!order) throw new Error('Order not found');
      if (order.status !== 'CREATED') throw new Error('Order cannot be confirmed');

      // Actualizar estado de la orden
      const updatedOrder = await this.orderRepo.updateStatus(id, 'CONFIRMED');

      // Guardar key de idempotencia
      await this.idempotencyRepo.create({
        key: idempotencyKey,
        target_type: 'order',
        target_id: id,
        response_body: updatedOrder
      });

      return updatedOrder;
    }



  // Cancelar orden
  async cancel({ id }) {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new Error('Order not found');

    const now = new Date();

    if (order.status === 'CREATED') {
      // Restaurar stock
      const items = await this.orderItemRepo.findByOrderId(id);
      for (const item of items) {
        const product = await this.productRepo.findById(item.product_id);
        await this.productRepo.update(product.id, { stock: product.stock + item.qty });
      }

      await this.orderRepo.updateStatus(id, 'CANCELED');
      return { id: order.id, status: 'CANCELED' };

    } else if (order.status === 'CONFIRMED') {
      const createdAt = new Date(order.created_at);
      const diffMinutes = (now - createdAt) / (1000 * 60);

      if (diffMinutes <= 10) {
        // Restaurar stock
        const items = await this.orderItemRepo.findByOrderId(id);
        for (const item of items) {
          const product = await this.productRepo.findById(item.product_id);
          await this.productRepo.update(product.id, { stock: product.stock + item.qty });
        }

        await this.orderRepo.updateStatus(id, 'CANCELED');
        return { id: order.id, status: 'CANCELED' };
      } else {
        throw new Error('Cannot cancel CONFIRMED order after 10 minutes');
      }
    } else {
      throw new Error('Order cannot be canceled');
    }
  }
}

module.exports = OrderUseCase;

const OrderUseCase = require('../../usecases/order.usecases');

const orderUseCase = new OrderUseCase();

class OrderController {
  async create(req, res, next) {
    try {
      const order = await orderUseCase.create(req.body);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await orderUseCase.getById(req.params.id);
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  async search(req, res, next) {
    try {
      const orders = await orderUseCase.search(req.query);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }

  async confirm(req, res, next) {
    const id = req.params.id;

    // Extraemos el header (Node convierte todos los headers a minúsculas)
    const idempotencyKeyHeader = req.headers['x-idempotency-key'];

    // Asignamos el valor que espera el Use Case
    const idempotency_key = idempotencyKeyHeader;

    // Verificación de seguridad
    if (!idempotency_key || typeof idempotency_key !== 'string' || idempotency_key.trim().length === 0) {
      return res.status(400).json({
        error: 'X-Idempotency-Key header is required and must contain a value'
      });
    }


    try {
      // Llamada al Use Case
      const order = await orderUseCase.confirm({ id, idempotencyKey: idempotency_key });
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    const id = req.params.id;
    try {
      const result = await orderUseCase.cancel({ id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new OrderController();

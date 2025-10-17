const customersService = require('../services/customersService');
const ordersService = require('../services/ordersService');
const idempotencyService = require('../services/idempotencyService');
const { generateCorrelationId } = require('../utils/generateCorrelationId');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

module.exports.handler = async (event) => {
  let correlationId;
  try {
    const body = JSON.parse(event.body);
    const { customer_id, items, idempotency_key } = body;
    correlationId = body.correlation_id || generateCorrelationId();

    if (!customer_id || !items || !idempotency_key) {
      throw new Error('Missing required fields: customer_id, items, idempotency_key');
    }

    // ✅ Validar cliente
    const customer = await customersService.getCustomerById(customer_id);
    if (!customer) throw new Error(`Customer with ID ${customer_id} not found`);

    // ✅ Revisar idempotencia
    if (idempotencyService.isProcessed(idempotency_key)) {
      const previousData = idempotencyService.getProcessed(idempotency_key);
      return formatSuccess(previousData, correlationId);
    }

    // 📝 Crear orden
    const orderCreated = await ordersService.createOrder(customer_id, items);

    // 🪄 Confirmar orden
    const orderConfirmed = await ordersService.confirmOrder(orderCreated.id, idempotency_key);

    const data = { customer, order: orderConfirmed };

    // ✅ Marcar como procesado
    idempotencyService.markProcessed(idempotency_key, data);

    return formatSuccess(data, correlationId);

  } catch (error) {
    console.error('❌ Error in orchestrator:', error);
    return formatError(error.message, correlationId);
  }
};

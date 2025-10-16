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

    console.log('🔹 Starting orchestration');
    console.log('Customer ID:', customer_id);
    console.log('Items:', items);
    console.log('Idempotency Key:', idempotency_key);
    console.log('Correlation ID:', correlationId);

    // ✅ Validar cliente
    const customer = await customersService.getCustomerById(customer_id);
    if (!customer) throw new Error(`Customer with ID ${customer_id} not found`);
    console.log('✅ Customer validated:', customer);

    // ✅ Revisar idempotencia
    if (idempotencyService.isProcessed(idempotency_key)) {
      console.log(`🌀 Idempotency key ${idempotency_key} detected. Returning previous result.`);
      const previousData = idempotencyService.getProcessed(idempotency_key);
      return formatSuccess(previousData, correlationId);
    }

    // 📝 Crear orden
    const orderCreated = await ordersService.createOrder(customer_id, items);
    console.log('✅ Order created:', orderCreated);

    // 🪄 Confirmar orden
    const orderConfirmed = await ordersService.confirmOrder(orderCreated.id, idempotency_key);
    console.log('✅ Order confirmed:', orderConfirmed);

    const data = { customer, order: orderConfirmed };

    // ✅ Marcar como procesado
    idempotencyService.markProcessed(idempotency_key, data);
    console.log('✅ Marked idempotency key as processed');

    console.log('🔹 Orchestration finished successfully');
    return formatSuccess(data, correlationId);

  } catch (error) {
    console.error('❌ Error in orchestrator:', error);
    return formatError(error.message, correlationId);
  }
};

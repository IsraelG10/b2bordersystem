const httpClient = require('../utils/httpClient');
const { ORDERS_API_URL } = process.env;

async function createOrder(customerId, items) {
  // 1️⃣ Crear la orden
  const createResp = await httpClient.post(`${ORDERS_API_URL}/api/orders`, {
    customer_id: customerId,
    items,
  });

  const orderId = createResp.data?.id;
  if (!orderId) {
    console.error('❌ Order creation failed, no order ID returned');
    throw new Error('Order creation failed');
  }

  // 2️⃣ Obtener la orden completa
  const fullOrderResp = await httpClient.get(`${ORDERS_API_URL}/api/orders/${orderId}`);

  return fullOrderResp.data;
}

async function confirmOrder(orderId, idempotencyKey) {

  // 1️⃣ Confirmar orden
  const confirmResp = await httpClient.post(
    `${ORDERS_API_URL}/api/orders/${orderId}/confirm`,
    {},
    { headers: { 'X-Idempotency-Key': idempotencyKey } }
  );
  console.log('✅ Confirm response (raw):', confirmResp.data);

  // 2️⃣ Obtener la orden confirmada completa
  const confirmedOrderResp = await httpClient.get(`${ORDERS_API_URL}/api/orders/${orderId}`);

  return confirmedOrderResp.data;
}

module.exports = { createOrder, confirmOrder };

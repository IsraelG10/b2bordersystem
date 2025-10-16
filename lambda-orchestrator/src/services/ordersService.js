const httpClient = require('../utils/httpClient');
const { ORDERS_API_URL } = process.env;

async function createOrder(customerId, items) {
  console.log('🚀 Creating order for customer:', customerId);
  console.log('Items to order:', items);
  console.log('Orders API URL:', `${ORDERS_API_URL}/api/orders`);

  // 1️⃣ Crear la orden
  const createResp = await httpClient.post(`${ORDERS_API_URL}/api/orders`, {
    customer_id: customerId,
    items,
  });
  console.log('✅ Order creation response:', createResp.data);

  const orderId = createResp.data?.id;
  if (!orderId) {
    console.error('❌ Order creation failed, no order ID returned');
    throw new Error('Order creation failed');
  }

  // 2️⃣ Obtener la orden completa
  const fullOrderResp = await httpClient.get(`${ORDERS_API_URL}/api/orders/${orderId}`);
  console.log('📦 Full order after creation:', fullOrderResp.data);

  return fullOrderResp.data;
}

async function confirmOrder(orderId, idempotencyKey) {
  console.log('🪄 Confirming order ID:', orderId, 'with idempotency key:', idempotencyKey);
  console.log('Orders API URL:', `${ORDERS_API_URL}/api/orders/${orderId}/confirm`);

  // 1️⃣ Confirmar orden
  const confirmResp = await httpClient.post(
    `${ORDERS_API_URL}/api/orders/${orderId}/confirm`,
    {},
    { headers: { 'X-Idempotency-Key': idempotencyKey } }
  );
  console.log('✅ Confirm response (raw):', confirmResp.data);

  // 2️⃣ Obtener la orden confirmada completa
  const confirmedOrderResp = await httpClient.get(`${ORDERS_API_URL}/api/orders/${orderId}`);
  console.log('📦 Full confirmed order:', confirmedOrderResp.data);

  return confirmedOrderResp.data;
}

module.exports = { createOrder, confirmOrder };

// Placeholder para manejar idempotency local (opcional)
const idempotencyStore = new Map();

function isProcessed(idempotencyKey) {
  return idempotencyStore.has(idempotencyKey);
}

function markProcessed(idempotencyKey, data) {
  idempotencyStore.set(idempotencyKey, data);
}

function getProcessed(idempotencyKey) {
  return idempotencyStore.get(idempotencyKey);
}

module.exports = { isProcessed, markProcessed, getProcessed };

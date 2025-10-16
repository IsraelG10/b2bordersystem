class IdempotencyKey {
  constructor({ idempotency_key, target_type, target_id, status, response_body }) {
    this.idempotency_key = idempotency_key;
    this.target_type = target_type;
    this.target_id = target_id;
    this.status = status;
    this.response_body = response_body;
  }
}

module.exports = IdempotencyKey;

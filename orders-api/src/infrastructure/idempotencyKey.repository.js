const db = require('../infrastructure/db');
const IdempotencyKey = require('../domain/idempotencyKey');

class IdempotencyKeyRepository {
  async findByKey(key) {
      if (!key) {
          throw new Error('Clave de idempotencia inválida antes de la consulta Knex');
      }

      // Si estás usando la sintaxis abreviada, verifica que sea la correcta
      const row = await db('idempotency_keys')
        .where({ idempotency_key: key }) // Línea 6 donde falla
        .first();
      return row ? new IdempotencyKey(row) : null;
  }

  async create({ key, target_type, target_id, status = 'PENDING', response_body }) {
    await db('idempotency_keys').insert({
      idempotency_key: key,
      target_type,
      target_id,
      status,
      response_body: JSON.stringify(response_body),
    });
    return new IdempotencyKey({ key, target_type, target_id, status, response_body });
  }

  // Actualizar status y response_body
  async updateStatus(idempotency_key, status, response_body) {
    await db('idempotency_keys')
      .where({ idempotency_key })
      .update({
        status,
        response_body: response_body ? JSON.stringify(response_body) : null
      });
  }
}

module.exports = IdempotencyKeyRepository;

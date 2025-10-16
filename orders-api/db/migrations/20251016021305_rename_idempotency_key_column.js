/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('idempotency_keys', (table) => {
    table.renameColumn('key', 'idempotency_key');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('idempotency_keys', (table) => {
    table.renameColumn('idempotency_key', 'key');
  });
};

exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('idempotency_keys', 'idempotency_key');
  if (!hasColumn) {
    await knex.schema.alterTable('idempotency_keys', (table) => {
      table.renameColumn('key', 'idempotency_key');
    });
  }
};

exports.down = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('idempotency_keys', 'idempotency_key');
  if (hasColumn) {
    await knex.schema.alterTable('idempotency_keys', (table) => {
      table.renameColumn('idempotency_key', 'key');
    });
  }
};

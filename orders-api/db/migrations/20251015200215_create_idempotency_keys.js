/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("idempotency_keys");
  if (!exists) {
    return knex.schema.createTable("idempotency_keys", (table) => {
      table.string("key").primary();
      table.string("target_type").notNullable(); // ejemplo: 'order'
      table.integer("target_id").unsigned().notNullable();
      table.enu("status", ["PENDING", "COMPLETED", "FAILED"]).notNullable();
      table.json("response_body").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("expires_at").nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const exists = await knex.schema.hasTable("idempotency_keys");
  if (exists) {
    return knex.schema.dropTable("idempotency_keys");
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments("id").primary(); // unsigned
    table.integer("customer_id").notNullable();
    table.enu("status", ["CREATED","CONFIRMED","CANCELED"]).notNullable();
    table.integer("total_cents").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists("orders");
};
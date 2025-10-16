/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("sku").unique().notNullable();
    table.string("name").notNullable();
    table.integer("price_cents").notNullable();
    table.integer("stock").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists("products");
};

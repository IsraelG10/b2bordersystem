/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("order_items");
  if (!exists) {
    return knex.schema.createTable("order_items", (table) => {
      table.increments("id").primary();
      table.integer("order_id").unsigned().notNullable();
      table.integer("product_id").unsigned().notNullable();
      table.integer("qty").notNullable();
      table.integer("unit_price_cents").notNullable();
      table.integer("subtotal_cents").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());

      table
        .foreign("order_id")
        .references("id")
        .inTable("orders")
        .onDelete("CASCADE");

      table
        .foreign("product_id")
        .references("id")
        .inTable("products")
        .onDelete("CASCADE");
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const exists = await knex.schema.hasTable("order_items");
  if (exists) {
    return knex.schema.dropTable("order_items");
  }
};

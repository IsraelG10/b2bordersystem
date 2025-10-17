/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("customers");
  if (!exists) {
    return knex.schema.createTable("customers", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("phone");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at").nullable();
    });
  }
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists("customers");
};

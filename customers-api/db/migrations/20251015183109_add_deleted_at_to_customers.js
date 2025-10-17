/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("customers");
  if (exists) {
    return knex.schema.alterTable("customers", (table) => {
      table.timestamp("deleted_at").nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("customers");
  if (exists) {
    return knex.schema.alterTable("customers", (table) => {
      table.dropColumn("deleted_at");
    });
  }
};

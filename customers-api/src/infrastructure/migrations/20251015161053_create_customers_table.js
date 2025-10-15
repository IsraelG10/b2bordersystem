const fs = require('fs');
const path = require('path');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const sqlPath = path.join(__dirname, '../../../../db/schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await knex.raw(sql);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw('DROP TABLE IF EXISTS customers;');
};

const db = require('./db');
const Product = require('../domain/product');

class ProductRepository {
  // Crear un nuevo producto
  async create(product) {
    const [id] = await db('products').insert(product);
    return new Product({ id, ...product });
  }

  // Actualizar precio y stock de un producto
  async update(id, data) {
    await db('products').where({ id }).update(data);
    const updated = await db('products').where({ id }).first();
    return updated ? new Product(updated) : null;
  }

  // Obtener un producto por ID
  async findById(id) {
    const row = await db('products').where({ id }).first();
    return row ? new Product(row) : null;
  }

  // Buscar productos con paginación y filtro
  async search({ search = '', cursor = 0, limit = 10 }) {
    const rows = await db('products')
      .where('name', 'like', `%${search}%`)
      .andWhere('id', '>', cursor)
      .orderBy('id')
      .limit(limit);

    return rows.map(row => new Product(row));
  }
}

module.exports = ProductRepository;

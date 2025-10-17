const ProductRepository = require('../infrastructure/product.repository');

const productRepo = new ProductRepository();

class ProductUseCases {
  async createProduct(data) {
    return await productRepo.create(data);
  }

  async updateProduct(id, data) {
    return await productRepo.update(id, data);
  }

  async getProductById(id) {
    return await productRepo.findById(id);
  }

  async searchProducts(query) {
    const { search = '', cursor = 0, limit = 10 } = query;
    return await productRepo.search({ search, cursor, limit });
  }
}

module.exports = new ProductUseCases();

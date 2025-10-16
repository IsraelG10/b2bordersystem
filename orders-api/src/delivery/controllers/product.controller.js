const ProductUseCases = require('../../usecases/product.usecases');

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await ProductUseCases.createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductUseCases.updateProduct(id, req.body);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductUseCases.getProductById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const products = await ProductUseCases.searchProducts(req.query);
      res.json(products);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();

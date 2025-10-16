class Product {
  constructor({ id, sku, name, price_cents, stock, created_at }) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.price_cents = price_cents;
    this.stock = stock;
    this.created_at = created_at;
  }
}

module.exports = Product;

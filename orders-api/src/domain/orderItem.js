class OrderItem {
  constructor({ id, order_id, product_id, qty, unit_price_cents, subtotal_cents, created_at }) {
    this.id = id;
    this.order_id = order_id;
    this.product_id = product_id;
    this.qty = qty;
    this.unit_price_cents = unit_price_cents;
    this.subtotal_cents = subtotal_cents;
    this.created_at = created_at;
  }
}

module.exports = OrderItem;

class Order {
  constructor({ id, customer_id, status, total_cents, created_at }) {
    this.id = id;
    this.customer_id = customer_id;
    this.status = status; // CREATED | CONFIRMED | CANCELED
    this.total_cents = total_cents;
    this.created_at = created_at;
  }
}

module.exports = Order;

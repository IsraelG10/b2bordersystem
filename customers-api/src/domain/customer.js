class Customer {
  constructor({ id, name, email, phone, created_at, deleted_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.created_at = created_at;
    this.deleted_at = deleted_at || null;
  }
}

module.exports = Customer;

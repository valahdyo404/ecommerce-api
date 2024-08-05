const db = require('../config/database');

const TransactionModel = {
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        t.id,
        t.sku, 
        t.qty, 
        t.qty * p.price as amount
      FROM transactions t
      JOIN products p ON t.sku = p.sku
      ORDER BY t.id
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
  },

  async getById(id) {
    const query = `
      SELECT 
        t.id,
        t.sku, 
        t.qty, 
        t.qty * p.price as amount
      FROM transactions t
      JOIN products p ON t.sku = p.sku
      WHERE t.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async getBySku(sku) {
    const query = `
      SELECT 
        t.sku,
        p.price * sum(t.qty) as amount,
        sum(t.qty) as qty       
      FROM transactions t
      JOIN products p ON t.sku = p.sku
      WHERE t.sku = $1
      GROUP BY t.sku, p.price
    `;
    const { rows } = await db.query(query, [sku]);
    return rows[0];
  },

  async create(transaction) {
    const { sku, qty } = transaction;
    const query = 'INSERT INTO transactions (sku, qty) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(query, [sku, qty]);
    return rows[0];
  },

  async update(id, transaction) {
    const { sku, qty } = transaction;
    const query = 'UPDATE transactions SET sku = $1, qty = $2 WHERE id = $3 RETURNING *';
    const { rows } = await db.query(query, [sku, qty, id]);
    return rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM transactions WHERE id = $1';
    await db.query(query, [id]);
  },

  async getStockBySku(sku) {
    const query = `
      SELECT COALESCE(SUM(qty), 0) as stock
      FROM transactions
      WHERE sku = $1
    `;
    const { rows } = await db.query(query, [sku]);
    return rows[0].stock;
  },
};

module.exports = TransactionModel;
const db = require('../config/database');

const ProductModel = {
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        p.title, 
        p.sku, 
        p.image, 
        p.price, 
        COALESCE(SUM(t.qty), 0) as stock
      FROM products p
      LEFT JOIN transactions t ON p.sku = t.sku
      GROUP BY p.id
      ORDER BY p.id
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
  },

  async getById(id) {
    const query = `
      SELECT 
        p.title, 
        p.sku, 
        p.image, 
        p.price, 
        p.description, 
        COALESCE(SUM(t.qty), 0) as stock
      FROM products p
      LEFT JOIN transactions t ON p.sku = t.sku
      WHERE p.id = $1
      GROUP BY p.sku, p.title, p.image, p.price, p.description
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async getBySku(sku) {
    const query = `
      SELECT 
        p.title, 
        p.sku, 
        p.image, 
        p.price, 
        p.description, 
        COALESCE(SUM(t.qty), 0) as stock
      FROM products p
      LEFT JOIN transactions t ON p.sku = t.sku
      WHERE p.sku = $1
      GROUP BY p.sku, p.title, p.image, p.price, p.description
    `;
    const { rows } = await db.query(query, [sku]);
    return rows[0];
  },

  async create(product) {
    const { title, sku, image, price, description } = product;
    const query = 'INSERT INTO products (title, sku, image, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const { rows } = await db.query(query, [title, sku, image, price, description]);
    return rows[0];
  },

  async updateById(id, product) {
    const { title, sku, image, price, description } = product;
    const query = 'UPDATE products SET title = $1, sku = $2, image = $3, price = $4, description = $5 WHERE id = $6 RETURNING *';
    const { rows } = await db.query(query, [title, sku, image, price, description, id]);
    return rows[0];
  },

  async updateBySku(sku, product) {
    const { title, image, price, description } = product;
    const query = 'UPDATE products SET title = $1, image = $2, price = $3, description = $4 WHERE sku = $5 RETURNING *';
    const { rows } = await db.query(query, [title, image, price, description, sku]);
    return rows[0];
  },

  async deleteById(id) {
    const query = 'DELETE FROM products WHERE id = $1';
    await db.query(query, [id]);
  },

  async deleteBySku(sku) {
    const query = 'DELETE FROM products WHERE sku = $1';
    await db.query(query, [sku]);
  },

  async findBySku(sku) {
    const query = 'SELECT * FROM products WHERE sku = $1';
    const { rows } = await db.query(query, [sku]);
    return rows[0];
  },
};

module.exports = ProductModel;
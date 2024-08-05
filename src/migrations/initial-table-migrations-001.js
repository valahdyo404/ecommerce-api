const { Pool } = require('pg');
require('dotenv').config({path:__dirname+'/../.env'})

let pool;
const initialize = async () => {
  return new Promise(async (resolve) => {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.CONTAINER_DB_NAME || process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  
    let retries = 5;
    while (retries) {
      try {
        await pool.query('SELECT 1');
        console.log('Database connected successfully');
        break;
      } catch (err) {
        // console.log(err, "err")
        console.log('Database connection failed. Retrying...');
        retries -= 1;
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    resolve(pool);
  })
};

const sqlUp = `
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) NOT NULL,
  qty INTEGER NOT NULL,
  FOREIGN KEY (sku) REFERENCES products(sku) ON DELETE CASCADE
);`;

const sqlDown = `
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS products;
`;

async function up() {
  await initialize();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sqlUp);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration up failed:', error);
  } finally {
    client.release();
  }
}

async function down() {
  await initialize();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sqlDown);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration down failed:', error);
  } finally {
    client.release();
  }
}

module.exports = { up, down };
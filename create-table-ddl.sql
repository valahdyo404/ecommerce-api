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
);
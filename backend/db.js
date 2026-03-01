const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully!");
  }
});

// Ensure tables and columns exist
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(20) NOT NULL DEFAULT 'expense',
      amount NUMERIC(12,2) NOT NULL,
      category VARCHAR(100),
      description VARCHAR(255),
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  // Add type column if it was created without it
  await pool.query(`
    ALTER TABLE expenses ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'expense';
  `);
}

initDB().catch(err => console.error("DB init error:", err.message));

module.exports = pool;
const pool = require('../db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (username, email, password) => {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashed]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return result.rows[0];
  }
};

module.exports = User;
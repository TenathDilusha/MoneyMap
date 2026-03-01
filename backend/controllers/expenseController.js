const pool = require('../db');

exports.getExpenses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses WHERE user_id=$1', [req.user]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.user, amount, category, description, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id=$1 AND user_id=$2', [req.params.id, req.user]);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
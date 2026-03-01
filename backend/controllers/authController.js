const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create(username, email, password);
    const token = generateToken(user.id);

    res.json({ user: { id: user.id, username, email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);
    res.json({ user: { id: user.id, username: user.username, email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
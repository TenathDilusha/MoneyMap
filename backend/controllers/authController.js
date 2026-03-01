const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
};12345

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create(username, email, password);
    const token = generateToken(user.id);
    setCookie(res, token);
    res.json({ user: { id: user.id, username, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'User not registered. Please sign up first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);
    setCookie(res, token);
    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.oauth = async (req, res) => {
  const { email, username } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  try {
    let user = await User.findByEmail(email);
    if (!user) {
      user = await User.create(
        username || email.split('@')[0],
        email,
        Math.random().toString(36).slice(2)
      );
    }
    const token = generateToken(user.id);
    setCookie(res, token);
    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
};
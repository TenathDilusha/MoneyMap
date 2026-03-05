
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes    = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const receiptRoutes = require('./routes/receiptRoutes');

const app = express();

// Middleware
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/receipts', receiptRoutes); // OCR receipt scanning

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
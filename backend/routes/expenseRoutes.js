const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, deleteExpense, editExpense } = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');


router.get('/', protect, getExpenses);
router.post('/', protect, addExpense);
router.put('/:id', protect, editExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;
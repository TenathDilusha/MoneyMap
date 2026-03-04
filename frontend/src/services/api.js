export async function editTransaction(id, tx) {
  const res = await api.put(`/expenses/${id}`, tx);
  return res.data;
}
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// ── Real backend calls ────────────────────────────────────────────────────────
const toDateStr = (d) => {
  if (!d) return '';
  // already YYYY-MM-DD string
  if (typeof d === 'string') return d.slice(0, 10);
  // Date object
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
};

export async function getTransactions() {
  const res = await api.get('/expenses');
  return res.data.map(t => ({
    ...t,
    type: t.type || 'expense',
    amount: parseFloat(t.amount),
    date: toDateStr(t.date),
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addTransaction(tx) {
  const res = await api.post('/expenses', tx);
  return res.data;
}

export async function deleteTransaction(id) {
  await api.delete(`/expenses/${id}`);
}

export function getSummary(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export function getCategoryBreakdown(transactions) {
  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getMonthlyData(transactions) {
  const months = {};
  transactions.forEach(t => {
    const dateStr = typeof t.date === 'string' ? t.date : String(t.date).slice(0, 10);
    const key = dateStr.slice(0, 7); // YYYY-MM
    if (!months[key]) months[key] = { month: key, income: 0, expense: 0 };
    months[key][t.type] += t.amount;
  });
  return Object.values(months)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map(m => ({ ...m, month: new Date(m.month + '-15').toLocaleString('default', { month: 'short' }) }));
}

export const CATEGORY_META = {
  food:           { label: 'Food & Dining',    emoji: '🍔', css: 'cat-food' },
  salary:         { label: 'Salary',           emoji: '💼', css: 'cat-salary' },
  transport:      { label: 'Transport',        emoji: '🚗', css: 'cat-transport' },
  shopping:       { label: 'Shopping',         emoji: '🛍️', css: 'cat-shopping' },
  health:         { label: 'Health & Fitness', emoji: '❤️', css: 'cat-health' },
  entertainment:  { label: 'Entertainment',    emoji: '🎬', css: 'cat-entertainment' },
  rent:           { label: 'Rent / Housing',   emoji: '🏠', css: 'cat-rent' },
  freelance:      { label: 'Freelance',        emoji: '💻', css: 'cat-freelance' },
  utilities:      { label: 'Utilities',        emoji: '💡', css: 'cat-utilities' },
  other:          { label: 'Other',            emoji: '📌', css: 'cat-other' },
};

export const INCOME_CATEGORIES  = ['salary', 'freelance', 'other'];
export const EXPENSE_CATEGORIES = ['food', 'rent', 'transport', 'shopping', 'health', 'entertainment', 'utilities', 'other'];

export function fmt(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
}

export function fmtDate(dateStr) {
  // Append noon-time to avoid UTC midnight falling on the previous day in local TZ
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

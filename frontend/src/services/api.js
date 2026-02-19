const STORAGE_KEY = 'moneymap_transactions';

// ── Seed data for first-time users ──────────────────────────────────────────
const SEED = [
  { id: '1', type: 'income',  category: 'salary',        description: 'Monthly Salary',      amount: 3500,  date: '2026-02-01' },
  { id: '2', type: 'expense', category: 'rent',           description: 'Apartment Rent',      amount: 950,   date: '2026-02-02' },
  { id: '3', type: 'expense', category: 'food',           description: 'Grocery Store',       amount: 120,   date: '2026-02-04' },
  { id: '4', type: 'income',  category: 'freelance',      description: 'Freelance Project',   amount: 800,   date: '2026-02-06' },
  { id: '5', type: 'expense', category: 'transport',      description: 'Monthly Bus Pass',    amount: 55,    date: '2026-02-07' },
  { id: '6', type: 'expense', category: 'entertainment',  description: 'Netflix & Spotify',   amount: 30,    date: '2026-02-08' },
  { id: '7', type: 'expense', category: 'health',         description: 'Gym Membership',      amount: 45,    date: '2026-02-10' },
  { id: '8', type: 'expense', category: 'shopping',       description: 'Clothes & Shoes',     amount: 210,   date: '2026-02-12' },
  { id: '9', type: 'expense', category: 'utilities',      description: 'Electricity Bill',    amount: 70,    date: '2026-02-14' },
  { id:'10', type: 'expense', category: 'food',           description: 'Restaurant Dinner',   amount: 65,    date: '2026-02-16' },
  { id:'11', type: 'income',  category: 'freelance',      description: 'Design Consultation', amount: 350,   date: '2026-02-17' },
  { id:'12', type: 'expense', category: 'other',          description: 'Birthday Gift',       amount: 80,    date: '2026-02-18' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return SEED;
  } catch {
    return SEED;
  }
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── API ──────────────────────────────────────────────────────────────────────
export function getTransactions() {
  return [...load()].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function addTransaction(tx) {
  const all = load();
  const entry = { ...tx, id: uid() };
  all.unshift(entry);
  save(all);
  return entry;
}

export function deleteTransaction(id) {
  const all = load().filter(t => t.id !== id);
  save(all);
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
    const key = t.date.slice(0, 7); // YYYY-MM
    if (!months[key]) months[key] = { month: key, income: 0, expense: 0 };
    months[key][t.type] += t.amount;
  });
  return Object.values(months)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map(m => ({ ...m, month: new Date(m.month + '-01').toLocaleString('default', { month: 'short' }) }));
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
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

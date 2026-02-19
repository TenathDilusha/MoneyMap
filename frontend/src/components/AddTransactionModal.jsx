import { useState } from 'react';
import {
  addTransaction,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  CATEGORY_META,
} from '../services/api';

const today = () => new Date().toISOString().slice(0, 10);

export default function AddTransactionModal({ onClose, onAdded }) {
  const [type, setType]        = useState('expense');
  const [description, setDesc] = useState('');
  const [amount, setAmount]    = useState('');
  const [category, setCat]     = useState('');
  const [date, setDate]        = useState(today());
  const [error, setError]      = useState('');

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) { setError('Please enter a description.'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (!category) { setError('Please select a category.'); return; }
    setError('');
    addTransaction({ type, description: description.trim(), amount: parseFloat(amount), category, date });
    onAdded?.();
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Transaction</div>

        {/* Type toggle */}
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn ${type === 'income' ? 'active income' : ''}`}
            onClick={() => { setType('income'); setCat(''); }}
          >
            📈 Income
          </button>
          <button
            type="button"
            className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
            onClick={() => { setType('expense'); setCat(''); }}
          >
            📉 Expense
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Monthly Salary, Netflix..."
              value={description}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-row">
              <label className="form-label">Amount (USD)</label>
              <input
                className="form-input"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCat(e.target.value)}
            >
              <option value="">Select a category...</option>
              {cats.map(c => (
                <option key={c} value={c}>
                  {CATEGORY_META[c]?.emoji} {CATEGORY_META[c]?.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div style={{ color: 'var(--accent-red)', fontSize: 13, marginBottom: 10 }}>
              ⚠ {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              ＋ Add Transaction
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

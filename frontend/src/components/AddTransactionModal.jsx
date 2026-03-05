import { useState, useEffect } from 'react';
import {
  addTransaction,
  editTransaction,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  CATEGORY_META,
} from '../services/api';


const today = () => new Date().toISOString().slice(0, 10);


export default function AddTransactionModal({ onClose, onAdded, initial }) {
  // isEdit is only true when an existing transaction ID is present.
  // A receipt pre-fill passes data without an id, so it must be treated as a new entry.
  const isEdit = !!initial?.id;
  const [type, setType]        = useState(initial?.type || 'expense');
  const [description, setDesc] = useState(initial?.description || '');
  const [amount, setAmount]    = useState(initial?.amount?.toString() || '');
  const [category, setCat]     = useState(initial?.category || '');
  const [date, setDate]        = useState(initial?.date || today());
  const [error, setError]      = useState('');

  useEffect(() => {
    if (initial) {
      setType(initial.type || 'expense');
      setDesc(initial.description || '');
      setAmount(initial.amount?.toString() || '');
      setCat(initial.category || '');
      setDate(initial.date || today());
    }
  }, [initial]);

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) { setError('Please enter a valid amount.'); return; }
    if (!category) { setError('Please select a category.'); return; }
    setError('');
    try {
      if (isEdit) {
        await editTransaction(initial.id, { type, description: description.trim(), amount: parseFloat(amount), category, date });
      } else {
        await addTransaction({ type, description: description.trim(), amount: parseFloat(amount), category, date });
      }
      onAdded?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || (isEdit ? 'Failed to edit transaction.' : 'Failed to add transaction.'));
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</div>

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
              {isEdit ? '💾 Save Changes' : '＋ Add Transaction'}
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

import { useState, useEffect, useCallback } from 'react';
import TransactionsList from '../components/TransactionsList';
import AddTransactionModal from '../components/AddTransactionModal';
import { getTransactions, getSummary, CATEGORY_META, fmt } from '../services/api';

const ALL_CATS = Object.entries(CATEGORY_META).map(([id, m]) => ({ id, ...m }));

export default function ExpensesScreen() {
  const [modal, setModal]       = useState(false);
  const [allTxns, setAllTxns]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('all');
  const [cat, setCat]           = useState('all');
  const [search, setSearch]     = useState('');
  const [sort, setSort]         = useState('date_desc');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTransactions();
      setAllTxns(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transactions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  let transactions = allTxns;

  // Filter by type
  if (filter !== 'all') transactions = transactions.filter(t => t.type === filter);

  // Filter by category
  if (cat !== 'all') transactions = transactions.filter(t => t.category === cat);

  // Filter by search
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    transactions = transactions.filter(t =>
      t.description.toLowerCase().includes(q) ||
      (CATEGORY_META[t.category]?.label || '').toLowerCase().includes(q)
    );
  }

  // Sort
  transactions = [...transactions].sort((a, b) => {
    if (sort === 'date_desc')   return new Date(b.date) - new Date(a.date);
    if (sort === 'date_asc')    return new Date(a.date) - new Date(b.date);
    if (sort === 'amount_desc') return b.amount - a.amount;
    if (sort === 'amount_asc')  return a.amount - b.amount;
    return 0;
  });

  const summary = getSummary(transactions);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          + Add Transaction
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Shown Transactions', value: transactions.length, unit: '' },
          { label: 'Total Income',  value: fmt(summary.income),  color: 'var(--accent-green)' },
          { label: 'Total Expenses', value: fmt(summary.expense), color: 'var(--accent-red)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px' }}>
            <div className="card-title">{s.label}</div>
            <div style={{
              fontSize: 20, fontWeight: 800,
              color: s.color || 'var(--text-primary)', letterSpacing: '-0.3px',
            }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div className="filter-bar" style={{ marginBottom: 12 }}>
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'income' ? '📈 Income' : '📉 Expenses'}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="amount_desc">Highest amount</option>
              <option value="amount_asc">Lowest amount</option>
            </select>
          </div>
        </div>

        <div className="filter-bar">
          <input
            className="search-input"
            type="text"
            placeholder="🔍  Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            key="all-cat"
            className={`filter-chip ${cat === 'all' ? 'active' : ''}`}
            onClick={() => setCat('all')}
          >
            All categories
          </button>
          {ALL_CATS.map(c => (
            <button
              key={c.id}
              className={`filter-chip ${cat === c.id ? 'active' : ''}`}
              onClick={() => setCat(c.id)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--accent-red)' }}>⚠ {error}</div>
        ) : (
          <TransactionsList transactions={transactions} onDelete={loadData} />
        )}
      </div>

      {modal && <AddTransactionModal onClose={() => setModal(false)} onAdded={loadData} />}
    </div>
  );
}

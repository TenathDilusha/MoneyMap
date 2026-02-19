import { useState, useCallback } from 'react';
import AnalyticsCard from '../components/AnalyticsCard';
import ExpenseCard from '../components/ExpenseCard';
import PieChartComponent from '../components/PieChartComponent';
import AddTransactionModal from '../components/AddTransactionModal';
import {
  getTransactions, getSummary, getCategoryBreakdown, getMonthlyData,
  CATEGORY_META, fmt, fmtDate,
} from '../services/api';

export default function TotalExpenseScreen() {
  const [modal, setModal]     = useState(false);
  const [refresh, setRefresh] = useState(0);
  const reload = useCallback(() => setRefresh(r => r + 1), []);

  const transactions = getTransactions();
  const summary      = getSummary(transactions);
  const breakdown    = getCategoryBreakdown(transactions);
  const monthly      = getMonthlyData(transactions);

  // Top spending categories
  const topCats = breakdown.slice(0, 5);
  const totalExpense = breakdown.reduce((s, c) => s + c.value, 0);

  // Income sources
  const incomeSources = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  const incomeArr = Object.entries(incomeSources)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Full financial overview & spending insights</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          ＋ Add Transaction
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          {
            label: 'Net Balance',
            value: fmt(summary.balance),
            sub: summary.balance >= 0 ? '✓ Positive cash flow' : '⚠ Negative balance',
            color: summary.balance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
          },
          {
            label: 'Savings Rate',
            value: summary.income > 0
              ? `${Math.round(((summary.income - summary.expense) / summary.income) * 100)}%`
              : '—',
            sub: 'Income saved after expenses',
            color: 'var(--accent-blue)',
          },
          {
            label: 'Total Transactions',
            value: transactions.length,
            sub: `${transactions.filter(t => t.type === 'income').length} income · ${transactions.filter(t => t.type === 'expense').length} expenses`,
            color: 'var(--accent-yellow)',
          },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <div className="card-title">{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: '-0.3px', margin: '6px 0 4px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div style={{ marginBottom: 24 }}>
        <AnalyticsCard monthlyData={monthly} />
      </div>

      {/* Category breakdown & Pie */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <ExpenseCard breakdown={breakdown} />
        <PieChartComponent breakdown={breakdown} />
      </div>

      {/* Income Sources */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ marginBottom: 16 }}>Income Sources</div>
        {incomeArr.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💵</div>
            <div className="empty-state-text">No income recorded yet</div>
          </div>
        ) : (
          <div className="grid-2">
            {incomeArr.map((src, i) => {
              const meta = CATEGORY_META[src.name] || CATEGORY_META.other;
              const pct = summary.income > 0 ? Math.round((src.value / summary.income) * 100) : 0;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className={`transaction-icon ${meta.css}`} style={{ width: 42, height: 42, fontSize: 20 }}>
                    {meta.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{meta.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}% of income</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: 15 }}>
                    {fmt(src.value)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent high-value transactions */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>Largest Expenses</div>
        {transactions
          .filter(t => t.type === 'expense')
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
          .map(tx => {
            const meta = CATEGORY_META[tx.category] || CATEGORY_META.other;
            return (
              <div key={tx.id} className="transaction-item">
                <div className={`transaction-icon ${meta.css}`}>{meta.emoji}</div>
                <div className="transaction-info">
                  <div className="transaction-name">{tx.description}</div>
                  <div className="transaction-meta">{meta.label} · {fmtDate(tx.date)}</div>
                </div>
                <span className="transaction-amount expense">-{fmt(tx.amount)}</span>
              </div>
            );
          })}
        {transactions.filter(t => t.type === 'expense').length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-text">No expense data yet</div>
          </div>
        )}
      </div>

      {modal && <AddTransactionModal onClose={() => setModal(false)} onAdded={reload} />}
    </div>
  );
}

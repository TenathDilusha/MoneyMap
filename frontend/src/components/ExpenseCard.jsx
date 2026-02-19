import { CATEGORY_META, fmt } from '../services/api';

const COLORS = ['#00d37f', '#4d79ff', '#ffd166', '#ff4d6d', '#b57bee', '#fd5d5d', '#34d399', '#fb923c'];

export default function ExpenseCard({ breakdown }) {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="card" style={{ height: '100%' }}>
        <div className="card-title">Expense Breakdown</div>
        <div className="empty-state" style={{ paddingTop: 20 }}>
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">No expenses yet</div>
        </div>
      </div>
    );
  }

  const total = breakdown.reduce((s, c) => s + c.value, 0);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-title">Expense Breakdown</div>
      {breakdown.map((cat, i) => {
        const meta = CATEGORY_META[cat.name] || CATEGORY_META.other;
        const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;
        return (
          <div key={cat.name} className="progress-wrap">
            <div className="progress-label">
              <span className="progress-name">
                {meta.emoji} {meta.label}
              </span>
              <span className="progress-val">
                {fmt(cat.value)} <span style={{ color: 'var(--text-muted)' }}>({pct}%)</span>
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_META, fmt } from '../services/api';

const COLORS = ['#00d37f', '#4d79ff', '#ffd166', '#ff4d6d', '#b57bee', '#fd5d5d', '#34d399', '#fb923c'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 14px',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {CATEGORY_META[d.name]?.label || d.name}
        </div>
        <div style={{ color: d.payload.fill, fontSize: 14 }}>{fmt(d.value)}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          {Math.round((d.value / d.payload.total) * 100)}% of expenses
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10 }}>
    {payload.map((e, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, display: 'inline-block' }} />
        <span style={{ color: 'var(--text-secondary)' }}>
          {CATEGORY_META[e.value]?.label || e.value}
        </span>
      </div>
    ))}
  </div>
);

export default function PieChartComponent({ breakdown }) {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="card" style={{ height: '100%' }}>
        <div className="card-title">Spending by Category</div>
        <div className="empty-state" style={{ paddingTop: 20 }}>
          <div className="empty-state-icon">🥧</div>
          <div className="empty-state-text">No expense data yet</div>
        </div>
      </div>
    );
  }

  const total = breakdown.reduce((s, c) => s + c.value, 0);
  const data = breakdown.map(c => ({ ...c, total }));

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-title">Spending by Category</div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend payload={data.map((d, i) => ({ value: d.name, color: COLORS[i % COLORS.length] }))} />
    </div>
  );
}

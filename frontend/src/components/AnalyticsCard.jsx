import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Line, ComposedChart, Area,
} from 'recharts';
import { fmt } from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 14px',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, fontSize: 13, marginBottom: 2 }}>
            {p.name}: {fmt(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCard({ monthlyData }) {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Monthly Overview</div>
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">No monthly data yet</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="transactions-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="card-title" style={{ marginBottom: 2 }}>Monthly Overview</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months · Income vs Expenses</div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#00d37f', display: 'inline-block' }} />
            Income
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#ff4d6d', display: 'inline-block' }} />
            Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={monthlyData} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={55} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" name="Income" fill="#00d37f" radius={[5, 5, 0, 0]} />
          <Bar dataKey="expense" name="Expenses" fill="#ff4d6d" radius={[5, 5, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

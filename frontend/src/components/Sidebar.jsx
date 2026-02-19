export default function Sidebar({ page, setPage }) {
  const navItems = [
    { id: 'home',     label: 'Dashboard',    icon: '🏠' },
    { id: 'expenses', label: 'Transactions', icon: '💳' },
    { id: 'analytics',label: 'Analytics',    icon: '📊' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">💸</div>
        <div className="sidebar-logo-text">
          Money<span>Map</span>
        </div>
      </div>

      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${page === item.id ? 'active' : ''}`}
          onClick={() => setPage(item.id)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setPage(item.id)}
        >
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}

      <div className="sidebar-footer">
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            margin: '0 8px',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>MoneyMap v1.0</div>
          <div>Personal Finance Tracker</div>
        </div>
      </div>
    </aside>
  );
}

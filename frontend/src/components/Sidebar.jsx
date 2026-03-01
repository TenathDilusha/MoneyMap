import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: '🏠', path: '/' },
    { id: 'expenses', label: 'Transactions', icon: '💳', path: '/expenses' },
    { id: 'analytics', label: 'Analytics', icon: '📊', path: '/analytics' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">💸</div>
        <div className="sidebar-logo-text">Money<span>Map</span></div>
      </div>

      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate(item.path)}
        >
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}

      <div className="sidebar-footer">
        <div
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/profile')}
        >
          <span style={{ fontSize: 18 }}>👤</span>
          <span>Profile</span>
        </div>
      </div>
    </aside>
  );
}

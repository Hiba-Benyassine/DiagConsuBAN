import { useNavigate, useLocation } from 'react-router-dom';
import banLogo from '../assets/ban_logo.png';

const navItems = [
  { icon: '🏠', label: 'Tableau de bord', path: '/dashboard' },
  { icon: '➕', label: 'Nouvel incident', path: '/incidents/new' },
  { icon: '📋', label: 'Mes incidents', path: '/incidents' },
  { icon: '🔍', label: 'Recherche IA', path: '/search' },
  { icon: '📚', label: 'Base de connaissances', path: '/knowledge' },
  { icon: '✅', label: 'Solutions validées', path: '/solutions' },
  { icon: '📊', label: 'Rapports & Stats', path: '/reports' },
];

const bottomItems = [
  { icon: '⚙️', label: 'Paramètres', path: '/settings' },
  { icon: '👥', label: 'Utilisateurs', path: '/users' },
  { icon: '❓', label: 'Aide & Support', path: '/help' },
];

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const initials = user
    ? `${(user.nom || user.username || 'U')[0]}${(user.prenom || '')[0] || ''}`.toUpperCase()
    : 'AA';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={banLogo} alt="BAN Logo" className="sidebar-logo-img" />
        <div className="sidebar-logo-text">
          <span className="logo-title">DiagConsuBAN</span>
          <span className="logo-sub">Business Action Network</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        <div style={{ marginTop: '20px' }}>
          {bottomItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user ? `${user.nom || ''} ${user.prenom || user.username || ''}`.trim() : 'Ahmed Ali'}
            </div>
            <div className="sidebar-user-role">
              {user?.role || 'Consultant'}
            </div>
          </div>
          <div className="status-dot" />
        </div>
        <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>
          © BAN – DiagConsu IA 2024
        </div>
      </div>
    </aside>
  );
}

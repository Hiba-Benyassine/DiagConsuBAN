import { useNavigate } from 'react-router-dom';
import banLogo from '../assets/ban_logo.png';

export default function Topbar({ user, title, subtitle, notifCount = 3 }) {
  const navigate = useNavigate();

  const initials = user
    ? `${(user.nom || user.username || 'A')[0]}${(user.prenom || '')[0] || ''}`.toUpperCase()
    : 'AA';

  const fullName = user
    ? `${user.nom || ''} ${user.prenom || user.username || ''}`.trim()
    : 'Ahmed Ali';

  return (
    <header className="topbar">
      {/* Welcome text */}
      <div className="topbar-welcome">
        <h2>
          {title || <>Bienvenue, <span>{fullName} !</span></>}
        </h2>
        <p>{subtitle || 'Assistant intelligent pour le support ERP'}</p>
      </div>

      {/* Center logo */}
      <div className="topbar-logo">
        <img src={banLogo} alt="BAN" />
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        {/* Search */}
        <div className="topbar-search">
          <span style={{ color: 'var(--ban-gray-400)', fontSize: '14px' }}>🔍</span>
          <input type="text" placeholder="Rechercher..." />
        </div>

        {/* Notifications */}
        <button
          id="notif-btn"
          className="icon-btn"
          title="Notifications"
        >
          🔔
          {notifCount > 0 && (
            <span className="notif-badge">{notifCount}</span>
          )}
        </button>

        {/* User button */}
        <div className="topbar-user-btn" onClick={() => navigate('/settings')}>
          <div className="topbar-avatar">{initials}</div>
          <div className="topbar-user-info">
            <span className="user-name">{fullName}</span>
            <span className="user-role">{user?.role || 'Consultant'}</span>
          </div>
          <span style={{ color: 'var(--ban-gray-400)', fontSize: '12px' }}>▾</span>
        </div>
      </div>
    </header>
  );
}

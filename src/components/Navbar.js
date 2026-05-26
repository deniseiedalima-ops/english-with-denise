import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const TIPO_COLORS = {
  '📚 Estudo':   { bg: '#e6f1fb', border: '#378add', text: '#0C447C' },
  '⚡ Urgente':  { bg: '#fee', border: '#e02020', text: '#8b0000' },
  '✅ Tarefa':   { bg: '#e1f5ee', border: '#1d9e75', text: '#085041' },
  '🎉 Novidade': { bg: '#fffbe6', border: '#d4a017', text: '#6b4c00' },
  '💡 Dica':     { bg: '#fff1e8', border: '#ff6a00', text: '#7a2e00' },
};

export default function Navbar({ user, student, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifIndex, setNotifIndex] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_dismissed_notifs') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    const token = process.env.REACT_APP_NOTION_TOKEN;
    const dbId = '609ab0b0d2344691b51aab5425f29169';

    if (!token) return;

    fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Ativa', checkbox: { equals: true } },
        sorts: [{ property: 'Data', direction: 'descending' }],
        page_size: 10,
      }),
    })
      .then(r => r.json())
      .then(data => {
        const notifs = (data.results || [])
          .map(page => ({
            id: page.id,
            message: page.properties['Mensagem']?.title?.[0]?.plain_text || '',
            tipo: page.properties['Tipo']?.select?.name || '📚 Estudo',
          }))
          .filter(n => n.message && !dismissed.includes(n.id));
        setNotifications(notifs);
      })
      .catch(() => {});
  }, []);

  const dismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('ewd_dismissed_notifs', JSON.stringify(updated));
    setNotifications(prev => prev.filter(n => n.id !== id));
    setNotifIndex(0);
  };

  const currentNotif = notifications[notifIndex] || null;
  const tipoStyle = currentNotif ? (TIPO_COLORS[currentNotif.tipo] || TIPO_COLORS['📚 Estudo']) : null;

  const initials = (user?.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div className="navbar-wrapper">
      {/* Notification bar */}
      {currentNotif && (
        <div className="notif-bar" style={{ background: tipoStyle.bg, borderBottom: `2px solid ${tipoStyle.border}` }}>
          <div className="notif-bar-inner">
            <span className="notif-tipo" style={{ color: tipoStyle.text }}>{currentNotif.tipo}</span>
            <span className="notif-message" style={{ color: tipoStyle.text }}>{currentNotif.message}</span>
            <div className="notif-actions">
              {notifications.length > 1 && (
                <span className="notif-count" style={{ color: tipoStyle.text }}>
                  {notifIndex + 1}/{notifications.length}
                  <button className="notif-nav" onClick={() => setNotifIndex(i => (i + 1) % notifications.length)}>›</button>
                </span>
              )}
              <button className="notif-dismiss" style={{ color: tipoStyle.text }} onClick={() => dismiss(currentNotif.id)}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Main navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo" onClick={() => navigate('/')}>
            <span className="navbar-star">✦</span>
            <span className="navbar-brand">English <span>With Denise</span></span>
          </div>

          <div className="navbar-links">
            {[
              { label: 'Dashboard', path: '/' },
              { label: 'Practice Hub', path: '/hub' },
            ].map(l => (
              <div key={l.path} className={`navbar-link ${location.pathname === l.path ? 'active' : ''}`}
                onClick={() => navigate(l.path)}>
                {l.label}
              </div>
            ))}
          </div>

          <div className="navbar-right">
            <div className="navbar-user" onClick={() => setMenuOpen(!menuOpen)}>
              {user?.picture
                ? <img src={user.picture} alt="" className="navbar-avatar-img" />
                : <div className="navbar-avatar">{initials}</div>
              }
              <span className="navbar-username">{student?.nome?.split(' ')[0] || user?.name?.split(' ')[0]}</span>
              <span className="navbar-chevron">▾</span>
            </div>

            {menuOpen && (
              <div className="navbar-dropdown">
                <div className="dropdown-info">
                  <div className="dropdown-name">{student?.nome || user?.name}</div>
                  <div className="dropdown-email">{user?.email}</div>
                  <div className="dropdown-level">{student?.nivel || '—'}</div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-logout" onClick={onLogout}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

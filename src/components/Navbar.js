import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, student, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
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
            { label: '🏆 Challenge', path: '/community' },
          ].map(l => (
            <div key={l.path}
              className={`navbar-link ${location.pathname === l.path ? 'active' : ''}`}
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
  );
}

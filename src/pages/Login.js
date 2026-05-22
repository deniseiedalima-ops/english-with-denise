import React, { useState, useEffect } from 'react';
import { getStudentByEmail } from '../notion';
import './Login.css';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  const initGoogle = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: 300, text: 'signin_with' }
    );
  };

  const handleCredential = async (response) => {
    setLoading(true);
    setError('');
    try {
      // Decode JWT to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      // Look up student in Notion
      const student = await getStudentByEmail(email);
      if (!student) {
        setError('Email not found. Please contact Denise to register.');
        setLoading(false);
        return;
      }

      onLogin({ email, name, picture }, student);
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Stars
  const stars = Array.from({ length: 8 }, (_, i) => ({
    top: `${[8,15,72,88,35,60,25,92][i]}%`,
    left: `${[5,92,3,85,97,1,48,88][i]}%`,
    size: [3,2,4,3,2,2,1.5,3][i],
    op: [0.4,0.3,0.5,0.4,0.3,0.3,0.2,0.35][i],
    d: ['3s','4s','5s','3s','4.5s','3.5s','5s','3s'][i],
    delay: ['0s','1s','0.5s','2s','1.5s','0.8s','3s','2.5s'][i],
  }));

  return (
    <div className="login-page">
      {stars.map((s, i) => (
        <div key={i} className="star" style={{
          top: s.top, left: s.left,
          width: s.size, height: s.size,
          '--op': s.op, '--d': s.d, '--delay': s.delay,
        }} />
      ))}

      <div className="login-card fade-up">
        <div className="login-logo">
          <span className="login-star-icon">✦</span>
          <div>
            <div className="login-brand">English</div>
            <div className="login-brand-sub">with Denise</div>
          </div>
        </div>

        <div className="login-divider" />

        <h1 className="login-title">Welcome back!</h1>
        <p className="login-subtitle">Sign in with your Google account to access your personalized English journey.</p>

        {loading ? (
          <div className="login-loading">
            <div className="spinner" />
            <span>Finding your profile...</span>
          </div>
        ) : (
          <div id="google-btn" className="login-google-btn-wrap" />
        )}

        {error && <div className="login-error">{error}</div>}

        <p className="login-footer">
          Don't have access? <a href="mailto:denise@englishwithdenise.com">Contact Denise</a>
        </p>
      </div>

      <div className="login-bg-text">A1 · A2 · B1 · B2</div>
    </div>
  );
}

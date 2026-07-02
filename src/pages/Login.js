import React, { useState, useEffect } from 'react';
import { getStudentByEmail, addToWaitlist } from '../notion';
import './Login.css';

export const ADMIN_EMAIL = 'denise.ieda.lima@gmail.com';

// Scopes: openid + email + profile + calendar (read-only)
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar.readonly',
].join(' ');

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [waitlistSent, setWaitlistSent] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  useEffect(() => {
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

    // Standard id_token login button (for students)
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: 300, text: 'signin_with' }
    );

    // OAuth2 token client for admin (requests calendar scope)
    window._gCalClient = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: handleAdminToken,
    });
  };

  // Called when student signs in with ID button
  const handleCredential = async (response) => {
    setLoading(true);
    setError('');
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const { email, name, picture } = payload;

      // If admin, request calendar access token instead
      if (email === ADMIN_EMAIL) {
        // Store id_token info temporarily, then request calendar scope
        window._pendingAdminUser = { email, name, picture };
        window._gCalClient.requestAccessToken();
        return;
      }

      const student = await getStudentByEmail(email);
      if (!student) {
        setWaitlistEmail(email);
        setWaitlistName(name);
        setShowWaitlist(true);
        setLoading(false);
        return;
      }

      onLogin({ email, name, picture }, student);
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Called when admin gets calendar access token
  const handleAdminToken = async (tokenResponse) => {
    try {
      if (tokenResponse.error) {
        setError('Calendar access denied. Please try again.');
        setLoading(false);
        return;
      }

      const pending = window._pendingAdminUser || {};
      const accessToken = tokenResponse.access_token;

      // Save access token for calendar API calls
      localStorage.setItem('ewd_gcal_token', accessToken);
      localStorage.setItem('ewd_gcal_expiry', Date.now() + (tokenResponse.expires_in * 1000));

      onLogin(
        { email: pending.email, name: pending.name, picture: pending.picture },
        null // admin has no student profile
      );
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleWaitlistSubmit = async () => {
    if (!waitlistName.trim()) return;
    setWaitlistLoading(true);
    const ok = await addToWaitlist(waitlistName, waitlistEmail, waitlistMsg);
    setWaitlistLoading(false);
    if (ok) setWaitlistSent(true);
  };

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

        {waitlistSent ? (
          <div className="waitlist-success">
            <div className="waitlist-success-icon">🎉</div>
            <h2 className="waitlist-success-title">Request sent!</h2>
            <p className="waitlist-success-text">
              Denise will review your request and get back to you soon. Keep an eye on your email!
            </p>
            <button className="waitlist-back-btn" onClick={() => { setShowWaitlist(false); setWaitlistSent(false); }}>
              ← Back to login
            </button>
          </div>

        ) : showWaitlist ? (
          <div className="waitlist-form">
            <div className="waitlist-icon">📬</div>
            <h2 className="waitlist-title">Request access</h2>
            <p className="waitlist-subtitle">
              Your email <strong>{waitlistEmail}</strong> is not registered yet. Fill in the form and Denise will add you!
            </p>

            <div className="waitlist-field">
              <label>Your name</label>
              <input
                type="text"
                value={waitlistName}
                onChange={e => setWaitlistName(e.target.value)}
                placeholder="Full name"
                className="waitlist-input"
              />
            </div>

            <div className="waitlist-field">
              <label>Message (optional)</label>
              <textarea
                value={waitlistMsg}
                onChange={e => setWaitlistMsg(e.target.value)}
                placeholder="Ex: I'm interested in starting A1 classes..."
                className="waitlist-textarea"
                rows={3}
              />
            </div>

            <button
              className="waitlist-submit-btn"
              onClick={handleWaitlistSubmit}
              disabled={waitlistLoading || !waitlistName.trim()}
            >
              {waitlistLoading ? 'Sending...' : 'Send request ✦'}
            </button>
            <button className="waitlist-back-btn" onClick={() => setShowWaitlist(false)}>
              ← Back to login
            </button>
          </div>

        ) : (
          <>
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
              Don't have access yet? Sign in with Google and request access!
            </p>
          </>
        )}
      </div>

      <div className="login-bg-text">A1 · A2 · B1 · B2</div>
    </div>
  );
}

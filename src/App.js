import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminPreview from './pages/AdminPreview';
import Teap from './pages/Teap';
import TeapSimulados from './pages/TeapSimulados';
import TeapSimuladoExam from './pages/TeapSimuladoExam';

export const ADMIN_EMAIL = 'denise.ieda.lima@gmail.com';
export const P1_EMAILS = ['yaraandrade19912@gmail.com'];
const SESSION_MS = 10 * 60 * 1000; // 10 minutes

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ewd_user'));
      const t = parseInt(localStorage.getItem('ewd_login_time') || '0');
      if (!u || Date.now() - t > SESSION_MS) {
        localStorage.removeItem('ewd_user');
        localStorage.removeItem('ewd_student');
        localStorage.removeItem('ewd_login_time');
        return null;
      }
      return u;
    } catch { return null; }
  });
  const [student, setStudent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_student')) || null; }
    catch { return null; }
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(0);

  const handleLogout = useCallback(() => {
    setUser(null);
    setStudent(null);
    localStorage.removeItem('ewd_user');
    localStorage.removeItem('ewd_student');
    localStorage.removeItem('ewd_login_time');
  }, []);

  // Auto-logout timer — fires even in bookmark/PWA
  useEffect(() => {
    if (!user) return;
    const t = parseInt(localStorage.getItem('ewd_login_time') || '0');
    const remaining = SESSION_MS - (Date.now() - t);
    if (remaining <= 0) { handleLogout(); return; }
    const timer = setTimeout(handleLogout, remaining);
    return () => clearTimeout(timer);
  }, [user, handleLogout]);

  // Check expiry when app comes back from background
  useEffect(() => {
    if (!user) return;
    const check = () => {
      if (document.visibilityState !== 'visible') return;
      const t = parseInt(localStorage.getItem('ewd_login_time') || '0');
      if (Date.now() - t > SESSION_MS) { handleLogout(); return; }
      refreshStudent(user.email);
    };
    document.addEventListener('visibilitychange', check);
    return () => document.removeEventListener('visibilitychange', check);
  }, [user, handleLogout]);

  const refreshStudent = useCallback(async (email) => {
    if (!email) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/index?route=notion&email=${encodeURIComponent(email)}&t=${Date.now()}`);
      const data = await res.json();
      if (data.student) {
        setStudent(data.student);
        localStorage.setItem('ewd_student', JSON.stringify(data.student));
        setLastRefresh(Date.now());
      }
    } catch { /* offline — use cache */ }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (user?.email) refreshStudent(user.email);
  }, [user?.email]);

  const handleLogin = (googleUser, studentData) => {
    localStorage.setItem('ewd_login_time', Date.now().toString());
    localStorage.setItem('ewd_user', JSON.stringify(googleUser));
    localStorage.setItem('ewd_student', JSON.stringify(studentData));
    setUser(googleUser);
    setStudent(studentData);
    refreshStudent(googleUser.email);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          !user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />
        } />
        <Route path="/" element={
          user
            ? <Dashboard
                key={lastRefresh}
                user={user}
                student={student}
                onLogout={handleLogout}
                refreshing={refreshing}
                onRefresh={() => refreshStudent(user.email)}
              />
            : <Navigate to="/login" replace />
        } />
        <Route path="/admin" element={
          user?.email === ADMIN_EMAIL
            ? <Admin user={user} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="/admin/preview/:studentEmail" element={
          user?.email === ADMIN_EMAIL
            ? <AdminPreview user={user} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="/teap" element={
          user && student?.programa === 'TEAP'
            ? <Teap user={user} student={student} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="/teap/simulados" element={
          user && student?.programa === 'TEAP'
            ? <TeapSimulados user={user} student={student} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="/teap/simulados/:id" element={
          user && student?.programa === 'TEAP'
            ? <TeapSimuladoExam user={user} student={student} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

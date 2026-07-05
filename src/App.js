import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminPreview from './pages/AdminPreview';

export const ADMIN_EMAIL = 'denise.ieda.lima@gmail.com';
export const P1_EMAILS = ['yaraandrade19912@gmail.com'];

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_user')) || null; }
    catch { return null; }
  });
  const [student, setStudent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_student')) || null; }
    catch { return null; }
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(0);

  const refreshStudent = useCallback(async (email) => {
    if (!email) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/notion?email=${encodeURIComponent(email)}&t=${Date.now()}`);
      const data = await res.json();
      if (data.student) {
        // Directly update state — Dashboard re-renders automatically
        setStudent(data.student);
        localStorage.setItem('ewd_student', JSON.stringify(data.student));
        setLastRefresh(Date.now());
      }
    } catch (e) {
      console.log('Offline — using cached data');
    }
    setRefreshing(false);
  }, []);

  // Refresh on mount (covers PWA/bookmark open)
  useEffect(() => {
    if (user?.email) refreshStudent(user.email);
  }, [user?.email]);

  // Refresh when tab/app becomes visible again (user switches back)
  useEffect(() => {
    if (!user?.email) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshStudent(user.email);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user?.email, refreshStudent]);

  const handleLogin = (googleUser, studentData) => {
    setUser(googleUser);
    setStudent(studentData);
    localStorage.setItem('ewd_user', JSON.stringify(googleUser));
    localStorage.setItem('ewd_student', JSON.stringify(studentData));
    // Fetch fresh data immediately after login too
    refreshStudent(googleUser.email);
  };

  const handleLogout = () => {
    setUser(null);
    setStudent(null);
    localStorage.removeItem('ewd_user');
    localStorage.removeItem('ewd_student');
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
                key={lastRefresh} // Forces full re-render when data updates
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

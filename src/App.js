import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminPreview from './pages/AdminPreview';

export const ADMIN_EMAIL = 'englishwithdenise.idiomas@gmail.com';
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

  const handleLogin = (googleUser, studentData) => {
    setUser(googleUser);
    setStudent(studentData);
    localStorage.setItem('ewd_user', JSON.stringify(googleUser));
    localStorage.setItem('ewd_student', JSON.stringify(studentData));
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
          user ? <Dashboard user={user} student={student} onLogout={handleLogout} /> : <Navigate to="/login" replace />
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

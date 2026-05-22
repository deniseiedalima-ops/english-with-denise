import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';

// ─── NOTION CONFIG ──────────────────────────────────────────
// Paste your Notion Integration Token in .env as REACT_APP_NOTION_TOKEN
// Students DB ID: 368628bb387c80259882da13d7e2ed1d
// Agenda DB ID:   20d1f53be0104838a9e452246edfa737
// ────────────────────────────────────────────────────────────

export const NOTION_TOKEN = process.env.REACT_APP_NOTION_TOKEN || '';
export const STUDENTS_DB  = '368628bb387c80259882da13d7e2ed1d';
export const AGENDA_DB    = '20d1f53be0104838a9e452246edfa737';

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
        <Route path="/practice/:skill" element={
          user ? <Practice user={user} student={student} onLogout={handleLogout} /> : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

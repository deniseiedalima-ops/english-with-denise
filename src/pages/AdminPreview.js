import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const ADMIN_EMAIL = 'englishwithdenise.idiomas@gmail.com';

export default function AdminPreview({ user, onLogout }) {
  const { studentEmail } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) { navigate('/'); return; }
    loadStudent();
  }, [studentEmail]);

  const loadStudent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notion?email=${encodeURIComponent(studentEmail)}`);
      const data = await res.json();
      setStudentData(data.student || null);
    } catch {}
    setLoading(false);
  };

  if (user?.email !== ADMIN_EMAIL) return null;

  const fakeUser = {
    email: studentEmail,
    name: studentData?.nome || studentEmail,
    picture: null,
  };

  return (
    <div>
      {/* Preview banner */}
      <div style={{
        background: '#111', color: '#fff', padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 13, fontFamily: 'DM Sans, sans-serif', gap: 12, flexWrap: 'wrap',
        position: 'sticky', top: 0, zIndex: 999,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>👁️</span>
          <strong>Modo Preview</strong>
          <span style={{ color: '#aaa' }}>—</span>
          <span>Você está vendo o app como:</span>
          <strong style={{ color: '#ff6a00' }}>{studentData?.nome || studentEmail}</strong>
          <span style={{ background: '#333', color: '#ff6a00', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
            {studentData?.nivel || '—'}
          </span>
        </div>
        <button
          onClick={() => navigate('/admin')}
          style={{
            background: '#ff6a00', color: '#fff', border: 'none',
            borderRadius: 8, padding: '6px 14px', fontSize: 12,
            fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}
        >
          ← Voltar ao Admin
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888', fontFamily: 'DM Sans, sans-serif' }}>
          Carregando dados do aluno...
        </div>
      ) : (
        <Dashboard
          user={fakeUser}
          student={studentData}
          onLogout={() => navigate('/admin')}
          isPreview={true}
        />
      )}
    </div>
  );
}

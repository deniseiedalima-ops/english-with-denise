import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './TeapSimulados.css';

export default function TeapSimulados({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [simulados, setSimulados] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/index?route=teap-simulados-list&email=${encodeURIComponent(user?.email || '')}`);
        const json = await res.json();
        if (!active) return;
        setSimulados(json.simulados || []);
      } catch {
        if (active) setError(true);
      }
    })();
    return () => { active = false; };
  }, [user?.email]);

  return (
    <div className="tsim-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="tsim-content">
        <button className="tsim-back" onClick={() => navigate('/teap')}>← Painel TEAP</button>
        <h1 className="tsim-title">Simulados</h1>

        {error && <p className="tsim-empty">Não foi possível carregar os simulados agora.</p>}
        {!error && simulados === null && <p className="tsim-empty">Carregando...</p>}
        {!error && simulados && simulados.length === 0 && (
          <p className="tsim-empty">Nenhum simulado disponível ainda. Volte em breve.</p>
        )}

        {simulados && simulados.map(s => (
          <div
            key={s.id}
            className="tsim-card"
            onClick={() => navigate(`/teap/simulados/${s.id}`)}
          >
            <div>
              <div className="tsim-card-title">{s.titulo}</div>
              <div className="tsim-card-sub">2 textos · 20 questões{s.area ? ` · ${s.area}` : ''}</div>
            </div>
            {s.status === 'concluido'
              ? <div className="tsim-badge tsim-badge-done">{s.nota}%</div>
              : <div className="tsim-badge tsim-badge-start">Iniciar</div>}
          </div>
        ))}
      </main>
    </div>
  );
}

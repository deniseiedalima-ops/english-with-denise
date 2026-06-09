import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Admin.css';

const ADMIN_EMAIL = 'englishwithdenise.idiomas@gmail.com';
const NOTION_TOKEN = process.env.REACT_APP_NOTION_TOKEN || '';
const STUDENTS_DB = '368628bb387c80259882da13d7e2ed1d';

const LEVEL_COLORS = {
  'A1': '#ff6a00', 'A1→A2': '#ff9a3c', 'A2': '#1d9e75',
  'B1 iniciante': '#2e86c1', 'B1': '#2e86c1', 'B2': '#7f77dd', 'P1': '#d4537e',
};

export default function Admin({ user, onLogout }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Protect route
  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.notion.com/v1/databases/${STUDENTS_DB}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ property: 'Nome', direction: 'ascending' }],
          page_size: 100,
        }),
      });
      const data = await res.json();
      const list = (data.results || []).map(page => {
        const p = page.properties;
        return {
          id: page.id,
          nome: p['Nome']?.title?.[0]?.plain_text || '—',
          email: p['E-mail']?.email || '—',
          nivel: p['Nível']?.select?.name || '—',
          codigo: p['Código']?.number || '—',
          tarefaPersonalizada: p['Tarefa Personalizada']?.rich_text?.[0]?.plain_text || '',
          paginasDoLivro: p['Páginas do Livro']?.rich_text?.[0]?.plain_text || '',
          tarefaDaSemana: p['Tarefa da Semana']?.rich_text?.[0]?.plain_text || '',
          meetLink: p['Link Google Meet']?.url || '',
          classroomLink: p['Link Classroom']?.url || '',
          reposicoes: p['Reposições']?.number ?? null,
          dataReposicao: p['Data Reposição']?.date?.start || null,
        };
      });
      setStudents(list);
    } catch (err) {
      console.error('Error loading students:', err);
    }
    setLoading(false);
  };

  const filtered = students.filter(s =>
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.nivel.toLowerCase().includes(search.toLowerCase())
  );

  const levelCounts = students.reduce((acc, s) => {
    acc[s.nivel] = (acc[s.nivel] || 0) + 1;
    return acc;
  }, {});

  if (user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="admin-page">
      <Navbar user={user} student={null} onLogout={onLogout} />
      <main className="admin-content">

        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="admin-badge">👑 Admin</div>
            <h1 className="admin-title">Painel da Professora</h1>
            <p className="admin-sub">Gerencie seus alunos e visualize o app como eles veem</p>
          </div>
          <button className="admin-refresh-btn" onClick={loadStudents}>↻ Atualizar</button>
        </div>

        {/* Stats row */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="admin-stat-num">{students.length}</div>
            <div className="admin-stat-label">Total de alunos</div>
          </div>
          {Object.entries(levelCounts).map(([lvl, cnt]) => (
            <div key={lvl} className="admin-stat-card" style={{ borderTopColor: LEVEL_COLORS[lvl] || '#aaa' }}>
              <div className="admin-stat-num" style={{ color: LEVEL_COLORS[lvl] || '#aaa' }}>{cnt}</div>
              <div className="admin-stat-label">{lvl}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="admin-search-wrap">
          <input
            className="admin-search"
            placeholder="🔍  Buscar por nome, email ou nível..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Students list */}
        {loading ? (
          <div className="admin-loading">Carregando alunos... ✨</div>
        ) : (
          <div className="admin-students-grid">
            {filtered.map(student => (
              <div
                key={student.id}
                className={`admin-student-card ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
              >
                <div className="admin-student-top">
                  <div className="admin-student-avatar">
                    {(student.nome || 'A')[0].toUpperCase()}
                  </div>
                  <div className="admin-student-info">
                    <div className="admin-student-name">{student.nome}</div>
                    <div className="admin-student-email">{student.email}</div>
                  </div>
                  <div
                    className="admin-student-nivel"
                    style={{ background: LEVEL_COLORS[student.nivel] || '#aaa' }}
                  >
                    {student.nivel}
                  </div>
                </div>

                {/* Expanded details */}
                {selectedStudent?.id === student.id && (
                  <div className="admin-student-details">
                    <div className="admin-detail-divider" />

                    {/* Agenda preview */}
                    <div className="admin-detail-section">
                      <div className="admin-detail-title">📅 Agenda do aluno</div>
                      {student.tarefaPersonalizada ? (
                        <div className="admin-detail-block green">
                          <div className="admin-detail-label">✅ Before class</div>
                          <div className="admin-detail-text">{student.tarefaPersonalizada}</div>
                        </div>
                      ) : <div className="admin-detail-empty">Sem tarefa pré-aula</div>}

                      {student.paginasDoLivro ? (
                        <div className="admin-detail-block blue">
                          <div className="admin-detail-label">📖 Book pages</div>
                          <div className="admin-detail-text">{student.paginasDoLivro}</div>
                        </div>
                      ) : null}

                      {student.tarefaDaSemana ? (
                        <div className="admin-detail-block orange">
                          <div className="admin-detail-label">🗓️ This week's task</div>
                          <div className="admin-detail-text">{student.tarefaDaSemana}</div>
                        </div>
                      ) : null}
                    </div>

                    {/* Reposições */}
                    {student.reposicoes > 0 && (
                      <div className="admin-detail-section">
                        <div className="admin-detail-title">🔄 Reposições</div>
                        <div className="admin-detail-block orange">
                          <div className="admin-detail-text">
                            {student.reposicoes} aula{student.reposicoes > 1 ? 's' : ''} pendente{student.reposicoes > 1 ? 's' : ''}
                            {student.dataReposicao && ` · ${new Date(student.dataReposicao + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}`}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="admin-detail-links">
                      {student.meetLink && (
                        <a href={student.meetLink} target="_blank" rel="noreferrer" className="admin-link-btn meet">
                          📹 Meet
                        </a>
                      )}
                      {student.classroomLink && (
                        <a href={student.classroomLink} target="_blank" rel="noreferrer" className="admin-link-btn classroom">
                          🎓 Classroom
                        </a>
                      )}
                      <a
                        href={`https://www.notion.so/${student.id.replace(/-/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-link-btn notion"
                      >
                        📋 Notion
                      </a>
                      <button
                        className="admin-link-btn preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/preview/${student.email}`);
                        }}
                      >
                        👁️ Ver como aluno
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="admin-empty">Nenhum aluno encontrado para "{search}"</div>
        )}

      </main>
    </div>
  );
}

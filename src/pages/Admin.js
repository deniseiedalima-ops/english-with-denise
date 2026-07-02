import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Admin.css';

const ADMIN_EMAIL = 'denise.ieda.lima@gmail.com';

const LEVEL_COLORS = {
  'A1': '#ff6a00', 'A1→A2': '#ff9a3c', 'A2': '#1d9e75',
  'B1 iniciante': '#2e86c1', 'B1': '#2e86c1', 'B2': '#7f77dd', 'P1': '#d4537e',
};

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MES_ATUAL_IDX = new Date().getMonth();
const ALUNOS_FINANCEIRO = [
  ['Débora Oliveira da Silva',200,10],['Thais de Fátima Aleixo Correa',200,10],
  ['Yara Naya Lopes de Andrade',600,10],['Maria Isabella Costa Silva',250,10],
  ['Vitor Axel Eduardo Clemente',250,10],['Sabrina Lacerda Cunha',400,10],
  ['Thawany Camila da Silva Costa',350,10],['Gustavo Mailho Machado',320,10],
  ['Isadora Lacerda Cunha',400,10],['Virginia Guerra Magre',180,10],
  ['Rafael Fontes Feitosa',320,10],['Roberta Leticia Rocha Silva',400,10],
  ['Ana Karoline Sobreiro Silva',350,10],['Thaís Monteiro Botelho Teles',190,15],
  ['Antonio Kawan Freitas Damasceno Pereira',190,15],['Lorenna Benicio',180,15],
  ['Claudia Abreu Silva',180,15],['Yasmim Araujo Silva',180,15],
  ['Raphaella Fonseca',140,15],['Romana Rebeca Barros',200,15],
  ['Emilly Fonseca',100,10],['Geovanna Inácio Araújo',200,10],
  ['Pedro Henrique Lustosa Soares',250,10],['Isabella Rissi Vincentini',250,10],
  ['Júlio Magre Guerra',0,15],['Alex Campos',320,10],['Lucinara Cunha',320,10],
];

const SK = 'ewd_admin_v1';
function loadLocal() { try { return JSON.parse(localStorage.getItem(SK)) || {}; } catch { return {}; } }
function saveLocal(data) { localStorage.setItem(SK, JSON.stringify(data)); }
function todayKey() { return new Date().toISOString().slice(0, 10); }
function fmtMoney(v) { return (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); }
function fmtDate(iso) { if (!iso) return ''; const [, m, d] = iso.split('-'); return `${d}/${m}`; }
function fmtDateFull(iso) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getFinStatus(nome, venc, mesIdx, pagStore) {
  const mes = MESES[mesIdx];
  const rec = pagStore[mes]?.[nome];
  if (rec?.dataPgto) return 'pago';
  if (rec?.manualAguardando) return 'aguardando';
  if (mesIdx < MES_ATUAL_IDX) return 'atrasado';
  if (mesIdx > MES_ATUAL_IDX) return 'futuro';
  return new Date().getDate() > venc ? 'atrasado' : 'aguardando';
}

function getCalToken() { return localStorage.getItem('ewd_gcal_token') || ''; }

const TABS = [
  { id: 'agenda',     label: '📅 Agenda',     icon: '📅' },
  { id: 'presenca',   label: '📋 Presença',   icon: '📋' },
  { id: 'financeiro', label: '💰 Financeiro', icon: '💰' },
  { id: 'notas',      label: '📝 Notas',      icon: '📝' },
  { id: 'empresa',    label: '🏫 Empresa',    icon: '🏫' },
];

const STATUS_META = {
  presente:     { label: 'Presente',       color: '#1d9e75', bg: '#f0faf5', icon: '✅' },
  falta:        { label: 'Falta',          color: '#e53935', bg: '#fdf3f3', icon: '❌' },
  rep_pendente: { label: 'Rep. Pendente',  color: '#ff6a00', bg: '#fff6f0', icon: '🔄' },
  rep_feita:    { label: 'Rep. Feita',     color: '#5c6bc0', bg: '#f4f3fc', icon: '✔️' },
  rep_falta:    { label: 'Rep. c/ Falta',  color: '#f9a825', bg: '#fefcf0', icon: '⚠️' },
};

export default function Admin({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('agenda');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState(loadLocal);

  useEffect(() => { if (user?.email !== ADMIN_EMAIL) navigate('/'); }, [user]);

  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(d => setStudents(d.students || []))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((updater) => {
    setLocal(prev => { const next = updater(prev); saveLocal(next); return next; });
  }, []);

  if (user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="admin-page">
      <Navbar user={user} student={null} onLogout={onLogout} />
      <main className="admin-content">
        <div className="admin-header">
          <div>
            <div className="admin-badge">👑 Admin</div>
            <h1 className="admin-title">English With Denise</h1>
            <p className="admin-sub">Painel de Gestão da Escola</p>
          </div>
          <div className="admin-date-badge">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`admin-tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label.replace(/^\S+\s/, '')}</span>
            </button>
          ))}
        </div>

        {activeTab === 'agenda'     && <TabAgenda />}
        {activeTab === 'presenca'   && <TabPresenca students={students} loading={loading} local={local} persist={persist} navigate={navigate} />}
        {activeTab === 'financeiro' && <TabFinanceiro local={local} persist={persist} />}
        {activeTab === 'notas'      && <TabNotas students={students} loading={loading} local={local} persist={persist} />}
        {activeTab === 'empresa'    && <TabEmpresa local={local} persist={persist} />}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: PRESENÇA (com histórico)
// ══════════════════════════════════════════════════════════════════════════════
function TabPresenca({ students, loading, local, persist, navigate }) {
  const [view, setView] = useState('hoje'); // 'hoje' | 'historico'
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [histDate, setHistDate] = useState(todayKey());
  const [histAluno, setHistAluno] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const today = todayKey();

  const getStatus = (id, date = today) => local.presenca?.[date]?.[id] || null;

  const setStatus = (id, status, date = today) => {
    persist(prev => ({
      ...prev,
      presenca: {
        ...prev.presenca,
        [date]: { ...(prev.presenca?.[date] || {}), [id]: status },
      },
    }));
  };

  // All dates that have any records
  const allDates = Object.keys(local.presenca || {}).sort().reverse();

  // History for a specific student across all dates
  const getStudentHistory = (id) => {
    return allDates
      .map(date => ({ date, status: local.presenca?.[date]?.[id] || null }))
      .filter(r => r.status);
  };

  // Students present/absent on a specific date
  const getDateSummary = (date) => {
    const dayData = local.presenca?.[date] || {};
    return students.map(s => ({ student: s, status: dayData[s.id] || null }));
  };

  const STATUS_BTNS = [
    { key: 'presente',     emoji: '✅', title: 'Presente' },
    { key: 'falta',        emoji: '❌', title: 'Falta' },
    { key: 'rep_pendente', emoji: '🔄', title: 'Rep. Pendente' },
    { key: 'rep_feita',    emoji: '✔️', title: 'Rep. Feita' },
    { key: 'rep_falta',    emoji: '⚠️', title: 'Rep. c/ Falta' },
  ];

  const todayCounts = students.reduce((acc, s) => {
    const st = getStatus(s.id) || 'sem_registro';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const filteredStudents = students.filter(s => {
    const match = s.nome.toLowerCase().includes(search.toLowerCase());
    if (!match) return false;
    if (filterStatus === 'todos') return true;
    if (filterStatus === 'sem_registro') return !getStatus(s.id);
    return getStatus(s.id) === filterStatus;
  });

  // History filter
  const histResults = view === 'historico' ? (() => {
    if (histAluno) {
      const s = students.find(s => s.id === histAluno);
      if (!s) return [];
      return getStudentHistory(s.id).map(r => ({ ...r, student: s }));
    }
    if (histDate) {
      return getDateSummary(histDate)
        .filter(r => r.status)
        .map(r => ({ date: histDate, status: r.status, student: r.student }));
    }
    return [];
  })() : [];

  if (loading) return <div className="admin-loading">Carregando alunos... ✨</div>;

  return (
    <div className="tab-presenca">
      {/* View toggle */}
      <div className="presenca-view-toggle">
        <button className={`pv-btn ${view === 'hoje' ? 'active' : ''}`} onClick={() => setView('hoje')}>
          📅 Registro do Dia
        </button>
        <button className={`pv-btn ${view === 'historico' ? 'active' : ''}`} onClick={() => setView('historico')}>
          🗂️ Histórico
        </button>
      </div>

      {/* ── HOJE ── */}
      {view === 'hoje' && (
        <>
          {/* Summary */}
          <div className="presenca-summary">
            {[
              ['green',  'Presentes',    'presente'],
              ['red',    'Faltas',       'falta'],
              ['orange', 'Rep. Pend.',   'rep_pendente'],
              ['purple', 'Rep. Feita',   'rep_feita'],
              ['yellow', 'Rep. c/ Falta','rep_falta'],
              ['gray',   'Sem registro', 'sem_registro'],
            ].map(([cls, label, key]) => (
              <div key={key} className={`presenca-stat ${cls}`} onClick={() => setFilterStatus(key === filterStatus ? 'todos' : key)} style={{ cursor: 'pointer' }}>
                <span>{todayCounts[key] || 0}</span>
                <small>{label}</small>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="presenca-filters">
            <input className="admin-search" placeholder="🔍 Buscar aluno..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="filter-chips">
              {[['todos','Todos'],['sem_registro','⬜ Sem registro'],['presente','✅ Presentes'],['falta','❌ Faltas'],['rep_pendente','🔄 Rep.']].map(([key, label]) => (
                <button key={key} className={`chip ${filterStatus === key ? 'active' : ''}`} onClick={() => setFilterStatus(key)}>{label}</button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="presenca-list">
            {filteredStudents.map(s => {
              const st = getStatus(s.id);
              const meta = st ? STATUS_META[st] : null;
              const hist = getStudentHistory(s.id);
              const faltas = hist.filter(h => h.status === 'falta' || h.status === 'rep_falta').length;
              const expanded = expandedId === s.id;

              return (
                <div key={s.id} className={`presenca-row ${st || 'sem-registro'}`}>
                  <div className="presenca-info" onClick={() => setExpandedId(expanded ? null : s.id)} style={{ cursor: 'pointer' }}>
                    <div className="presenca-avatar" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa' }}>{s.nome[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="presenca-nome">{s.nome}</div>
                      <div className="presenca-nivel">
                        <span className="nivel-badge" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa' }}>{s.nivel}</span>
                        {meta && <span className="status-label" style={{ color: meta.color }}>{meta.icon} {meta.label}</span>}
                        {faltas > 0 && <span className="falta-count">{faltas} falta{faltas > 1 ? 's' : ''}</span>}
                      </div>
                      {/* Mini history inline */}
                      {expanded && (
                        <div className="presenca-hist-inline">
                          {hist.length === 0
                            ? <span className="hist-empty">Sem histórico ainda</span>
                            : hist.map(h => {
                                const m = STATUS_META[h.status];
                                return (
                                  <div key={h.date} className="hist-row">
                                    <span className="hist-date">{fmtDateFull(h.date)}</span>
                                    <span className="hist-badge" style={{ background: m?.bg, color: m?.color }}>{m?.icon} {m?.label}</span>
                                  </div>
                                );
                              })
                          }
                        </div>
                      )}
                    </div>
                    <span className="expand-chevron">{expanded ? '▲' : '▼'}</span>
                  </div>
                  <div className="presenca-actions">
                    {STATUS_BTNS.map(btn => (
                      <button
                        key={btn.key}
                        className={`presenca-btn ${st === btn.key ? 'active' : ''}`}
                        style={st === btn.key ? { background: STATUS_META[btn.key].color, color: '#fff', borderColor: STATUS_META[btn.key].color } : {}}
                        onClick={() => setStatus(s.id, st === btn.key ? null : btn.key)}
                        title={btn.title}
                      >{btn.emoji}</button>
                    ))}
                    <button className="presenca-btn view-btn" onClick={() => navigate(`/admin/preview/${s.email}`)} title="Ver como aluno">👁️</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── HISTÓRICO ── */}
      {view === 'historico' && (
        <div className="hist-panel">
          <div className="hist-filters">
            {/* Filter by date */}
            <div className="hist-filter-group">
              <label className="hist-label">📅 Ver por data</label>
              <input
                type="date"
                className="hist-date-input"
                value={histDate}
                onChange={e => { setHistDate(e.target.value); setHistAluno(''); }}
              />
            </div>
            <div className="hist-divider">ou</div>
            {/* Filter by student */}
            <div className="hist-filter-group">
              <label className="hist-label">👤 Ver por aluno</label>
              <select className="hist-aluno-sel" value={histAluno} onChange={e => { setHistAluno(e.target.value); setHistDate(''); }}>
                <option value="">Selecionar aluno...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
          </div>

          {/* Results */}
          {histAluno && (() => {
            const s = students.find(s => s.id === histAluno);
            const hist = getStudentHistory(s?.id);
            const faltas = hist.filter(h => h.status === 'falta' || h.status === 'rep_falta').length;
            const presencas = hist.filter(h => h.status === 'presente').length;
            const reps = hist.filter(h => h.status?.startsWith('rep')).length;

            return (
              <div className="hist-results">
                <div className="hist-student-header">
                  <div className="presenca-avatar" style={{ background: LEVEL_COLORS[s?.nivel] || '#aaa', width: 48, height: 48, fontSize: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{s?.nome[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{s?.nome}</div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{s?.nivel}</div>
                  </div>
                  <div className="hist-mini-stats">
                    <span className="hist-mini green">✅ {presencas} pres.</span>
                    <span className="hist-mini red">❌ {faltas} faltas</span>
                    <span className="hist-mini orange">🔄 {reps} rep.</span>
                  </div>
                </div>
                {hist.length === 0
                  ? <div className="hist-empty-msg">Nenhum registro encontrado para este aluno.</div>
                  : hist.map(h => {
                      const m = STATUS_META[h.status];
                      return (
                        <div key={h.date} className="hist-item">
                          <span className="hist-item-date">{fmtDateFull(h.date)}</span>
                          <span className="hist-item-badge" style={{ background: m?.bg, color: m?.color, border: `1px solid ${m?.color}` }}>{m?.icon} {m?.label}</span>
                        </div>
                      );
                    })
                }
              </div>
            );
          })()}

          {histDate && !histAluno && (() => {
            const summary = getDateSummary(histDate).filter(r => r.status);
            const faltas = summary.filter(r => r.status === 'falta' || r.status === 'rep_falta').length;
            const presencas = summary.filter(r => r.status === 'presente').length;

            return (
              <div className="hist-results">
                <div className="hist-date-header">
                  <span className="hist-date-title">{fmtDateFull(histDate)}</span>
                  <div className="hist-mini-stats">
                    <span className="hist-mini green">✅ {presencas} pres.</span>
                    <span className="hist-mini red">❌ {faltas} faltas</span>
                    <span className="hist-mini gray">📋 {summary.length} registros</span>
                  </div>
                </div>
                {summary.length === 0
                  ? <div className="hist-empty-msg">Nenhum registro para esta data.</div>
                  : summary.map(({ student: s, status }) => {
                      const m = STATUS_META[status];
                      return (
                        <div key={s.id} className="hist-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="presenca-avatar" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa', width: 30, height: 30, fontSize: 12, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{s.nome[0]}</div>
                            <span className="hist-item-date">{s.nome}</span>
                          </div>
                          <span className="hist-item-badge" style={{ background: m?.bg, color: m?.color, border: `1px solid ${m?.color}` }}>{m?.icon} {m?.label}</span>
                        </div>
                      );
                    })
                }
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: AGENDA
// ══════════════════════════════════════════════════════════════════════════════
function TabAgenda() {
  const [events, setEvents] = useState([]);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [view, setView] = useState('day');

  const fetchEvents = useCallback(async (dateStr) => {
    const token = getCalToken();
    if (!token) { setCalError('no_token'); return; }
    setCalLoading(true); setCalError('');
    try {
      const date = new Date(dateStr + 'T00:00:00');
      let timeMin, timeMax;
      if (view === 'week') {
        const day = date.getDay();
        const mon = new Date(date); mon.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
        const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
        timeMin = mon.toISOString();
        timeMax = new Date(sun.setHours(23,59,59,999)).toISOString();
      } else {
        timeMin = new Date(date.setHours(0,0,0,0)).toISOString();
        timeMax = new Date(date.setHours(23,59,59,999)).toISOString();
      }
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ timeMin, timeMax }),
      });
      if (res.status === 401) { setCalError('expired'); return; }
      const data = await res.json();
      if (data.error) { setCalError(data.error); return; }
      setEvents(data.events || []);
    } catch (e) { setCalError(e.message); }
    finally { setCalLoading(false); }
  }, [view]);

  useEffect(() => { fetchEvents(selectedDate); }, [selectedDate, view]);

  const changeDay = (delta) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const formatEventTime = (ev) => {
    if (ev.start?.date) return 'Dia inteiro';
    const s = ev.start?.dateTime ? new Date(ev.start.dateTime) : null;
    const e = ev.end?.dateTime ? new Date(ev.end.dateTime) : null;
    if (!s) return '';
    const fmt = t => t.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return e ? `${fmt(s)} – ${fmt(e)}` : fmt(s);
  };

  const isClass = (t='') => t.toLowerCase().includes('english class') || t.toLowerCase().includes('(rep)');
  const isRep   = (t='') => t.toLowerCase().includes('(rep)');
  const isPres  = (t='') => t.toLowerCase().includes('(pres)');

  const groupedByDate = events.reduce((acc, ev) => {
    const d = (ev.start?.dateTime || ev.start?.date || '').slice(0, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(ev);
    return acc;
  }, {});

  if (calError === 'no_token' || calError === 'expired') {
    return (
      <div className="cal-error-box">
        <div className="cal-error-icon">🔐</div>
        <div className="cal-error-title">{calError === 'expired' ? 'Sessão do Calendar expirada' : 'Agenda não conectada'}</div>
        <p className="cal-error-text">{calError === 'expired' ? 'Clique abaixo para reconectar.' : 'Faça logout e login novamente para conectar o Calendar.'}</p>
        <button className="cal-reauth-btn" onClick={() => window._gCalClient?.requestAccessToken()}>🔄 Reconectar</button>
      </div>
    );
  }

  return (
    <div className="tab-agenda">
      <div className="cal-controls">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => changeDay(view === 'week' ? -7 : -1)}>‹</button>
          <button className="cal-today-btn" onClick={() => setSelectedDate(todayKey())}>Hoje</button>
          <button className="cal-nav-btn" onClick={() => changeDay(view === 'week' ? 7 : 1)}>›</button>
        </div>
        <div className="cal-date-label">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <div className="cal-view-toggle">
          <button className={`cal-view-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>Dia</button>
          <button className={`cal-view-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Semana</button>
        </div>
        <button className="cal-refresh-btn" onClick={() => fetchEvents(selectedDate)}>↻</button>
      </div>
      {!calLoading && events.length > 0 && (
        <div className="cal-summary">
          <span className="cal-chip total">{events.length} eventos</span>
          <span className="cal-chip aulas">{events.filter(e => isClass(e.summary)).length} aulas</span>
          <span className="cal-chip reps">{events.filter(e => isRep(e.summary)).length} reposições</span>
        </div>
      )}
      {calLoading && <div className="cal-loading">Carregando agenda... 📅</div>}
      {calError && !calLoading && <div className="cal-inline-error">⚠️ {calError}</div>}
      {!calLoading && view === 'day' && (
        <div className="cal-day-list">
          {events.length === 0 && <div className="cal-empty">Nenhum evento para este dia 🎉</div>}
          {events.map(ev => {
            const title = ev.summary || '(sem título)';
            const rep = isRep(title); const pres = isPres(title); const cls = isClass(title);
            let accent = '#e0dbd4';
            if (rep) accent = '#e53935'; else if (pres) accent = '#9c27b0'; else if (cls) accent = '#ff6a00';
            return (
              <div key={ev.id} className="cal-event" style={{ borderLeftColor: accent }}>
                <div className="cal-event-time">{formatEventTime(ev)}</div>
                <div className="cal-event-title" style={{ color: rep ? '#e53935' : pres ? '#9c27b0' : cls ? '#ff6a00' : '#111' }}>{title}</div>
                {rep && <span className="cal-event-tag rep">REP</span>}
                {pres && <span className="cal-event-tag pres">PRES</span>}
              </div>
            );
          })}
        </div>
      )}
      {!calLoading && view === 'week' && (
        <div className="cal-week">
          {Object.entries(groupedByDate).sort().map(([date, evs]) => (
            <div key={date} className="cal-week-day">
              <div className="cal-week-day-header">
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                <span className="cal-week-count">{evs.length}</span>
              </div>
              {evs.map(ev => {
                const title = ev.summary || '(sem título)';
                const rep = isRep(title); const cls = isClass(title);
                let accent = '#e0dbd4';
                if (rep) accent = '#e53935'; else if (cls) accent = '#ff6a00';
                return (
                  <div key={ev.id} className="cal-event compact" style={{ borderLeftColor: accent }}>
                    <div className="cal-event-time">{formatEventTime(ev)}</div>
                    <div className="cal-event-title" style={{ color: rep ? '#e53935' : cls ? '#ff6a00' : '#111', fontSize: 13 }}>{title}</div>
                  </div>
                );
              })}
            </div>
          ))}
          {Object.keys(groupedByDate).length === 0 && <div className="cal-empty">Sem eventos esta semana 🎉</div>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: FINANCEIRO
// ══════════════════════════════════════════════════════════════════════════════
function TabFinanceiro({ local, persist }) {
  const [mesSel, setMesSel] = useState(MESES[MES_ATUAL_IDX]);
  const [filter, setFilter] = useState('todos');
  const pagStore = local.pagamentos || {};
  const mesIdx = MESES.indexOf(mesSel);

  const setPag = (nome, action) => {
    persist(prev => {
      const pg = { ...(prev.pagamentos || {}) };
      if (!pg[mesSel]) pg[mesSel] = {};
      if (action === 'pago') pg[mesSel][nome] = { dataPgto: todayKey() };
      else if (action === 'aguardando') pg[mesSel][nome] = { manualAguardando: true };
      else delete pg[mesSel][nome];
      return { ...prev, pagamentos: pg };
    });
  };

  const rows = ALUNOS_FINANCEIRO.map(([nome, valor, venc]) => ({
    nome, valor, venc,
    st: getFinStatus(nome, venc, mesIdx, pagStore),
    dataPgto: pagStore[mesSel]?.[nome]?.dataPgto || null,
  }));

  const filtered = filter === 'todos' ? rows : rows.filter(r => r.st === filter);
  filtered.sort((a, b) => { const o = { atrasado:0, aguardando:1, futuro:2, pago:3 }; return o[a.st]-o[b.st] || a.nome.localeCompare(b.nome); });

  const totalRecebido = rows.filter(r => r.st === 'pago').reduce((s, r) => s + r.valor, 0);
  const totalEsperado = rows.reduce((s, r) => s + r.valor, 0);

  const ST_META = {
    pago:      { label: '🟢 Em dia',       color: '#1d9e75' },
    atrasado:  { label: '🔴 Inadimplente', color: '#e53935' },
    aguardando:{ label: '🟡 Aguardando',   color: '#f9a825' },
    futuro:    { label: '⬜ Mês futuro',   color: '#aaa' },
  };

  return (
    <div className="tab-financeiro">
      <div className="fin-top-bar">
        <select className="fin-mes-sel" value={mesSel} onChange={e => setMesSel(e.target.value)}>
          {MESES.map(m => <option key={m} value={m}>{m}/2026</option>)}
        </select>
      </div>
      <div className="fin-stats">
        <div className="fin-stat"><span className="fin-val green">R$ {fmtMoney(totalRecebido)}</span><small>Recebido</small></div>
        <div className="fin-stat"><span className="fin-val">R$ {fmtMoney(totalEsperado)}</span><small>Esperado</small></div>
        <div className="fin-stat"><span className="fin-val green">{rows.filter(r=>r.st==='pago').length}</span><small>Em dia</small></div>
        <div className="fin-stat"><span className="fin-val red">{rows.filter(r=>r.st==='atrasado').length}</span><small>Inadimplentes</small></div>
      </div>
      <div className="filter-chips" style={{ marginBottom: 12 }}>
        {[['todos','Todos'],['atrasado','🔴 Inadimplentes'],['aguardando','🟡 Aguardando'],['pago','🟢 Em dia']].map(([k,l]) => (
          <button key={k} className={`chip ${filter===k?'active':''}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <div className="fin-list">
        {filtered.map(r => {
          const meta = ST_META[r.st];
          return (
            <div key={r.nome} className="fin-row">
              <div className="fin-info">
                <div className="fin-nome" style={{ color: meta.color }}>{r.nome}</div>
                <div className="fin-detalhe">R$ {fmtMoney(r.valor)} · vence dia {r.venc}{r.dataPgto ? ` · pago ${fmtDate(r.dataPgto)}` : ''}</div>
              </div>
              <div className="fin-btns">
                {r.st === 'pago'
                  ? <button className="fin-btn undo" onClick={() => setPag(r.nome, 'desfazer')}>✕ Desfazer</button>
                  : <>
                      <button className="fin-btn pay" onClick={() => setPag(r.nome, 'pago')}>✓ Pago</button>
                      {r.st !== 'aguardando' && <button className="fin-btn wait" onClick={() => setPag(r.nome, 'aguardando')}>⏳</button>}
                    </>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: NOTAS
// ══════════════════════════════════════════════════════════════════════════════
function TabNotas({ students, loading, local, persist }) {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const getNota = (id) => local.notas?.[id] || '';
  const setNota = (id, val) => persist(prev => ({ ...prev, notas: { ...(prev.notas||{}), [id]: val } }));
  if (loading) return <div className="admin-loading">Carregando... ✨</div>;
  return (
    <div className="tab-notas">
      <input className="admin-search" placeholder="🔍 Buscar aluno..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12 }} />
      <div className="notas-list">
        {students.filter(s => s.nome.toLowerCase().includes(search.toLowerCase())).map(s => {
          const nota = getNota(s.id); const open = openId === s.id;
          return (
            <div key={s.id} className={`nota-card ${open?'open':''}`}>
              <div className="nota-header" onClick={() => setOpenId(open ? null : s.id)}>
                <div className="nota-avatar" style={{ background: LEVEL_COLORS[s.nivel]||'#aaa' }}>{s.nome[0]}</div>
                <div className="nota-name-wrap">
                  <div className="nota-nome">{s.nome}</div>
                  {!open && nota && <div className="nota-preview">{nota.slice(0,60)}{nota.length>60?'…':''}</div>}
                </div>
                <span className="nota-chevron">{open?'▲':'▼'}</span>
              </div>
              {open && (
                <div className="nota-body">
                  <textarea className="nota-textarea" placeholder="Anotações, pendências, observações..." value={nota} onChange={e => setNota(s.id, e.target.value)} rows={5} />
                  {(s.tarefaPersonalizada||s.tarefaDaSemana||s.paginasDoLivro) && (
                    <div className="nota-notion-info">
                      {s.tarefaPersonalizada && <div className="notion-field green"><b>Before class:</b> {s.tarefaPersonalizada}</div>}
                      {s.tarefaDaSemana && <div className="notion-field orange"><b>Tarefa da semana:</b> {s.tarefaDaSemana}</div>}
                      {s.paginasDoLivro && <div className="notion-field blue"><b>Páginas:</b> {s.paginasDoLivro}</div>}
                    </div>
                  )}
                  {s.reposicoes > 0 && (
                    <div className="notion-field orange" style={{ marginTop: 8 }}>
                      🔄 <b>{s.reposicoes} reposição(ões)</b>
                      {s.dataReposicao && ` · ${new Date(s.dataReposicao+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'})}`}
                    </div>
                  )}
                  <div className="nota-links">
                    {s.meetLink && <a href={s.meetLink} target="_blank" rel="noreferrer" className="nota-link meet">📹 Meet</a>}
                    {s.kamiLink && <a href={s.kamiLink} target="_blank" rel="noreferrer" className="nota-link kami">📚 KAMI</a>}
                    {s.classroomLink && <a href={s.classroomLink} target="_blank" rel="noreferrer" className="nota-link classroom">🎓 Classroom</a>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: EMPRESA
// ══════════════════════════════════════════════════════════════════════════════
function TabEmpresa({ local, persist }) {
  const today = todayKey();
  const getTasks = (key) => local.empresa?.[key] || [];
  const setTasks = (key, val) => persist(prev => ({ ...prev, empresa: { ...(prev.empresa||{}), [key]: val } }));
  const getDiario = () => local.empresa?.diario?.[today] || '';
  const setDiario = (val) => persist(prev => ({ ...prev, empresa: { ...(prev.empresa||{}), diario: { ...(prev.empresa?.diario||{}), [today]: val } } }));
  return (
    <div className="tab-empresa">
      <div className="empresa-section">
        <div className="empresa-section-title">📓 Diário do dia</div>
        <textarea className="empresa-textarea" placeholder="Anote aqui o que aconteceu hoje, tarefas, o que precisa resolver..." value={getDiario()} onChange={e => setDiario(e.target.value)} rows={4} />
      </div>
      <div className="empresa-section">
        <div className="empresa-section-title">📚 Materiais</div>
        <TaskList tasks={getTasks('materiais')} onChange={v => setTasks('materiais', v)} placeholder="Ex: Criar workbook A2 Unit 3..." categories={['Criar','Otimizar','Remover']} />
      </div>
      <div className="empresa-section">
        <div className="empresa-section-title">🎯 Metas e Projetos</div>
        <TaskList tasks={getTasks('metas')} onChange={v => setTasks('metas', v)} placeholder="Ex: Lançar curso intensivo 2027..." categories={['Em andamento','Próximo','Concluído']} />
      </div>
      <div className="empresa-section">
        <div className="empresa-section-title">🔔 Lembretes & Pendências</div>
        <TaskList tasks={getTasks('lembretes')} onChange={v => setTasks('lembretes', v)} placeholder="Ex: Entregar resultados Rafael 07/07..." categories={['Urgente','Esta semana','Feito']} />
      </div>
    </div>
  );
}

function TaskList({ tasks, onChange, placeholder, categories }) {
  const [newText, setNewText] = useState('');
  const [newCat, setNewCat] = useState(categories[0]);
  const add = () => { if (!newText.trim()) return; onChange([...tasks, { id: Date.now(), text: newText.trim(), cat: newCat, done: false }]); setNewText(''); };
  const toggle = (id) => onChange(tasks.map(t => t.id===id ? {...t, done: !t.done} : t));
  const remove = (id) => onChange(tasks.filter(t => t.id!==id));
  const CAT_COLORS = { 'Criar':'#1d9e75','Otimizar':'#2e86c1','Remover':'#e53935','Em andamento':'#ff6a00','Próximo':'#5c6bc0','Concluído':'#aaa','Urgente':'#e53935','Esta semana':'#ff6a00','Feito':'#aaa' };
  return (
    <div className="task-list">
      <div className="task-add-row">
        <select className="task-cat-sel" value={newCat} onChange={e => setNewCat(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <input className="task-input" placeholder={placeholder} value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key==='Enter' && add()} />
        <button className="task-add-btn" onClick={add}>+</button>
      </div>
      {tasks.map(t => (
        <div key={t.id} className={`task-item ${t.done?'done':''}`}>
          <button className="task-check" onClick={() => toggle(t.id)}>{t.done?'✅':'⬜'}</button>
          <span className="task-cat-badge" style={{ background: CAT_COLORS[t.cat]||'#aaa' }}>{t.cat}</span>
          <span className="task-text">{t.text}</span>
          <button className="task-del" onClick={() => remove(t.id)}>✕</button>
        </div>
      ))}
      {tasks.length===0 && <div className="task-empty">Nenhum item ainda.</div>}
    </div>
  );
}

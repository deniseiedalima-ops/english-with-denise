import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Admin.css';

const ADMIN_EMAIL = 'englishwithdenise.idiomas@gmail.com';

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
  { id: 'agenda', label: '📅 Agenda', icon: '📅' },
  { id: 'presenca', label: '📋 Presença', icon: '📋' },
  { id: 'financeiro', label: '💰 Financeiro', icon: '💰' },
  { id: 'notas', label: '📝 Notas', icon: '📝' },
  { id: 'empresa', label: '🏫 Empresa', icon: '🏫' },
];

export default function Admin({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('agenda');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState(loadLocal);

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) navigate('/');
  }, [user]);

  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(d => setStudents(d.students || []))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((updater) => {
    setLocal(prev => {
      const next = updater(prev);
      saveLocal(next);
      return next;
    });
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
            <button
              key={t.id}
              className={`admin-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
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
// TAB 0 — AGENDA (Google Calendar)
// ══════════════════════════════════════════════════════════════════════════════
function TabAgenda() {
  const [events, setEvents] = useState([]);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [view, setView] = useState('day'); // 'day' | 'week'

  const fetchEvents = useCallback(async (dateStr) => {
    const token = getCalToken();
    if (!token) { setCalError('no_token'); return; }

    setCalLoading(true);
    setCalError('');
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ timeMin, timeMax }),
      });

      if (res.status === 401) { setCalError('expired'); return; }
      const data = await res.json();
      if (data.error) { setCalError(data.error); return; }
      setEvents(data.events || []);
    } catch (e) {
      setCalError(e.message);
    } finally {
      setCalLoading(false);
    }
  }, [view]);

  useEffect(() => { fetchEvents(selectedDate); }, [selectedDate, view]);

  const reauth = () => {
    if (window._gCalClient) window._gCalClient.requestAccessToken();
    else setCalError('Recarregue a página e faça login novamente.');
  };

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

  const isClass = (title = '') => title.toLowerCase().includes('english class') || title.toLowerCase().includes('(rep)');
  const isRep = (title = '') => title.toLowerCase().includes('(rep)');
  const isPres = (title = '') => title.toLowerCase().includes('(pres)');

  // Group by date for week view
  const groupedByDate = events.reduce((acc, ev) => {
    const d = (ev.start?.dateTime || ev.start?.date || '').slice(0, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(ev);
    return acc;
  }, {});

  const selectedDateFmt = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  if (calError === 'no_token' || calError === 'expired') {
    return (
      <div className="cal-error-box">
        <div className="cal-error-icon">🔐</div>
        <div className="cal-error-title">
          {calError === 'expired' ? 'Sessão do Calendar expirada' : 'Agenda não conectada'}
        </div>
        <p className="cal-error-text">
          {calError === 'expired'
            ? 'Seu acesso ao Google Calendar expirou. Clique abaixo para reconectar.'
            : 'Para ver sua agenda, faça logout e login novamente — o sistema pedirá acesso ao Google Calendar.'}
        </p>
        <button className="cal-reauth-btn" onClick={reauth}>🔄 Reconectar Calendar</button>
      </div>
    );
  }

  return (
    <div className="tab-agenda">
      {/* Controls */}
      <div className="cal-controls">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => changeDay(view === 'week' ? -7 : -1)}>‹</button>
          <button className="cal-today-btn" onClick={() => setSelectedDate(todayKey())}>Hoje</button>
          <button className="cal-nav-btn" onClick={() => changeDay(view === 'week' ? 7 : 1)}>›</button>
        </div>
        <div className="cal-date-label">{selectedDateFmt}</div>
        <div className="cal-view-toggle">
          <button className={`cal-view-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>Dia</button>
          <button className={`cal-view-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Semana</button>
        </div>
        <button className="cal-refresh-btn" onClick={() => fetchEvents(selectedDate)}>↻</button>
      </div>

      {/* Summary chips */}
      {!calLoading && events.length > 0 && (
        <div className="cal-summary">
          <span className="cal-chip total">{events.length} eventos</span>
          <span className="cal-chip aulas">{events.filter(e => isClass(e.summary)).length} aulas</span>
          <span className="cal-chip reps">{events.filter(e => isRep(e.summary)).length} reposições</span>
        </div>
      )}

      {/* Loading */}
      {calLoading && <div className="cal-loading">Carregando agenda... 📅</div>}

      {/* Error */}
      {calError && !calLoading && calError !== 'no_token' && calError !== 'expired' && (
        <div className="cal-inline-error">⚠️ {calError}</div>
      )}

      {/* Day view */}
      {!calLoading && view === 'day' && (
        <div className="cal-day-list">
          {events.length === 0 && <div className="cal-empty">Nenhum evento para este dia 🎉</div>}
          {events.map(ev => (
            <EventCard key={ev.id} ev={ev} formatTime={formatEventTime} isClass={isClass} isRep={isRep} isPres={isPres} />
          ))}
        </div>
      )}

      {/* Week view */}
      {!calLoading && view === 'week' && (
        <div className="cal-week">
          {Object.entries(groupedByDate).sort().map(([date, evs]) => (
            <div key={date} className="cal-week-day">
              <div className="cal-week-day-header">
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                <span className="cal-week-count">{evs.length}</span>
              </div>
              {evs.map(ev => (
                <EventCard key={ev.id} ev={ev} formatTime={formatEventTime} isClass={isClass} isRep={isRep} isPres={isPres} compact />
              ))}
            </div>
          ))}
          {Object.keys(groupedByDate).length === 0 && <div className="cal-empty">Sem eventos esta semana 🎉</div>}
        </div>
      )}
    </div>
  );
}

function EventCard({ ev, formatTime, isClass, isRep, isPres, compact }) {
  const title = ev.summary || '(sem título)';
  const time = formatTime(ev);
  const rep = isRep(title);
  const pres = isPres(title);
  const cls = isClass(title);

  let accent = '#e0dbd4';
  if (rep)  accent = '#e53935';
  else if (pres) accent = '#9c27b0';
  else if (cls)  accent = '#ff6a00';

  return (
    <div className={`cal-event ${compact ? 'compact' : ''}`} style={{ borderLeftColor: accent }}>
      <div className="cal-event-time">{time}</div>
      <div className="cal-event-title" style={{ color: rep ? '#e53935' : pres ? '#9c27b0' : cls ? '#ff6a00' : '#111' }}>
        {title}
      </div>
      {ev.location && !compact && <div className="cal-event-loc">📍 {ev.location}</div>}
      {rep  && <span className="cal-event-tag rep">REP</span>}
      {pres && <span className="cal-event-tag pres">PRES</span>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1 — PRESENÇA
// ══════════════════════════════════════════════════════════════════════════════
function TabPresenca({ students, loading, local, persist, navigate }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const today = todayKey();

  const getStatus = (id) => local.presenca?.[today]?.[id] || null;
  const setStatus = (id, status) => {
    persist(prev => ({
      ...prev,
      presenca: { ...prev.presenca, [today]: { ...(prev.presenca?.[today] || {}), [id]: status } },
    }));
  };

  const STATUS_BTNS = [
    { key: 'presente',    label: '✅ Presente',      color: '#1d9e75' },
    { key: 'falta',       label: '❌ Falta',          color: '#e53935' },
    { key: 'rep_pendente',label: '🔄 Rep. Pendente',  color: '#ff6a00' },
    { key: 'rep_feita',   label: '✔️ Rep. Feita',     color: '#5c6bc0' },
    { key: 'rep_falta',   label: '⚠️ Rep. c/ Falta',  color: '#f9a825' },
  ];

  const filtered = students.filter(s => {
    const match = s.nome.toLowerCase().includes(search.toLowerCase());
    if (!match) return false;
    if (filterStatus === 'todos') return true;
    if (filterStatus === 'sem_registro') return !getStatus(s.id);
    return getStatus(s.id) === filterStatus;
  });

  const counts = students.reduce((acc, s) => {
    const st = getStatus(s.id) || 'sem_registro';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="admin-loading">Carregando alunos... ✨</div>;

  return (
    <div className="tab-presenca">
      <div className="presenca-summary">
        <div className="presenca-stat green"><span>{counts.presente || 0}</span><small>Presentes</small></div>
        <div className="presenca-stat red"><span>{counts.falta || 0}</span><small>Faltas</small></div>
        <div className="presenca-stat orange"><span>{counts.rep_pendente || 0}</span><small>Rep. Pend.</small></div>
        <div className="presenca-stat purple"><span>{counts.rep_feita || 0}</span><small>Rep. Feita</small></div>
        <div className="presenca-stat yellow"><span>{counts.rep_falta || 0}</span><small>Rep. c/ Falta</small></div>
        <div className="presenca-stat gray"><span>{counts.sem_registro || 0}</span><small>Sem registro</small></div>
      </div>

      <div className="presenca-filters">
        <input className="admin-search" placeholder="🔍 Buscar aluno..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-chips">
          {[['todos','Todos'],['sem_registro','⬜ Sem registro'],['presente','✅ Presentes'],['falta','❌ Faltas'],['rep_pendente','🔄 Rep.']].map(([key, label]) => (
            <button key={key} className={`chip ${filterStatus === key ? 'active' : ''}`} onClick={() => setFilterStatus(key)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="presenca-list">
        {filtered.map(s => {
          const st = getStatus(s.id);
          const stBtn = STATUS_BTNS.find(b => b.key === st);
          return (
            <div key={s.id} className={`presenca-row ${st || 'sem-registro'}`}>
              <div className="presenca-info">
                <div className="presenca-avatar" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa' }}>{s.nome[0]}</div>
                <div>
                  <div className="presenca-nome">{s.nome}</div>
                  <div className="presenca-nivel">
                    <span className="nivel-badge" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa' }}>{s.nivel}</span>
                    {st && <span className="status-label" style={{ color: stBtn?.color }}>{stBtn?.label}</span>}
                  </div>
                </div>
              </div>
              <div className="presenca-actions">
                {STATUS_BTNS.map(btn => (
                  <button
                    key={btn.key}
                    className={`presenca-btn ${st === btn.key ? 'active' : ''}`}
                    style={st === btn.key ? { background: btn.color, color: '#fff', borderColor: btn.color } : {}}
                    onClick={() => setStatus(s.id, st === btn.key ? null : btn.key)}
                    title={btn.label}
                  >{btn.label.split(' ')[0]}</button>
                ))}
                <button className="presenca-btn view-btn" onClick={() => navigate(`/admin/preview/${s.email}`)} title="Ver como aluno">👁️</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2 — FINANCEIRO
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
  const pagos = rows.filter(r => r.st === 'pago').length;
  const atrasados = rows.filter(r => r.st === 'atrasado').length;

  const ST_META = {
    pago:      { label: '🟢 Em dia',        color: '#1d9e75' },
    atrasado:  { label: '🔴 Inadimplente',   color: '#e53935' },
    aguardando:{ label: '🟡 Aguardando',     color: '#f9a825' },
    futuro:    { label: '⬜ Mês futuro',     color: '#aaa' },
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
        <div className="fin-stat"><span className="fin-val green">{pagos}</span><small>Em dia</small></div>
        <div className="fin-stat"><span className="fin-val red">{atrasados}</span><small>Inadimplentes</small></div>
      </div>
      <div className="filter-chips" style={{ marginBottom: 12 }}>
        {[['todos','Todos'],['atrasado','🔴 Inadimplentes'],['aguardando','🟡 Aguardando'],['pago','🟢 Em dia']].map(([k,l]) => (
          <button key={k} className={`chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
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
// TAB 3 — NOTAS
// ══════════════════════════════════════════════════════════════════════════════
function TabNotas({ students, loading, local, persist }) {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  const getNota = (id) => local.notas?.[id] || '';
  const setNota = (id, val) => persist(prev => ({ ...prev, notas: { ...(prev.notas || {}), [id]: val } }));

  if (loading) return <div className="admin-loading">Carregando... ✨</div>;

  return (
    <div className="tab-notas">
      <input className="admin-search" placeholder="🔍 Buscar aluno..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12 }} />
      <div className="notas-list">
        {students.filter(s => s.nome.toLowerCase().includes(search.toLowerCase())).map(s => {
          const nota = getNota(s.id);
          const open = openId === s.id;
          return (
            <div key={s.id} className={`nota-card ${open ? 'open' : ''}`}>
              <div className="nota-header" onClick={() => setOpenId(open ? null : s.id)}>
                <div className="nota-avatar" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa' }}>{s.nome[0]}</div>
                <div className="nota-name-wrap">
                  <div className="nota-nome">{s.nome}</div>
                  {!open && nota && <div className="nota-preview">{nota.slice(0, 60)}{nota.length > 60 ? '…' : ''}</div>}
                </div>
                <span className="nota-chevron">{open ? '▲' : '▼'}</span>
              </div>
              {open && (
                <div className="nota-body">
                  <textarea className="nota-textarea" placeholder="Anotações, pendências, observações..." value={nota} onChange={e => setNota(s.id, e.target.value)} rows={5} />
                  {(s.tarefaPersonalizada || s.tarefaDaSemana || s.paginasDoLivro) && (
                    <div className="nota-notion-info">
                      {s.tarefaPersonalizada && <div className="notion-field green"><b>Before class:</b> {s.tarefaPersonalizada}</div>}
                      {s.tarefaDaSemana && <div className="notion-field orange"><b>Tarefa da semana:</b> {s.tarefaDaSemana}</div>}
                      {s.paginasDoLivro && <div className="notion-field blue"><b>Páginas:</b> {s.paginasDoLivro}</div>}
                    </div>
                  )}
                  {s.reposicoes > 0 && (
                    <div className="notion-field orange" style={{ marginTop: 8 }}>
                      🔄 <b>{s.reposicoes} reposição(ões) pendente(s)</b>
                      {s.dataReposicao && ` · ${new Date(s.dataReposicao + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}`}
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
// TAB 4 — EMPRESA
// ══════════════════════════════════════════════════════════════════════════════
function TabEmpresa({ local, persist }) {
  const today = todayKey();
  const getTasks = (key) => local.empresa?.[key] || [];
  const setTasks = (key, val) => persist(prev => ({ ...prev, empresa: { ...(prev.empresa || {}), [key]: val } }));
  const getDiario = () => local.empresa?.diario?.[today] || '';
  const setDiario = (val) => persist(prev => ({ ...prev, empresa: { ...(prev.empresa || {}), diario: { ...(prev.empresa?.diario || {}), [today]: val } } }));

  return (
    <div className="tab-empresa">
      <div className="empresa-section">
        <div className="empresa-section-title">📓 Diário do dia</div>
        <textarea className="empresa-textarea" placeholder="Anote aqui o que aconteceu hoje, tarefas, o que precisa resolver..." value={getDiario()} onChange={e => setDiario(e.target.value)} rows={4} />
      </div>
      <div className="empresa-section">
        <div className="empresa-section-title">📚 Materiais</div>
        <TaskList tasks={getTasks('materiais')} onChange={v => setTasks('materiais', v)} placeholder="Ex: Criar workbook A2 Unit 3..." categories={['Criar', 'Otimizar', 'Remover']} />
      </div>
      <div className="empresa-section">
        <div className="empresa-section-title">🎯 Metas e Projetos</div>
        <TaskList tasks={getTasks('metas')} onChange={v => setTasks('metas', v)} placeholder="Ex: Lançar curso intensivo 2027..." categories={['Em andamento', 'Próximo', 'Concluído']} />
      </div>
      <div className="empresa-section">
        <div className="empresa-section-title">🔔 Lembretes & Pendências</div>
        <TaskList tasks={getTasks('lembretes')} onChange={v => setTasks('lembretes', v)} placeholder="Ex: Entregar resultados Rafael 07/07..." categories={['Urgente', 'Esta semana', 'Feito']} />
      </div>
    </div>
  );
}

function TaskList({ tasks, onChange, placeholder, categories }) {
  const [newText, setNewText] = useState('');
  const [newCat, setNewCat] = useState(categories[0]);
  const add = () => { if (!newText.trim()) return; onChange([...tasks, { id: Date.now(), text: newText.trim(), cat: newCat, done: false }]); setNewText(''); };
  const toggle = (id) => onChange(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id) => onChange(tasks.filter(t => t.id !== id));
  const CAT_COLORS = { 'Criar': '#1d9e75', 'Otimizar': '#2e86c1', 'Remover': '#e53935', 'Em andamento': '#ff6a00', 'Próximo': '#5c6bc0', 'Concluído': '#aaa', 'Urgente': '#e53935', 'Esta semana': '#ff6a00', 'Feito': '#aaa' };
  return (
    <div className="task-list">
      <div className="task-add-row">
        <select className="task-cat-sel" value={newCat} onChange={e => setNewCat(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <input className="task-input" placeholder={placeholder} value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="task-add-btn" onClick={add}>+</button>
      </div>
      {tasks.map(t => (
        <div key={t.id} className={`task-item ${t.done ? 'done' : ''}`}>
          <button className="task-check" onClick={() => toggle(t.id)}>{t.done ? '✅' : '⬜'}</button>
          <span className="task-cat-badge" style={{ background: CAT_COLORS[t.cat] || '#aaa' }}>{t.cat}</span>
          <span className="task-text">{t.text}</span>
          <button className="task-del" onClick={() => remove(t.id)}>✕</button>
        </div>
      ))}
      {tasks.length === 0 && <div className="task-empty">Nenhum item ainda.</div>}
    </div>
  );
}

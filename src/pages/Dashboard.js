import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';
import { ADMIN_EMAIL, P1_EMAILS } from '../App';
import { getItem, setItem } from '../utils/storage';

const ASAAS_LINK = 'https://www.asaas.com/c/englishwithdenise';
const PIX_KEY = '54.182.857/0001-07';
const BOOKING_LINK = 'https://calendar.app.google/M4SkBZbhnKE4pQis6';

const ACHIEVEMENTS = [
  { id:'spectacular_attendance', name:'Spectacular Attendance', desc:'20 aulas seguidas sem faltar — zero reposições', icon:'⭐', tier:'gold', auto:false },
  { id:'always_there', name:'Always There', desc:'8 aulas seguidas sem nenhuma falta', icon:'🎯', tier:'silver', auto:false },
  { id:'on_time', name:'On Time, Every Time', desc:'Chegou na hora em 5 aulas consecutivas', icon:'📅', tier:'bronze', auto:false },
  { id:'homework_champion', name:'Homework Champion', desc:'Entregou todas as tarefas do mês sem falhar uma', icon:'📝', tier:'gold', auto:false },
  { id:'one_step_ahead', name:'One Step Ahead', desc:'Fez a tarefa antes da aula por 3 semanas seguidas', icon:'⚡', tier:'special', auto:false },
  { id:'book_lover', name:'Book Lover', desc:'Leu todos os textos do material em uma unidade completa', icon:'📖', tier:'silver', auto:false },
  { id:'no_shame', name:'No Shame!', desc:'Falou inglês durante toda a aula com pouquíssimo ou nada em português', icon:'🎙️', tier:'gold', auto:false },
  { id:'lion_heart', name:'Lion Heart', desc:'Tentou responder mesmo sem ter certeza da resposta', icon:'🦁', tier:'bronze', auto:false },
  { id:'titanium_mind', name:'Titanium Mind', desc:'Usou vocabulário de 3 aulas anteriores espontaneamente', icon:'🧠', tier:'gold', auto:false },
  { id:'level_up', name:'Level Up!', desc:'Avançou para um novo nível — conquista máxima!', icon:'🏅', tier:'gold', auto:false },
  { id:'on_fire', name:'On Fire', desc:'7 dias seguidos de atividade no app', icon:'🔥', tier:'special', auto:true, check: (streak) => streak >= 7 },
  { id:'rat_of_month', name:'Rat of the Month', desc:'Aluna/aluno mais dedicada(o) do mês — escolha da professora', icon:'💜', tier:'special', auto:false },
];

const TIER_STYLE = {
  gold:    { bg:'#fff3cd', color:'#92600a', label:'Ouro' },
  silver:  { bg:'#f0f0f0', color:'#555',    label:'Prata' },
  bronze:  { bg:'#f5ede6', color:'#8a4a1e', label:'Bronze' },
  special: { bg:'#fff1e8', color:'#c85000', label:'Especial' },
};

const LEVEL_ORDER = ['A1','A1→A2','A2','B1 iniciante','B1','B2','P1'];

function updateStreak(email) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const last = getItem(email, 'last_active', '');
  let streak = getItem(email, 'streak', 0);
  let best = getItem(email, 'best_streak', 0);
  if (last === today) return streak;
  streak = last === yesterday ? streak + 1 : 1;
  if (streak > best) { best = streak; setItem(email, 'best_streak', best); }
  setItem(email, 'streak', streak);
  setItem(email, 'last_active', today);
  return streak;
}

export default function Dashboard({ user, student, onLogout, isPreview }) {
  const navigate = useNavigate();
  const email = user?.email || '';

  const [xp, setXp] = useState(() => getItem(email, 'xp', 0));
  const [streak, setStreak] = useState(() => getItem(email, 'streak', 0));
  const [unlockedIds, setUnlockedIds] = useState(() => getItem(email, 'achievements', []));
  const [showAchievements, setShowAchievements] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  const nivel = student?.nivel || 'A1';
  const agenda = student?.proximaAula;
  const dataAula = student?.dataProximaAula || agenda?.dataAula;

  const formatDate = (d) => {
    if (!d) return null;
    const dt = new Date(d + 'T12:00:00');
    return {
      day: dt.getDate(),
      month: dt.toLocaleString('pt-BR', { month: 'short' }),
      weekday: dt.toLocaleString('pt-BR', { weekday: 'long' }),
    };
  };
  const date = formatDate(dataAula);

  useEffect(() => {
    const s = updateStreak(email);
    setStreak(s);
    // Check auto achievements
    if (s >= 7 && !unlockedIds.includes('on_fire')) {
      const updated = [...unlockedIds, 'on_fire'];
      setUnlockedIds(updated);
      setItem(email, 'achievements', updated);
      setNewBadge(ACHIEVEMENTS.find(a => a.id === 'on_fire'));
      setTimeout(() => setNewBadge(null), 4000);
    }
    const onStorage = () => {
      setXp(getItem(email, 'xp', 0));
      setStreak(getItem(email, 'streak', 0));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const copyPix = () => {
    navigator.clipboard.writeText('54182857000107').then(() => {
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    });
  };

  const isPl = P1_EMAILS.includes(email);
  const firstName = (student?.nome || user?.name || '').split(' ')[0];
  const isQueen = student?.genero === 'F';

  // Agenda items from tarefaDaSemana — split by newline or semicolon
  const agendaItems = (student?.tarefaDaSemana || '')
    .split(/[\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (showAchievements) {
    return (
      <div className="dash-page">
        <Navbar user={user} student={student} onLogout={onLogout} />
        <main className="dash-content">
          <div className="ach-page-header">
            <button className="back-btn" onClick={() => setShowAchievements(false)}>← Voltar</button>
            <h2 className="ach-page-title">Achievements</h2>
            <p className="ach-page-sub">{unlockedIds.length} de {ACHIEVEMENTS.length} desbloqueados</p>
          </div>

          {['Presença & Dedicação','Tarefa & Estudo','Fala & Coragem','Progresso & Evolução'].map((cat, ci) => {
            const catAchs = [
              ACHIEVEMENTS.slice(0,3),
              ACHIEVEMENTS.slice(3,6),
              ACHIEVEMENTS.slice(6,9),
              ACHIEVEMENTS.slice(9),
            ][ci];
            return (
              <div key={cat} className="ach-category">
                <div className="ach-cat-label">{cat}</div>
                {catAchs.map(ach => {
                  const unlocked = unlockedIds.includes(ach.id);
                  const ts = TIER_STYLE[ach.tier];
                  return (
                    <div key={ach.id} className={`ach-row ${unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="ach-icon-wrap" style={{ background: unlocked ? ts.bg : '#f0ede8' }}>
                        <span style={{ fontSize: 22, filter: unlocked ? 'none' : 'grayscale(1)' }}>{ach.icon}</span>
                      </div>
                      <div className="ach-row-info">
                        <div className="ach-row-name">{ach.name}</div>
                        <div className="ach-row-desc">{ach.desc}</div>
                      </div>
                      <span className="ach-tier-pill" style={unlocked ? { background: ts.bg, color: ts.color } : { background: '#f0ede8', color: '#bbb' }}>
                        {unlocked ? ts.label : '🔒'}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </main>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <Navbar user={user} student={student} onLogout={onLogout} />

      {/* New badge popup */}
      {newBadge && (
        <div className="badge-popup" onClick={() => setNewBadge(null)}>
          <span style={{ fontSize: 28 }}>{newBadge.icon}</span>
          <div>
            <div className="badge-popup-title">Novo badge desbloqueado!</div>
            <div className="badge-popup-name">{newBadge.name}</div>
          </div>
          <span className="badge-popup-close">✕</span>
        </div>
      )}

      <main className="dash-content">

        {/* ── WELCOME ─────────────────────────────────── */}
        <div className="welcome-row">
          <div className="welcome-left">
            <p className="welcome-greeting">Good morning</p>
            <p className="welcome-name">
              {firstName} <span className="welcome-star">✦</span>
            </p>
            {streak > 0 && (
              <div className="streak-pill">
                <span>🔥</span> {streak}-day streak
              </div>
            )}
          </div>
          <div className="level-square">
            <div className="level-square-label">Nível</div>
            <div className="level-square-value">{nivel}</div>
            {isPl && <div className="level-square-p1">P1</div>}
          </div>
        </div>

        {/* ── NEXT CLASS ──────────────────────────────── */}
        <div className="next-class-card">
          <div className="nc-eyebrow">Next class</div>
          <div className="nc-body">
            {date && (
              <div className="nc-date-badge">
                <div className="nc-date-num">{date.day}</div>
                <div className="nc-date-mon">{date.month}</div>
              </div>
            )}
            <div className="nc-info">
              <div className="nc-title">{agenda?.titulo || 'A ser confirmada'}</div>
              <div className="nc-sub">
                {agenda ? `✦ Aula ${agenda.numero} · ${nivel}` : 'Denise vai atualizar em breve'}
                {date && ` · ${date.weekday}`}
              </div>
            </div>
          </div>
          {student?.meetLink ? (
            <a href={student.meetLink} target="_blank" rel="noreferrer" className="meet-btn">
              <span>📹</span> Clique aqui e entre na sala
            </a>
          ) : (
            <div className="meet-btn meet-btn-disabled">📹 Link da sala em breve</div>
          )}
        </div>

        {/* ── AGENDA DA SEMANA ───────────────────────── */}
        <div className="agenda-card">
          <div className="agenda-card-header">
            <div className="agenda-orange-dot" />
            <span className="agenda-card-title">Agenda da Semana</span>
            <span className="agenda-weekly-badge">WEEKLY</span>
          </div>
          {agendaItems.length > 0 ? (
            <div className="agenda-items">
              {agendaItems.map((item, i) => (
                <div key={i} className="agenda-item-row">
                  <div className="agenda-item-bullet" />
                  <span className="agenda-item-text">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="agenda-empty-text">Denise ainda não postou a agenda desta semana.</div>
          )}
        </div>

        {/* ── REPOSIÇÃO ──────────────────────────────── */}
        <a href={BOOKING_LINK} target="_blank" rel="noreferrer" className="repos-banner">
          <span className="repos-emoji">📅</span>
          <div className="repos-text">
            <span className="repos-main">Precisa repor uma aula?</span>
            <span className="repos-sub">Agende seu horário aqui</span>
          </div>
          <span className="repos-arrow">›</span>
        </a>

        {/* ── REPOSIÇÃO AGENDADA ─────────────────────── */}
        {student?.reposicoes > 0 && student?.dataReposicao && (
          <div className="repos-scheduled">
            <span style={{ fontSize: 18 }}>✅</span>
            <div style={{ flex: 1 }}>
              <div className="repos-sched-title">Reposição agendada</div>
              <div className="repos-sched-date">
                {new Date(student.dataReposicao + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                {student.horarioReposicao && ` às ${student.horarioReposicao}`}
              </div>
              <div className="repos-sched-warn">⚠️ Cancele com pelo menos 12h de antecedência</div>
            </div>
          </div>
        )}

        {/* ── FINANCEIRO ────────────────────────────── */}
        <div className="fin-card">
          <div className="fin-header">
            <span className="fin-header-icon">💳</span>
            <span className="fin-header-title">Financeiro</span>
          </div>
          <div className="fin-body">
            {student?.valorMensalidade && (
              <div className="fin-row">
                <span className="fin-label">Mensalidade</span>
                <span className="fin-value">R$ {student.valorMensalidade}</span>
              </div>
            )}
            {student?.dataVencimento && (
              <div className="fin-row">
                <span className="fin-label">Vencimento</span>
                <span className="fin-value fin-due">{student.dataVencimento}</span>
              </div>
            )}
            <div className="fin-row fin-pix-row">
              <span className="fin-label">Chave PIX (CNPJ)</span>
              <div className="fin-pix-right">
                <span className="fin-value fin-pix-key">{PIX_KEY}</span>
                <button className="fin-copy-btn" onClick={copyPix}>
                  {pixCopied ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>
            </div>
            <a href={ASAAS_LINK} target="_blank" rel="noreferrer" className="fin-pay-btn">
              <span>💰</span> Pagar via link de pagamento
            </a>
          </div>
        </div>

        {/* ── QUICK LINKS ────────────────────────────── */}
        <div className="quick-grid">
          {student?.driveLink && (
            <a href={student.driveLink} target="_blank" rel="noreferrer" className="quick-card">
              <div className="quick-icon-wrap" style={{ background:'#e8f5e9' }}>📂</div>
              <div className="quick-title">Google Drive</div>
              <div className="quick-sub">Material de estudo</div>
            </a>
          )}
          <div className="quick-card" onClick={() => setShowAchievements(true)}>
            <div className="quick-icon-wrap" style={{ background:'#fff3cd' }}>🏅</div>
            <div className="quick-title">Achievements</div>
            <div className="quick-sub">{unlockedIds.length} desbloqueados</div>
          </div>
          <a href="https://www.englishwithdenise.com.br/" target="_blank" rel="noreferrer" className="quick-card">
            <div className="quick-icon-wrap" style={{ background:'#eeedfe' }}>🌍</div>
            <div className="quick-title">Explore</div>
            <div className="quick-sub">Recursos e desafios</div>
          </a>
          {student?.classroomLink && (
            <a href={student.classroomLink} target="_blank" rel="noreferrer" className="quick-card">
              <div className="quick-icon-wrap" style={{ background:'#e6f1fb' }}>🎓</div>
              <div className="quick-title">Classroom</div>
              <div className="quick-sub">Gravações das aulas</div>
            </a>
          )}
        </div>

      </main>
    </div>
  );
}

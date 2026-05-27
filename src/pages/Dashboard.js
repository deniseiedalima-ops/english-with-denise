import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const LEVEL_ORDER = ['A1', 'A1→A2', 'A2', 'B1 iniciante', 'B1', 'B2'];
const LEVEL_DISPLAY = { 'A1': 'A1', 'A1→A2': 'A1→A2', 'A2': 'A2', 'B1 iniciante': 'B1 Beginner', 'B1': 'B1', 'B2': 'B2' };
const XP_PER_LEVEL = 100;

// ─── Achievement definitions ─────────────────────────────────────────────────
const ACHIEVEMENTS = [
  // Bronze
  { id: 'first_step',   tier: 'Bronze', label: 'First Step',     desc: 'Complete your first activity',         check: (a,x,s) => a.length >= 1 },
  { id: 'getting_warm', tier: 'Bronze', label: 'Getting Warm',   desc: 'Complete 5 activities',                check: (a,x,s) => a.length >= 5 },
  { id: 'on_fire',      tier: 'Bronze', label: 'On Fire!',       desc: 'Earn 50 XP',                           check: (a,x,s) => x >= 50 },
  { id: 'reader',       tier: 'Bronze', label: 'Bookworm',       desc: 'Complete 2 reading activities',        check: (a,x,s) => a.filter(i=>i.skill==='reading').length >= 2 },
  { id: 'speaker_1',   tier: 'Bronze', label: 'First Words',    desc: 'Complete 1 speaking activity',         check: (a,x,s) => a.filter(i=>i.skill==='speaking').length >= 1 },
  // Silver
  { id: 'century',      tier: 'Silver', label: 'Century!',       desc: 'Earn 100 XP',                          check: (a,x,s) => x >= 100 },
  { id: 'streak_3',     tier: 'Silver', label: '3-Day Streak',   desc: 'Practice 3 days in a row',             check: (a,x,s) => s >= 3 },
  { id: 'all_skills',   tier: 'Silver', label: 'Well Rounded',   desc: 'Try all 4 skills',                     check: (a,x,s) => new Set(a.map(i=>i.skill)).size >= 4 },
  { id: 'writer_5',     tier: 'Silver', label: 'Pen Master',     desc: 'Complete 5 writing activities',        check: (a,x,s) => a.filter(i=>i.skill==='writing').length >= 5 },
  { id: 'listener_5',   tier: 'Silver', label: 'Sharp Ears',     desc: 'Complete 5 listening activities',      check: (a,x,s) => a.filter(i=>i.skill==='listening').length >= 5 },
  // Gold
  { id: 'xp_250',       tier: 'Gold',   label: 'XP Hunter',      desc: 'Earn 250 XP',                          check: (a,x,s) => x >= 250 },
  { id: 'streak_7',     tier: 'Gold',   label: 'Week Warrior',   desc: 'Practice 7 days in a row',             check: (a,x,s) => s >= 7 },
  { id: 'activities_20',tier: 'Gold',   label: 'Dedicated',      desc: 'Complete 20 activities',               check: (a,x,s) => a.length >= 20 },
  { id: 'perfect_score',tier: 'Gold',   label: 'Perfectionist',  desc: 'Score 100% on any activity',           check: (a,x,s) => a.some(i=>i.score>=100) },
  // Platinum
  { id: 'xp_500',       tier: 'Platinum', label: 'XP Legend',    desc: 'Earn 500 XP',                          check: (a,x,s) => x >= 500 },
  { id: 'streak_30',    tier: 'Platinum', label: 'Unstoppable',  desc: 'Practice 30 days in a row',            check: (a,x,s) => s >= 30 },
];

const TIER_COLORS = { Bronze: '#cd7f32', Silver: '#999', Gold: '#ff6a00', Platinum: '#7f77dd' };

function updateStreak() {
  const today = new Date().toDateString();
  const lastActive = localStorage.getItem('ewd_last_active') || '';
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let streak = parseInt(localStorage.getItem('ewd_streak') || '0');
  let bestStreak = parseInt(localStorage.getItem('ewd_best_streak') || '0');

  if (lastActive === today) return streak; // already counted today
  if (lastActive === yesterday) streak += 1; // consecutive day
  else if (lastActive !== today) streak = 1; // reset — gap in days

  if (streak > bestStreak) bestStreak = streak;
  localStorage.setItem('ewd_streak', streak);
  localStorage.setItem('ewd_best_streak', bestStreak);
  localStorage.setItem('ewd_last_active', today);
  return streak;
}

export default function Dashboard({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('ewd_xp') || '0'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('ewd_streak') || '0'));
  const [bestStreak] = useState(() => parseInt(localStorage.getItem('ewd_best_streak') || '0'));
  const [activities, setActivities] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_activities') || '[]'); }
    catch { return []; }
  });
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_achievements') || '[]'); }
    catch { return []; }
  });
  const [newAchievement, setNewAchievement] = useState(null);

  // Update streak on mount + listen for XP changes
  useEffect(() => {
    const newStreak = updateStreak();
    setStreak(newStreak);

    const onStorage = () => {
      const newXp = parseInt(localStorage.getItem('ewd_xp') || '0');
      const newActs = JSON.parse(localStorage.getItem('ewd_activities') || '[]');
      const newStrk = parseInt(localStorage.getItem('ewd_streak') || '0');
      setXp(newXp);
      setActivities(newActs);
      setStreak(newStrk);
      checkAchievements(newActs, newXp, newStrk);
    };

    window.addEventListener('storage', onStorage);
    // Also check on mount
    checkAchievements(
      JSON.parse(localStorage.getItem('ewd_activities') || '[]'),
      parseInt(localStorage.getItem('ewd_xp') || '0'),
      newStreak
    );
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const checkAchievements = (acts, xpVal, streakVal) => {
    const current = JSON.parse(localStorage.getItem('ewd_achievements') || '[]');
    let updated = [...current];
    let newest = null;
    ACHIEVEMENTS.forEach(ach => {
      if (!updated.includes(ach.id) && ach.check(acts, xpVal, streakVal)) {
        updated.push(ach.id);
        newest = ach;
      }
    });
    if (updated.length !== current.length) {
      localStorage.setItem('ewd_achievements', JSON.stringify(updated));
      setUnlockedIds(updated);
      if (newest) setNewAchievement(newest);
    }
  };

  const [reports, setReports] = useState([]);
  const [showReports, setShowReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/reports?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(data => setReports(data.reports || []))
        .catch(() => {});
    }
  }, [user?.email]);
  const levelIndex = LEVEL_ORDER.indexOf(nivel);
  const xpProgress = xp % XP_PER_LEVEL;
  const levelNum = Math.floor(xp / XP_PER_LEVEL) + 1;
  const agenda = student?.proximaAula;
  const dataAula = student?.dataProximaAula || agenda?.dataAula;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T12:00:00');
    return { day: d.getDate(), month: d.toLocaleString('en', { month: 'short' }), weekday: d.toLocaleString('en', { weekday: 'long' }) };
  };
  const date = formatDate(dataAula);

  const skills = [
    { key: 'writing',   label: 'Writing',   icon: '✏️' },
    { key: 'speaking',  label: 'Speaking',  icon: '🎙️' },
    { key: 'reading',   label: 'Reading',   icon: '📖' },
    { key: 'listening', label: 'Listening', icon: '🎧' },
  ].map(s => {
    const acts = activities.filter(a => a.skill === s.key);
    const avgScore = acts.length ? (acts.reduce((acc, a) => acc + a.score, 0) / acts.length).toFixed(1) : '—';
    return { ...s, score: avgScore, done: acts.length };
  });

  // Achievements grouped by tier
  const byTier = ['Bronze','Silver','Gold','Platinum'].map(tier => ({
    tier,
    total: ACHIEVEMENTS.filter(a => a.tier === tier).length,
    unlocked: ACHIEVEMENTS.filter(a => a.tier === tier && unlockedIds.includes(a.id)).length,
  }));
  const latestAch = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).slice(-1)[0];

  const firstName = student?.nome?.split(' ')[0] || user?.name?.split(' ')[0] || '';
  const genero = student?.genero || '';
  const title = genero === 'M' ? 'King' : genero === 'F' ? 'Queen' : null;

  const stars = Array.from({ length: 8 }, (_, i) => ({
    top: [6,12,38,62,75,89,93,25][i] + '%',
    left: [4,91,97,1.5,96,6,87,50][i] + '%',
    size: [3,2,3.5,2,2.5,2,3,1.5][i],
    op: [0.35,0.25,0.4,0.3,0.35,0.2,0.3,0.15][i],
    d: ['3.5s','4s','5s','3s','4.5s','6s','3s','5s'][i],
    delay: ['0s','1s','0.5s','2s','1.5s','0.8s','2.5s','3s'][i],
  }));

  return (
    <div className="dashboard-page">
      {stars.map((s, i) => (
        <div key={i} className="star" style={{ top: s.top, left: s.left, width: s.size, height: s.size, '--op': s.op, '--d': s.d, '--delay': s.delay }} />
      ))}
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="dashboard-content">

    {/* Achievement unlock popup */}
        {newAchievement && (
          <div className="ach-popup" onClick={() => setNewAchievement(null)}>
            <div className="ach-popup-inner">
              <div className="ach-popup-icon">🏅</div>
              <div>
                <div className="ach-popup-title">Achievement Unlocked!</div>
                <div className="ach-popup-name">{newAchievement.tier} — {newAchievement.label}</div>
                <div className="ach-popup-desc">{newAchievement.desc}</div>
              </div>
              <div className="ach-popup-close">✕</div>
            </div>
          </div>
        )}

        {/* Welcome */}
        <div className="welcome-row fade-up fade-up-1">
          <div>
            <p className="welcome-label">Welcome back,</p>
            {title && <div className="welcome-title-badge">{title === 'Queen' ? '👑' : '👑'} {title}</div>}
            <h1 className="welcome-name">{firstName} <span className="welcome-star">✦</span></h1>
            <p className="welcome-streak">{streak > 0 ? '🔥 ' + streak + ' day streak! Keep going!' : 'Start your streak today!'}</p>
          </div>
        </div>

        {/* Level banner */}
        <div className="level-banner fade-up fade-up-2">
          <div className="level-banner-left">
            <span className="level-icon">🏆</span>
            <div>
              <div className="level-info-label">Your journey</div>
              <div className="level-info-name">{LEVEL_DISPLAY[nivel] || nivel}</div>
            </div>
          </div>
          <div className="level-track">
            {['A1','A2','B1','B2'].map(l => {
              const levelMap = { 'A1': 0, 'A2': 2, 'B1': 4, 'B2': 5 };
              const isDone = levelIndex > levelMap[l];
              const isCurrent = (l === 'A1' && levelIndex <= 1) || (l === 'A2' && levelIndex === 2) || (l === 'B1' && (levelIndex === 3 || levelIndex === 4)) || (l === 'B2' && levelIndex === 5);
              const isUnlocked = levelIndex >= levelMap[l];
              return (
                <div
                  key={l}
                  className={'level-dot' + (isDone ? ' done' : '') + (isCurrent ? ' current' : '') + (!isUnlocked ? ' locked' : '')}
                  title={isUnlocked ? `Go to ${l} lessons` : `Complete ${l === 'A2' ? 'A1' : l === 'B1' ? 'A2' : 'B1'} to unlock`}
                  onClick={() => isUnlocked && navigate('/hub')}
                  style={{ cursor: isUnlocked ? 'pointer' : 'default' }}
                >
                  {!isUnlocked ? '🔒' : l}
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Bar */}
        <div className="xp-card fade-up fade-up-2">
          <div className="xp-badge">LV. {levelNum}</div>
          <div className="xp-num">{xp} <span className="xp-label">XP</span></div>
          <div className="xp-bar-wrap">
            <div className="xp-bar-label"><span>Progress to next level</span><span>{xpProgress} / {XP_PER_LEVEL} XP</span></div>
            <div className="xp-bar"><div className="xp-fill" style={{ width: xpProgress + '%' }} /></div>
          </div>
          <div className="streak-box">
            <span className="streak-fire">🔥</span>
            <div><div className="streak-num">{streak}</div><div className="streak-lbl">day streak</div></div>
          </div>
        </div>

        {/* Skills */}
        <div className="section-title fade-up fade-up-3">Your skills</div>
        <div className="skills-grid fade-up fade-up-3">
          {skills.map(s => (
            <div key={s.key} className="skill-card" onClick={() => navigate('/hub?skill=' + s.key)}>
              <div className="skill-icon">{s.icon}</div>
              <div className="skill-score">{s.score} <span className="skill-avg">avg</span></div>
              <div className="skill-name">{s.label}</div>
              <div className="skill-sub">{s.done} {s.done === 1 ? 'activity' : 'activities'} done</div>
              <div className="skill-bar"><div className="skill-bar-fill" style={{ width: Math.min(s.done * 10, 100) + '%' }} /></div>
              <div className="practice-btn">Practice →</div>
            </div>
          ))}
        </div>

        {/* Agenda */}
        <div className="section-title fade-up fade-up-4">Agenda</div>
        <div className="agenda-card fade-up fade-up-4">
          <div className="agenda-header">
            <div className="agenda-header-left">
              <span style={{ fontSize: 18, color: '#ff6a00' }}>📅</span>
              <span className="agenda-h-title">Next class</span>
              <span className="agenda-badge">WEEKLY</span>
            </div>
            <span className="agenda-synced">↻ Synced with Notion</span>
          </div>
          {agenda ? (
            <div className="agenda-body">
              {date && (
                <div className="agenda-date">
                  <div className="agenda-day">{date.day}</div>
                  <div className="agenda-month">{date.month}</div>
                  <div className="agenda-weekday">{date.weekday}</div>
                </div>
              )}
              <div className="agenda-info">
                <div className="agenda-num">✦ LESSON {agenda.numero} · {agenda.nivel}</div>
                <div className="agenda-title-text">{agenda.titulo}</div>
                <div className="agenda-goal">{agenda.targetGoal}</div>
                <div className="agenda-task-box">
                  <div className="agenda-task-label">✅ Before class — your task</div>
                  <div className="agenda-task-text">{student?.tarefaPersonalizada || agenda.tarefa}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="agenda-empty">
              <span>📭</span>
              <p>No class scheduled yet. Denise will update your agenda soon!</p>
            </div>
          )}
          <div className="agenda-footer">
            <span className="agenda-level-pill">{nivel}</span>
            <span className="agenda-updated">Updated by Denise</span>
          </div>
        </div>

        {/* Google Meet */}
        <div className="meet-card fade-up fade-up-5">
          <div className="meet-card-left">
            <div className="meet-icon">📹</div>
            <div>
              <div className="meet-title">Google Meet — Aula ao Vivo</div>
              <div className="meet-sub">{student?.meetLink ? 'Clique para entrar na sua aula com a Denise' : 'Link da aula será adicionado pela Denise em breve'}</div>
            </div>
          </div>
          {student?.meetLink ? (
            <a href={student.meetLink} target="_blank" rel="noreferrer" className="meet-btn">
              Entrar na Aula ↗
            </a>
          ) : (
            <div className="meet-btn-disabled">Em breve</div>
          )}
        </div>

        {/* Bottom grid */}
        <div className="bottom-grid fade-up fade-up-5">

          {/* LEFT COL */}
          <div className="bottom-col">

            {/* Google Classroom */}
            {student?.classroomLink && (
              <div className="card classroom-card">
                <div className="card-title">🎓 Google Classroom</div>
                <a href={student.classroomLink} target="_blank" rel="noreferrer" className="classroom-btn">
                  Open my Classroom ↗
                </a>
                <div className="classroom-desc-box">
                  <div className="classroom-desc-item">📄 PDF do material para imprimir ou usar no tablet</div>
                  <div className="classroom-desc-item">🎥 Gravações das aulas</div>
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="card achievements-card">
              <div className="card-header-row">
                <div className="card-title">✨ Achievements <span className="ach-count">{unlockedIds.length}/{ACHIEVEMENTS.length}</span></div>
                <span className="view-all">View all ↓</span>
              </div>
              {latestAch ? (
                <div className="ach-latest-item">
                  <div className="ach-latest-tier" style={{ color: TIER_COLORS[latestAch.tier] }}>{latestAch.tier}</div>
                  <div className="ach-latest-name">{latestAch.label}</div>
                  <div className="ach-latest-desc">{latestAch.desc}</div>
                </div>
              ) : (
                <div className="ach-empty">Complete activities to unlock achievements! 🏅</div>
              )}
              <div className="ach-progress-row">
                {byTier.map(({ tier, total, unlocked }) => (
                  <div key={tier} className="ach-prog">
                    <div className="ach-prog-label" style={{ color: TIER_COLORS[tier] }}>{tier}</div>
                    <div className="ach-prog-counts">{unlocked}/{total}</div>
                    <div className="ach-bar"><div className="ach-bar-fill" style={{ background: TIER_COLORS[tier], width: total > 0 ? (unlocked/total*100)+'%' : '0%' }} /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relatórios & Feedback */}
            <div className="card reports-card" style={{ cursor: 'pointer' }} onClick={() => setShowReports(true)}>
              <div className="reports-card-inner">
                <div className="reports-icon-wrap">📊</div>
                <div className="reports-text">
                  <div className="reports-title">Relatórios & Feedback</div>
                  <div className="reports-sub">Relatórios pós provas · {reports.length} {reports.length === 1 ? 'relatório disponível' : 'relatórios disponíveis'}</div>
                </div>
                <div className="reports-arrow">↗</div>
              </div>
            </div>

            {/* Explore more resources */}
            <a href="https://www.englishwithdenise.com.br/" target="_blank" rel="noreferrer" className="card website-card">
              <div className="website-card-inner">
                <div className="website-icon">🌐</div>
                <div className="website-text">
                  <div className="website-title">Explore more resources</div>
                  <div className="website-sub">Guided Immersion & 30-Day Challenge</div>
                </div>
                <div className="website-arrow">↗</div>
              </div>
            </a>

            {/* Manual de Estudo Independente */}
            <a href="https://polydactyl-melon-224.notion.site/MANUAL-DE-COMO-APRENDER-INGL-S-POR-CONTA-PR-PRIA-32d628bb387c80698ddfd1c290166b32" target="_blank" rel="noreferrer" className="card manual-card">
              <div className="manual-card-inner">
                <div className="manual-icon-wrap" style={{ background: '#fff1e8' }}>📘</div>
                <div className="manual-text">
                  <div className="manual-title">Manual de Estudo Independente</div>
                  <div className="manual-sub">Como aprender inglês por conta própria</div>
                </div>
                <div className="manual-arrow">↗</div>
              </div>
            </a>

            {/* Manual do Aluno */}
            <a href="https://polydactyl-melon-224.notion.site/Manual-do-Aluno-353628bb387c81199971fa266ed66a26" target="_blank" rel="noreferrer" className="card manual-card">
              <div className="manual-card-inner">
                <div className="manual-icon-wrap" style={{ background: '#eeedfe' }}>📙</div>
                <div className="manual-text">
                  <div className="manual-title">Manual do Aluno</div>
                  <div className="manual-sub">English with Denise — guia completo</div>
                </div>
                <div className="manual-arrow">↗</div>
              </div>
            </a>
          </div>

          {/* RIGHT COL */}
          <div className="bottom-col">

            {/* Recent activity */}
            <div className="card activity-card">
              <div className="card-header-row">
                <div className="card-title">Recent activity</div>
                <span className="view-all">View all →</span>
              </div>
              {activities.length === 0 ? (
                <div className="activity-empty">No activities yet. Start practicing! 🚀</div>
              ) : (
                activities.slice(-4).reverse().map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="act-icon">{a.skill === 'writing' ? '✏️' : a.skill === 'reading' ? '📖' : a.skill === 'listening' ? '🎧' : '🎙️'}</div>
                    <div className="act-name">{a.title}</div>
                    <div className="act-time">{a.time}</div>
                  </div>
                ))
              )}
            </div>

            {/* Make-up Classes */}
            <div className="card reposicoes-card">
              <div className="reposicoes-header">
                <div className="card-title">🔄 Make-up Classes</div>
                <span className="reposicoes-synced">↻ Notion</span>
              </div>
              <div className="reposicoes-body">
                <div className="reposicoes-num-wrap">
                  <div className="reposicoes-num">{student?.reposicoes ?? '—'}</div>
                </div>
                <div className="reposicoes-text">
                  <div className="reposicoes-label">{student?.reposicoes === 1 ? 'Aula' : 'Aulas'} para Repor</div>
                  <div className="reposicoes-desc">Essa é a quantidade de aulas que você precisa repor.</div>
                </div>
              </div>

              {/* Show scheduled makeup class if date is set */}
              {student?.reposicoes > 0 && student?.dataReposicao ? (
                <div className="reposicoes-agendada">
                  <div className="reposicoes-agendada-icon">📅</div>
                  <div>
                    <div className="reposicoes-agendada-label">Reposição agendada</div>
                    <div className="reposicoes-agendada-data">
                      {new Date(student.dataReposicao + 'T12:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long', day: 'numeric', month: 'long'
                      })}
                      {student?.horarioReposicao && (
                        <span className="reposicoes-agendada-hora"> · {student.horarioReposicao}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : student?.reposicoes > 0 ? (
                <div className="reposicoes-note">Entre em contato com a Denise para agendar um horário 💬</div>
              ) : null}
            </div>

            {/* Your stats */}
            <div className="card stats-card">
              <div className="card-title" style={{ marginBottom: 12 }}>Your stats</div>
              {[
                ['Total practices', activities.length],
                ['Current streak', streak + ' days 🔥'],
                ['Best streak', bestStreak + ' days'],
                ['Total XP', xp + ' XP'],
                ['Current level', LEVEL_DISPLAY[nivel] || nivel],
              ].map(([label, val]) => (
                <div key={label} className="stat-item">
                  <span className="stat-label">{label}</span>
                  <span className="stat-value" style={label === 'Current level' ? { color: '#ff6a00' } : {}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      {/* ── Reports Modal ── */}
      {showReports && (
        <div className="reports-overlay" onClick={() => { setShowReports(false); setSelectedReport(null); }}>
          <div className="reports-modal" onClick={e => e.stopPropagation()}>
            <div className="reports-modal-header">
              <div>
                <div className="reports-modal-title">📊 Relatórios & Feedback</div>
                <div className="reports-modal-sub">Seus relatórios pós provas</div>
              </div>
              <button className="reports-close" onClick={() => { setShowReports(false); setSelectedReport(null); }}>✕</button>
            </div>

            {reports.length === 0 ? (
              <div className="reports-empty">
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <div className="reports-empty-title">Nenhum relatório ainda</div>
                <div className="reports-empty-sub">Após sua prova de nível, a Denise adicionará seu relatório aqui com feedback detalhado das 4 habilidades!</div>
              </div>
            ) : !selectedReport ? (
              <div className="reports-list">
                {reports.map(r => (
                  <div key={r.id} className="reports-list-item" onClick={() => setSelectedReport(r)}>
                    <div className="reports-list-left">
                      <div className="reports-nivel-badge">{r.nivel}</div>
                      <div>
                        <div className="reports-list-title">Prova {r.nivel}</div>
                        <div className="reports-list-date">{r.data ? new Date(r.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Data não informada'}</div>
                      </div>
                    </div>
                    <div className="reports-list-right">
                      <div className={`reports-resultado ${r.resultado?.includes('Aprovado') ? 'aprovado' : r.resultado?.includes('Precisa') ? 'revisar' : 'progresso'}`}>{r.resultado || '—'}</div>
                      <div className="reports-nota-final">{r.notas?.final != null ? r.notas.final + '/10' : '—'}</div>
                      <span style={{ color: '#aaa', fontSize: 20 }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="reports-detail">
                <button className="reports-back-btn" onClick={() => setSelectedReport(null)}>← Voltar</button>
                <div className="reports-detail-header">
                  <div className="reports-nivel-badge big">{selectedReport.nivel}</div>
                  <div style={{ flex: 1 }}>
                    <div className="reports-detail-title">Prova {selectedReport.nivel}</div>
                    <div className="reports-detail-date">{selectedReport.data ? new Date(selectedReport.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}</div>
                  </div>
                  <div className={`reports-resultado ${selectedReport.resultado?.includes('Aprovado') ? 'aprovado' : selectedReport.resultado?.includes('Precisa') ? 'revisar' : 'progresso'}`}>{selectedReport.resultado}</div>
                </div>

                <div className="reports-grades">
                  {[
                    { label: '📖 Reading',   key: 'reading',   color: '#1d9e75' },
                    { label: '🎧 Listening', key: 'listening', color: '#378add' },
                    { label: '✏️ Writing',   key: 'writing',   color: '#7f77dd' },
                    { label: '🎙️ Speaking',  key: 'speaking',  color: '#d4537e' },
                  ].map(s => (
                    <div key={s.key} className="reports-grade-item">
                      <div className="reports-grade-label">{s.label}</div>
                      <div className="reports-grade-num" style={{ color: s.color }}>{selectedReport.notas?.[s.key] ?? '—'}<span>/10</span></div>
                      <div className="reports-grade-bar"><div className="reports-grade-fill" style={{ width: selectedReport.notas?.[s.key] ? (selectedReport.notas[s.key] * 10) + '%' : '0%', background: s.color }} /></div>
                      {selectedReport.feedbacks?.[s.key] && <div className="reports-grade-feedback">{selectedReport.feedbacks[s.key]}</div>}
                    </div>
                  ))}
                </div>

                {selectedReport.notas?.final != null && (
                  <div className="reports-final-row">
                    <span>Nota Final</span>
                    <span className="reports-final-nota">{selectedReport.notas.final}/10</span>
                  </div>
                )}
                {selectedReport.pontosFortes && (
                  <div className="reports-section green">
                    <div className="reports-section-label">✅ Pontos Fortes</div>
                    <div className="reports-section-text">{selectedReport.pontosFortes}</div>
                  </div>
                )}
                {selectedReport.pontosMelhorar && (
                  <div className="reports-section orange">
                    <div className="reports-section-label">💡 Pontos a Melhorar</div>
                    <div className="reports-section-text">{selectedReport.pontosMelhorar}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

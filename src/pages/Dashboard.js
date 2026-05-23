import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const LEVEL_ORDER = ['A1', 'A1→A2', 'A2', 'B1 iniciante', 'B1', 'B2'];
const LEVEL_DISPLAY = { 'A1': 'A1', 'A1→A2': 'A1→A2', 'A2': 'A2', 'B1 iniciante': 'B1 Beginner', 'B1': 'B1', 'B2': 'B2' };
const XP_PER_LEVEL = 100;

export default function Dashboard({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [xp] = useState(() => parseInt(localStorage.getItem('ewd_xp') || '0'));
  const [streak] = useState(() => parseInt(localStorage.getItem('ewd_streak') || '0'));
  const [activities] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_activities') || '[]'); }
    catch { return []; }
  });

  const nivel = student?.nivel || 'A1';
  const levelIndex = LEVEL_ORDER.indexOf(nivel);
  const xpProgress = xp % XP_PER_LEVEL;
  const levelNum = Math.floor(xp / XP_PER_LEVEL) + 1;
  const agenda = student?.proximaAula;
  const dataAula = student?.dataProximaAula || agenda?.dataAula;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T12:00:00');
    return {
      day: d.getDate(),
      month: d.toLocaleString('en', { month: 'short' }),
      weekday: d.toLocaleString('en', { weekday: 'long' }),
    };
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

  const firstName = student?.nome?.split(' ')[0] || user?.name?.split(' ')[0] || '';
  const genero = student?.genero || '';
  const crown = genero === 'M' ? '👑 King' : genero === 'F' ? '👑 Queen' : '';
  const welcomeDisplay = crown ? `${crown} ${firstName}` : firstName;

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

        {/* Welcome */}
        <div className="welcome-row fade-up fade-up-1">
          <div>
            <p className="welcome-label">Welcome back,</p>
            <h1 className="welcome-name">{welcomeDisplay} <span className="welcome-star">✦</span></h1>
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
              return <div key={l} className={'level-dot' + (isDone ? ' done' : '') + (isCurrent ? ' current' : '')}>{l}</div>;
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
        {student?.meetLink && (
          <div className="meet-card fade-up fade-up-5">
            <div className="meet-card-left">
              <div className="meet-icon">📹</div>
              <div>
                <div className="meet-title">Google Meet — Aula ao Vivo</div>
                <div className="meet-sub">Clique para entrar na sua aula com a Denise</div>
              </div>
            </div>
            <a href={student.meetLink} target="_blank" rel="noreferrer" className="meet-btn">
              Entrar na Aula ↗
            </a>
          </div>
        )}

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
                <div className="card-title">✨ Achievements <span className="ach-count">0/37</span></div>
                <span className="view-all">View all ↓</span>
              </div>
              <div className="ach-empty">Complete activities to unlock achievements! 🏅</div>
              <div className="ach-progress-row">
                {[['Bronze','#cd7f32'],['Silver','#999'],['Gold','#ff6a00'],['Platinum','#7f77dd']].map(([label, color]) => (
                  <div key={label} className="ach-prog">
                    <div className="ach-prog-label" style={{ color }}>{label}</div>
                    <div className="ach-prog-counts">0/5</div>
                    <div className="ach-bar"><div className="ach-bar-fill" style={{ background: color, width: '0%' }} /></div>
                  </div>
                ))}
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
              <div className="reposicoes-note">Entre em contato com a Denise para agendar um horário 💬</div>
            </div>

            {/* Your stats */}
            <div className="card stats-card">
              <div className="card-title" style={{ marginBottom: 12 }}>Your stats</div>
              {[
                ['Total practices', activities.length],
                ['Best streak', streak + ' days'],
                ['Total XP', xp],
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
      </main>
    </div>
  );
}

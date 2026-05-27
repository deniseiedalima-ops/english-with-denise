import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PracticeHub.css';

const LESSONS = [
  { num: 1,  code: 'L1',  title: 'The American Pronunciation', level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  {
    num: 2, code: 'L2', title: 'The Greetings', level: 'A1',
    activities: {
      reading: [
        { code: 'L2-R1', title: 'Mark & Julia — Dialogue', type: 'Multiple Choice', activityIndex: 0, phase: 'pre' },
        { code: 'L2-R2', title: 'Vocabulary Match', type: 'Multiple Choice', activityIndex: 1, phase: 'pre' },
        { code: 'L2-R3', title: 'Verb To Be in Context', type: 'Multiple Choice', activityIndex: 2, phase: 'post' },
      ],
      listening: [
        { code: 'L2-L1', title: 'Jenny at the Hotel', type: 'Video + Questions', activityIndex: 0, phase: 'pre' },
        { code: 'L2-L2', title: 'Meet Sarah!', type: 'Video + Questions', activityIndex: 1, phase: 'pre' },
        { code: 'L2-L3', title: 'Where Are You From?', type: 'Video + Questions', activityIndex: 2, phase: 'post' },
      ],
      writing: [
        { code: 'L2-W1', title: 'Write a Greeting Dialogue', type: 'Open Writing', activityIndex: 0, phase: 'pre' },
        { code: 'L2-W2', title: 'How Are You? — 5 Ways', type: 'Open Writing', activityIndex: 1, phase: 'pre' },
        { code: 'L2-W3', title: 'Formal or Informal? Rewrite!', type: 'Open Writing', activityIndex: 2, phase: 'post' },
      ],
      speaking: [
        { code: 'L2-S1', title: 'Introduce Yourself!', type: 'AI Speaking', activityIndex: 0, phase: 'pre' },
        { code: 'L2-S2', title: 'How Are You? 5 Different Ways', type: 'AI Speaking', activityIndex: 1, phase: 'pre' },
        { code: 'L2-S3', title: 'Role Play — Hotel Check-in', type: 'AI Speaking', activityIndex: 2, phase: 'post' },
      ],
    }
  },
  {
    num: 3, code: 'L3', title: 'The Introductions', level: 'A1',
    activities: {
      reading: [
        { code: 'L3-R1', title: 'Meet Elizabeth & John', type: 'Multiple Choice', activityIndex: 3, phase: 'pre' },
        { code: 'L3-R2', title: 'Here, There & Whose? — Grammar Focus', type: 'Multiple Choice', activityIndex: 4, phase: 'post' },
      ],
      listening: [
        { code: 'L3-L1', title: 'Elizabeth & John — Full Introduction', type: 'Video + Questions', activityIndex: 3, phase: 'pre' },
        { code: 'L3-L2', title: 'Introducing Yourself — ESL Practice', type: 'Video + Questions', activityIndex: 4, phase: 'post' },
      ],
      writing: [
        { code: 'L3-W1', title: 'Write Your Own Introduction', type: 'Open Writing', activityIndex: 3, phase: 'pre' },
        { code: 'L3-W2', title: 'His, Her & Where — Write It Right', type: 'Open Writing', activityIndex: 4, phase: 'post' },
      ],
      speaking: [
        { code: 'L3-S1', title: 'Introduce Yourself!', type: 'AI Speaking', activityIndex: 3, phase: 'pre' },
        { code: 'L3-S2', title: 'Where Is It? Point & Say!', type: 'AI Speaking', activityIndex: 4, phase: 'post' },
      ],
    }
  },
  { num: 4,  code: 'L4',  title: 'Countries and Nationalities', level: 'A1',
    activities: {
      reading: [
        { code: 'L4-R1', title: 'Meet Giulia!', type: 'Multiple Choice', activityIndex: 5, phase: 'pre' },
        { code: 'L4-R2', title: 'Countries, Nationalities & Verbs', type: 'Multiple Choice', activityIndex: 6, phase: 'post' },
      ],
      listening: [
        { code: 'L4-L1', title: 'Street Interview — Where Are You From?', type: 'Video + Questions', activityIndex: 5, phase: 'pre' },
        { code: 'L4-L2', title: 'Countries & Nationalities — TV Show', type: 'Video + Questions', activityIndex: 6, phase: 'post' },
      ],
      writing: [
        { code: 'L4-W1', title: 'Where Are You From? — Write It!', type: 'Open Writing', activityIndex: 5, phase: 'pre' },
        { code: 'L4-W2', title: 'My Country & City — Describe It!', type: 'Open Writing', activityIndex: 6, phase: 'post' },
      ],
      speaking: [
        { code: 'L4-S1', title: 'Where Are You From? Tell Me Everything!', type: 'AI Speaking', activityIndex: 5, phase: 'pre' },
        { code: 'L4-S2', title: 'My Country & City — Tell Me More!', type: 'AI Speaking', activityIndex: 6, phase: 'post' },
      ],
    }
  },
  { num: 5,  code: 'L5',  title: 'The Occupations',             level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 6,  code: 'L6',  title: 'At the Café',                 level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 7,  code: 'L7',  title: 'The Places in the City',      level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 8,  code: 'L8',  title: 'The Family',                  level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 9,  code: 'L9',  title: 'You Are Going To…',           level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 10, code: 'L10', title: 'At the Travel Agency',        level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 11, code: 'L11', title: 'I Was So Nervous!',           level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 12, code: 'L12', title: 'Where Were You Yesterday?',   level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 13, code: 'L13', title: 'Final Review',                level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 14, code: 'L14', title: 'Final Test A1',               level: 'A1', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  // ── A2 ──────────────────────────────────────────────────────────────────
  { num: 15, code: 'L15', title: 'Daily Routines',              level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 16, code: 'L16', title: 'What Time Is It?',            level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 17, code: 'L17', title: 'At the Restaurant',           level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 18, code: 'L18', title: 'Shopping & Prices',           level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 19, code: 'L19', title: 'My Home & Furniture',         level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 20, code: 'L20', title: 'Transport & Directions',      level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 21, code: 'L21', title: 'Health & Body',               level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 22, code: 'L22', title: 'Past Experiences',            level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 23, code: 'L23', title: 'Future Plans',                level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
  { num: 24, code: 'L24', title: 'Final Test A2',               level: 'A2', activities: { reading: [], listening: [], writing: [], speaking: [] } },
];

const SKILLS = [
  { key: 'reading',   label: 'Reading',   icon: '📖', color: '#1d9e75', bg: '#e1f5ee', code: 'R' },
  { key: 'listening', label: 'Listening', icon: '🎧', color: '#378add', bg: '#e6f1fb', code: 'L' },
  { key: 'writing',   label: 'Writing',   icon: '✏️', color: '#7f77dd', bg: '#eeedfe', code: 'W' },
  { key: 'speaking',  label: 'Speaking',  icon: '🎙️', color: '#d4537e', bg: '#fbeaf0', code: 'S' },
];

const TYPE_ICONS = {
  'Multiple Choice': '🔘',
  'Video + Questions': '🎬',
  'Open Writing': '📝',
  'AI Speaking': '🤖',
};

// Which lesson levels the student can access based on their Notion level
const LEVEL_ACCESS = {
  'A1':          ['A1'],
  'A1→A2':       ['A1'],
  'A2':          ['A1', 'A2'],
  'B1 iniciante':['A1', 'A2'],
  'B1':          ['A1', 'A2', 'B1'],
  'B2':          ['A1', 'A2', 'B1', 'B2'],
};
const PRE_CLASS = 4;
const POST_CLASS = 4;

const WEEKLY_BADGES = [
  { min: 0,  max: 3,  label: 'Getting started',   icon: '🌱', color: '#aaa' },
  { min: 4,  max: 6,  label: 'On the right path!', icon: '🔥', color: '#ff6a00' },
  { min: 7,  max: 9,  label: 'Almost there!',      icon: '⭐', color: '#ba7517' },
  { min: 10, max: 11, label: 'So close!',           icon: '🚀', color: '#378add' },
  { min: 12, max: 12, label: 'Week completed!',     icon: '🏆', color: '#1d9e75' },
];

export default function PracticeHub({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedSkill, setSelectedSkill] = useState(() => searchParams.get('skill') || null);
  const [completedCodes, setCompletedCodes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_completed_codes') || '[]'); }
    catch { return []; }
  });

  const studentLevel = (student?.nivel || 'A1').trim();
  const allowedLevels = LEVEL_ACCESS[studentLevel] || LEVEL_ACCESS['A1'];

  // Separate available vs locked lessons safely
  const availableLessons = LESSONS.filter(l => allowedLevels.includes(l.level));
  const lockedLessons = LESSONS.filter(l => !allowedLevels.includes(l.level));

  // Auto-detect current lesson among available ones
  const currentLesson = (() => {
    for (const lesson of availableLessons) {
      try {
        const codes = Object.values(lesson.activities || {}).flat().map(a => a.code);
        if (codes.length === 0) continue;
        const done = codes.filter(c => completedCodes.includes(c)).length;
        if (done < codes.length) return lesson;
      } catch { continue; }
    }
    return availableLessons[availableLessons.length - 1] || LESSONS[0];
  })();

  const [expandedLesson, setExpandedLesson] = useState(currentLesson?.code || 'L2');

  const allCodes = currentLesson ? Object.values(currentLesson.activities || {}).flat().map(a => a.code) : [];
  const completedThisLesson = allCodes.filter(c => completedCodes.includes(c)).length;
  const lessonTotal = Math.max(allCodes.length, 1);
  const progressPct = Math.round((completedThisLesson / lessonTotal) * 100);
  const badge = WEEKLY_BADGES.find(b => completedThisLesson >= b.min && completedThisLesson <= b.max) || WEEKLY_BADGES[0];

  const handleStartActivity = (skill, activityIndex, code, lessonTitle) => {
    if (!completedCodes.includes(code)) {
      const updated = [...completedCodes, code];
      setCompletedCodes(updated);
      localStorage.setItem('ewd_completed_codes', JSON.stringify(updated));
      const xp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', xp + 10);
    }
    navigate(`/practice/${skill}?lesson=${encodeURIComponent(lessonTitle)}&activity=${activityIndex}`);
  };

  const stars = Array.from({ length: 6 }, (_, i) => ({
    top: [6,88,35,72,15,92][i] + '%',
    left: [4,91,97,2,50,87][i] + '%',
    size: [3,2,3.5,2,1.5,3][i],
    op: [0.35,0.25,0.4,0.3,0.15,0.3][i],
    d: ['3.5s','4s','5s','3s','5s','3s'][i],
    delay: ['0s','1s','0.5s','2s','3s','2.5s'][i],
  }));

  return (
    <div className="hub-page">
      {stars.map((s, i) => (
        <div key={i} className="star" style={{ top: s.top, left: s.left, width: s.size, height: s.size, '--op': s.op, '--d': s.d, '--delay': s.delay }} />
      ))}
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="hub-content">

        {/* Header */}
        <div className="hub-header">
          <h1 className="hub-title">Practice Hub</h1>
          <p className="hub-sub">Choose a skill and dive into your lesson activities ✦</p>
        </div>

        {/* 3 columns row */}
        <div className="hub-trio-row">

          {/* Legend */}
          <div className="hub-legend">
            <div className="hub-legend-title">How to read the activity codes:</div>
            <div className="hub-legend-items">
              <div className="hub-legend-item">
                <span className="hub-legend-code">L3</span>
                <span className="hub-legend-desc">Lesson number</span>
              </div>
              {[
                { code: 'R1', cls: 'reading',   desc: 'Reading',   icon: '📖' },
                { code: 'L1', cls: 'listening', desc: 'Listening', icon: '🎧' },
                { code: 'W1', cls: 'writing',   desc: 'Writing',   icon: '✏️' },
                { code: 'S1', cls: 'speaking',  desc: 'Speaking',  icon: '🎙️' },
              ].map(item => (
                <div key={item.code} className="hub-legend-item">
                  <span className={'hub-legend-code ' + item.cls}>{item.code}</span>
                  <span className="hub-legend-desc">{item.icon} {item.desc}</span>
                </div>
              ))}
            </div>
            <div className="hub-legend-example">
              <strong>L3-R2</strong> = Lesson 3 · Reading · Activity 2
            </div>
          </div>

          {/* Tip banner */}
          <div className="hub-tip-banner">
            <div className="hub-tip-icon">💡</div>
            <div className="hub-tip-text">
              <strong>Tip From the Teacher</strong>
              <ul className="hub-tip-list">
                <li>Faça <strong>4 atividades antes da aula</strong> (📚 Pré-aula) para chegar preparado</li>
                <li>Faça <strong>4 atividades após a aula</strong> (✅ Pós-aula) para consolidar o aprendizado</li>
                <li>Isso evita o acúmulo de conteúdo e aumenta sua retenção</li>
                <li>Quer praticar mais? Acesse o <strong>Guided Immersion</strong> no dashboard</li>
              </ul>
              <em>Consistency is the key to fluency!</em>
            </div>
          </div>

          {/* Weekly progress */}
          <div className="hub-weekly-card">
            <div className="hub-weekly-top">
              <div className="hub-weekly-left">
                <div className="hub-weekly-badge-icon">{badge.icon}</div>
                <div>
                  <div className="hub-weekly-title">{currentLesson.code}: {currentLesson.title}</div>
                  <div className="hub-weekly-status" style={{ color: badge.color }}>{badge.label}</div>
                </div>
              </div>
              <div className="hub-weekly-count">
                <span className="hub-weekly-done" style={{ color: badge.color }}>{completedThisLesson}</span>
                <span className="hub-weekly-total">/{TOTAL_PER_LESSON}</span>
              </div>
            </div>
            <div className="hub-weekly-bar-wrap">
              <div className="hub-weekly-bar">
                <div className="hub-weekly-fill" style={{ width: progressPct + '%', background: badge.color }} />
              </div>
              <span className="hub-weekly-pct">{progressPct}%</span>
            </div>
            <div className="hub-weekly-skills">
              {SKILLS.map(s => {
                const codes = (currentLesson.activities[s.key] || []).map(a => a.code);
                const done = codes.filter(c => completedCodes.includes(c)).length;
                return (
                  <div key={s.key} className="hub-weekly-skill-chip" style={{ '--chip-color': s.color }}>
                    {s.icon} {done}/{codes.length}
                  </div>
                );
              })}
            </div>
            {completedThisLesson === lessonTotal && (
              <div className="hub-weekly-congrats">
                🎉 All {lessonTotal} done! +{lessonTotal * 10} XP 🏆 Want more? Try Guided Immersion!
              </div>
            )}
          </div>

        </div>

        {/* Skill selector */}
        {!selectedSkill ? (
          <>
            <div className="hub-skills-grid">
              {SKILLS.map(s => {
                const codes = (currentLesson.activities[s.key] || []).map(a => a.code);
                const done = codes.filter(c => completedCodes.includes(c)).length;
                const total = availableLessons.reduce((acc, l) => acc + (l.activities[s.key] ? l.activities[s.key].length : 0), 0);
                return (
                  <div key={s.key} className="hub-skill-card" onClick={() => setSelectedSkill(s.key)} style={{ '--skill-color': s.color, '--skill-bg': s.bg }}>
                    <div className="hub-skill-icon">{s.icon}</div>
                    <div className="hub-skill-label">{s.label}</div>
                    <div className="hub-skill-count">{total} activities</div>
                    <div className="hub-skill-mini-bar">
                      <div className="hub-skill-mini-fill" style={{ width: Math.round((done / 3) * 100) + '%', background: s.color }} />
                    </div>
                    <div className="hub-skill-progress-text" style={{ color: s.color }}>{done}/3 this week</div>
                    <div className="hub-skill-arrow" style={{ color: s.color }}>→</div>
                  </div>
                );
              })}
            </div>
            <div className="hub-stats-row">
              <div className="hub-stat"><div className="hub-stat-num">{LESSONS.length}</div><div className="hub-stat-label">lessons available</div></div>
              <div className="hub-stat"><div className="hub-stat-num">{LESSONS.reduce((acc, l) => acc + Object.values(l.activities).flat().length, 0)}</div><div className="hub-stat-label">total activities</div></div>
              <div className="hub-stat"><div className="hub-stat-num">4</div><div className="hub-stat-label">skills covered</div></div>
              <div className="hub-stat"><div className="hub-stat-num">AI</div><div className="hub-stat-label">powered feedback</div></div>
            </div>
          </>
        ) : (
          <>
            <div className="hub-skill-header">
              <button className="hub-back-btn" onClick={() => setSelectedSkill(null)}>← Back</button>
              <div className="hub-skill-title-row">
                <span>{SKILLS.find(s => s.key === selectedSkill)?.icon}</span>
                <h2 className="hub-skill-title">{SKILLS.find(s => s.key === selectedSkill)?.label}</h2>
              </div>
            </div>
            <div className="hub-lessons">
              {/* Available lessons */}
              {availableLessons.map(lesson => {
                const acts = lesson.activities[selectedSkill] || [];
                const isOpen = expandedLesson === lesson.code;
                return (
                  <div key={lesson.code} className="hub-lesson-card">
                    <div className="hub-lesson-header" onClick={() => setExpandedLesson(isOpen ? null : lesson.code)}>
                      <div className="hub-lesson-left">
                        <div className="hub-lesson-code">{lesson.code}</div>
                        <div>
                          <div className="hub-lesson-title">{lesson.title}</div>
                          <div className="hub-lesson-meta">
                            <span className="hub-level-pill">{lesson.level}</span>
                            <span className="hub-acts-count">{acts.length} activities</span>
                          </div>
                        </div>
                      </div>
                      <div className={'hub-chevron' + (isOpen ? ' open' : '')}>▾</div>
                    </div>
                    {isOpen && (
                      <div className="hub-activities-list">
                        {acts.length === 0 ? (
                          <div className="hub-coming-soon">✨ Activities coming soon!</div>
                        ) : acts.map((act, i) => {
                          const done = completedCodes.includes(act.code);
                          return (
                            <div key={act.code} className={'hub-activity-row' + (done ? ' done' : '')} onClick={() => handleStartActivity(selectedSkill, act.activityIndex, act.code, lesson.title)}>
                              <div className="hub-activity-left">
                                <div className={'hub-activity-num' + (done ? ' done' : '')}>{done ? '✓' : i + 1}</div>
                                <div>
                                  <div className="hub-activity-code-row">
                                    <span className="hub-activity-code">{act.code}</span>
                                    {act.phase && <span className={'hub-phase-badge ' + act.phase}>{act.phase === 'pre' ? '📚 Pré-aula' : '✅ Pós-aula'}</span>}
                                  </div>
                                  <div className="hub-activity-title">{act.title}</div>
                                </div>
                              </div>
                              <div className="hub-activity-right">
                                <span className="hub-type-badge">{TYPE_ICONS[act.type]} {act.type}</span>
                                <button className={'hub-start-btn' + (done ? ' done' : '')}>{done ? 'Redo ↺' : 'Start →'}</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Locked lessons */}
              {lockedLessons.length > 0 && (
                <div className="hub-locked-section">
                  <div className="hub-locked-title">🔒 Locked — Complete your current level to unlock</div>
                  {[...new Set(lockedLessons.map(l => l.level))].map(lvl => (
                    <div key={lvl} className="hub-locked-level-card">
                      <div className="hub-locked-level-badge">{lvl}</div>
                      <div className="hub-locked-level-info">
                        <div className="hub-locked-level-name">{lvl === 'A2' ? 'Elementary' : lvl === 'B1' ? 'Intermediate' : lvl === 'B2' ? 'Upper Intermediate' : lvl}</div>
                        <div className="hub-locked-level-count">{lockedLessons.filter(l => l.level === lvl).length} lessons · {lockedLessons.filter(l => l.level === lvl).reduce((a, l) => a + Object.values(l.activities).flat().length, 0)}+ activities</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

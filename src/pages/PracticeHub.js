import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PracticeHub.css';

const LESSONS = [
  {
    num: 3, code: 'L3', title: 'The Greetings', level: 'A1',
    activities: {
      reading: [
        { code: 'L3-R1', title: 'Mark & Julia — Dialogue', type: 'Multiple Choice', activityIndex: 0 },
        { code: 'L3-R2', title: 'Vocabulary Match', type: 'Multiple Choice', activityIndex: 1 },
        { code: 'L3-R3', title: 'Verb To Be in Context', type: 'Multiple Choice', activityIndex: 2 },
      ],
      listening: [
        { code: 'L3-L1', title: 'Jenny at the Hotel', type: 'Video + Questions', activityIndex: 0 },
        { code: 'L3-L2', title: 'Meet Sarah!', type: 'Video + Questions', activityIndex: 1 },
        { code: 'L3-L3', title: 'Where Are You From?', type: 'Video + Questions', activityIndex: 2 },
      ],
      writing: [
        { code: 'L3-W1', title: 'Write a Greeting Dialogue', type: 'Open Writing', activityIndex: 0 },
        { code: 'L3-W2', title: 'How Are You? — 5 Ways', type: 'Open Writing', activityIndex: 1 },
        { code: 'L3-W3', title: 'Formal or Informal? Rewrite!', type: 'Open Writing', activityIndex: 2 },
      ],
      speaking: [
        { code: 'L3-S1', title: 'Introduce Yourself!', type: 'AI Speaking', activityIndex: 0 },
        { code: 'L3-S2', title: 'How Are You? 5 Different Ways', type: 'AI Speaking', activityIndex: 1 },
        { code: 'L3-S3', title: 'Role Play — Hotel Check-in', type: 'AI Speaking', activityIndex: 2 },
      ],
    }
  },
  {
    num: 4, code: 'L4', title: 'The Introductions', level: 'A1',
    activities: {
      reading: [
        { code: 'L4-R1', title: 'Molly & Peter at School', type: 'Multiple Choice', activityIndex: 3, phase: 'pre' },
        { code: 'L4-R2', title: 'Verb To Be — Introductions', type: 'Multiple Choice', activityIndex: 4, phase: 'post' },
      ],
      listening: [
        { code: 'L4-L1', title: 'Friends Cast — Introductions', type: 'Transcript + Questions', activityIndex: 3, phase: 'pre' },
        { code: 'L4-L2', title: 'Molly & Peter — Listen & Follow', type: 'Transcript + Questions', activityIndex: 4, phase: 'post' },
      ],
      writing: [
        { code: 'L4-W1', title: 'School Introduction Dialogue', type: 'Open Writing', activityIndex: 3, phase: 'pre' },
        { code: 'L4-W2', title: 'Verb To Be — Complete & Create', type: 'Open Writing', activityIndex: 4, phase: 'post' },
      ],
      speaking: [
        { code: 'L4-S1', title: 'Introduce Yourself at School', type: 'AI Speaking', activityIndex: 3, phase: 'pre' },
        { code: 'L4-S2', title: 'Correct the Teacher!', type: 'AI Speaking', activityIndex: 5, phase: 'post' },
      ],
    }
  },
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

const TOTAL_PER_LESSON = 8;
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

  // Auto-detect current lesson: find first lesson not 100% completed
  const currentLesson = (() => {
    for (const lesson of LESSONS) {
      const codes = Object.values(lesson.activities).flat().map(a => a.code);
      const done = codes.filter(c => completedCodes.includes(c)).length;
      if (done < codes.length) return lesson;
    }
    return LESSONS[LESSONS.length - 1];
  })();

  const [expandedLesson, setExpandedLesson] = useState(currentLesson?.code || 'L3');

  const allCodes = Object.values(currentLesson.activities).flat().map(a => a.code);
  const completedThisLesson = allCodes.filter(c => completedCodes.includes(c)).length;
  const lessonTotal = allCodes.length;
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
                const total = LESSONS.reduce((acc, l) => acc + (l.activities[s.key] ? l.activities[s.key].length : 0), 0);
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
              {LESSONS.map(lesson => {
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
                        {acts.map((act, i) => {
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
            </div>
          </>
        )}
      </main>
    </div>
  );
}

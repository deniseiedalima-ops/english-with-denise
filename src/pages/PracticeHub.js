import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PracticeHub.css';

const LEVEL_ACCESS = {
  'A1':           ['A1'],
  'A1→A2':        ['A1'],
  'A2':           ['A1', 'A2'],
  'B1 iniciante': ['A1', 'A2'],
  'B1':           ['A1', 'A2', 'B1'],
  'B2':           ['A1', 'A2', 'B1', 'B2'],
};

// Each lesson has ONE pre activity and ONE post activity
const LESSONS = [
  {
    num: 1, code: 'L1', title: 'The American Pronunciation', level: 'A1',
    pre:  { code: 'L1-PRE', title: 'American Sounds — Listen & Learn', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 11 },
    post: { code: 'L1-POST', title: 'Pronunciation Practice', skill: 'speaking', icon: '🎙️', type: 'AI Speaking', activityIndex: 12 },
  },
  {
    num: 2, code: 'L2', title: 'The Greetings', level: 'A1',
    pre:  { code: 'L2-PRE', title: 'Jenny at the Hotel', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 0 },
    post: { code: 'L2-POST', title: 'Verb To Be in Context', skill: 'reading', icon: '📖', type: 'Multiple Choice', activityIndex: 2 },
  },
  {
    num: 3, code: 'L3', title: 'The Introductions', level: 'A1',
    pre:  { code: 'L3-PRE', title: 'John & Elizabeth — First Meeting', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 3 },
    post: { code: 'L3-POST', title: 'Her, His, Here & There', skill: 'reading', icon: '📖', type: 'Multiple Choice', activityIndex: 4 },
  },
  {
    num: 4, code: 'L4', title: 'Countries and Nationalities', level: 'A1',
    pre:  { code: 'L4-PRE', title: 'Street Interview — Where Are You From?', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 5 },
    post: { code: 'L4-POST', title: 'Countries, Nationalities & Verbs', skill: 'reading', icon: '📖', type: 'Multiple Choice', activityIndex: 6 },
  },
  {
    num: 5, code: 'L5', title: 'The Occupations', level: 'A1',
    pre:  { code: 'L5-PRE', title: 'What Is Your Job?', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 7 },
    post: { code: 'L5-POST', title: 'Articles A / AN — Jobs Grammar', skill: 'reading', icon: '📖', type: 'Multiple Choice', activityIndex: 8 },
  },
  {
    num: 6, code: 'L6', title: 'At the Café', level: 'A1',
    pre:  { code: 'L6-PRE', title: 'Ordering at a Coffee Shop', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 9 },
    post: { code: 'L6-POST', title: 'Café Vocabulary & Expressions', skill: 'reading', icon: '📖', type: 'Multiple Choice', activityIndex: 10 },
  },
  { num: 7,  code: 'L7',  title: 'The Places in the City',    level: 'A1',
    pre:  { code: 'L7-PRE',  title: 'Places in the City — Conversation', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 13 },
    post: { code: 'L7-POST', title: 'City Vocabulary & Directions',       skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 14 },
  },
  { num: 8,  code: 'L8',  title: 'The Family',                level: 'A1',
    pre:  { code: 'L8-PRE',  title: 'The Family — Conversation',          skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 15 },
    post: { code: 'L8-POST', title: 'Family Members & Possessives',        skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 16 },
  },
  { num: 9,  code: 'L9',  title: 'You Are Going To…',         level: 'A1',
    pre:  { code: 'L9-PRE',  title: 'Future Plans — Going To',             skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 17 },
    post: { code: 'L9-POST', title: 'Going To — Grammar Focus',            skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 18 },
  },
  { num: 10, code: 'L10', title: 'At the Travel Agency',      level: 'A1',
    pre:  { code: 'L10-PRE',  title: 'At the Airport — Conversation',      skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 19 },
    post: { code: 'L10-POST', title: 'Travel Vocabulary & Phrases',         skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 20 },
  },
  { num: 11, code: 'L11', title: 'I Was So Nervous!',         level: 'A1',
    pre:  { code: 'L11-PRE',  title: 'Was / Were — Conversation',           skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 21 },
    post: { code: 'L11-POST', title: 'Simple Past — To Be',                  skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 22 },
  },
  { num: 12, code: 'L12', title: 'Where Were You Yesterday?', level: 'A1',
    pre:  { code: 'L12-PRE',  title: 'Where Were You? — Conversation',       skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 23 },
    post: { code: 'L12-POST', title: 'Simple Past — Regular Verbs',           skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 24 },
  },
  { num: 13, code: 'L13', title: 'Final Review',              level: 'A1',
    pre:  { code: 'L13-PRE',  title: 'A1 Full Review — Listening',            skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 25 },
    post: { code: 'L13-POST', title: 'A1 Full Review — Reading',               skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 26 },
  },
  { num: 14, code: 'L14', title: 'Final Test A1',             level: 'A1',
    pre:  { code: 'L14-PRE',  title: 'Final Test — Writing Review',            skill: 'writing',   icon: '✏️', type: 'Open Writing',     activityIndex: 27 },
    post: { code: 'L14-POST', title: 'Final Test — Reading Review',             skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 28 },
  },
  { num: 15, code: 'L15', title: 'Daily Routines',         level: 'A2', pre: null, post: null },
  { num: 16, code: 'L16', title: 'The Parts of the House', level: 'A2',
    pre:  { code: 'L16-PRE',  title: 'Parts of the House — Conversation', skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 100 },
    post: { code: 'L16-POST', title: 'House Vocabulary — Reading',         skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 101 },
  },
  { num: 17, code: 'L17', title: 'Do or Does?',            level: 'A2',
    pre:  { code: 'L17-PRE',  title: 'Do or Does? — Conversation',        skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 102 },
    post: { code: 'L17-POST', title: 'Do / Does — Grammar Focus',          skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 103 },
  },
  { num: 18, code: 'L18', title: 'Housework',              level: 'A2',
    pre:  { code: 'L18-PRE',  title: 'Housework — Conversation',          skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 104 },
    post: { code: 'L18-POST', title: 'Housework Vocabulary — Reading',     skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 105 },
  },
  { num: 19, code: 'L19', title: 'Routines',               level: 'A2',
    pre:  { code: 'L19-PRE',  title: 'Routines — Conversation',           skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 106 },
    post: { code: 'L19-POST', title: 'Daily Routines — Reading',           skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 107 },
  },
  { num: 20, code: 'L20', title: 'A Scheduled Routine',    level: 'A2',
    pre:  { code: 'L20-PRE',  title: 'Routines — Writing Review',         skill: 'writing',   icon: '✏️', type: 'Open Writing',     activityIndex: 108 },
    post: { code: 'L20-POST', title: 'Routines — Reading Review',          skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 109 },
  },
  { num: 21, code: 'L21', title: 'Would You…?',            level: 'A2',
    pre:  { code: 'L21-PRE',  title: 'Would You…? — Conversation',        skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 110 },
    post: { code: 'L21-POST', title: 'Would — Grammar Focus',              skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 111 },
  },
  { num: 22, code: 'L22', title: 'Food Time!',             level: 'A2',
    pre:  { code: 'L22-PRE',  title: 'Food Time! — Conversation',         skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 112 },
    post: { code: 'L22-POST', title: 'Food Vocabulary — Reading',          skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 113 },
  },
  { num: 23, code: 'L23', title: 'I Can or I Could?!',     level: 'A2',
    pre:  { code: 'L23-PRE',  title: 'Can or Could? — Conversation',      skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 114 },
    post: { code: 'L23-POST', title: 'Can / Could — Grammar Focus',        skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 115 },
  },
  { num: 24, code: 'L24', title: 'Shopping Time!',         level: 'A2',
    pre:  { code: 'L24-PRE',  title: 'Shopping Time! — Conversation',     skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 116 },
    post: { code: 'L24-POST', title: 'Shopping Vocabulary — Reading',      skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 117 },
  },
  { num: 25, code: 'L25', title: 'Fashion',                level: 'A2',
    pre:  { code: 'L25-PRE',  title: 'Fashion — Writing Review',          skill: 'writing',   icon: '✏️', type: 'Open Writing',     activityIndex: 118 },
    post: { code: 'L25-POST', title: 'Fashion Vocabulary — Reading',       skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 119 },
  },
  { num: 26, code: 'L26', title: 'What Did You Do?',       level: 'A2',
    pre:  { code: 'L26-PRE',  title: 'What Did You Do? — Conversation',   skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 120 },
    post: { code: 'L26-POST', title: 'Simple Past Review — Reading',       skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 121 },
  },
  { num: 27, code: 'L27', title: "I Didn't Propose!",      level: 'A2',
    pre:  { code: 'L27-PRE',  title: "Didn't / Did — Writing Review",     skill: 'writing',   icon: '✏️', type: 'Open Writing',     activityIndex: 122 },
    post: { code: 'L27-POST', title: "Did / Didn't — Grammar Focus",      skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 123 },
  },
  { num: 28, code: 'L28', title: 'The Lost Backpack',      level: 'A2',
    pre:  { code: 'L28-PRE',  title: 'The Lost Backpack — Writing Review', skill: 'writing',  icon: '✏️', type: 'Open Writing',     activityIndex: 124 },
    post: { code: 'L28-POST', title: 'Full Review — Reading',              skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 125 },
  },
  { num: 29, code: 'L29', title: 'A Story in the Past',    level: 'A2',
    pre:  { code: 'L29-PRE',  title: 'A Story in the Past — Listening',   skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 126 },
    post: { code: 'L29-POST', title: 'Past Story — Reading',               skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 127 },
  },
  { num: 30, code: 'L30', title: 'The Final Review II',    level: 'A2',
    pre:  { code: 'L30-PRE',  title: 'A2 Final Review — Listening',       skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 128 },
    post: { code: 'L30-POST', title: 'A2 Final Review — Reading',          skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 129 },
  },
  { num: 31, code: 'L31', title: 'Final Test 2',           level: 'A2',
    pre:  { code: 'L31-PRE',  title: 'Final Test 2 — Writing Review',     skill: 'writing',   icon: '✏️', type: 'Open Writing',     activityIndex: 130 },
    post: { code: 'L31-POST', title: 'Final Test 2 — Reading Review',     skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 131 },
  },
  { num: 30, code: 'L30', title: 'Final Review II',        level: 'A2',
    pre:  { code: 'L30-PRE',  title: 'Final Review II — Listening',       skill: 'listening', icon: '🎧', type: 'Video + Questions', activityIndex: 128 },
    post: { code: 'L30-POST', title: 'Final Review II — Reading',          skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 129 },
  },
  { num: 31, code: 'L31', title: 'Final Test 2',           level: 'A2',
    pre:  { code: 'L31-PRE',  title: 'Final Test 2 — Writing Review',     skill: 'writing',   icon: '✏️', type: 'Open Writing',     activityIndex: 130 },
    post: { code: 'L31-POST', title: 'Final Test 2 — Reading Review',      skill: 'reading',   icon: '📖', type: 'Multiple Choice',  activityIndex: 131 },
  },
];

const SKILL_COLORS = {
  listening: { bg: '#e6f1fb', color: '#0C447C', label: 'Listening' },
  reading:   { bg: '#e1f5ee', color: '#085041', label: 'Reading' },
  writing:   { bg: '#eeedfe', color: '#3C3489', label: 'Writing' },
  speaking:  { bg: '#fbeaf0', color: '#72243E', label: 'Speaking' },
};

const LEVEL_META = {
  'A1': { label: 'Nível A1', sub: 'Beginner',           color: '#ff6a00', bg: '#fff1e8' },
  'A2': { label: 'Nível A2', sub: 'Elementary',         color: '#1d9e75', bg: '#e1f5ee' },
  'B1': { label: 'Nível B1', sub: 'Intermediate',       color: '#378add', bg: '#e6f1fb' },
  'B2': { label: 'Nível B2', sub: 'Upper Intermediate',  color: '#7f77dd', bg: '#eeedfe' },
};

export default function PracticeHub({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [completedCodes, setCompletedCodes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_completed_codes') || '[]'); }
    catch { return []; }
  });
  const [openLevels, setOpenLevels] = useState({ 'A1': true, 'A2': true, 'B1': true, 'B2': true });

  const studentLevel = (student?.nivel || 'A1').trim();
  const allowedLevels = LEVEL_ACCESS[studentLevel] || ['A1'];

  // Deduplicate lessons by code
  const seen = new Set();
  const uniqueLessons = LESSONS.filter(l => {
    if (seen.has(l.code)) return false;
    seen.add(l.code);
    return true;
  });

  const availableLessons = uniqueLessons.filter(l => allowedLevels.includes(l.level));
  const lockedLessons    = uniqueLessons.filter(l => !allowedLevels.includes(l.level));

  // Group available lessons by level
  const lessonsByLevel = allowedLevels.reduce((acc, lvl) => {
    acc[lvl] = availableLessons.filter(l => l.level === lvl);
    return acc;
  }, {});

  // Find current lesson (first incomplete)
  const currentLesson = availableLessons.find(l => {
    if (!l.pre && !l.post) return false;
    const preDone  = !l.pre  || completedCodes.includes(l.pre.code);
    const postDone = !l.post || completedCodes.includes(l.post.code);
    return !preDone || !postDone;
  }) || availableLessons.find(l => l.pre || l.post) || availableLessons[0];

  // Progress
  const preTotal  = availableLessons.filter(l => l.pre).length;
  const postTotal = availableLessons.filter(l => l.post).length;
  const preDone   = availableLessons.filter(l => l.pre  && completedCodes.includes(l.pre.code)).length;
  const postDone  = availableLessons.filter(l => l.post && completedCodes.includes(l.post.code)).length;
  const totalDone = preDone + postDone;
  const totalActs = preTotal + postTotal;
  const pct = totalActs > 0 ? Math.round((totalDone / totalActs) * 100) : 0;

  const handleStart = (act, lessonTitle) => {
    if (!completedCodes.includes(act.code)) {
      const updated = [...completedCodes, act.code];
      setCompletedCodes(updated);
      localStorage.setItem('ewd_completed_codes', JSON.stringify(updated));
      const xp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', xp + 20);
      window.dispatchEvent(new Event('storage'));
    }
    navigate(`/practice/${act.skill}?lesson=${encodeURIComponent(lessonTitle)}&activity=${act.activityIndex}`);
  };

  const toggleLevel = (lvl) => setOpenLevels(prev => ({ ...prev, [lvl]: !prev[lvl] }));

  const renderLesson = (lesson, phase) => {
    const act = phase === 'pre' ? lesson.pre : lesson.post;
    const isCurrent = lesson.code === currentLesson?.code;
    const isDone = act && completedCodes.includes(act.code);
    const hasAct = !!act;
    const skillStyle = act ? SKILL_COLORS[act.skill] : null;

    if (!hasAct) return (
      <div key={lesson.code + phase} className="lesson-row upcoming-row">
        <span className="lesson-code-badge upcoming">{lesson.code}</span>
        <div className="lesson-row-info">
          <div className="lesson-row-name">{lesson.title}</div>
          <span className="coming-soon-tag">Coming soon</span>
        </div>
      </div>
    );

    if (isCurrent && !isDone) return (
      <div key={lesson.code + phase} className={`lesson-current-card ${phase}`}>
        <div className={`lesson-current-header ${phase}`}>
          <span className={`lesson-code-badge ${phase}`}>{lesson.code}</span>
          <div className="lesson-row-info">
            <div className="lesson-row-name">{lesson.title}</div>
            <span className="skill-pill" style={{ background: skillStyle.bg, color: skillStyle.color }}>
              {act.icon} {skillStyle.label}
            </span>
          </div>
          <span className={`current-tag ${phase}`}>{phase === 'pre' ? 'Current ✦' : 'After class ✦'}</span>
        </div>
        <div className="lesson-current-body">
          <div className="lesson-current-title">{act.title}</div>
          <div className="lesson-current-actions">
            <button className={`start-big-btn ${phase}`} onClick={() => handleStart(act, lesson.title)}>▶ Start Activity</button>
            <span className="xp-tag">+20 XP</span>
          </div>
        </div>
      </div>
    );

    return (
      <div key={lesson.code + phase} className={`lesson-row ${isDone ? 'done' : ''}`}>
        <span className={`lesson-code-badge ${isDone ? 'done' : 'default'}`}>{lesson.code}</span>
        <div className="lesson-row-info">
          <div className="lesson-row-name">{lesson.title}</div>
          <span className="skill-pill" style={{ background: skillStyle.bg, color: skillStyle.color }}>
            {act.icon} {skillStyle.label} · {act.title}
          </span>
        </div>
        {isDone
          ? <><span className="done-check">✓</span><button className="redo-btn" onClick={() => handleStart(act, lesson.title)}>↺</button></>
          : <button className="start-small-btn" onClick={() => handleStart(act, lesson.title)}>Start →</button>
        }
      </div>
    );
  };

  // Render a level section (collapsible) for one column
  const renderLevelSection = (lvl, phase) => {
    const meta = LEVEL_META[lvl];
    const lessons = lessonsByLevel[lvl] || [];
    const isOpen = openLevels[lvl];
    const doneCnt = lessons.filter(l => {
      const act = phase === 'pre' ? l.pre : l.post;
      return act && completedCodes.includes(act.code);
    }).length;
    const total = lessons.filter(l => phase === 'pre' ? l.pre : l.post).length;

    return (
      <div key={lvl + phase} className="hub-level-section">
        <div className="hub-level-header" onClick={() => toggleLevel(lvl)} style={{ borderColor: meta.color }}>
          <div className="hub-level-header-left">
            <div className="hub-level-pill" style={{ background: meta.color, color: '#fff' }}>{meta.label}</div>
            <div className="hub-level-sub">{meta.sub}</div>
          </div>
          <div className="hub-level-header-right">
            <div className="hub-level-progress-text" style={{ color: meta.color }}>{doneCnt}/{total}</div>
            <div className="hub-level-mini-bar">
              <div className="hub-level-mini-fill" style={{ width: total > 0 ? (doneCnt/total*100)+'%' : '0%', background: meta.color }} />
            </div>
            <span className={`hub-level-chevron ${isOpen ? 'open' : ''}`}>▾</span>
          </div>
        </div>
        {isOpen && (
          <div className="hub-level-content">
            {lessons.map(l => renderLesson(l, phase))}
          </div>
        )}
      </div>
    );
  };

  const lockedLevels = [...new Set(lockedLessons.map(l => l.level))];

  return (
    <div className="hub-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="hub-content">

        <div className="hub-header">
          <h1 className="hub-title">Practice Hub</h1>
          <p className="hub-sub">One activity before class, one after — simple and focused ✦</p>
        </div>

        {/* Progress card */}
        <div className="hub-progress-card">
          <div className="hub-progress-icon">🔥</div>
          <div className="hub-progress-text">
            <div className="hub-progress-lesson">
              {currentLesson ? `${currentLesson.code}: ${currentLesson.title}` : 'All done!'}
            </div>
            <div className="hub-progress-status">{totalDone} of {totalActs} activities completed</div>
            <div className="hub-progress-bar"><div className="hub-progress-fill" style={{ width: pct + '%' }} /></div>
          </div>
          <div className="hub-progress-nums">{totalDone}<span>/{totalActs}</span></div>
        </div>

        {/* Two-column layout */}
        <div className="hub-two-cols">

          {/* PRÉ-AULA */}
          <div className="hub-col">
            <div className="hub-col-header pre">
              <span className="hub-col-icon">📚</span>
              <span className="hub-col-label pre">Pré-aula</span>
              <span className="hub-col-badge pre">Before class</span>
            </div>
            <p className="hub-col-desc">Complete before each class with Denise</p>

            {allowedLevels.map(lvl => renderLevelSection(lvl, 'pre'))}

            {lockedLevels.map(lvl => {
              const meta = LEVEL_META[lvl] || {};
              return (
                <div key={lvl + 'pre-locked'} className="hub-locked-row">
                  <span className="hub-locked-icon">🔒</span>
                  <span className="hub-locked-badge">{meta.label || lvl}</span>
                  <span className="hub-locked-txt">Unlocks when you reach {lvl}</span>
                </div>
              );
            })}
          </div>

          {/* PÓS-AULA */}
          <div className="hub-col">
            <div className="hub-col-header pos">
              <span className="hub-col-icon">✅</span>
              <span className="hub-col-label pos">Pós-aula</span>
              <span className="hub-col-badge pos">After class</span>
            </div>
            <p className="hub-col-desc">Complete right after your class</p>

            {allowedLevels.map(lvl => renderLevelSection(lvl, 'post'))}

            {lockedLevels.map(lvl => {
              const meta = LEVEL_META[lvl] || {};
              return (
                <div key={lvl + 'post-locked'} className="hub-locked-row">
                  <span className="hub-locked-icon">🔒</span>
                  <span className="hub-locked-badge">{meta.label || lvl}</span>
                  <span className="hub-locked-txt">Unlocks when you reach {lvl}</span>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}


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
  { num: 15, code: 'L15', title: 'Daily Routines',            level: 'A2', pre: null, post: null },
  { num: 16, code: 'L16', title: 'What Time Is It?',          level: 'A2', pre: null, post: null },
  { num: 17, code: 'L17', title: 'At the Restaurant',         level: 'A2', pre: null, post: null },
  { num: 18, code: 'L18', title: 'Shopping & Prices',         level: 'A2', pre: null, post: null },
  { num: 19, code: 'L19', title: 'My Home & Furniture',       level: 'A2', pre: null, post: null },
  { num: 20, code: 'L20', title: 'Transport & Directions',    level: 'A2', pre: null, post: null },
  { num: 21, code: 'L21', title: 'Health & Body',             level: 'A2', pre: null, post: null },
  { num: 22, code: 'L22', title: 'Past Experiences',          level: 'A2', pre: null, post: null },
  { num: 23, code: 'L23', title: 'Future Plans',              level: 'A2', pre: null, post: null },
  { num: 24, code: 'L24', title: 'Final Test A2',             level: 'A2', pre: null, post: null },
];

const SKILL_COLORS = {
  listening: { bg: '#e6f1fb', color: '#0C447C', label: 'Listening' },
  reading:   { bg: '#e1f5ee', color: '#085041', label: 'Reading' },
  writing:   { bg: '#eeedfe', color: '#3C3489', label: 'Writing' },
  speaking:  { bg: '#fbeaf0', color: '#72243E', label: 'Speaking' },
};

export default function PracticeHub({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [completedCodes, setCompletedCodes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ewd_completed_codes') || '[]'); }
    catch { return []; }
  });

  const studentLevel = (student?.nivel || 'A1').trim();
  const allowedLevels = LEVEL_ACCESS[studentLevel] || ['A1'];
  const availableLessons = LESSONS.filter(l => allowedLevels.includes(l.level));
  const lockedLessons = LESSONS.filter(l => !allowedLevels.includes(l.level));

  // Find current lesson (first with activities not fully done)
  const currentLesson = availableLessons.find(l => {
    if (!l.pre && !l.post) return false;
    const preDone = !l.pre || completedCodes.includes(l.pre.code);
    const postDone = !l.post || completedCodes.includes(l.post.code);
    return !preDone || !postDone;
  }) || availableLessons.find(l => l.pre || l.post) || availableLessons[0];

  // Weekly progress
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

  const renderLesson = (lesson, phase) => {
    const act = phase === 'pre' ? lesson.pre : lesson.post;
    const isCurrent = lesson.code === currentLesson?.code;
    const isDone = act && completedCodes.includes(act.code);
    const hasAct = !!act;
    const skillStyle = act ? SKILL_COLORS[act.skill] : null;

    if (!hasAct) {
      return (
        <div key={lesson.code + phase} className="lesson-row upcoming-row">
          <span className="lesson-code-badge upcoming">{lesson.code}</span>
          <div className="lesson-row-info">
            <div className="lesson-row-name">{lesson.title}</div>
            <span className="coming-soon-tag">Coming soon</span>
          </div>
        </div>
      );
    }

    if (isCurrent && !isDone) {
      return (
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
              <button className={`start-big-btn ${phase}`} onClick={() => handleStart(act, lesson.title)}>
                ▶ Start Activity
              </button>
              <span className="xp-tag">+20 XP</span>
            </div>
          </div>
        </div>
      );
    }

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

  const lockedLevels = [...new Set(lockedLessons.map(l => l.level))];

  return (
    <div className="hub-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="hub-content">

        {/* Header */}
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
            <div className="hub-progress-status">
              {totalDone} of {totalActs} activities completed
            </div>
            <div className="hub-progress-bar"><div className="hub-progress-fill" style={{ width: pct + '%' }} /></div>
          </div>
          <div className="hub-progress-nums">{totalDone}<span>/{totalActs}</span></div>
        </div>

        {/* Two-column layout */}
        <div className="hub-two-cols">

          {/* PRÉ-AULA column */}
          <div className="hub-col">
            <div className="hub-col-header pre">
              <span className="hub-col-icon">📚</span>
              <span className="hub-col-label pre">Pré-aula</span>
              <span className="hub-col-badge pre">Before class</span>
            </div>
            <p className="hub-col-desc">Complete before each class with Denise</p>

            {availableLessons.map(l => renderLesson(l, 'pre'))}

            {lockedLevels.map(lvl => (
              <div key={lvl} className="hub-locked-row">
                <span className="hub-locked-icon">🔒</span>
                <span className="hub-locked-badge">{lvl}</span>
                <span className="hub-locked-txt">Unlocks when you reach {lvl}</span>
              </div>
            ))}
          </div>

          {/* PÓS-AULA column */}
          <div className="hub-col">
            <div className="hub-col-header pos">
              <span className="hub-col-icon">✅</span>
              <span className="hub-col-label pos">Pós-aula</span>
              <span className="hub-col-badge pos">After class</span>
            </div>
            <p className="hub-col-desc">Complete right after your class</p>

            {availableLessons.map(l => renderLesson(l, 'post'))}

            {lockedLevels.map(lvl => (
              <div key={lvl} className="hub-locked-row">
                <span className="hub-locked-icon">🔒</span>
                <span className="hub-locked-badge">{lvl}</span>
                <span className="hub-locked-txt">Unlocks when you reach {lvl}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

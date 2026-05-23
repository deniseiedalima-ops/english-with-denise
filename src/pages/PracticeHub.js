import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PracticeHub.css';

// ─── LESSON CATALOG ─────────────────────────────────────────────────────────
// Format: lessonNumber (L3 = aula 3), code prefix, activities per skill
const LESSONS = [
  {
    num: 3,
    code: 'L3',
    title: 'The Greetings',
    level: 'A1',
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
  // Add more lessons here as you go!
];

const SKILLS = [
  { key: 'reading',   label: 'Reading',   icon: '📖', color: '#1d9e75', bg: '#e1f5ee' },
  { key: 'listening', label: 'Listening', icon: '🎧', color: '#378add', bg: '#e6f1fb' },
  { key: 'writing',   label: 'Writing',   icon: '✏️', color: '#7f77dd', bg: '#eeedfe' },
  { key: 'speaking',  label: 'Speaking',  icon: '🎙️', color: '#d4537e', bg: '#fbeaf0' },
];

const TYPE_ICONS = {
  'Multiple Choice': '🔘',
  'Video + Questions': '🎬',
  'Open Writing': '📝',
  'AI Speaking': '🤖',
};

export default function PracticeHub({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState('L3');

  const handleStartActivity = (skill, activityIndex) => {
    navigate(`/practice/${skill}?activity=${activityIndex}`);
  };

  const stars = Array.from({ length: 6 }, (_, i) => ({
    top: `${[6,88,35,72,15,92][i]}%`,
    left: `${[4,91,97,2,50,87][i]}%`,
    size: [3,2,3.5,2,1.5,3][i],
    op: [0.35,0.25,0.4,0.3,0.15,0.3][i],
    d: ['3.5s','4s','5s','3s','5s','3s'][i],
    delay: ['0s','1s','0.5s','2s','3s','2.5s'][i],
  }));

  return (
    <div className="hub-page">
      {stars.map((s, i) => (
        <div key={i} className="star" style={{
          top: s.top, left: s.left, width: s.size, height: s.size,
          '--op': s.op, '--d': s.d, '--delay': s.delay,
        }} />
      ))}

      <Navbar user={user} student={student} onLogout={onLogout} />

      <main className="hub-content">

        {/* Header */}
        <div className="hub-header">
          <div>
            <h1 className="hub-title">Practice Hub</h1>
            <p className="hub-sub">Choose a skill and dive into your lesson activities ✦</p>
          </div>
        </div>

        {/* Skill selector */}
        {!selectedSkill ? (
          <>
            <div className="hub-skills-grid">
              {SKILLS.map(s => (
                <div key={s.key} className="hub-skill-card" onClick={() => setSelectedSkill(s.key)}
                  style={{ '--skill-color': s.color, '--skill-bg': s.bg }}>
                  <div className="hub-skill-icon">{s.icon}</div>
                  <div className="hub-skill-label">{s.label}</div>
                  <div className="hub-skill-count">
                    {LESSONS.reduce((acc, l) => acc + (l.activities[s.key]?.length || 0), 0)} activities
                  </div>
                  <div className="hub-skill-arrow">→</div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="hub-stats-row">
              <div className="hub-stat">
                <div className="hub-stat-num">{LESSONS.length}</div>
                <div className="hub-stat-label">lessons available</div>
              </div>
              <div className="hub-stat">
                <div className="hub-stat-num">{LESSONS.reduce((acc, l) => acc + Object.values(l.activities).flat().length, 0)}</div>
                <div className="hub-stat-label">total activities</div>
              </div>
              <div className="hub-stat">
                <div className="hub-stat-num">4</div>
                <div className="hub-stat-label">skills covered</div>
              </div>
              <div className="hub-stat">
                <div className="hub-stat-num">AI</div>
                <div className="hub-stat-label">powered feedback</div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back + skill header */}
            <div className="hub-skill-header">
              <button className="hub-back-btn" onClick={() => setSelectedSkill(null)}>
                ← Back
              </button>
              <div className="hub-skill-title-row">
                {SKILLS.find(s => s.key === selectedSkill)?.icon}
                <h2 className="hub-skill-title">{SKILLS.find(s => s.key === selectedSkill)?.label}</h2>
              </div>
            </div>

            {/* Lessons list */}
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
                      <div className={`hub-chevron ${isOpen ? 'open' : ''}`}>▾</div>
                    </div>

                    {isOpen && (
                      <div className="hub-activities-list">
                        {acts.map((act, i) => (
                          <div key={act.code} className="hub-activity-row"
                            onClick={() => handleStartActivity(selectedSkill, act.activityIndex)}>
                            <div className="hub-activity-left">
                              <div className="hub-activity-num">{i + 1}</div>
                              <div>
                                <div className="hub-activity-code">{act.code}</div>
                                <div className="hub-activity-title">{act.title}</div>
                              </div>
                            </div>
                            <div className="hub-activity-right">
                              <span className="hub-type-badge">
                                {TYPE_ICONS[act.type]} {act.type}
                              </span>
                              <button className="hub-start-btn">Start →</button>
                            </div>
                          </div>
                        ))}
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

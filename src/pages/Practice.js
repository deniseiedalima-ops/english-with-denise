import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Practice.css';

const SKILLS = {
  reading: {
    label: 'Reading', icon: '📖', color: '#1d9e75',
    activities: [
      {
        id: 'r1', title: 'Daily Routines', level: 'A1→A2',
        type: 'multiple_choice',
        text: `Maria wakes up every day at 7:00 AM. She brushes her teeth and takes a shower. After that, she eats breakfast — usually toast and coffee. She goes to work by bus. She works from 9 AM to 6 PM. In the evening, she watches TV or reads a book. She goes to bed at 10:30 PM.`,
        questions: [
          { q: 'What time does Maria wake up?', options: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM'], answer: 1 },
          { q: 'How does Maria go to work?', options: ['By car', 'By train', 'By bus', 'On foot'], answer: 2 },
          { q: 'What does Maria eat for breakfast?', options: ['Eggs and juice', 'Toast and coffee', 'Cereal and milk', 'Fruit and tea'], answer: 1 },
          { q: 'What does Maria do in the evening?', options: ['Goes to the gym', 'Cooks dinner', 'Watches TV or reads', 'Calls friends'], answer: 2 },
        ]
      }
    ]
  },
  listening: {
    label: 'Listening', icon: '🎧', color: '#378add',
    activities: [
      {
        id: 'l1', title: 'At the Café', level: 'A1→A2',
        type: 'multiple_choice',
        audioText: `Waiter: Good morning! Welcome to Sunny Café. What can I get for you today? \nCustomer: Hi! I'd like a large coffee, please. And do you have any sandwiches? \nWaiter: Yes, we have chicken, tuna, and cheese sandwiches. \nCustomer: I'll have the chicken sandwich, please. How much is that? \nWaiter: The coffee is $3.50 and the sandwich is $6.00. That's $9.50 total. \nCustomer: Here you go. Thank you! \nWaiter: Thank you! Your order will be ready in 5 minutes.`,
        questions: [
          { q: 'What does the customer order to drink?', options: ['Tea', 'Orange juice', 'Large coffee', 'Small coffee'], answer: 2 },
          { q: 'What type of sandwich does the customer order?', options: ['Tuna', 'Cheese', 'Vegetable', 'Chicken'], answer: 3 },
          { q: 'How much does the customer pay in total?', options: ['$6.00', '$3.50', '$9.50', '$10.00'], answer: 2 },
          { q: 'How long will the order take?', options: ['2 minutes', '5 minutes', '10 minutes', '15 minutes'], answer: 1 },
        ]
      }
    ]
  },
  writing: {
    label: 'Writing', icon: '✏️', color: '#7f77dd',
    activities: [
      {
        id: 'w1', title: 'Introduce Yourself', level: 'A1→A2',
        type: 'writing',
        prompt: 'Write a short paragraph introducing yourself. Include: your name, where you are from, your age, your job or what you study, and one hobby you have.',
        minWords: 40,
        tips: ['Use "My name is..." to start', 'Use "I am from..." for your country', 'Use "I work as..." or "I study..."', 'Use "In my free time, I like to..."'],
        feedback: {
          excellent: "Excellent! Your introduction is clear, complete, and uses great vocabulary. Well done! 🌟",
          good: "Good job! Your introduction covers the main points. Try to add more details next time!",
          needsWork: "Nice start! Make sure to include all the required information and write at least 40 words."
        }
      }
    ]
  },
  speaking: {
    label: 'Speaking', icon: '🎙️', color: '#d4537e',
    activities: [
      {
        id: 's1', title: 'Talk About Your Day', level: 'A1→A2',
        type: 'speaking',
        prompt: 'Record yourself talking about your typical day. Include what time you wake up, what you eat, how you go to work or school, and what you do in the evening.',
        tips: ['Speak clearly and at a natural pace', 'Use time expressions: first, then, after that, finally', 'Try to speak for at least 30 seconds', 'Don\'t worry about being perfect — practice makes perfect!'],
        phrases: ['I usually wake up at...', 'For breakfast, I have...', 'I go to work/school by...', 'In the evening, I...']
      }
    ]
  }
};

export default function Practice({ user, student, onLogout }) {
  const { skill } = useParams();
  const navigate = useNavigate();
  const skillData = SKILLS[skill] || SKILLS.reading;
  const activity = skillData.activities[0];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [score, setScore] = useState(0);
  const [showAudio, setShowAudio] = useState(false);

  const handleAnswer = (qi, ai) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qi]: ai }));
  };

  const handleSubmit = () => {
    if (activity.type === 'multiple_choice') {
      const correct = activity.questions.filter((q, i) => answers[i] === q.answer).length;
      const pct = Math.round((correct / activity.questions.length) * 100);
      setScore(pct);

      // Save XP
      const xpGain = pct >= 80 ? 20 : pct >= 50 ? 10 : 5;
      const currentXp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', currentXp + xpGain);

      // Save activity
      const activities = JSON.parse(localStorage.getItem('ewd_activities') || '[]');
      activities.push({ skill, title: activity.title, score: pct, time: 'Just now' });
      localStorage.setItem('ewd_activities', JSON.stringify(activities));
    } else if (activity.type === 'writing') {
      const words = writingText.trim().split(/\s+/).filter(Boolean).length;
      const pct = words >= activity.minWords ? (words >= activity.minWords * 1.5 ? 100 : 75) : 40;
      setScore(pct);
      const xpGain = pct >= 80 ? 20 : pct >= 50 ? 10 : 5;
      const currentXp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', currentXp + xpGain);
    }
    setSubmitted(true);
  };

  const wordCount = writingText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="practice-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="practice-content">
        {/* Skill tabs */}
        <div className="skill-tabs">
          {Object.entries(SKILLS).map(([key, s]) => (
            <div key={key} className={`skill-tab ${skill === key ? 'active' : ''}`}
              onClick={() => { navigate(`/practice/${key}`); setSubmitted(false); setAnswers({}); setWritingText(''); }}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>

        <div className="practice-card fade-up fade-up-1">
          {/* Header */}
          <div className="practice-header">
            <div>
              <div className="practice-skill-label" style={{ color: skillData.color }}>{skillData.icon} {skillData.label}</div>
              <h2 className="practice-title">{activity.title}</h2>
              <span className="practice-level">{activity.level}</span>
            </div>
            {!submitted && (
              <div className="practice-xp-preview">+20 XP</div>
            )}
          </div>

          {/* Reading activity */}
          {activity.type === 'multiple_choice' && skill === 'reading' && (
            <div className="reading-section">
              <div className="reading-text">{activity.text}</div>
              <div className="questions-section">
                {activity.questions.map((q, qi) => (
                  <div key={qi} className="question-block">
                    <div className="question-text">{qi + 1}. {q.q}</div>
                    <div className="options-grid">
                      {q.options.map((opt, ai) => {
                        let cls = 'option';
                        if (submitted) {
                          if (ai === q.answer) cls += ' correct';
                          else if (answers[qi] === ai && ai !== q.answer) cls += ' wrong';
                        } else if (answers[qi] === ai) cls += ' selected';
                        return (
                          <div key={ai} className={cls} onClick={() => handleAnswer(qi, ai)}>
                            <span className="option-letter">{['A','B','C','D'][ai]}</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Listening activity */}
          {activity.type === 'multiple_choice' && skill === 'listening' && (
            <div className="listening-section">
              <div className="audio-prompt">
                <div className="audio-icon">🎧</div>
                <div>
                  <div className="audio-label">Listen to the conversation</div>
                  <div className="audio-sub">Read the transcript below, then answer the questions</div>
                </div>
                <button className="show-transcript-btn" onClick={() => setShowAudio(!showAudio)}>
                  {showAudio ? 'Hide' : 'Show'} transcript
                </button>
              </div>
              {showAudio && (
                <div className="transcript-box">
                  {activity.audioText.split('\n').map((line, i) => (
                    <p key={i} className="transcript-line">{line}</p>
                  ))}
                </div>
              )}
              <div className="questions-section">
                {activity.questions.map((q, qi) => (
                  <div key={qi} className="question-block">
                    <div className="question-text">{qi + 1}. {q.q}</div>
                    <div className="options-grid">
                      {q.options.map((opt, ai) => {
                        let cls = 'option';
                        if (submitted) {
                          if (ai === q.answer) cls += ' correct';
                          else if (answers[qi] === ai && ai !== q.answer) cls += ' wrong';
                        } else if (answers[qi] === ai) cls += ' selected';
                        return (
                          <div key={ai} className={cls} onClick={() => handleAnswer(qi, ai)}>
                            <span className="option-letter">{['A','B','C','D'][ai]}</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Writing activity */}
          {activity.type === 'writing' && (
            <div className="writing-section">
              <div className="writing-prompt-box">
                <div className="writing-prompt-label">📝 Your task</div>
                <div className="writing-prompt-text">{activity.prompt}</div>
              </div>
              <div className="writing-tips">
                {activity.tips.map((tip, i) => (
                  <div key={i} className="writing-tip">💡 {tip}</div>
                ))}
              </div>
              <textarea
                className="writing-textarea"
                placeholder="Start writing here..."
                value={writingText}
                onChange={e => setWritingText(e.target.value)}
                disabled={submitted}
                rows={8}
              />
              <div className="word-count" style={{ color: wordCount >= activity.minWords ? '#1d9e75' : '#aaa' }}>
                {wordCount} / {activity.minWords} words minimum {wordCount >= activity.minWords ? '✓' : ''}
              </div>
            </div>
          )}

          {/* Speaking activity */}
          {activity.type === 'speaking' && (
            <div className="speaking-section">
              <div className="speaking-prompt-box">
                <div className="speaking-prompt-label">🎙️ Your task</div>
                <div className="speaking-prompt-text">{activity.prompt}</div>
              </div>
              <div className="speaking-phrases">
                <div className="phrases-label">Useful phrases:</div>
                {activity.phrases.map((p, i) => (
                  <div key={i} className="phrase-item">"{p}"</div>
                ))}
              </div>
              <div className="speaking-tips">
                {activity.tips.map((tip, i) => (
                  <div key={i} className="writing-tip">💡 {tip}</div>
                ))}
              </div>
              <div className="speaking-record-area">
                <div className="record-note">🎤 Practice speaking out loud, then mark as complete when you're done!</div>
              </div>
            </div>
          )}

          {/* Submit / Feedback */}
          {!submitted ? (
            <button className="submit-btn" onClick={handleSubmit}
              disabled={activity.type === 'multiple_choice' && Object.keys(answers).length < activity.questions?.length}>
              Submit answers ✓
            </button>
          ) : (
            <div className="feedback-section">
              {activity.type === 'multiple_choice' && (
                <>
                  <div className={`score-display ${score >= 80 ? 'great' : score >= 50 ? 'ok' : 'low'}`}>
                    <div className="score-num">{score}%</div>
                    <div className="score-label">{score >= 80 ? '🌟 Excellent!' : score >= 50 ? '👍 Good job!' : '💪 Keep practicing!'}</div>
                    <div className="score-detail">
                      {activity.questions.filter((q, i) => answers[i] === q.answer).length} / {activity.questions.length} correct
                    </div>
                  </div>
                  <div className="xp-earned">+{score >= 80 ? 20 : score >= 50 ? 10 : 5} XP earned! 🎉</div>
                </>
              )}
              {activity.type === 'writing' && (
                <div className={`score-display ${score >= 80 ? 'great' : score >= 50 ? 'ok' : 'low'}`}>
                  <div className="score-label">
                    {score >= 80 ? activity.feedback.excellent : score >= 50 ? activity.feedback.good : activity.feedback.needsWork}
                  </div>
                  <div className="xp-earned" style={{ marginTop: 12 }}>+{score >= 80 ? 20 : score >= 50 ? 10 : 5} XP earned! 🎉</div>
                </div>
              )}
              {activity.type === 'speaking' && (
                <div className="score-display great">
                  <div className="score-label">🌟 Great practice! Speaking regularly is the key to fluency. Keep it up!</div>
                  <div className="xp-earned" style={{ marginTop: 12 }}>+15 XP earned! 🎉</div>
                </div>
              )}
              <button className="try-again-btn" onClick={() => { setSubmitted(false); setAnswers({}); setWritingText(''); }}>
                Try another activity →
              </button>
              <button className="back-btn" onClick={() => navigate('/')}>← Back to dashboard</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

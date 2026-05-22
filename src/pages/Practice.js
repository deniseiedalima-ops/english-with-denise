import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Practice.css';

const SKILLS = {
  reading: {
    label: 'Reading', icon: '📖', color: '#1d9e75',
    activities: [
      {
        id: 'r1', title: 'The Greetings — Mark & Julia', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE GREETINGS',
        text: `Mark: Good afternoon!\nJulia: Good afternoon!\nMark: Hi, what's your name?\nJulia: I'm Julia. And you?\nMark: I'm Mark. Nice to meet you!\nJulia: Nice to meet you too! How do you spell your name?\nMark: It's M-A-R-K. How do you spell yours?\nJulia: J-U-L-I-A.\nMark: Great! How are you?\nJulia: I'm good, thanks. How about you?\nMark: Fine, thanks!\nJulia: Alright, then! But I have to go now!\nMark: Okay, no problem. Have a good day!\nJulia: Thanks, you too! See you later!\nMark: Take care! Bye bye!`,
        questions: [
          { q: 'What time of day does the conversation happen?', options: ['Morning', 'Afternoon', 'Evening', 'Night'], answer: 1 },
          { q: 'How does Julia spell her name?', options: ['J-U-L-I-E', 'J-O-O-L-I-A', 'J-U-L-I-A', 'G-U-L-I-A'], answer: 2 },
          { q: 'How is Julia feeling?', options: ['Tired', 'Bad', 'Good', 'Nervous'], answer: 2 },
          { q: 'What does Mark say when Julia leaves?', options: ['Goodbye forever!', 'See you tomorrow!', 'Have a good day! Take care!', 'Come back soon!'], answer: 2 },
        ]
      },
      {
        id: 'r2', title: 'The Greetings — Vocabulary Match', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE GREETINGS',
        text: `Study these greetings from your class:\n\n🌅 MORNING: "Good morning!" / "Morning!"\n☀️ AFTERNOON: "Good afternoon!" / "Afternoon, people!"\n🌙 EVENING/ARRIVAL: "Good evening!"\n🌛 LEAVING AT NIGHT: "Good night!"\n\nHow to ask how someone is:\n"How are you?" → "I'm good, thanks!"\n"What's up?" → "Not much! And you?"\n"How's it going?" → "Pretty good! And you?"\n"You good?" → "Yeah, all good!"\n\nSaying goodbye:\n"See you later!" / "Take care!" / "Have a good day!"`,
        questions: [
          { q: 'You arrive at a party at 8 PM. What do you say?', options: ['Good morning!', 'Good night!', 'Good evening!', 'Goodbye!'], answer: 2 },
          { q: 'Someone asks "What\'s up?" — what is the best answer?', options: ['I\'m Julia.', 'Not much! And you?', 'Good afternoon!', 'Take care!'], answer: 1 },
          { q: 'You are leaving work late at night. What do you say?', options: ['Good morning!', 'Good evening!', 'Good night!', 'See you!'], answer: 2 },
          { q: 'Which greeting is INFORMAL?', options: ['Good afternoon.', 'How do you do?', 'Morning!', 'Good evening, sir.'], answer: 2 },
        ]
      },
      {
        id: 'r3', title: 'The Greetings — Verb To Be', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE GREETINGS',
        text: `From your class material, review the verb TO BE:\n\nI am → eu sou / eu estou\nYou are → você é / você está\nHe is → ele é / ele está\nShe is → ela é / ela está\nIt is → a coisa é / está\nThey are → eles/elas são/estão\n\nExamples in greetings:\n"I'm Julia." (I am Julia)\n"I'm good, thanks!" (I am good)\n"I'm from New York." (I am from New York)\n"She is the assistant editor." (She is = ela é)`,
        questions: [
          { q: 'Complete: "___ Mark. Nice to meet you!"', options: ['He am', 'I\'m', 'She is', 'They are'], answer: 1 },
          { q: 'Complete: "How ___ you?"', options: ['am', 'is', 'are', 'be'], answer: 2 },
          { q: '"I\'m good" is a short form of...', options: ['I were good', 'I is good', 'I am good', 'I be good'], answer: 2 },
          { q: 'Which sentence is CORRECT?', options: ['She am happy.', 'They is fine.', 'He are Mark.', 'I am Julia.'], answer: 3 },
        ]
      },
    ]
  },
  listening: {
    label: 'Listening', icon: '🎧', color: '#378add',
    activities: [
      {
        id: 'l1', title: 'Jenny at the Hotel', level: 'A1',
        type: 'listening_video',
        lesson: 'THE GREETINGS',
        youtubeId: 'EflkHGJbxnA',
        startTime: 56,
        endTime: 286,
        instruction: 'Watch the video from 0:56 to 4:46. Pay attention to how Jenny greets the receptionist, spells her name, and checks in. Then answer the questions below!',
        questions: [
          { q: 'What is Jenny\'s last name?', options: ['Zelinski', 'Zielinski', 'Zielinsky', 'Zielinksi'], answer: 1 },
          { q: 'How many nights is Jenny staying?', options: ['3 nights', '4 nights', '5 nights', '6 nights'], answer: 2 },
          { q: 'What room does Jenny get?', options: ['Room 306', 'Room 360', 'Room 603', 'Room 316'], answer: 0 },
          { q: 'What does "lift" mean?', options: ['Stairs', 'Reception', 'Elevator', 'Exit'], answer: 2 },
        ]
      },
      {
        id: 'l2', title: 'Meet Sarah!', level: 'A1',
        type: 'listening_video',
        lesson: 'THE GREETINGS',
        youtubeId: 'fLYzVdpseSA',
        startTime: 0,
        endTime: 60,
        instruction: 'Listen to Sarah introducing herself. Pay attention to how she spells her name, where she is from, her age, and how she is feeling. Then answer the questions below!',
        audioText: `Sarah: Hi! Good morning! My name is Sarah, and it's spelled S-A-R-A-H. Nice to meet you!\nSarah: I'm from New York, but now I live in a different city for work and study. I'm 22 years old, and I really enjoy music, coffee, and meeting new people.\nSarah: Today I'm feeling great, just a little tired because I woke up early this morning.\nSarah: People usually say my name is easy to remember, but I still like spelling it when I meet someone new. What about you? What's your name, and how do you spell it?`,
        questions: [
          { q: 'How does Sarah spell her name?', options: ['S-E-R-A-H', 'S-A-R-A-H', 'S-A-R-R-A-H', 'S-A-R-A'], answer: 1 },
          { q: 'Where is Sarah originally from?', options: ['Los Angeles', 'London', 'New York', 'Chicago'], answer: 2 },
          { q: 'How old is Sarah?', options: ['20 years old', '21 years old', '23 years old', '22 years old'], answer: 3 },
          { q: 'How is Sarah feeling today?', options: ['Sick and tired', 'Great, a little tired', 'Nervous and excited', 'Bored and sleepy'], answer: 1 },
        ]
      },
      {
        id: 'l3', title: 'Formal vs Informal — Spot the Difference', level: 'A1',
        type: 'multiple_choice',
        lesson: 'THE GREETINGS',
        youtubeLink: null,
        audioText: `Listen to these two conversations:\n\n🎩 CONVERSATION 1 — FORMAL (Job Interview):\nMr. Brown: Good morning. How do you do?\nMs. Lee: Good morning, Mr. Brown. I'm very well, thank you. And you?\nMr. Brown: Fine, thank you. Please, have a seat.\nMs. Lee: Thank you very much.\nMr. Brown: It's a pleasure to meet you, Ms. Lee.\nMs. Lee: The pleasure is mine.\n\n👋 CONVERSATION 2 — INFORMAL (Friends at school):\nAlex: Hey! What's up?\nBia: Not much! You good?\nAlex: Yeah, all good! How's everything?\nBia: Pretty good! Oh, I gotta go — see ya!\nAlex: Later! Take care!`,
        questions: [
          { q: 'In the formal conversation, how does Mr. Brown greet Ms. Lee?', options: ['Hey! What\'s up?', 'Good morning. How do you do?', 'You good?', 'How\'s everything?'], answer: 1 },
          { q: 'Which phrase is INFORMAL?', options: ['How do you do?', 'It\'s a pleasure to meet you.', 'What\'s up?', 'Good morning.'], answer: 2 },
          { q: 'In the informal conversation, how does Bia say goodbye?', options: ['Goodbye, have a nice day.', 'See ya! Take care!', 'It was a pleasure.', 'Good night.'], answer: 1 },
          { q: '"I gotta go" means...', options: ['I want to stay', 'I have to go', 'I am going to eat', 'I got the ball'], answer: 1 },
        ]
      },
    ]
  },
  writing: {
    label: 'Writing', icon: '✏️', color: '#7f77dd',
    activities: [
      {
        id: 'w1', title: 'Write Your Own Greeting Dialogue', level: 'A1',
        type: 'writing',
        lesson: 'THE GREETINGS',
        prompt: 'Write a short dialogue (conversation) between two people meeting for the first time. Include: a greeting, asking and saying names, spelling at least one name, asking how they are, and saying goodbye. Use vocabulary from The Greetings class!',
        minWords: 40,
        tips: [
          'Start with a greeting: "Good morning!" / "Hi!" / "Hey!"',
          'Ask the name: "What\'s your name?" → "I\'m ___."',
          'Spell a name: "How do you spell that?" → "It\'s M-A-R-K."',
          'Ask how they are: "How are you?" → "I\'m good, thanks!"',
          'Say goodbye: "See you later!" / "Take care!" / "Have a good day!"'
        ],
        feedback: {
          excellent: "Excellent dialogue! You used greetings, introductions and farewells perfectly. Your English is growing! 🌟",
          good: "Good job! Your dialogue flows naturally. Try to add more expressions from class next time!",
          needsWork: "Nice start! Make sure to include a greeting, name exchange, and goodbye. Check your class material for ideas!"
        }
      },
      {
        id: 'w2', title: 'How Are You? — Write Your Answers', level: 'A1',
        type: 'writing',
        lesson: 'THE GREETINGS',
        prompt: 'Someone asks you these 3 questions. Write a natural answer for each one using expressions from your class:\n1. "How are you today?"\n2. "What\'s up?"\n3. "How\'s everything?"\n\nThen write 2 more sentences about your day using "I am" or "I\'m".',
        minWords: 35,
        tips: [
          'Use different answers — don\'t repeat the same one!',
          'For "How are you?" try: "I\'m good, thanks! And you?"',
          'For "What\'s up?" try: "Not much! Pretty good day!"',
          'Add details: "I\'m a little tired but happy!"',
          'Remember: I am = I\'m (contraction)'
        ],
        feedback: {
          excellent: "Wonderful! You used a great variety of expressions and the verb TO BE correctly. Keep it up! 🌟",
          good: "Good work! You answered naturally. Try to vary your expressions even more next time!",
          needsWork: "Good try! Remember to answer each of the 3 questions and use I'm/I am in your sentences."
        }
      },
      {
        id: 'w3', title: 'Formal or Informal? — Rewrite It!', level: 'A1',
        type: 'writing',
        lesson: 'THE GREETINGS',
        prompt: 'Rewrite these sentences. Make them the OPPOSITE style:\n\n1. INFORMAL → make it FORMAL:\n"Hey! What\'s up? You good?"\n\n2. FORMAL → make it INFORMAL:\n"Good morning. How do you do? It is a pleasure to meet you."\n\n3. Write 3 sentences to say goodbye — 1 formal, 1 informal, 1 your choice!',
        minWords: 30,
        tips: [
          'FORMAL: "Good morning", "How do you do?", "It\'s a pleasure"',
          'INFORMAL: "Hey!", "What\'s up?", "You good?", "Later!", "See ya!"',
          'Formal goodbye: "Have a good day. Goodbye."',
          'Informal goodbye: "Later! Take care! See ya!"',
          'Think about WHERE you use each — office vs. friends'
        ],
        feedback: {
          excellent: "Excellent! You perfectly understand the difference between formal and informal English. This is so important! 🌟",
          good: "Good job! You're getting the hang of formal vs informal. Practice more to make it feel natural!",
          needsWork: "Good try! Remember: formal = complete sentences and polite words. Informal = short, casual, relaxed!"
        }
      },
    ]
  },
  speaking: {
    label: 'Speaking', icon: '🎙️', color: '#d4537e',
    activities: [
      {
        id: 's1', title: 'Introduce Yourself!', level: 'A1',
        type: 'speaking',
        lesson: 'THE GREETINGS',
        prompt: 'Imagine you are meeting someone new. Record yourself doing a complete greeting: say hello, give your name, spell it, say where you are from, ask how they are, and say goodbye. Speak naturally — like in the Mark & Julia dialogue from class!',
        tips: [
          'Start with a greeting: "Good morning!" or "Hi!"',
          'Say your name: "My name is ___ / I\'m ___"',
          'Spell it: "It\'s spelled ___"',
          'Ask: "How are you?" and answer back',
          'End with: "Nice to meet you! Have a good day!"'
        ],
        phrases: ['Good morning! My name is...', 'It\'s spelled...', 'Nice to meet you!', 'How are you?', 'I\'m good, thanks! And you?', 'Have a good day! Take care!']
      },
      {
        id: 's2', title: 'How Are You? — 5 Different Ways!', level: 'A1',
        type: 'speaking',
        lesson: 'THE GREETINGS',
        prompt: 'Record yourself saying 5 different ways to ask "how are you?" and 5 different ways to answer. Use the vocabulary from your class! Try to sound natural — not like you\'re reading a list. Imagine you\'re texting a friend, then talking to your boss!',
        tips: [
          'Formal ways: "How are you today?" / "How have you been?"',
          'Informal ways: "What\'s up?" / "You good?" / "All good?"',
          'Formal answers: "I\'m well, thank you. And you?"',
          'Informal answers: "Not bad!" / "Pretty good!" / "All good!"',
          'Try to sound natural — smile while you speak!'
        ],
        phrases: ['How are you today?', 'What\'s up?', 'How\'s everything?', 'I\'m good, thanks!', 'Pretty good! And you?', 'Not much! You?', 'All good!', 'Doing well, thanks!']
      },
      {
        id: 's3', title: 'Role Play — Checking In at a Hotel', level: 'A1',
        type: 'speaking',
        lesson: 'THE GREETINGS',
        prompt: 'You are Jenny from the listening exercise. You are checking into a hotel. Record yourself playing Jenny\'s part in the conversation: greet the receptionist, say your name, spell it, confirm your reservation, and thank them. Use "here you are", "that\'s right", and "thank you"!',
        tips: [
          'Start with: "Hello! Good evening."',
          'Say: "I have a reservation. My name is ___."',
          'Spell your name letter by letter',
          'Confirm details: "Yes, that\'s right."',
          'Be polite: "Here you are." / "Thank you very much!"'
        ],
        phrases: ['Hello! Good evening.', 'I have a reservation.', 'My name is... it\'s spelled...', 'Yes, that\'s right.', 'Here you are.', 'Thank you very much!', 'Have a good evening!']
      },
    ]
  }
};

export default function Practice({ user, student, onLogout }) {
  const { skill } = useParams();
  const navigate = useNavigate();
  const skillData = SKILLS[skill] || SKILLS.reading;
  const [activityIndex, setActivityIndex] = useState(0);
  const activity = skillData.activities[activityIndex];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [score, setScore] = useState(0);
  const [showAudio, setShowAudio] = useState(false);

  // Speaking / recording state
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [speakingFeedback, setSpeakingFeedback] = useState(null);
  const [speakingLoading, setSpeakingLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      alert('Could not access microphone. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const transcribeAudio = async (blob) => {
    setSpeakingLoading(true);
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/webm' },
        body: blob,
      });
      const data = await res.json();
      const text = data.text || '';
      setTranscript(text);
      await getFeedback(text);
    } catch (err) {
      setTranscript('Could not transcribe. Please try again.');
      setSpeakingLoading(false);
    }
  };

  const getFeedback = async (text) => {
    try {
      const res = await fetch('/api/speaking-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          prompt: activity.prompt,
          level: student?.nivel || 'A1',
          keywords: activity.phrases,
        }),
      });
      const feedback = await res.json();
      setSpeakingFeedback(feedback);
      const xpGain = (feedback.score || 5) >= 8 ? 25 : (feedback.score || 5) >= 6 ? 15 : 8;
      const currentXp = parseInt(localStorage.getItem('ewd_xp') || '0');
      localStorage.setItem('ewd_xp', currentXp + xpGain);
      const activities = JSON.parse(localStorage.getItem('ewd_activities') || '[]');
      activities.push({ skill: 'speaking', title: activity.title, score: (feedback.score || 5) * 10, time: 'Just now' });
      localStorage.setItem('ewd_activities', JSON.stringify(activities));
    } catch {
      setSpeakingFeedback({ score: 7, positive: "Good effort!", tip: "Keep practicing!", overall: "Well done! 🌟" });
    }
    setSpeakingLoading(false);
    setSubmitted(true);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const handleAnswer = (qi, ai) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qi]: ai }));
  };

  const handleSubmit = () => {
    if (activity.type === 'multiple_choice' || activity.type === 'listening_video') {
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

  // Helper: renders dialogue text with bold character names
  const renderDialogue = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0 && colonIdx < 25 && !line.startsWith('http')) {
        const name = line.substring(0, colonIdx).trim();
        const speech = line.substring(colonIdx + 1).trim();
        return (
          <div key={i} className="dialogue-line">
            <span className="dialogue-name">{name}:</span>
            <span className="dialogue-speech"> {speech}</span>
          </div>
        );
      }
      return line ? <div key={i} className="dialogue-narration">{line}</div> : <div key={i} style={{height: 8}} />;
    });
  };

  return (
    <div className="practice-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="practice-content">
        {/* Skill tabs */}
        <div className="skill-tabs">
          {Object.entries(SKILLS).map(([key, s]) => (
            <div key={key} className={`skill-tab ${skill === key ? 'active' : ''}`}
              onClick={() => { navigate(`/practice/${key}`); setSubmitted(false); setAnswers({}); setWritingText(''); setTranscript(''); setSpeakingFeedback(null); setRecordingTime(0); setActivityIndex(0); }}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>

        {/* Activity selector */}
        <div className="activity-selector">
          <div className="activity-lesson-tag">📚 {activity.lesson}</div>
          <div className="activity-tabs">
            {skillData.activities.map((a, i) => (
              <div key={i}
                className={`activity-tab ${activityIndex === i ? 'active' : ''}`}
                onClick={() => { setActivityIndex(i); setSubmitted(false); setAnswers({}); setWritingText(''); setTranscript(''); setSpeakingFeedback(null); setRecordingTime(0); }}>
                Activity {i + 1}
              </div>
            ))}
          </div>
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
              <div className="reading-text">{renderDialogue(activity.text)}</div>
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

          {/* Listening with YouTube video */}
          {activity.type === 'listening_video' && (
            <div className="listening-section">
              <div className="video-instruction">
                <span className="video-instruction-icon">🎬</span>
                <div>
                  <div className="video-instruction-title">Watch & Listen</div>
                  <div className="video-instruction-text">{activity.instruction}</div>
                </div>
              </div>
              <div className="video-timestamp-badge">
                ▶ {Math.floor(activity.startTime/60)}:{String(activity.startTime%60).padStart(2,'0')} → {Math.floor(activity.endTime/60)}:{String(activity.endTime%60).padStart(2,'0')}
              </div>
              <div className="youtube-wrap">
                <iframe
                  className="youtube-iframe"
                  src={`https://www.youtube.com/embed/${activity.youtubeId}?start=${activity.startTime}&end=${activity.endTime}&rel=0&modestbranding=1`}
                  title="Listening activity"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {activity.audioText && (
                <div className="transcript-toggle-wrap">
                  <button className="transcript-toggle-btn" onClick={() => setShowAudio(!showAudio)}>
                    {showAudio ? '🙈 Hide transcript' : '📄 Show transcript'}
                  </button>
                  {showAudio && (
                    <div className="transcript-box" style={{ marginTop: 12 }}>
                      <div className="transcript-header">📝 Transcript</div>
                      {renderDialogue(activity.audioText)}
                    </div>
                  )}
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

          {/* Listening with transcript */}
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
                  {renderDialogue(activity.audioText)}
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

              {/* Recorder */}
              {!submitted && !speakingLoading && (
                <div className="recorder-area">
                  {!recording && !transcript && (
                    <button className="record-btn" onClick={startRecording}>
                      <span className="record-dot" />
                      Start Recording
                    </button>
                  )}
                  {recording && (
                    <div className="recording-active">
                      <div className="recording-pulse" />
                      <span className="recording-time">{formatTime(recordingTime)}</span>
                      <button className="stop-btn" onClick={stopRecording}>⏹ Stop</button>
                    </div>
                  )}
                  <p className="recorder-note">🔒 Your audio is processed securely and not stored.</p>
                </div>
              )}

              {/* Loading */}
              {speakingLoading && (
                <div className="speaking-loading">
                  <div className="spinner" />
                  <span>Analyzing your speaking... ✨</span>
                </div>
              )}

              {/* Transcript */}
              {transcript && !speakingLoading && (
                <div className="transcript-result">
                  <div className="transcript-label">📝 What we heard:</div>
                  <div className="transcript-text">"{transcript}"</div>
                </div>
              )}
            </div>
          )}

          {/* Submit / Feedback */}
          {!submitted ? (
            <button className="submit-btn" onClick={handleSubmit}
              disabled={( activity.type === 'multiple_choice' || activity.type === 'listening_video') && Object.keys(answers).length < activity.questions?.length}>
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
              {activity.type === 'speaking' && speakingFeedback && (
                <div className="speaking-feedback">
                  <div className="speaking-score-row">
                    <div className="speaking-score">{speakingFeedback.score}<span>/10</span></div>
                    <div className="speaking-overall">{speakingFeedback.overall}</div>
                  </div>
                  <div className="speaking-feedback-box positive">
                    <div className="fb-label">✅ What you did well</div>
                    <div className="fb-text">{speakingFeedback.positive}</div>
                  </div>
                  <div className="speaking-feedback-box tip">
                    <div className="fb-label">💡 Tip for next time</div>
                    <div className="fb-text">{speakingFeedback.tip}</div>
                  </div>
                  <div className="xp-earned">+{(speakingFeedback.score || 5) >= 8 ? 25 : (speakingFeedback.score || 5) >= 6 ? 15 : 8} XP earned! 🎉</div>
                </div>
              )}
              <button className="try-again-btn" onClick={() => { setSubmitted(false); setAnswers({}); setWritingText(''); setTranscript(''); setSpeakingFeedback(null); setRecordingTime(0); }}>
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { transcript, prompt, level, keywords, skill } = req.body;

  if (!transcript || transcript.trim().length < 3) {
    return res.json({
      score: 0,
      positive: '🎤 We could not hear you clearly.',
      tip: 'Speak louder and closer to the microphone. Make sure there is no background noise.',
      suggestions: ['Try again in a quieter place', 'Hold the microphone closer', 'Speak more slowly and clearly'],
      overall: 'No speech detected — give it another try! 💪'
    });
  }

  const systemPrompt = `You are Denise, a warm and encouraging English teacher with 10+ years of experience teaching Brazilian students from A1 to B2. 

Your feedback must be:
1. SPECIFIC — point to exact words/sounds the student used
2. ACTIONABLE — give concrete daily practice exercises
3. LEVEL-APPROPRIATE — for ${level || 'A1'} students
4. ENCOURAGING — always celebrate what they did well first

For ${skill === 'speaking' ? 'speaking' : 'writing'} feedback, always include:
- What they did well (specific example from their response)
- 3 specific, actionable suggestions with daily practice routines
- If pronunciation issues detected, suggest specific tongue twisters and word lists
- A score from 0-10

IMPORTANT: Respond ONLY with valid JSON. No markdown. No extra text. Use this exact format:
{
  "score": 7,
  "positive": "Great job using 'Nice to meet you!' naturally — that shows real progress!",
  "errors": [
    "❌ You said 'I have 25 years' → ✅ Say 'I AM 25 years old' (em inglês usamos 'to be' para idade)",
    "❌ 'I am very good in English' → ✅ 'I am very good AT English' (use 'good at', not 'good in')"
  ],
  "tip": "Your main area to improve is...",
  "suggestions": [
    "🗣️ Practice the /r/ sound for 30 seconds daily: try these tongue twisters: 'Red lorry, yellow lorry'",
    "📝 Every day for 5 days, say these 5 words aloud: right, really, ready, ride, ring.",
    "🎬 Watch 2 minutes of an American TV show and repeat 3 sentences out loud immediately after."
  ],
  "overall": "You're making great progress! Keep going! 🌟"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Task given to student: "${prompt}"
Student's response: "${transcript}"
Level: ${level || 'A1'}
Expected vocabulary/keywords: ${keywords?.join(', ') || 'natural English greetings and introductions'}

Analyze their response carefully. Give specific, actionable feedback with daily practice routines. Return ONLY valid JSON.`
          }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';

    let feedback;
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      feedback = JSON.parse(cleaned);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try { feedback = JSON.parse(match[0]); } catch { feedback = null; }
      }
    }

    if (!feedback || !feedback.score) {
      feedback = {
        score: 7,
        positive: 'Good effort on your speaking practice!',
        tip: 'Keep practicing to build more confidence.',
        suggestions: [
          '🗣️ Practice speaking for 5 minutes every day',
          '📝 Record yourself and listen back to find areas to improve',
          '🎬 Watch English videos and repeat phrases out loud (shadowing)'
        ],
        overall: 'Well done! Every practice session makes you better! 🌟'
      };
    }

    return res.json(feedback);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      score: 6,
      positive: 'You completed the speaking exercise!',
      tip: 'Keep practicing regularly.',
      suggestions: ['Practice every day', 'Record yourself', 'Watch English videos'],
      overall: 'Great job showing up to practice! 🌟'
    });
  }
}

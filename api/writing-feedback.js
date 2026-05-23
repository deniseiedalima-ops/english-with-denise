export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { text, prompt, level } = req.body;

  if (!text || text.trim().split(/\s+/).length < 5) {
    return res.json({
      score: 0,
      positive: 'Start writing to get feedback!',
      tip: 'Write at least a few sentences to get a proper evaluation.',
      suggestions: ['Try writing a few sentences first', 'Use vocabulary from your class', 'Don\'t worry about being perfect — just start!'],
      overall: 'Keep going! ✍️'
    });
  }

  const systemPrompt = `You are Denise, a warm English teacher for Brazilian students (level: ${level || 'A1'}). 
  
Analyze the student's writing carefully and give specific, constructive feedback.

RULES:
- Be encouraging but honest
- Point to SPECIFIC words/sentences from their text
- Give 3 concrete practice suggestions with daily routines
- For grammar errors, show the correction
- Score 0-10

Respond ONLY with valid JSON:
{
  "score": 7,
  "positive": "Your use of 'Nice to meet you!' was perfect, and your sentence structure is clear!",
  "tip": "Watch out for verb agreement — 'She are' should be 'She is'",
  "corrections": ["'She are my teacher' → 'She is my teacher'", "'They was' → 'They were'"],
  "suggestions": [
    "📝 Every day, write 3 sentences using 'is/am/are' correctly and check them",
    "🔁 Rewrite this same text tomorrow without looking at your notes — it helps memory!",
    "📖 Read your text aloud — your ear will catch mistakes your eyes miss"
  ],
  "overall": "Great effort! You're building real English skills! 🌟"
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
          { role: 'user', content: `Task: "${prompt}"\n\nStudent wrote:\n"${text}"\n\nGive detailed feedback. Return ONLY valid JSON.` }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';
    let feedback;
    try {
      feedback = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) try { feedback = JSON.parse(match[0]); } catch { feedback = null; }
    }

    if (!feedback) feedback = {
      score: 7, positive: 'Good writing effort!', tip: 'Keep practicing!',
      corrections: [], suggestions: ['Write every day', 'Read your text aloud', 'Review grammar rules'],
      overall: 'Keep it up! 🌟'
    };

    return res.json(feedback);
  } catch (err) {
    return res.status(500).json({ score: 6, positive: 'Good effort!', tip: 'Keep practicing!', corrections: [], suggestions: ['Write every day', 'Read aloud', 'Check grammar'], overall: 'Well done! 🌟' });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { transcript, prompt, level, keywords } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are a friendly English teacher giving feedback to a ${level} level student. 
Be encouraging, specific, and brief. Always give: 
1. What they did well (1-2 sentences)
2. One specific improvement tip
3. A score out of 10
Format: {"score": 8, "positive": "...", "tip": "...", "overall": "Great job! ..."}`
          },
          {
            role: 'user',
            content: `Task: "${prompt}"
Student said: "${transcript}"
Keywords expected: ${keywords?.join(', ') || 'natural English'}
Give feedback in JSON format.`
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    try {
      const feedback = JSON.parse(content.replace(/```json|```/g, '').trim());
      return res.json(feedback);
    } catch {
      return res.json({ score: 7, positive: "Good effort!", tip: "Keep practicing!", overall: "Well done! 🌟" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

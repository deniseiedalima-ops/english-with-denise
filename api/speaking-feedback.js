export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { transcript, prompt, level, keywords } = req.body;

  if (!transcript || transcript.trim().length < 3) {
    return res.json({ score: 5, positive: "We couldn't hear you clearly.", tip: "Try speaking louder and closer to the microphone!", overall: "Give it another try! 🎙️" });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: `You are a friendly English teacher giving feedback to a ${level || 'A1'} level student. Always respond ONLY with a valid JSON object, no markdown, no explanation outside the JSON. Use this exact format:
{"score": 7, "positive": "You used good vocabulary!", "tip": "Try to use more complete sentences.", "overall": "Good effort! Keep practicing! 🌟"}`
          },
          {
            role: 'user',
            content: `Task given to student: "${prompt}"
What the student said: "${transcript}"
Expected keywords: ${keywords?.join(', ') || 'natural English'}

Evaluate and return ONLY the JSON object.`
          }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';
    
    // Try multiple parsing strategies
    let feedback;
    try {
      // Remove markdown if present
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      feedback = JSON.parse(cleaned);
    } catch {
      // Try to extract JSON from text
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try { feedback = JSON.parse(match[0]); } catch { feedback = null; }
      }
    }

    if (!feedback || !feedback.score) {
      feedback = { 
        score: 7, 
        positive: "Good effort on your speaking practice!", 
        tip: "Keep practicing to build more confidence.", 
        overall: "Well done! Every practice session makes you better! 🌟" 
      };
    }

    return res.json(feedback);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      score: 6, 
      positive: "You completed the speaking exercise!", 
      tip: "Keep practicing regularly.", 
      overall: "Great job showing up to practice! 🌟" 
    });
  }
}

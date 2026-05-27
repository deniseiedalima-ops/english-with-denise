const NOTION_API = 'https://api.notion.com/v1';
const REPORTS_DB = 'e637a1b4-c2d4-4152-878e-b05a396f4a17';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TOKEN = process.env.NOTION_TOKEN || process.env.REACT_APP_NOTION_TOKEN || '';
  const { email } = req.query;

  if (!email) return res.json({ reports: [] });

  try {
    const response = await fetch(`${NOTION_API}/databases/${REPORTS_DB}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Email do Aluno', email: { equals: email } },
        sorts: [{ property: 'Data da Prova', direction: 'descending' }],
      }),
    });

    const data = await response.json();

    const reports = (data.results || []).map(page => {
      const p = page.properties;
      return {
        id: page.id,
        aluno: p['Aluno']?.title?.[0]?.plain_text || '',
        nivel: p['Nível Avaliado']?.select?.name || '',
        data: p['Data da Prova']?.date?.start || null,
        resultado: p['Resultado']?.select?.name || '',
        notas: {
          reading:   p['Nota Reading']?.number ?? null,
          writing:   p['Nota Writing']?.number ?? null,
          speaking:  p['Nota Speaking']?.number ?? null,
          listening: p['Nota Listening']?.number ?? null,
          final:     p['Nota Final']?.number ?? null,
        },
        feedbacks: {
          reading:   p['Feedback Reading']?.rich_text?.[0]?.plain_text || '',
          writing:   p['Feedback Writing']?.rich_text?.[0]?.plain_text || '',
          speaking:  p['Feedback Speaking']?.rich_text?.[0]?.plain_text || '',
          listening: p['Feedback Listening']?.rich_text?.[0]?.plain_text || '',
        },
        pontosFortes:   p['Pontos Fortes']?.rich_text?.[0]?.plain_text || '',
        pontosMelhorar: p['Pontos a Melhorar']?.rich_text?.[0]?.plain_text || '',
      };
    });

    return res.json({ reports });
  } catch (err) {
    return res.status(500).json({ reports: [], error: err.message });
  }
}

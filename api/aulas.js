const NOTION_API = 'https://api.notion.com/v1';
const AULAS_DB = 'ba15709d-e9bf-43c8-a124-60c39a087b9b';
const TOKEN = () => process.env.NOTION_TOKEN || process.env.REACT_APP_NOTION_TOKEN || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(`${NOTION_API}/databases/${AULAS_DB}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [{ property: 'Nº', direction: 'ascending' }],
        page_size: 100,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data?.message, aulas: [] });

    const aulas = (data.results || []).map(page => {
      const p = page.properties;
      return {
        id: page.id,
        numero: p['Nº']?.number || 0,
        titulo: p['Título da Aula']?.title?.[0]?.plain_text || '',
        nivel: p['Nível']?.select?.name || '',
        dataAula: p['Data da Aula']?.date?.start || null,
      };
    }).filter(a => a.titulo);

    return res.json({ aulas });
  } catch (err) {
    return res.status(500).json({ error: err.message, aulas: [] });
  }
}

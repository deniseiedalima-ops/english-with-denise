const NOTION_API = 'https://api.notion.com/v1';
const NOTIFICATIONS_DB = '609ab0b0-d234-4691-b51a-ab5425f29169';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Support both env var names
  const TOKEN = process.env.NOTION_TOKEN
    || process.env.REACT_APP_NOTION_TOKEN
    || '';

  if (!TOKEN) {
    console.error('[notifications] No Notion token found');
    return res.json({ notifications: [], error: 'no_token' });
  }

  try {
    const response = await fetch(`${NOTION_API}/databases/${NOTIFICATIONS_DB}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Ativa', checkbox: { equals: true } },
        sorts: [{ property: 'Data', direction: 'descending' }],
        page_size: 10,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[notifications] Notion error:', response.status, err);
      return res.json({ notifications: [] });
    }

    const data = await response.json();
    const notifications = (data.results || []).map(page => {
      const props = page.properties;
      return {
        id: page.id,
        message: props['Mensagem']?.title?.[0]?.plain_text || '',
        tipo: props['Tipo']?.select?.name || '📚 Estudo',
        data: props['Data']?.date?.start || null,
      };
    }).filter(n => n.message); // only show if message is not empty

    return res.json({ notifications });
  } catch (err) {
    console.error('[notifications] Exception:', err.message);
    return res.status(500).json({ notifications: [] });
  }
}

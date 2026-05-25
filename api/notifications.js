const NOTION_API = 'https://api.notion.com/v1';
const TOKEN = process.env.REACT_APP_NOTION_TOKEN;
const NOTIFICATIONS_DB = '609ab0b0-d234-4691-b51a-ab5425f29169';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(`${NOTION_API}/databases/${NOTIFICATIONS_DB}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filter: { property: 'Ativa', checkbox: { equals: true } },
        sorts: [{ property: 'Data', direction: 'descending' }],
      }),
    });

    const data = await response.json();
    const notifications = (data.results || []).map(page => {
      const props = page.properties;
      return {
        id: page.id,
        message: props['Mensagem']?.title?.[0]?.plain_text || '',
        tipo: props['Tipo']?.select?.name || '📚 Estudo',
        data: props['Data']?.date?.start || null,
      };
    });

    return res.json({ notifications });
  } catch (err) {
    console.error('Notifications error:', err);
    return res.status(500).json({ notifications: [] });
  }
}

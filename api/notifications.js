const NOTIFICATIONS_DB = '609ab0b0-d234-4691-b51a-ab5425f29169';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TOKEN = process.env.NOTION_TOKEN
    || process.env.REACT_APP_NOTION_TOKEN
    || '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';

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTIFICATIONS_DB}/query`,
      {
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
      }
    );

    const data = await response.json();

    const notifications = (data.results || [])
      .map(page => ({
        id: page.id,
        message: page.properties['Mensagem']?.title?.[0]?.plain_text || '',
        tipo: page.properties['Tipo']?.select?.name || '📚 Estudo',
      }))
      .filter(n => n.message);

    return res.json({ notifications });
  } catch (err) {
    return res.status(500).json({ notifications: [] });
  }
}

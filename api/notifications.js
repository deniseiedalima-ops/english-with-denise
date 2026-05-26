const NOTION_API = 'https://api.notion.com/v1';
const NOTIFICATIONS_DB = '609ab0b0-d234-4691-b51a-ab5425f29169';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TOKEN = process.env.NOTION_TOKEN
    || process.env.REACT_APP_NOTION_TOKEN
    || '';

  console.log('[notifications] token present:', !!TOKEN, '| length:', TOKEN.length);

  if (!TOKEN) {
    return res.json({ notifications: [], debug: 'no_token' });
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
        filter: {
          property: 'Ativa',
          checkbox: { equals: true }
        },
        sorts: [{ property: 'Data', direction: 'descending' }],
        page_size: 10,
      }),
    });

    const body = await response.text();
    console.log('[notifications] Notion status:', response.status, '| body preview:', body.substring(0, 200));

    if (!response.ok) {
      return res.json({ notifications: [], debug: `notion_error_${response.status}` });
    }

    const data = JSON.parse(body);
    const notifications = (data.results || [])
      .map(page => {
        const props = page.properties;
        const message = props['Mensagem']?.title?.[0]?.plain_text || '';
        return {
          id: page.id,
          message,
          tipo: props['Tipo']?.select?.name || '📚 Estudo',
          data: props['Data']?.date?.start || null,
        };
      })
      .filter(n => n.message.length > 0);

    console.log('[notifications] Found', notifications.length, 'active notifications');
    return res.json({ notifications });

  } catch (err) {
    console.error('[notifications] Exception:', err.message);
    return res.status(500).json({ notifications: [], debug: err.message });
  }
}

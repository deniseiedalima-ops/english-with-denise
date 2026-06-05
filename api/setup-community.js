// One-time setup route: creates the EnglishRats database using the Vercel token
// Call: GET /api/setup-community
const NOTION_API = 'https://api.notion.com/v1';

// Parent page ID — the main English With Denise workspace page
const PARENT_PAGE_ID = '301628bb387c803fb9edd5508cf98b47';

const EMOJIS = ['🔥','❤️','👏','🎉','✨','📚','👑','💛'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TOKEN = process.env.NOTION_TOKEN || process.env.REACT_APP_NOTION_TOKEN || '';
  if (!TOKEN) return res.json({ error: 'No token found' });

  // Test: try to query the existing DB first
  const testRes = await fetch(`${NOTION_API}/databases/dbe7ae1a-6bf8-4610-bc11-ffb585acaf5c/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 1 }),
  });
  const testData = await testRes.json();

  if (testRes.ok) {
    return res.json({ 
      status: 'existing_db_works', 
      db_id: 'dbe7ae1a-6bf8-4610-bc11-ffb585acaf5c',
      message: 'Existing database is accessible! No setup needed.'
    });
  }

  // Existing DB not accessible — create a new one with this token
  console.log('[setup] Existing DB error:', testData.message);

  const emojiProps = {};
  EMOJIS.forEach(e => { emojiProps[`Reações ${e}`] = { number: {} }; });

  const createRes = await fetch(`${NOTION_API}/databases`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
      title: [{ type: 'text', text: { content: '🐀 EnglishRats — Posts' } }],
      properties: {
        'Legenda':   { title: {} },
        'Nome':      { rich_text: {} },
        'Email':     { email: {} },
        'Categoria': { select: { options: [
          { name: '📖 Reading', color: 'blue' },
          { name: '🎧 Listening', color: 'green' },
          { name: '✏️ Writing', color: 'purple' },
          { name: '🎙️ Speaking', color: 'pink' },
        ]}},
        'Foto URL':  { url: {} },
        'Semana':    { number: {} },
        'Mês':       { number: {} },
        'Ano':       { number: {} },
        'Pontos':    { number: {} },
        ...emojiProps,
      },
    }),
  });

  const createData = await createRes.json();
  if (!createRes.ok) {
    return res.status(500).json({ error: 'Failed to create DB', detail: createData });
  }

  return res.json({
    status: 'created_new_db',
    new_db_id: createData.id,
    message: '✅ New database created! Update POSTS_DB in community.js with this ID.',
  });
}

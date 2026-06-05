const NOTION_API = 'https://api.notion.com/v1';
const POSTS_DB = 'dbe7ae1a-6bf8-4610-bc11-ffb585acaf5c';
const TOKEN = () => process.env.NOTION_TOKEN || process.env.REACT_APP_NOTION_TOKEN || '';
const EMOJIS = ['🔥','❤️','👏','🎉','✨','📚','👑','💛'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: feed or podio ──────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { type = 'feed' } = req.query;
    try {
      const response = await fetch(`${NOTION_API}/databases/${POSTS_DB}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ timestamp: 'created_time', direction: 'descending' }],
          page_size: 100,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[community GET]', data);
        return res.status(500).json({ error: data?.message || 'Notion error', posts: [] });
      }

      const posts = (data.results || []).map(page => {
        const p = page.properties;
        const reactions = {};
        EMOJIS.forEach(e => { reactions[e] = p[`Reações ${e}`]?.number || 0; });
        return {
          id: page.id,
          legenda:   p['Legenda']?.title?.[0]?.plain_text || '',
          nome:      p['Nome']?.rich_text?.[0]?.plain_text || '',
          email:     p['Email']?.email || '',
          categoria: p['Categoria']?.select?.name || '',
          fotoUrl:   p['Foto URL']?.url || '',
          data:      page.created_time,
          semana:    p['Semana']?.number || 0,
          mes:       p['Mês']?.number || 0,
          ano:       p['Ano']?.number || 0,
          reactions,
        };
      });

      if (type === 'podio') {
        const now = new Date();
        const weekNum = getWeekNumber(now);
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const weekly  = calcLeaderboard(posts.filter(p => p.semana === weekNum && p.ano === year));
        const monthly = calcLeaderboard(posts.filter(p => p.mes === month && p.ano === year));
        return res.json({ weekly, monthly });
      }

      return res.json({ posts });
    } catch (err) {
      console.error('[community GET exception]', err.message);
      return res.status(500).json({ error: err.message, posts: [] });
    }
  }

  // ── POST: create post ───────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { nome, email, categoria, legenda, fotoUrl } = req.body || {};
    if (!nome || !email || !categoria || !legenda || !fotoUrl) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const words = legenda.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      return res.status(400).json({ error: 'Caption must have at least 3 words' });
    }

    // Check daily limit — fetch all posts by this email today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const checkRes = await fetch(`${NOTION_API}/databases/${POSTS_DB}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Email', email: { equals: email } },
        page_size: 100,
      }),
    });
    const checkData = await checkRes.json();
    const todayPosts = (checkData.results || []).filter(p =>
      p.created_time?.startsWith(todayStr)
    );
    if (todayPosts.length >= 4) {
      return res.status(429).json({ error: 'Daily limit reached (4 posts/day)' });
    }

    const now = new Date();
    const weekNum = getWeekNumber(now);

    const response = await fetch(`${NOTION_API}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: POSTS_DB },
        properties: {
          'Legenda':   { title: [{ text: { content: legenda } }] },
          'Nome':      { rich_text: [{ text: { content: nome } }] },
          'Email':     { email },
          'Categoria': { select: { name: categoria } },
          'Foto URL':  { url: fotoUrl },
          'Semana':    { number: weekNum },
          'Mês':       { number: now.getMonth() + 1 },
          'Ano':       { number: now.getFullYear() },
          'Pontos':    { number: 1 },
          ...Object.fromEntries(EMOJIS.map(e => [`Reações ${e}`, { number: 0 }])),
        },
      }),
    });

    const post = await response.json();
    if (!response.ok) {
      console.error('[community POST create]', post);
      return res.status(500).json({ error: post?.message || 'Failed to create post' });
    }

    return res.json({ success: true, id: post.id });
  }

  // ── PATCH: add reaction ──────────────────────────────────────────────────
  if (req.method === 'PATCH') {
    const { postId, emoji } = req.body || {};
    if (!postId || !emoji || !EMOJIS.includes(emoji)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const pageRes = await fetch(`${NOTION_API}/pages/${postId}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Notion-Version': '2022-06-28',
      },
    });
    const page = await pageRes.json();
    const current = page.properties?.[`Reações ${emoji}`]?.number || 0;

    await fetch(`${NOTION_API}/pages/${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { [`Reações ${emoji}`]: { number: current + 1 } },
      }),
    });

    return res.json({ success: true, newCount: current + 1 });
  }

  return res.status(405).end();
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function calcLeaderboard(posts) {
  const map = {};
  posts.forEach(p => {
    if (!map[p.email]) map[p.email] = { nome: p.nome, email: p.email, posts: 0, reactions: 0 };
    map[p.email].posts++;
    map[p.email].reactions += Object.values(p.reactions).reduce((a, b) => a + b, 0);
  });
  return Object.values(map)
    .map(u => ({ ...u, score: u.posts + (u.reactions * 0.1) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

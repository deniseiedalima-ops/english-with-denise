const NOTION_API = 'https://api.notion.com/v1';
const TOKEN = process.env.REACT_APP_NOTION_TOKEN;

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, ...body } = req.body || {};

  try {
    if (action === 'getStudentByEmail') {
      const { email } = body;
      const response = await fetch(`${NOTION_API}/databases/368628bb387c80259882da13d7e2ed1d/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filter: { property: 'E-mail', email: { equals: email } }
        }),
      });
      const result = await response.json();
      const pages = result.results || [];
      if (!pages.length) return res.json({ student: null });

      const page = pages[0];
      const props = page.properties;

      // Get próxima aula
      const proximaAulaRelation = props['Próxima Aula']?.relation || [];
      let proximaAula = null;
      if (proximaAulaRelation.length > 0) {
        const aulaRes = await fetch(`${NOTION_API}/pages/${proximaAulaRelation[0].id}`, { headers });
        const aulaPage = await aulaRes.json();
        const ap = aulaPage.properties;
        proximaAula = {
          id: aulaPage.id,
          numero: ap['Nº']?.number || 0,
          titulo: ap['Título da Aula']?.title?.[0]?.plain_text || '',
          nivel: ap['Nível']?.select?.name || '',
          targetGoal: ap['Target Goal']?.rich_text?.[0]?.plain_text || '',
          tarefa: ap['Tarefa para fazer antes']?.rich_text?.[0]?.plain_text || '',
          dataAula: ap['Data da Aula']?.date?.start || null,
        };
      }

      const student = {
        id: page.id,
        nome: props['Nome']?.title?.[0]?.plain_text || '',
        email: props['E-mail']?.email || '',
        nivel: props['Nível']?.select?.name || '',
        genero: props['Gênero']?.select?.name || '',
        classroomLink: props['Link Classroom']?.url || '',
        meetLink: props['Link Google Meet']?.url || '',
        codigo: props['Código']?.number || null,
        dataProximaAula: props['Data da Próxima Aula']?.date?.start || null,
        tarefaPersonalizada: props['Tarefa Personalizada']?.rich_text?.[0]?.plain_text || '',
        reposicoes: props['Reposições']?.number ?? null,
        dataReposicao: props['Data Reposição']?.date?.start || null,
        horarioReposicao: props['Horário Reposição']?.rich_text?.[0]?.plain_text || null,
        proximaAula,
      };

      return res.json({ student });
    }

    if (action === 'addToWaitlist') {
      const { nome, email, mensagem } = body;
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${NOTION_API}/pages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          parent: { database_id: '46648b67d9e640b89c53d1aae5f82908' },
          properties: {
            'Nome': { title: [{ text: { content: nome } }] },
            'E-mail': { email },
            'Mensagem': { rich_text: [{ text: { content: mensagem || '' } }] },
            'Data': { date: { start: today } },
            'Status': { select: { name: 'Aguardando' } },
          }
        })
      });
      return res.json({ ok: response.ok });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

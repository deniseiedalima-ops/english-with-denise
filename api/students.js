const NOTION_API = 'https://api.notion.com/v1';
const STUDENTS_DB = '368628bb387c80259882da13d7e2ed1d';
const TOKEN = () => process.env.NOTION_TOKEN || process.env.REACT_APP_NOTION_TOKEN || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(`${NOTION_API}/databases/${STUDENTS_DB}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [{ property: 'Nome', direction: 'ascending' }],
        page_size: 100,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data?.message || 'Notion error', students: [] });
    }

    const students = (data.results || []).map(page => {
      const p = page.properties;
      return {
        id: page.id,
        nome:               p['Nome']?.title?.[0]?.plain_text || '—',
        email:              p['E-mail']?.email || '—',
        nivel:              p['Nível']?.select?.name || '—',
        genero:             p['Gênero']?.select?.name || '',
        codigo:             p['Código']?.number || null,
        tarefaPersonalizada: p['Tarefa Personalizada']?.rich_text?.[0]?.plain_text || '',
        paginasDoLivro:     p['Páginas do Livro']?.rich_text?.[0]?.plain_text || '',
        tarefaDaSemana:     p['Tarefa da Semana']?.rich_text?.[0]?.plain_text || '',
        meetLink:           p['Link Google Meet']?.url || '',
        classroomLink:      p['Link Classroom']?.url || '',
        kamiLink:           p['Link KAMI']?.url || '',
        asaasLink:          p['Link ASAAS']?.url || '',
        badges:             p['Badges']?.rich_text?.[0]?.plain_text || '',
        reposicoes:         p['Reposições']?.number ?? null,
        dataReposicao:      p['Data Reposição']?.date?.start || null,
        horarioReposicao:   p['Horário Reposição']?.rich_text?.[0]?.plain_text || null,
      };
    });

    return res.json({ students });
  } catch (err) {
    return res.status(500).json({ error: err.message, students: [] });
  }
}

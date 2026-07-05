const NOTION_API = 'https://api.notion.com/v1';
const TOKEN = () => process.env.NOTION_TOKEN || process.env.REACT_APP_NOTION_TOKEN || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { pageId, fields } = req.body || {};
  if (!pageId || !fields) return res.status(400).json({ error: 'Missing pageId or fields' });

  // Map app fields → Notion property names
  const props = {};

  if (fields.tarefaDaSemana   !== undefined) props['Tarefa da Semana']     = { rich_text: [{ text: { content: fields.tarefaDaSemana || '' } }] };
  if (fields.paginasDoLivro   !== undefined) props['Páginas do Livro']     = { rich_text: [{ text: { content: fields.paginasDoLivro || '' } }] };
  if (fields.tarefaPersonalizada !== undefined) props['Tarefa Personalizada'] = { rich_text: [{ text: { content: fields.tarefaPersonalizada || '' } }] };
  if (fields.meetLink         !== undefined) props['Link Google Meet']     = { url: fields.meetLink || null };
  if (fields.classroomLink    !== undefined) props['Link Classroom']       = { url: fields.classroomLink || null };
  if (fields.driveLink        !== undefined) props['Link Drive']           = { url: fields.driveLink || null };
  if (fields.kamiLink         !== undefined) props['Link KAMI']            = { url: fields.kamiLink || null };
  if (fields.valorMensalidade !== undefined) props['Valor Mensalidade']    = { rich_text: [{ text: { content: fields.valorMensalidade || '' } }] };
  if (fields.dataVencimento   !== undefined) props['Data Vencimento']      = { rich_text: [{ text: { content: fields.dataVencimento || '' } }] };
  if (fields.asaasLink        !== undefined) props['Link ASAAS']           = { url: fields.asaasLink || null };
  if (fields.horarioReposicao !== undefined) props['Horário Reposição']    = { rich_text: [{ text: { content: fields.horarioReposicao || '' } }] };
  if (fields.reposicoes       !== undefined) props['Reposições']           = { number: Number(fields.reposicoes) || 0 };
  if (fields.dataReposicao    !== undefined) props['Data Reposição']       = fields.dataReposicao ? { date: { start: fields.dataReposicao } } : { date: null };
  if (fields.nivel            !== undefined) props['Nível']                = { select: { name: fields.nivel } };

  try {
    const r = await fetch(`${NOTION_API}/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN()}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties: props }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data?.message || 'Notion error' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

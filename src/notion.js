// Notion API via proxy (needed to avoid CORS in browser)
// In production, use a small Vercel serverless function as proxy.
// For now we use the public Notion API directly with the token.

const NOTION_API = 'https://api.notion.com/v1';
const TOKEN = process.env.REACT_APP_NOTION_TOKEN;

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

export async function queryDatabase(databaseId, filter = null) {
  const body = filter ? { filter } : {};
  const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.results || [];
}

export async function getStudentByEmail(email) {
  const results = await queryDatabase('368628bb387c80259882da13d7e2ed1d', {
    property: 'E-mail',
    email: { equals: email }
  });
  if (!results.length) return null;
  const page = results[0];
  const props = page.properties;

  // Parse relation to get próxima aula ID
  const proximaAulaRelation = props['Próxima Aula']?.relation || [];
  let proximaAula = null;
  if (proximaAulaRelation.length > 0) {
    const aulaId = proximaAulaRelation[0].id;
    proximaAula = await getPageById(aulaId);
  }

  return {
    id: page.id,
    nome: props['Nome']?.title?.[0]?.plain_text || '',
    email: props['E-mail']?.email || '',
    nivel: props['Nível']?.select?.name || '',
    classroomLink: props['Link Classroom']?.url || '',
    codigo: props['Código']?.number || null,
    dataProximaAula: props['Data da Próxima Aula']?.date?.start || null,
    tarefaPersonalizada: props['Tarefa Personalizada']?.rich_text?.[0]?.plain_text || '',
    reposicoes: props['Reposições']?.number ?? null,
    proximaAula,
  };
}

export async function getPageById(pageId) {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, { headers });
  const page = await res.json();
  const props = page.properties;
  return {
    id: page.id,
    numero: props['Nº']?.number || 0,
    titulo: props['Título da Aula']?.title?.[0]?.plain_text || '',
    nivel: props['Nível']?.select?.name || '',
    targetGoal: props['Target Goal']?.rich_text?.[0]?.plain_text || '',
    tarefa: props['Tarefa para fazer antes']?.rich_text?.[0]?.plain_text || '',
    dataAula: props['Data da Aula']?.date?.start || null,
    ativa: props['Ativa']?.checkbox || false,
  };
}

export async function logActivity(studentId, activity) {
  // Log activity to Notion (optional future feature)
  console.log('Activity logged:', studentId, activity);
}

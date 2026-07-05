// ═══════════════════════════════════════════════════════════════════════════
// SINGLE API FILE — all routes in one function (Vercel Hobby limit workaround)
// Route via: /api?route=notion | students | update | community | data | etc.
// ═══════════════════════════════════════════════════════════════════════════
import formidable from 'formidable';
import { createReadStream } from 'fs';

const NOTION_API = 'https://api.notion.com/v1';
const STUDENTS_DB = '368628bb387c80259882da13d7e2ed1d';
const AULAS_DB    = 'ba15709d-e9bf-43c8-a124-60c39a087b9b';
const POSTS_DB    = 'dbe7ae1a-6bf8-4610-bc11-ffb585acaf5c';
const TOKEN = () => process.env.NOTION_TOKEN || process.env.REACT_APP_NOTION_TOKEN || '';
const OPENAI_KEY = () => process.env.OPENAI_API_KEY || '';
const CLOUD_NAME = 'dbkrebqs0';
const UPLOAD_PRESET = 'agrr8msy';

const nHeaders = () => ({
  'Authorization': `Bearer ${TOKEN()}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
});

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Parse body for non-file requests
  let body = {};
  let rawBuffer = null;
  const ct = req.headers['content-type'] || '';

  if (ct.includes('application/json')) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try { body = JSON.parse(Buffer.concat(chunks).toString()); } catch {}
  } else if (ct.includes('multipart') || ct.includes('octet-stream') || ct.includes('image/')) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    rawBuffer = Buffer.concat(chunks);
  }

  const route = req.query.route || body.route || '';

  try {
    // ── NOTION: get student by email ───────────────────────────────────────
    if (route === 'notion') {
      const email = req.query.email || body.email || body.action?.email;
      if (!email) return res.status(400).json({ error: 'Missing email' });

      const r = await fetch(`${NOTION_API}/databases/${STUDENTS_DB}/query`, {
        method: 'POST', headers: nHeaders(),
        body: JSON.stringify({ filter: { property: 'E-mail', email: { equals: email } } }),
      });
      const result = await r.json();
      const pages = result.results || [];
      if (!pages.length) return res.json({ student: null });

      const page = pages[0];
      const props = page.properties;

      // Fetch próxima aula relation
      const aulaRelation = props['Próxima Aula']?.relation || [];
      let proximaAula = null;
      if (aulaRelation.length > 0) {
        const aulaRes = await fetch(`${NOTION_API}/pages/${aulaRelation[0].id}`, { headers: nHeaders() });
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

      return res.json({ student: {
        id: page.id,
        nome: props['Nome']?.title?.[0]?.plain_text || '',
        email: props['E-mail']?.email || '',
        nivel: props['Nível']?.select?.name || '',
        genero: props['Gênero']?.select?.name || '',
        classroomLink:    props['Link Classroom']?.url || '',
        kamiLink:         props['Link KAMI']?.url || '',
        driveLink:        props['Link Drive']?.url || '',
        valorMensalidade: props['Valor Mensalidade']?.rich_text?.[0]?.plain_text || '',
        dataVencimento:   props['Data Vencimento']?.rich_text?.[0]?.plain_text || '',
        asaasLink:        props['Link ASAAS']?.url || '',
        badges:           props['Badges']?.rich_text?.[0]?.plain_text || '',
        meetLink:         props['Link Google Meet']?.url || '',
        dataProximaAula:  props['Data da Próxima Aula']?.date?.start || null,
        tituloProximaAula:props['Título da Próxima Aula']?.rich_text?.[0]?.plain_text || '',
        tarefaPersonalizada:props['Tarefa Personalizada']?.rich_text?.[0]?.plain_text || '',
        paginasDoLivro:   props['Páginas do Livro']?.rich_text?.[0]?.plain_text || '',
        tarefaDaSemana:   props['Tarefa da Semana']?.rich_text?.[0]?.plain_text || '',
        reposicoes:       props['Reposições']?.number ?? null,
        dataReposicao:    props['Data Reposição']?.date?.start || null,
        horarioReposicao: props['Horário Reposição']?.rich_text?.[0]?.plain_text || null,
        proximaAula,
      }});
    }

    // ── STUDENTS: list all ─────────────────────────────────────────────────
    if (route === 'students') {
      const r = await fetch(`${NOTION_API}/databases/${STUDENTS_DB}/query`, {
        method: 'POST', headers: nHeaders(),
        body: JSON.stringify({ sorts: [{ property: 'Nome', direction: 'ascending' }], page_size: 100 }),
      });
      const data = await r.json();
      if (!r.ok) return res.status(500).json({ error: data?.message, students: [] });

      const students = (data.results || []).map(page => {
        const p = page.properties;
        return {
          id: page.id,
          nome:             p['Nome']?.title?.[0]?.plain_text || '—',
          email:            p['E-mail']?.email || '—',
          nivel:            p['Nível']?.select?.name || '—',
          genero:           p['Gênero']?.select?.name || '',
          tarefaPersonalizada: p['Tarefa Personalizada']?.rich_text?.[0]?.plain_text || '',
          paginasDoLivro:   p['Páginas do Livro']?.rich_text?.[0]?.plain_text || '',
          tarefaDaSemana:   p['Tarefa da Semana']?.rich_text?.[0]?.plain_text || '',
          meetLink:         p['Link Google Meet']?.url || '',
          classroomLink:    p['Link Classroom']?.url || '',
          driveLink:        p['Link Drive']?.url || '',
          kamiLink:         p['Link KAMI']?.url || '',
          asaasLink:        p['Link ASAAS']?.url || '',
          valorMensalidade: p['Valor Mensalidade']?.rich_text?.[0]?.plain_text || '',
          dataVencimento:   p['Data Vencimento']?.rich_text?.[0]?.plain_text || '',
          badges:           p['Badges']?.rich_text?.[0]?.plain_text || '',
          reposicoes:       p['Reposições']?.number ?? null,
          dataReposicao:    p['Data Reposição']?.date?.start || null,
          horarioReposicao: p['Horário Reposição']?.rich_text?.[0]?.plain_text || null,
          dataProximaAula:  p['Data da Próxima Aula']?.date?.start || null,
          tituloProximaAula:p['Título da Próxima Aula']?.rich_text?.[0]?.plain_text || '',
          proximaAula:      null,
        };
      });
      return res.json({ students });
    }

    // ── UPDATE STUDENT ─────────────────────────────────────────────────────
    if (route === 'update-student') {
      const { pageId, fields } = body;
      if (!pageId || !fields) return res.status(400).json({ error: 'Missing pageId or fields' });

      const props = {};
      if (fields.tarefaDaSemana    !== undefined) props['Tarefa da Semana']       = { rich_text: [{ text: { content: fields.tarefaDaSemana || '' } }] };
      if (fields.paginasDoLivro    !== undefined) props['Páginas do Livro']       = { rich_text: [{ text: { content: fields.paginasDoLivro || '' } }] };
      if (fields.tarefaPersonalizada !== undefined) props['Tarefa Personalizada'] = { rich_text: [{ text: { content: fields.tarefaPersonalizada || '' } }] };
      if (fields.meetLink          !== undefined) props['Link Google Meet']       = { url: fields.meetLink || null };
      if (fields.classroomLink     !== undefined) props['Link Classroom']         = { url: fields.classroomLink || null };
      if (fields.driveLink         !== undefined) props['Link Drive']             = { url: fields.driveLink || null };
      if (fields.kamiLink          !== undefined) props['Link KAMI']              = { url: fields.kamiLink || null };
      if (fields.asaasLink         !== undefined) props['Link ASAAS']             = { url: fields.asaasLink || null };
      if (fields.badges            !== undefined) props['Badges']                 = { rich_text: [{ text: { content: fields.badges || '' } }] };
      if (fields.valorMensalidade  !== undefined) props['Valor Mensalidade']      = { rich_text: [{ text: { content: fields.valorMensalidade || '' } }] };
      if (fields.dataVencimento    !== undefined) props['Data Vencimento']        = { rich_text: [{ text: { content: fields.dataVencimento || '' } }] };
      if (fields.horarioReposicao  !== undefined) props['Horário Reposição']      = { rich_text: [{ text: { content: fields.horarioReposicao || '' } }] };
      if (fields.reposicoes        !== undefined) props['Reposições']             = { number: Number(fields.reposicoes) || 0 };
      if (fields.dataReposicao     !== undefined) props['Data Reposição']         = fields.dataReposicao ? { date: { start: fields.dataReposicao } } : { date: null };
      if (fields.dataProximaAula   !== undefined) props['Data da Próxima Aula']   = fields.dataProximaAula ? { date: { start: fields.dataProximaAula } } : { date: null };
      if (fields.proximaAulaId     !== undefined) props['Próxima Aula']           = fields.proximaAulaId ? { relation: [{ id: fields.proximaAulaId }] } : { relation: [] };
      if (fields.nivel             !== undefined) props['Nível']                  = { select: { name: fields.nivel } };

      const r = await fetch(`${NOTION_API}/pages/${pageId}`, {
        method: 'PATCH', headers: nHeaders(),
        body: JSON.stringify({ properties: props }),
      });
      const data = await r.json();
      if (!r.ok) return res.status(500).json({ error: data?.message || 'Notion error' });
      return res.json({ success: true });
    }

    // ── AULAS: list agenda de aulas ────────────────────────────────────────
    if (route === 'aulas') {
      const r = await fetch(`${NOTION_API}/databases/${AULAS_DB}/query`, {
        method: 'POST', headers: nHeaders(),
        body: JSON.stringify({ sorts: [{ property: 'Nº', direction: 'ascending' }], page_size: 100 }),
      });
      const data = await r.json();
      if (!r.ok) return res.status(500).json({ error: data?.message, aulas: [] });

      const aulas = (data.results || []).map(page => {
        const p = page.properties;
        return {
          id: page.id,
          numero: p['Nº']?.number || 0,
          titulo: p['Título da Aula']?.title?.[0]?.plain_text || '',
          nivel:  p['Nível']?.select?.name || '',
          dataAula: p['Data da Aula']?.date?.start || null,
        };
      }).filter(a => a.titulo);
      return res.json({ aulas });
    }

    // ── COMMUNITY: feed / posts / reactions ───────────────────────────────
    if (route === 'community') {
      const EMOJIS = ['🔥','❤️','👏','🎉','✨','📚','👑','💛'];
      if (req.method === 'GET' || body.type === 'feed') {
        const r = await fetch(`${NOTION_API}/databases/${POSTS_DB}/query`, {
          method: 'POST', headers: nHeaders(),
          body: JSON.stringify({ sorts: [{ timestamp: 'created_time', direction: 'descending' }], page_size: 100 }),
        });
        const data = await r.json();
        const posts = (data.results || []).map(page => {
          const p = page.properties;
          const reactions = {};
          EMOJIS.forEach(e => { reactions[e] = p[`Reações ${e}`]?.number || 0; });
          return { id: page.id, legenda: p['Legenda']?.title?.[0]?.plain_text || '', nome: p['Nome']?.rich_text?.[0]?.plain_text || '', email: p['Email']?.email || '', categoria: p['Categoria']?.select?.name || '', fotoUrl: p['Foto URL']?.url || '', data: page.created_time, reactions };
        });
        return res.json({ posts });
      }
      return res.status(405).end();
    }

    // ── UPLOAD IMAGE ───────────────────────────────────────────────────────
    if (route === 'upload-image') {
      if (!rawBuffer || rawBuffer.length < 100) return res.status(400).json({ error: 'No image data' });
      const contentType = req.headers['content-type'] || 'image/jpeg';
      const boundary = '----CloudinaryBoundary' + Date.now();
      const CRLF = '\r\n';
      const fileHeader = Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="photo.jpg"${CRLF}Content-Type: ${contentType}${CRLF}${CRLF}`);
      const presetPart  = Buffer.from(`${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="upload_preset"${CRLF}${CRLF}${UPLOAD_PRESET}${CRLF}`);
      const folderPart  = Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="folder"${CRLF}${CRLF}english-rats${CRLF}--${boundary}--${CRLF}`);
      const uploadBody  = Buffer.concat([fileHeader, rawBuffer, presetPart, folderPart]);
      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': uploadBody.length.toString() },
        body: uploadBody,
      });
      const upData = await upRes.json();
      if (!upRes.ok || !upData.secure_url) return res.status(500).json({ error: upData?.error?.message || 'Upload failed' });
      return res.json({ url: upData.secure_url });
    }

    // ── TRANSCRIBE (Whisper) ───────────────────────────────────────────────
    if (route === 'transcribe') {
      if (!rawBuffer) return res.status(400).json({ error: 'No audio data' });
      const boundary2 = '----WhisperBoundary' + Date.now();
      const CRLF = '\r\n';
      const audioPart = Buffer.from(`--${boundary2}${CRLF}Content-Disposition: form-data; name="file"; filename="audio.webm"${CRLF}Content-Type: audio/webm${CRLF}${CRLF}`);
      const modelPart = Buffer.from(`${CRLF}--${boundary2}${CRLF}Content-Disposition: form-data; name="model"${CRLF}${CRLF}whisper-1${CRLF}--${boundary2}--${CRLF}`);
      const whisperBody = Buffer.concat([audioPart, rawBuffer, modelPart]);
      const wRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_KEY()}`, 'Content-Type': `multipart/form-data; boundary=${boundary2}` },
        body: whisperBody,
      });
      const wData = await wRes.json();
      return res.json({ text: wData.text || '' });
    }

    // ── WRITING FEEDBACK ──────────────────────────────────────────────────
    if (route === 'writing-feedback') {
      const { text, prompt, level } = body;
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_KEY()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini', max_tokens: 600,
          messages: [{ role: 'user', content: `You are an English teacher. Level: ${level}. Task: "${prompt}". Student answer: "${text}". Give feedback in Portuguese. Return JSON: {"score":0-10,"positive":"...","errors":"...","tip":"...","suggestions":[]}` }],
        }),
      });
      const d = await r.json();
      try {
        const content = d.choices?.[0]?.message?.content || '{}';
        const cleaned = content.replace(/```json|```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      } catch { return res.json({ score: 7, positive: 'Good effort!', errors: '', tip: '', suggestions: [] }); }
    }

    // ── SPEAKING FEEDBACK ─────────────────────────────────────────────────
    if (route === 'speaking-feedback') {
      const { transcript, prompt, level } = body;
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_KEY()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini', max_tokens: 500,
          messages: [{ role: 'user', content: `English teacher. Level: ${level}. Task: "${prompt}". Transcript: "${transcript}". Feedback in Portuguese. JSON: {"score":0-10,"pronunciation":"...","grammar":"...","fluency":"...","tip":"..."}` }],
        }),
      });
      const d = await r.json();
      try {
        const content = d.choices?.[0]?.message?.content || '{}';
        return res.json(JSON.parse(content.replace(/```json|```/g, '').trim()));
      } catch { return res.json({ score: 7, pronunciation: '', grammar: '', fluency: '', tip: '' }); }
    }

    // ── CALENDAR ──────────────────────────────────────────────────────────
    if (route === 'calendar') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'No token' });
      const { timeMin, timeMax } = body;
      const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const calData = await calRes.json();
      if (!calRes.ok) return res.status(calRes.status).json({ error: calData.error?.message });
      const events = (calData.items || []).map(e => ({
        id: e.id, summary: e.summary, start: e.start, end: e.end, location: e.location, description: e.description,
      }));
      return res.json({ events });
    }

    return res.status(404).json({ error: `Unknown route: ${route}` });

  } catch (err) {
    console.error('[API Error]', route, err.message);
    return res.status(500).json({ error: err.message });
  }
}

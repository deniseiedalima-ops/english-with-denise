// ═══════════════════════════════════════════════════════════════════════════
// SINGLE API FILE — all routes in one function (Vercel Hobby limit workaround)
// Route via: /api/index?route=notion | students | update-student | etc.
// ═══════════════════════════════════════════════════════════════════════════

const NOTION_API = 'https://api.notion.com/v1';
const STUDENTS_DB = '368628bb387c80259882da13d7e2ed1d';
const AULAS_DB    = 'ba15709d-e9bf-43c8-a124-60c39a087b9b';
const POSTS_DB    = 'dbe7ae1a-6bf8-4610-bc11-ffb585acaf5c';
const TEAP_SIMULADOS_DB  = '429c0015-e3ce-4fc6-a7e5-8381cfd1523e'; // TEAP Simulados Cadastrados
const TEAP_QUESTOES_DB   = '7b311cba-32cd-4b88-97fd-bc38c0785df7'; // TEAP Questões
const TEAP_RESULTADOS_DB = '6ab6517f-3004-44fc-aa77-157b5a9c166c'; // TEAP Resultados
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
        programa: props['Programa']?.select?.name || '',
        areaTeap: props['Área TEAP']?.select?.name || '',
        objetivoTeap: props['Objetivo']?.rich_text?.[0]?.plain_text || '',
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
        // Get the relation ID so AulaPicker can show current selection
        const aulaRelation = p['Próxima Aula']?.relation || [];
        const proximaAulaId = aulaRelation.length > 0 ? aulaRelation[0].id : null;
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
          proximaAulaId,
          proximaAula: proximaAulaId ? { id: proximaAulaId, titulo: p['Título da Próxima Aula']?.rich_text?.[0]?.plain_text || '' } : null,
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
      const titulo = fields.proximaAulaTitulo || fields.tituloProximaAula;
      if (titulo !== undefined) props['Título da Próxima Aula'] = { rich_text: [{ text: { content: titulo || '' } }] };
      if (fields.nivel             !== undefined) props['Nível']                   = { select: { name: fields.nivel } };

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

    // ── TEAP: student dashboard data (simulados, categorias, radar) ────────
    // Categorias vêm agregadas de "Categorias JSON" (salvo no momento do
    // submit). Radar é um mapeamento heurístico das categorias — ainda não
    // existe uma fonte de dados própria para as 9 competências do radar.
    if (route === 'teap-dashboard') {
      const email = req.query.email || body.email;
      if (!email) return res.status(400).json({ error: 'Missing email' });

      const r = await fetch(`${NOTION_API}/databases/${TEAP_RESULTADOS_DB}/query`, {
        method: 'POST', headers: nHeaders(),
        body: JSON.stringify({
          filter: { property: 'E-mail Aluno', email: { equals: email } },
          sorts: [{ property: 'Data', direction: 'ascending' }],
        }),
      });
      const data = await r.json();
      const rows = data.results || [];
      if (!rows.length) return res.json({ configured: true, simulados: [] });

      const simulados = rows.map(page => {
        const p = page.properties;
        const d = p['Data']?.date?.start;
        return {
          data: d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '',
          nota: p['Nota']?.number ?? 0,
          tempoMedio: p['Tempo Médio (s)']?.number ?? 0,
          tempoTotal: p['Tempo Total (min)']?.number ?? 0,
        };
      });

      // Agrega "Categorias JSON" de todas as tentativas
      const catTotals = {};
      rows.forEach(page => {
        let cats = {};
        try { cats = JSON.parse(page.properties['Categorias JSON']?.rich_text?.[0]?.plain_text || '{}'); } catch {}
        Object.entries(cats).forEach(([nome, v]) => {
          if (!catTotals[nome]) catTotals[nome] = { acertos: 0, total: 0 };
          catTotals[nome].acertos += v.acertos || 0;
          catTotals[nome].total += v.total || 0;
        });
      });
      const categorias = Object.entries(catTotals).map(([nome, v]) => ({
        nome, acerto: v.total ? Math.round((v.acertos / v.total) * 100) : 0,
      }));

      const catMap = Object.fromEntries(categorias.map(c => [c.nome, c.acerto]));
      const ultimoTempo = simulados[simulados.length - 1]?.tempoMedio || 60;
      const radar = [
        { nome: 'Reading Speed', valor: Math.max(0, Math.min(100, Math.round(100 - (ultimoTempo - 40) * 1.5))) },
        { nome: 'Scanning', valor: catMap['Localização'] ?? 0 },
        { nome: 'Skimming', valor: catMap['Ideia Central'] ?? 0 },
        { nome: 'Vocabulary', valor: catMap['Vocabulário'] ?? 0 },
        { nome: 'Pronoun Ref.', valor: catMap['Referência Pronominal'] ?? 0 },
        { nome: 'Main Idea', valor: catMap['Ideia Central'] ?? 0 },
        { nome: 'Inference', valor: catMap['Compreensão de Parágrafo'] ?? 0 },
        { nome: 'Sentence Mng.', valor: catMap['Compreensão de Sentença'] ?? 0 },
        { nome: 'Paragraph Mng.', valor: catMap['Compreensão de Parágrafo'] ?? 0 },
      ];

      return res.json({ configured: true, simulados, categorias, radar });
    }

    // ── TEAP: list active simulados + status for this student ──────────────
    if (route === 'teap-simulados-list') {
      const email = req.query.email || body.email;
      if (!email) return res.status(400).json({ error: 'Missing email' });

      const [simR, resR] = await Promise.all([
        fetch(`${NOTION_API}/databases/${TEAP_SIMULADOS_DB}/query`, {
          method: 'POST', headers: nHeaders(),
          body: JSON.stringify({ filter: { property: 'Ativo', checkbox: { equals: true } } }),
        }).then(r => r.json()),
        fetch(`${NOTION_API}/databases/${TEAP_RESULTADOS_DB}/query`, {
          method: 'POST', headers: nHeaders(),
          body: JSON.stringify({ filter: { property: 'E-mail Aluno', email: { equals: email } } }),
        }).then(r => r.json()),
      ]);

      const resultsBySimuladoId = {};
      (resR.results || []).forEach(page => {
        const p = page.properties;
        const simId = p['Simulado']?.relation?.[0]?.id;
        const nota = p['Nota']?.number ?? 0;
        if (simId && (!resultsBySimuladoId[simId] || nota > resultsBySimuladoId[simId])) {
          resultsBySimuladoId[simId] = nota;
        }
      });

      const simulados = (simR.results || []).map(page => {
        const p = page.properties;
        const nota = resultsBySimuladoId[page.id];
        return {
          id: page.id,
          titulo: p['Título']?.title?.[0]?.plain_text || '',
          area: p['Área TEAP']?.select?.name || '',
          status: nota !== undefined ? 'concluido' : 'nao_iniciado',
          nota: nota ?? null,
        };
      }).filter(s => s.titulo && !s.titulo.startsWith('EXEMPLO'));

      return res.json({ simulados });
    }

    // ── TEAP: fetch a simulado's texts + questions (sem gabarito!) ──────────
    if (route === 'teap-simulado-detail') {
      const id = req.query.id || body.id;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      const [simRes, qRes] = await Promise.all([
        fetch(`${NOTION_API}/pages/${id}`, { headers: nHeaders() }).then(r => r.json()),
        fetch(`${NOTION_API}/databases/${TEAP_QUESTOES_DB}/query`, {
          method: 'POST', headers: nHeaders(),
          body: JSON.stringify({
            filter: { property: 'Simulado', relation: { contains: id } },
            sorts: [{ property: 'Número', direction: 'ascending' }],
          }),
        }).then(r => r.json()),
      ]);

      const sp = simRes.properties;
      const questoes = (qRes.results || []).map(page => {
        const p = page.properties;
        const alternativas = {};
        ['A', 'B', 'C', 'D', 'E'].forEach(letra => {
          const texto = p[`Alternativa ${letra}`]?.rich_text?.[0]?.plain_text || '';
          if (texto) alternativas[letra] = texto;
        });
        return {
          numero: p['Número']?.number ?? 0,
          enunciado: p['Enunciado']?.title?.[0]?.plain_text || '',
          textoReferencia: p['Texto Referência']?.select?.name || 'Texto 1',
          alternativas,
          // Resposta Certa é DE PROPÓSITO omitida — só volta no submit.
        };
      });

      return res.json({
        id,
        titulo: sp['Título']?.title?.[0]?.plain_text || '',
        texto1: sp['Texto 1']?.rich_text?.[0]?.plain_text || '',
        texto2: sp['Texto 2']?.rich_text?.[0]?.plain_text || '',
        questoes,
      });
    }

    // ── TEAP: submit answers, grade server-side, save result ───────────────
    if (route === 'teap-simulado-submit') {
      const { email, simuladoId, respostas, tempoTotalMin, tempoMedioSeg } = body;
      if (!email || !simuladoId || !respostas) return res.status(400).json({ error: 'Missing fields' });

      const qRes = await fetch(`${NOTION_API}/databases/${TEAP_QUESTOES_DB}/query`, {
        method: 'POST', headers: nHeaders(),
        body: JSON.stringify({
          filter: { property: 'Simulado', relation: { contains: simuladoId } },
          sorts: [{ property: 'Número', direction: 'ascending' }],
        }),
      });
      const qData = await qRes.json();
      const questoes = qData.results || [];
      if (!questoes.length) return res.status(404).json({ error: 'Simulado sem questões cadastradas' });

      let acertos = 0;
      const catTotals = {};
      const gabarito = questoes.map(page => {
        const p = page.properties;
        const numero = p['Número']?.number ?? 0;
        const certa = p['Resposta Certa']?.select?.name || 'A';
        const categoria = p['Categoria']?.select?.name || 'Geral';
        const dada = respostas[numero] || respostas[String(numero)] || null;
        const correta = dada === certa;
        if (correta) acertos++;
        if (!catTotals[categoria]) catTotals[categoria] = { acertos: 0, total: 0 };
        catTotals[categoria].total++;
        if (correta) catTotals[categoria].acertos++;
        return { numero, enunciado: p['Enunciado']?.title?.[0]?.plain_text || '', respostaAluno: dada, respostaCerta: certa, correta };
      });

      const total = questoes.length;
      const nota = Math.round((acertos / total) * 100);

      const createRes = await fetch(`${NOTION_API}/pages`, {
        method: 'POST', headers: nHeaders(),
        body: JSON.stringify({
          parent: { database_id: TEAP_RESULTADOS_DB },
          properties: {
            'Título': { title: [{ text: { content: `${email} — ${new Date().toLocaleDateString('pt-BR')}` } }] },
            'E-mail Aluno': { email },
            'Simulado': { relation: [{ id: simuladoId }] },
            'Data': { date: { start: new Date().toISOString().slice(0, 10) } },
            'Nota': { number: nota },
            'Tempo Total (min)': { number: Number(tempoTotalMin) || 0 },
            'Tempo Médio (s)': { number: Number(tempoMedioSeg) || 0 },
            'Respostas JSON': { rich_text: [{ text: { content: JSON.stringify(respostas) } }] },
            'Categorias JSON': { rich_text: [{ text: { content: JSON.stringify(catTotals) } }] },
          },
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        return res.status(500).json({ error: err?.message || 'Erro ao salvar resultado' });
      }

      return res.json({ nota, acertos, total, gabarito });
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

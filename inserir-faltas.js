// ============================================================
// SCRIPT DE FALTAS E REPOSIÇÕES RETROATIVAS — English With Denise
// Como usar:
// 1. Abra english-with-denise.vercel.app e faça login como admin
// 2. Pressione F12 → aba "Console"
// 3. Cole TODO este código e pressione Enter
// 4. Aguarde a mensagem "✅ Concluído!"
// ============================================================

(async () => {
  console.log("🔄 Buscando alunos do Notion...");

  // Buscar alunos reais com IDs do Notion
  const res = await fetch('/api/students');
  const data = await res.json();
  const students = data.students || [];

  // Helper para encontrar aluno por nome (parcial, case-insensitive)
  const find = (nome) => students.find(s =>
    s.nome.toLowerCase().includes(nome.toLowerCase())
  );

  // ── FALTAS E STATUS A REGISTRAR ──────────────────────────────────────────
  // Formato: { nome, date, status }
  // Status: presente | falta | rep_pendente | rep_feita | rep_falta
  const registros = [
    // Yara — 3 faltas em abril (datas exatas não registradas, usando dias aproximados)
    { nome: "Yara",        date: "2026-04-07", status: "falta" },
    { nome: "Yara",        date: "2026-04-14", status: "falta" },
    { nome: "Yara",        date: "2026-04-21", status: "falta" },

    // Pedro & Isabella — faltas
    { nome: "Pedro",       date: "2026-05-22", status: "falta" },
    { nome: "Isabella Rissi", date: "2026-05-22", status: "falta" },
    { nome: "Pedro",       date: "2026-05-29", status: "falta" },
    { nome: "Isabella Rissi", date: "2026-05-29", status: "falta" },
    { nome: "Pedro",       date: "2026-06-03", status: "falta" },
    { nome: "Isabella Rissi", date: "2026-06-03", status: "falta" },

    // Gustavo — faltas
    { nome: "Gustavo",     date: "2026-05-15", status: "falta" },
    { nome: "Gustavo",     date: "2026-06-26", status: "falta" },

    // Ana Karoline — faltas
    { nome: "Ana Karoline", date: "2026-06-02", status: "falta" },
    { nome: "Ana Karoline", date: "2026-06-12", status: "falta" },
    { nome: "Ana Karoline", date: "2026-06-19", status: "falta" },

    // Rafael — faltas
    { nome: "Rafael",      date: "2026-06-02", status: "falta" },
    { nome: "Rafael",      date: "2026-06-08", status: "falta" },

    // Alex — falta
    { nome: "Alex",        date: "2026-06-01", status: "falta" },

    // Grupo 2 (Julio + Kawan + Thaís Monteiro) — falta
    { nome: "Júlio",       date: "2026-05-18", status: "falta" },
    { nome: "Antonio Kawan", date: "2026-05-18", status: "falta" },
    { nome: "Thaís Monteiro", date: "2026-05-18", status: "falta" },

    // Grupo 1 (Lorenna + Claudia) — falta
    { nome: "Lorenna",     date: "2026-06-01", status: "falta" },
    { nome: "Claudia",     date: "2026-06-01", status: "falta" },

    // Débora & Romana — faltas
    { nome: "Débora",      date: "2026-06-18", status: "falta" },
    { nome: "Romana",      date: "2026-06-18", status: "falta" },
    { nome: "Débora",      date: "2026-06-29", status: "falta" },
    { nome: "Romana",      date: "2026-06-29", status: "falta" },

    // Grupo 4 (Thais Aleixo + Geovanna + Emilly) — falta
    { nome: "Thais de Fátima", date: "2026-06-13", status: "falta" },
    { nome: "Geovanna",    date: "2026-06-13", status: "falta" },
    { nome: "Emilly",      date: "2026-06-13", status: "falta" },

    // Roberta — falta
    { nome: "Roberta",     date: "2026-06-16", status: "falta" },

    // Virginia — falta
    { nome: "Virginia",    date: "2026-06-17", status: "falta" },

    // Raphaella — falta
    { nome: "Raphaella",   date: "2026-06-03", status: "falta" },

    // ── REPOSIÇÕES JÁ FEITAS ─────────────────────────────────────────────
    // Ana Karoline — rep feita em 05/06
    { nome: "Ana Karoline", date: "2026-06-05", status: "rep_feita" },

    // Reposições confirmadas e feitas (do calendário)
    { nome: "Gustavo",     date: "2026-06-12", status: "rep_feita" },
    { nome: "Alex",        date: "2026-06-08", status: "rep_feita" }, // Aline e Alex

    // Grupo 2 — rep feita 07/07
    { nome: "Júlio",       date: "2026-07-07", status: "rep_feita" },
    { nome: "Antonio Kawan", date: "2026-07-07", status: "rep_feita" },
    { nome: "Thaís Monteiro", date: "2026-07-07", status: "rep_feita" },

    // Rafael — reps feitas
    { nome: "Rafael",      date: "2026-07-07", status: "rep_feita" },
    { nome: "Rafael",      date: "2026-07-09", status: "rep_feita" },

    // Virginia — rep feita
    { nome: "Virginia",    date: "2026-07-09", status: "rep_feita" },

    // Lorenna & Claudia — rep feita 10/07
    { nome: "Lorenna",     date: "2026-07-10", status: "rep_feita" },
    { nome: "Claudia",     date: "2026-07-10", status: "rep_feita" },

    // Ana Karoline — reps feitas
    { nome: "Ana Karoline", date: "2026-07-02", status: "rep_feita" },
    { nome: "Ana Karoline", date: "2026-07-08", status: "rep_feita" },

    // Pedro & Isabella — reps feitas
    { nome: "Pedro",       date: "2026-07-08", status: "rep_feita" },
    { nome: "Isabella Rissi", date: "2026-07-08", status: "rep_feita" },
    { nome: "Pedro",       date: "2026-07-09", status: "rep_feita" },
    { nome: "Isabella Rissi", date: "2026-07-09", status: "rep_feita" },

    // Roberta — rep feita 01/07
    { nome: "Roberta",     date: "2026-07-01", status: "rep_feita" },

    // ── REPOSIÇÕES PENDENTES (sem data) → rep_pendente ───────────────────
    // Débora & Romana — 2 reps pendentes
    { nome: "Débora",      date: "2026-07-01", status: "rep_pendente" },
    { nome: "Romana",      date: "2026-07-01", status: "rep_pendente" },

    // Grupo 4 — 1 rep pendente
    { nome: "Thais de Fátima", date: "2026-07-01", status: "rep_pendente" },
    { nome: "Geovanna",    date: "2026-07-01", status: "rep_pendente" },
    { nome: "Emilly",      date: "2026-07-01", status: "rep_pendente" },

    // Alex — 1 rep pendente
    { nome: "Alex",        date: "2026-07-01", status: "rep_pendente" },

    // Pedro & Isabella — 1 rep ainda pendente
    { nome: "Pedro",       date: "2026-07-02", status: "rep_pendente" },
    { nome: "Isabella Rissi", date: "2026-07-02", status: "rep_pendente" },

    // Gustavo — rep pendente (falta 26/06)
    { nome: "Gustavo",     date: "2026-07-02", status: "rep_pendente" },
  ];

  // ── APLICAR NO LOCALSTORAGE ───────────────────────────────────────────────
  const SK = 'ewd_admin_v1';
  let store;
  try { store = JSON.parse(localStorage.getItem(SK)) || {}; } catch { store = {}; }
  if (!store.presenca) store.presenca = {};

  let ok = 0, skip = 0;

  for (const r of registros) {
    const student = find(r.nome);
    if (!student) {
      console.warn(`⚠️ Aluno não encontrado: "${r.nome}"`);
      skip++;
      continue;
    }
    if (!store.presenca[r.date]) store.presenca[r.date] = {};
    store.presenca[r.date][student.id] = r.status;
    ok++;
  }

  localStorage.setItem(SK, JSON.stringify(store));

  console.log(`✅ Concluído! ${ok} registros inseridos, ${skip} não encontrados.`);
  console.log("🔄 Recarregando a página...");
  setTimeout(() => location.reload(), 1000);
})();

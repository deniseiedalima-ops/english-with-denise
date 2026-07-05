import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Admin.css';

const ADMIN_EMAIL = 'denise.ieda.lima@gmail.com';

const LEVEL_COLORS = {
  'A1': '#ff6a00', 'A2': '#1d9e75',
  'B1': '#2e86c1', 'B2': '#7f77dd', 'P1': '#d4537e',
};

const NIVEL_BG = { A1:'#ff6a00', A2:'#1d9e75', B1:'#2e86c1', B2:'#7f77dd' };

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MES_ATUAL_IDX = new Date().getMonth();

const ALUNOS_FINANCEIRO = [
  ['Débora Oliveira da Silva',200,10],['Thais de Fátima Aleixo Correa',200,10],
  ['Yara Naya Lopes de Andrade',600,10],['Maria Isabella Costa Silva',250,10],
  ['Vitor Axel Eduardo Clemente',250,10],['Sabrina Lacerda Cunha',400,10],
  ['Thawany Camila da Silva Costa',350,10],['Gustavo Mailho Machado',320,10],
  ['Isadora Lacerda Cunha',400,10],['Virginia Guerra Magre',180,10],
  ['Rafael Fontes Feitosa',320,10],['Roberta Leticia Rocha Silva',400,10],
  ['Ana Karoline Sobreiro Silva',350,10],['Thaís Monteiro Botelho Teles',190,15],
  ['Antonio Kawan Freitas Damasceno Pereira',190,15],['Lorenna Benicio',180,15],
  ['Claudia Abreu Silva',180,15],['Yasmim Araujo Silva',180,15],
  ['Raphaella Fonseca',140,15],['Romana Rebeca Barros',200,15],
  ['Emilly Fonseca',100,10],['Geovanna Inácio Araújo',200,10],
  ['Pedro Henrique Lustosa Soares',250,10],['Isabella Rissi Vincentini',250,10],
  ['Júlio Magre Guerra',0,15],['Alex Campos',320,10],['Lucinara Cunha',320,10],
];

const CRONOGRAMAS = {
  A1: [
    {num:1,lesson:"1A — American Pronunciation",tipo:"aula"},
    {num:2,lesson:"1C — As Pessoas do Inglês",tipo:"aula"},
    {num:3,lesson:"2A — The Greetings",tipo:"aula"},
    {num:4,lesson:"2C — Jenny at the Hotel",tipo:"aula"},
    {num:5,lesson:"3A — The Introductions",tipo:"aula"},
    {num:6,lesson:"3D — Verb to Be",tipo:"aula"},
    {num:7,lesson:"4A — Countries and Nationalities",tipo:"aula"},
    {num:8,lesson:"4C — Proximity and Distance",tipo:"aula"},
    {num:9,lesson:"5A — Occupations",tipo:"aula"},
    {num:10,lesson:"5C — WH Questions",tipo:"aula"},
    {num:11,lesson:"6A — At the Café",tipo:"aula"},
    {num:12,lesson:"6C — Prepositions of Place",tipo:"aula"},
    {num:13,lesson:"AVALIAÇÃO 1 a 6",tipo:"avaliacao"},
    {num:14,lesson:"7A — The Places in the City",tipo:"aula"},
    {num:15,lesson:"7C — What's Everyone Doing?",tipo:"aula"},
    {num:16,lesson:"8A — Family",tipo:"aula"},
    {num:17,lesson:"8C — This Is My Father",tipo:"aula"},
    {num:18,lesson:"9A — You Are Going To...",tipo:"aula"},
    {num:19,lesson:"9C — What Are You Going to Do This Weekend?",tipo:"aula"},
    {num:20,lesson:"10A — At the Travel Agency",tipo:"aula"},
    {num:21,lesson:"10B — Seasons, Days and Months",tipo:"aula"},
    {num:22,lesson:"11A — I was so nervous!",tipo:"aula"},
    {num:23,lesson:"11C — Yesterday was a very special day!",tipo:"aula"},
    {num:24,lesson:"AVALIAÇÃO 7 a 12",tipo:"avaliacao"},
  ],
  A2: [
    {num:1,lesson:"Unit 1-1A: Talk about where you're from (p.10-11)",tipo:"aula"},
    {num:2,lesson:"Unit 1-1C: Ask for and give information (p.14)",tipo:"aula"},
    {num:3,lesson:"Unit 2-2A: Talk about jobs (p.20-21)",tipo:"aula"},
    {num:4,lesson:"Unit 2-2C: Ask for things and reply (p.24)",tipo:"aula"},
    {num:5,lesson:"Unit 3-3A: Talk about your daily routine (p.30-31)",tipo:"aula"},
    {num:6,lesson:"Unit 3-3C: Make arrangements (p.34)",tipo:"aula"},
    {num:7,lesson:"Unit 4-4A: Talk about food you like (p.40-41)",tipo:"aula"},
    {num:8,lesson:"Unit 4-4C: Make a reservation (p.44)",tipo:"aula"},
    {num:9,lesson:"AVALIAÇÃO 1 A 4",tipo:"avaliacao"},
    {num:10,lesson:"Unit 5-5A: Describe a place (p.50-51)",tipo:"aula"},
    {num:11,lesson:"Unit 5-5C: Ask for and give directions (p.54)",tipo:"aula"},
    {num:12,lesson:"Unit 6-6A: Talk about your family's past (p.60-61)",tipo:"aula"},
    {num:13,lesson:"Unit 6-6C: Talk on the phone (p.64)",tipo:"aula"},
    {num:14,lesson:"Unit 7-7A: Talk about a trip (p.70-71)",tipo:"aula"},
    {num:15,lesson:"Unit 7-7C: Say excuse me and sorry (p.74)",tipo:"aula"},
    {num:16,lesson:"Unit 8-8A: Talk about abilities (p.80-81)",tipo:"aula"},
    {num:17,lesson:"Unit 8-8C: Talk about health (p.84)",tipo:"aula"},
    {num:18,lesson:"AVALIAÇÃO 5 A 8",tipo:"avaliacao"},
    {num:19,lesson:"Unit 9-9A: Talk about what's happening now (p.90-91)",tipo:"aula"},
    {num:20,lesson:"Unit 9-9C: Shop for clothes (p.94)",tipo:"aula"},
    {num:21,lesson:"Unit 10-10A: Compare things (p.100-101)",tipo:"aula"},
    {num:22,lesson:"Unit 10-10C: Ask for and offer help (p.104)",tipo:"aula"},
    {num:23,lesson:"Unit 11-11A: Talk about experiences (p.110-111)",tipo:"aula"},
    {num:24,lesson:"Unit 11-11C: Respond to an opinion (p.114)",tipo:"aula"},
    {num:25,lesson:"Unit 12-12A: Talk about travel plans (p.120-121)",tipo:"aula"},
    {num:26,lesson:"Unit 12-12C: Use language for travel (p.124)",tipo:"aula"},
    {num:27,lesson:"AVALIAÇÃO 9 A 12",tipo:"avaliacao"},
  ],
  B1: [
    {num:1,lesson:"Unit 1-1A: Do you play any sports? (p.4)",tipo:"aula"},
    {num:2,lesson:"Unit 1-1C: It was really nice to meet you (p.6)",tipo:"aula"},
    {num:3,lesson:"Unit 2-2A: We had an adventure (p.10)",tipo:"aula"},
    {num:4,lesson:"Unit 2-2C: What time's the next train? (p.12)",tipo:"aula"},
    {num:5,lesson:"Unit 3-3A: Have you ever helped a stranger? (p.16)",tipo:"aula"},
    {num:6,lesson:"Unit 3-3C: Do you have anything cheaper? (p.18)",tipo:"aula"},
    {num:7,lesson:"Unit 4-4A: I'm going to the hairdresser's tomorrow (p.22)",tipo:"aula"},
    {num:8,lesson:"Unit 4-4C: Are you doing anything on Wednesday? (p.24)",tipo:"aula"},
    {num:9,lesson:"AVALIAÇÃO 3 E 4",tipo:"avaliacao"},
    {num:10,lesson:"Unit 5-5A: I have to work long hours (p.28)",tipo:"aula"},
    {num:11,lesson:"Unit 5-5C: I'll finish things here, if you want (p.30)",tipo:"aula"},
    {num:12,lesson:"Unit 6-6A: You should have a break (p.34)",tipo:"aula"},
    {num:13,lesson:"Unit 6-6C: What do you think I should do? (p.36)",tipo:"aula"},
    {num:14,lesson:"Unit 7-7A: I'm the happiest I've ever been (p.40)",tipo:"aula"},
    {num:15,lesson:"Unit 7-7C: It hurts all the time (p.42)",tipo:"aula"},
    {num:16,lesson:"Unit 8-8A: My favourite book is based on a true story (p.46)",tipo:"aula"},
    {num:17,lesson:"Unit 8-8C: I'm really sorry I haven't called (p.48)",tipo:"aula"},
    {num:18,lesson:"AVALIAÇÃO 7 E 8",tipo:"avaliacao"},
    {num:19,lesson:"Unit 9-9A: If I don't pass this exam, I won't be very happy (p.52)",tipo:"aula"},
    {num:20,lesson:"Unit 9-9C: Who's calling, please? (p.54)",tipo:"aula"},
    {num:21,lesson:"Unit 10-10A: Would you do the right thing? (p.58)",tipo:"aula"},
    {num:22,lesson:"Unit 10-10C: Asking for help online (p.60)",tipo:"aula"},
    {num:23,lesson:"Unit 11-11A: It's a robot that looks like a human (p.64)",tipo:"aula"},
    {num:24,lesson:"Unit 11-11C: Discussing important inventions (p.66)",tipo:"aula"},
    {num:25,lesson:"Unit 12-12A: I had always thought they were dangerous (p.70)",tipo:"aula"},
    {num:26,lesson:"Unit 12-12C: I'm pretty sure it's Japanese (p.72)",tipo:"aula"},
    {num:27,lesson:"AVALIAÇÃO 11 E 12",tipo:"avaliacao"},
  ],
  B2: [],
};

const SK = 'ewd_admin_v1';
function loadLocal(){try{return JSON.parse(localStorage.getItem(SK))||{};}catch{return {};}}
function saveLocal(d){localStorage.setItem(SK,JSON.stringify(d));}
function todayKey(){return new Date().toISOString().slice(0,10);}
function fmtMoney(v){return(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2});}
function fmtDate(iso){if(!iso)return'';const[,m,d]=iso.split('-');return`${d}/${m}`;}
function fmtDateFull(iso){if(!iso)return'';return new Date(iso+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'});}
function getCalToken(){return localStorage.getItem('ewd_gcal_token')||'';}
function getFinStatus(nome,venc,mesIdx,pagStore){
  const mes=MESES[mesIdx];const rec=pagStore[mes]?.[nome];
  if(rec?.dataPgto)return'pago';if(rec?.manualAguardando)return'aguardando';
  if(mesIdx<MES_ATUAL_IDX)return'atrasado';if(mesIdx>MES_ATUAL_IDX)return'futuro';
  return new Date().getDate()>venc?'atrasado':'aguardando';
}

const STATUS_META={
  presente:    {label:'Presente',      color:'#1d9e75',bg:'#f0faf5',icon:'✅'},
  falta:       {label:'Falta',         color:'#e53935',bg:'#fdf3f3',icon:'❌'},
  rep_pendente:{label:'Rep. Pendente', color:'#ff6a00',bg:'#fff6f0',icon:'🔄'},
  rep_feita:   {label:'Rep. Feita',    color:'#5c6bc0',bg:'#f4f3fc',icon:'✔️'},
  rep_falta:   {label:'Rep. c/ Falta',color:'#f9a825',bg:'#fefcf0',icon:'⚠️'},
};

const TABS=[
  {id:'dashboard',  label:'🏠 Dashboard',  icon:'🏠'},
  {id:'alunos',     label:'👤 Alunos',      icon:'👤'},
  {id:'agenda',     label:'📅 Agenda',     icon:'📅'},
  {id:'presenca',   label:'👥 Presença',    icon:'👥'},
  {id:'financeiro', label:'💰 Financeiro', icon:'💰'},
  {id:'despesas',   label:'💸 Despesas',   icon:'💸'},
  {id:'diario',     label:'📖 Diário',     icon:'📖'},
  {id:'notas',      label:'📝 Notas',      icon:'📝'},
  {id:'empresa',    label:'🏫 Empresa',    icon:'🏫'},
];

export default function Admin({user,onLogout}){
  const navigate=useNavigate();
  const [activeTab,setActiveTab]=useState('dashboard');
  const [students,setStudents]=useState([]);
  const [loading,setLoading]=useState(true);
  const [local,setLocal]=useState(loadLocal);

  useEffect(()=>{if(user?.email!==ADMIN_EMAIL)navigate('/');},[user]);
  useEffect(()=>{
    fetch('/api/students').then(r=>r.json()).then(d=>setStudents(d.students||[])).finally(()=>setLoading(false));
  },[]);

  const persist=useCallback((updater)=>{
    setLocal(prev=>{const next=updater(prev);saveLocal(next);return next;});
  },[]);

  if(user?.email!==ADMIN_EMAIL)return null;

  return(
    <div className="admin-page">
      <Navbar user={user} student={null} onLogout={onLogout}/>
      <main className="admin-content">
        <div className="admin-header">
          <div>
            <div className="admin-badge">👑 Admin</div>
            <h1 className="admin-title">English With Denise</h1>
            <p className="admin-sub">Painel de Gestão da Escola</p>
          </div>
          <div className="admin-date-badge">
            {new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}
          </div>
        </div>
        <div className="admin-tabs">
          {TABS.map(t=>(
            <button key={t.id} className={`admin-tab-btn ${activeTab===t.id?'active':''}`} onClick={()=>setActiveTab(t.id)}>
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label.replace(/^\S+\s/,'')}</span>
            </button>
          ))}
        </div>
        {activeTab==='dashboard'  && <TabDashboard students={students} loading={loading} local={local}/>}
        {activeTab==='alunos'     && <TabAlunos students={students} loading={loading} navigate={navigate}/>}
        {activeTab==='agenda'     && <TabAgenda/>}
        {activeTab==='presenca'   && <TabPresenca students={students} loading={loading} local={local} persist={persist} navigate={navigate}/>}
        {activeTab==='financeiro' && <TabFinanceiro local={local} persist={persist}/>}
        {activeTab==='despesas'   && <TabDespesas local={local} persist={persist}/>}
        {activeTab==='diario'     && <TabDiario students={students} loading={loading} local={local} persist={persist}/>}
        {activeTab==='notas'      && <TabNotas students={students} loading={loading} local={local} persist={persist}/>}
        {activeTab==='empresa'    && <TabEmpresa local={local} persist={persist}/>}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AULA PICKER — search and select from Agenda de Aulas
// ══════════════════════════════════════════════════════════════════════════════
function AulaPicker({ currentAulaId, currentTitulo, onSelect }) {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || aulas.length > 0) return;
    setLoading(true);
    fetch('/api/aulas')
      .then(r => r.json())
      .then(d => setAulas(d.aulas || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = aulas.filter(a =>
    a.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (a.nivel || '').toLowerCase().includes(search.toLowerCase()) ||
    String(a.numero).includes(search)
  );

  return (
    <div className="aula-picker">
      {/* Current selection */}
      <div className="aula-picker-current" onClick={() => setOpen(!open)}>
        {currentTitulo
          ? <><span className="aula-picker-check">✓</span><span className="aula-picker-sel-title">{currentTitulo}</span></>
          : <span className="aula-picker-placeholder">Selecionar aula...</span>
        }
        <span className="aula-picker-chevron">{open ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="aula-picker-dropdown">
          <input
            className="aula-picker-search"
            placeholder="🔍 Buscar aula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          {loading && <div className="aula-picker-loading">Carregando aulas...</div>}
          <div className="aula-picker-list">
            {filtered.map(a => (
              <div
                key={a.id}
                className={`aula-picker-item ${currentAulaId === a.id ? 'active' : ''}`}
                onClick={() => { onSelect(a); setOpen(false); setSearch(''); }}
              >
                <span className="aula-picker-num">#{a.numero}</span>
                <div className="aula-picker-info">
                  <div className="aula-picker-title">{a.titulo}</div>
                  {a.dataAula && (
                    <div className="aula-picker-date">
                      {new Date(a.dataAula + 'T12:00:00').toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' })}
                    </div>
                  )}
                </div>
                {a.nivel && <span className="aula-picker-nivel" style={{ background: LEVEL_COLORS[a.nivel]||'#aaa', color:'#fff' }}>{a.nivel}</span>}
                {currentAulaId === a.id && <span style={{ color:'#ff6a00', fontWeight:700 }}>✓</span>}
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="aula-picker-loading">Nenhuma aula encontrada</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ALUNOS — edita dados via Notion
// ══════════════════════════════════════════════════════════════════════════════
const ALL_BADGES_ADM = [
  { id:'spectacular_attendance', name:'Spectacular Attendance', icon:'⭐', bg:'#fff3cd' },
  { id:'always_there',           name:'Always There',           icon:'🎯', bg:'#f0f0f0' },
  { id:'on_time',                name:'On Time, Every Time',    icon:'📅', bg:'#f5ede6' },
  { id:'homework_champion',      name:'Homework Champion',      icon:'📝', bg:'#fff1e8' },
  { id:'one_step_ahead',         name:'One Step Ahead',         icon:'⚡', bg:'#fff1e8' },
  { id:'book_lover',             name:'Book Lover',             icon:'📖', bg:'#e1f5ee' },
  { id:'no_shame',               name:'No Shame!',              icon:'🎙️', bg:'#fbeaf0' },
  { id:'lion_heart',             name:'Lion Heart',             icon:'🦁', bg:'#fbeaf0' },
  { id:'titanium_mind',          name:'Titanium Mind',          icon:'🧠', bg:'#e6f1fb' },
  { id:'level_up',               name:'Level Up!',              icon:'🏅', bg:'#fff3cd' },
  { id:'on_fire',                name:'On Fire',                icon:'🔥', bg:'#fff1e8' },
  { id:'rat_of_month',           name:'Rat of the Month',       icon:'💜', bg:'#eeedfe' },
];

function TabAlunos({ students, loading, navigate }) {
  const [mode, setMode] = useState('individual'); // 'individual' | 'lote'
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(new Set());
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({});
  const [bulkForm, setBulkForm] = useState({
    tituloProximaAula: '', dataProximaAula: '',
    tarefaDaSemana: '', paginasDoLivro: '', tarefaPersonalizada: '',
    meetLink: '', valorMensalidade: '', dataVencimento: '',
  });
  const [bulkFields, setBulkFields] = useState({
    tituloProximaAula: false, dataProximaAula: false,
    tarefaDaSemana: false, paginasDoLivro: false, tarefaPersonalizada: false,
    meetLink: false, valorMensalidade: false, dataVencimento: false,
  });
  const [badges, setBadges] = useState([]);
  const [saving, setSaving] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(null); // {done, total}
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const selectStudent = (s) => {
    setSelected(s);
    setForm({
      tarefaDaSemana: s.tarefaDaSemana || '', paginasDoLivro: s.paginasDoLivro || '',
      tarefaPersonalizada: s.tarefaPersonalizada || '', meetLink: s.meetLink || '',
      tituloProximaAula:   s.tituloProximaAula || '',
      dataProximaAula:     s.dataProximaAula || '',
      classroomLink: s.classroomLink || '', driveLink: s.driveLink || '',
      kamiLink: s.kamiLink || '', valorMensalidade: s.valorMensalidade || '',
      dataVencimento: s.dataVencimento || '', asaasLink: s.asaasLink || '',
      reposicoes: s.reposicoes ?? 0, dataReposicao: s.dataReposicao || '',
      horarioReposicao: s.horarioReposicao || '', nivel: s.nivel || 'A1',
    });
    setBadges(JSON.parse(s.badges || '[]').filter(Boolean));
  };

  const toggleCheck = (id) => {
    setChecked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (checked.size === filtered.length) setChecked(new Set());
    else setChecked(new Set(filtered.map(s => s.id)));
  };

  // Save individual
  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const r = await fetch('/api/update-student', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: selected.id, fields: { ...form, badges: JSON.stringify(badges) } }),
      });
      const d = await r.json();
      if (d.success) showToast('✅ Salvo com sucesso!');
      else showToast('⚠️ Erro: ' + (d.error || 'tente novamente'));
    } catch { showToast('⚠️ Erro de conexão'); }
    setSaving(false);
  };

  // Save bulk — only checked fields
  const saveBulk = async () => {
    const targets = students.filter(s => checked.has(s.id));
    if (targets.length === 0) { showToast('⚠️ Selecione pelo menos um aluno'); return; }
    const activeFields = Object.entries(bulkFields).filter(([, v]) => v).map(([k]) => k);
    if (activeFields.length === 0) { showToast('⚠️ Ative pelo menos um campo para enviar'); return; }

    const payload = {};
    activeFields.forEach(k => { payload[k] = bulkForm[k]; });

    setSaving(true);
    setBulkProgress({ done: 0, total: targets.length });
    let done = 0; const errors = [];
    for (const s of targets) {
      try {
        const r = await fetch('/api/update-student', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: s.id, fields: payload }),
        });
        const d = await r.json();
        if (!d.success) errors.push(s.nome);
      } catch { errors.push(s.nome); }
      done++;
      setBulkProgress({ done, total: targets.length });
      await new Promise(r => setTimeout(r, 300)); // avoid rate limiting
    }
    setSaving(false);
    setBulkProgress(null);
    if (errors.length === 0) showToast(`✅ ${targets.length} aluno${targets.length > 1 ? 's' : ''} atualizado${targets.length > 1 ? 's' : ''}!`);
    else showToast(`⚠️ Erro em: ${errors.join(', ')}`);
  };

  const filtered = students.filter(s =>
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    (s.nivel || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Carregando... ✨</div>;

  const BULK_FIELD_LABELS = [
    { key: 'tarefaDaSemana',    label: '📅 Agenda da semana',       type: 'textarea' },
    { key: 'paginasDoLivro',    label: '📖 Páginas do livro',        type: 'input', ph: 'Ex: p.10-13' },
    { key: 'tarefaPersonalizada',label: '✅ Tarefa personalizada',   type: 'input', ph: 'Ex: Leia o diálogo antes da aula' },
    { key: 'meetLink',          label: '📹 Link Google Meet',        type: 'input', ph: 'https://meet.google.com/...' },
    { key: 'valorMensalidade',  label: '💰 Valor mensalidade',       type: 'input', ph: 'Ex: 220,00' },
    { key: 'dataVencimento',    label: '📆 Vencimento',              type: 'input', ph: 'Ex: 20 de julho' },
  ];

  return (
    <div className="tab-alunos">
      {toast && <div className="alunos-toast">{toast}</div>}

      {/* Mode toggle */}
      <div className="alunos-mode-toggle">
        <button className={`alunos-mode-btn ${mode === 'individual' ? 'active' : ''}`} onClick={() => { setMode('individual'); setChecked(new Set()); }}>
          👤 Individual
        </button>
        <button className={`alunos-mode-btn ${mode === 'lote' ? 'active' : ''}`} onClick={() => { setMode('lote'); setSelected(null); }}>
          📢 Envio em Lote
        </button>
      </div>

      <div className="alunos-layout">

        {/* Sidebar — shared between modes */}
        <div className="alunos-sidebar">
          <input className="admin-search" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 8 }} />

          {mode === 'lote' && (
            <div className="lote-select-all" onClick={toggleAll}>
              <input type="checkbox" readOnly checked={checked.size === filtered.length && filtered.length > 0} style={{ marginRight: 6 }} />
              <span style={{ fontSize: 12, color: '#555' }}>Selecionar todos ({filtered.length})</span>
            </div>
          )}

          <div className="alunos-list">
            {filtered.map(s => (
              <div key={s.id}
                className={`aluno-item ${mode === 'individual' && selected?.id === s.id ? 'active' : ''} ${mode === 'lote' && checked.has(s.id) ? 'checked' : ''}`}
                onClick={() => mode === 'individual' ? selectStudent(s) : toggleCheck(s.id)}
              >
                {mode === 'lote' && (
                  <input type="checkbox" readOnly checked={checked.has(s.id)} style={{ marginRight: 4, flexShrink: 0 }} />
                )}
                <div className="presenca-avatar" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa', width: 28, height: 28, fontSize: 12, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{s.nome[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="aluno-nome">{s.nome}</div>
                  <div className="aluno-email">{s.nivel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── INDIVIDUAL MODE ── */}
        {mode === 'individual' && (
          selected ? (
            <div className="alunos-form">
              <div className="alunos-form-header">
                <div>
                  <div className="alunos-form-title">{selected.nome}</div>
                  <div className="alunos-form-sub">{selected.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="adm-preview-small" onClick={() => navigate(`/admin/preview/${selected.email}`)}>👁️ Ver como aluno</button>
                  <button className="adm-save-small" onClick={save} disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar'}</button>
                </div>
              </div>

              <div className="alunos-section">
                <div className="alunos-section-title">🎓 Nível</div>
                <div className="level-row">
                  {['A1','A2','B1','B2','P1'].map(lvl => (
                    <button key={lvl} className={`level-pill-btn ${form.nivel === lvl ? 'active' : ''}`}
                      style={form.nivel === lvl ? { background: LEVEL_COLORS[lvl], color: '#fff', borderColor: LEVEL_COLORS[lvl] } : {}}
                      onClick={() => setForm(f => ({ ...f, nivel: lvl }))}>{lvl}</button>
                  ))}
                </div>
              </div>

              <div className="alunos-section">
                <div className="alunos-section-title">🗓️ Next Class</div>
                <AulaPicker
                  currentAulaId={selected?.proximaAula?.id || ''}
                  currentTitulo={selected?.proximaAula?.titulo || ''}
                  onSelect={(aula) => {
                    setForm(f => ({ ...f, proximaAulaId: aula.id, dataProximaAula: aula.dataAula || '' }));
                    setSelected(s => ({ ...s, proximaAula: aula }));
                  }}
                />
              </div>
              <div className="alunos-section">
                <div className="alunos-section-title">📅 Agenda da semana</div>
                <div className="alunos-field">
                  <label className="alunos-label">Itens <span style={{ color: '#aaa', fontWeight: 400 }}>— um por linha</span></label>
                  <textarea className="alunos-textarea" rows={4} value={form.tarefaDaSemana} onChange={e => setForm(f => ({ ...f, tarefaDaSemana: e.target.value }))} placeholder="Ex: Unit 2 — 2A: We had an adventure&#10;Rever vocabulário Unit 1" />
                </div>
                <div className="alunos-grid2">
                  <div className="alunos-field">
                    <label className="alunos-label">Páginas do livro</label>
                    <input className="alunos-input" value={form.paginasDoLivro} onChange={e => setForm(f => ({ ...f, paginasDoLivro: e.target.value }))} placeholder="Ex: p.10-13" />
                  </div>
                  <div className="alunos-field">
                    <label className="alunos-label">Tarefa personalizada</label>
                    <input className="alunos-input" value={form.tarefaPersonalizada} onChange={e => setForm(f => ({ ...f, tarefaPersonalizada: e.target.value }))} placeholder="Ex: Leia o diálogo antes da aula" />
                  </div>
                </div>
              </div>

              <div className="alunos-section">
                <div className="alunos-section-title">🔗 Links</div>
                <div className="alunos-grid2">
                  {[['meetLink','Google Meet','https://meet.google.com/...'],['driveLink','Google Drive','https://drive.google.com/...'],['classroomLink','Classroom','https://classroom.google.com/...'],['kamiLink','KAMI','https://app.kami.com/...']].map(([key, label, ph]) => (
                    <div key={key} className="alunos-field">
                      <label className="alunos-label">{label}</label>
                      <input className="alunos-input" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="alunos-section">
                <div className="alunos-section-title">💳 Financeiro</div>
                <div className="alunos-grid2">
                  <div className="alunos-field"><label className="alunos-label">Valor mensalidade</label><input className="alunos-input" value={form.valorMensalidade} onChange={e => setForm(f => ({ ...f, valorMensalidade: e.target.value }))} placeholder="Ex: 220,00" /></div>
                  <div className="alunos-field"><label className="alunos-label">Vencimento</label><input className="alunos-input" value={form.dataVencimento} onChange={e => setForm(f => ({ ...f, dataVencimento: e.target.value }))} placeholder="Ex: 20 de julho" /></div>
                </div>
                <div className="alunos-field" style={{ marginTop: 10 }}>
                  <label className="alunos-label">Link ASAAS individual</label>
                  <input className="alunos-input" value={form.asaasLink} onChange={e => setForm(f => ({ ...f, asaasLink: e.target.value }))} placeholder="https://www.asaas.com/c/..." />
                </div>
              </div>

              <div className="alunos-section">
                <div className="alunos-section-title">🔄 Reposição</div>
                <div className="alunos-grid3">
                  <div className="alunos-field"><label className="alunos-label">Qtd. pendentes</label><input className="alunos-input" type="number" min="0" value={form.reposicoes} onChange={e => setForm(f => ({ ...f, reposicoes: parseInt(e.target.value) || 0 }))} /></div>
                  <div className="alunos-field"><label className="alunos-label">Data</label><input className="alunos-input" type="date" value={form.dataReposicao} onChange={e => setForm(f => ({ ...f, dataReposicao: e.target.value }))} /></div>
                  <div className="alunos-field"><label className="alunos-label">Horário</label><input className="alunos-input" value={form.horarioReposicao} onChange={e => setForm(f => ({ ...f, horarioReposicao: e.target.value }))} placeholder="Ex: 19h30" /></div>
                </div>
              </div>

              <div className="alunos-section">
                <div className="alunos-section-title">🏅 Badges</div>
                <div className="badges-grid-adm">
                  {ALL_BADGES_ADM.map(b => {
                    const on = badges.includes(b.id);
                    return (
                      <div key={b.id} className={`badge-toggle-adm ${on ? 'on' : ''}`} onClick={() => setBadges(prev => on ? prev.filter(x => x !== b.id) : [...prev, b.id])}>
                        <div className="badge-icon-adm" style={{ background: on ? b.bg : '#f0ede8' }}>{b.icon}</div>
                        <span className="badge-name-adm">{b.name}</span>
                        <div className={`toggle-adm ${on ? 'on' : ''}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <button className="adm-save-bottom-btn" onClick={save} disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar todas as alterações'}</button>
            </div>
          ) : (
            <div className="alunos-empty">
              <div style={{ fontSize: 40, marginBottom: 12 }}>👈</div>
              <div style={{ fontWeight: 600, color: '#111', marginBottom: 6 }}>Selecione um aluno</div>
              <div style={{ color: '#aaa', fontSize: 13 }}>Clique em um aluno para editar agenda, financeiro, links e badges</div>
            </div>
          )
        )}

        {/* ── LOTE MODE ── */}
        {mode === 'lote' && (
          <div className="alunos-form">
            <div className="alunos-form-header">
              <div>
                <div className="alunos-form-title">Envio em Lote</div>
                <div className="alunos-form-sub">
                  {checked.size === 0 ? 'Nenhum aluno selecionado' : `${checked.size} aluno${checked.size > 1 ? 's' : ''} selecionado${checked.size > 1 ? 's' : ''}`}
                </div>
              </div>
              <button className="adm-save-small" onClick={saveBulk} disabled={saving || checked.size === 0}>
                {saving ? `Enviando ${bulkProgress?.done}/${bulkProgress?.total}...` : `📢 Enviar para ${checked.size} aluno${checked.size !== 1 ? 's' : ''}`}
              </button>
            </div>

            {/* Progress bar */}
            {bulkProgress && (
              <div className="lote-progress">
                <div className="lote-progress-bar">
                  <div className="lote-progress-fill" style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }} />
                </div>
                <span className="lote-progress-label">{bulkProgress.done} de {bulkProgress.total}</span>
              </div>
            )}

            <div className="lote-hint">
              <span>💡</span>
              <span>Ative apenas os campos que deseja atualizar. Os campos desativados não serão alterados nos alunos selecionados.</span>
            </div>

            {/* Bulk fields with toggle */}
            {BULK_FIELD_LABELS.map(({ key, label, type, ph }) => (
              <div key={key} className={`lote-field-block ${bulkFields[key] ? 'active' : ''}`}>
                <div className="lote-field-header" onClick={() => setBulkFields(f => ({ ...f, [key]: !f[key] }))}>
                  <div className={`lote-toggle ${bulkFields[key] ? 'on' : ''}`} />
                  <span className="lote-field-label">{label}</span>
                  {!bulkFields[key] && <span className="lote-field-off">desativado</span>}
                </div>
                {bulkFields[key] && (
                  type === 'textarea'
                    ? <textarea className="alunos-textarea" rows={4} value={bulkForm[key]} onChange={e => setBulkForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Ex: Unit 2 — 2A: We had an adventure&#10;Rever vocabulário Unit 1" />
                    : <input className="alunos-input" value={bulkForm[key]} onChange={e => setBulkForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} />
                )}
              </div>
            ))}

            {checked.size > 0 && (
              <div className="lote-selected-preview">
                <div className="lote-selected-title">Será enviado para:</div>
                <div className="lote-selected-names">
                  {students.filter(s => checked.has(s.id)).map(s => (
                    <span key={s.id} className="lote-name-chip">
                      {s.nome.split(' ')[0]}
                      <span onClick={() => toggleCheck(s.id)} style={{ marginLeft: 4, cursor: 'pointer', opacity: .6 }}>✕</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="adm-save-bottom-btn" onClick={saveBulk} disabled={saving || checked.size === 0}>
              {saving ? `Enviando ${bulkProgress?.done || 0}/${bulkProgress?.total || 0}...` : `📢 Enviar para ${checked.size} aluno${checked.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: AGENDA
// ══════════════════════════════════════════════════════════════════════════════
function TabAgenda(){
  const [events,setEvents]=useState([]);
  const [calLoading,setCalLoading]=useState(false);
  const [calError,setCalError]=useState('');
  const [selectedDate,setSelectedDate]=useState(todayKey());
  const [view,setView]=useState('day');

  const fetchEvents=useCallback(async(dateStr)=>{
    const token=getCalToken();
    if(!token){setCalError('no_token');return;}
    setCalLoading(true);setCalError('');
    try{
      const date=new Date(dateStr+'T00:00:00');
      let timeMin,timeMax;
      if(view==='week'){
        const day=date.getDay();
        const mon=new Date(date);mon.setDate(date.getDate()-(day===0?6:day-1));
        const sun=new Date(mon);sun.setDate(mon.getDate()+6);
        timeMin=mon.toISOString();timeMax=new Date(sun.setHours(23,59,59,999)).toISOString();
      }else{
        timeMin=new Date(date.setHours(0,0,0,0)).toISOString();
        timeMax=new Date(date.setHours(23,59,59,999)).toISOString();
      }
      const res=await fetch('/api/calendar',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({timeMin,timeMax})});
      if(res.status===401){setCalError('expired');return;}
      const data=await res.json();
      if(data.error){setCalError(data.error);return;}
      setEvents(data.events||[]);
    }catch(e){setCalError(e.message);}
    finally{setCalLoading(false);}
  },[view]);

  useEffect(()=>{fetchEvents(selectedDate);},[selectedDate,view]);

  const changeDay=(delta)=>{
    const d=new Date(selectedDate+'T12:00:00');d.setDate(d.getDate()+delta);
    setSelectedDate(d.toISOString().slice(0,10));
  };
  const fmtTime=(ev)=>{
    if(ev.start?.date)return'Dia inteiro';
    const s=ev.start?.dateTime?new Date(ev.start.dateTime):null;
    const e=ev.end?.dateTime?new Date(ev.end.dateTime):null;
    if(!s)return'';
    const fmt=t=>t.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return e?`${fmt(s)} – ${fmt(e)}`:fmt(s);
  };
  const isClass=(t='')=>t.toLowerCase().includes('english class')||t.toLowerCase().includes('(rep)');
  const isRep=(t='')=>t.toLowerCase().includes('(rep)');
  const isPres=(t='')=>t.toLowerCase().includes('(pres)');

  if(calError==='no_token'||calError==='expired')return(
    <div className="cal-error-box">
      <div className="cal-error-icon">🔐</div>
      <div className="cal-error-title">{calError==='expired'?'Sessão expirada':'Agenda não conectada'}</div>
      <p className="cal-error-text">{calError==='expired'?'Clique abaixo para reconectar.':'Faça logout e login novamente.'}</p>
      <button className="cal-reauth-btn" onClick={()=>window._gCalClient?.requestAccessToken()}>🔄 Reconectar</button>
    </div>
  );

  const groupedByDate=events.reduce((acc,ev)=>{
    const d=(ev.start?.dateTime||ev.start?.date||'').slice(0,10);
    if(!acc[d])acc[d]=[];acc[d].push(ev);return acc;
  },{});

  return(
    <div className="tab-agenda">
      <div className="cal-controls">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={()=>changeDay(view==='week'?-7:-1)}>‹</button>
          <button className="cal-today-btn" onClick={()=>setSelectedDate(todayKey())}>Hoje</button>
          <button className="cal-nav-btn" onClick={()=>changeDay(view==='week'?7:1)}>›</button>
        </div>
        <div className="cal-date-label">{new Date(selectedDate+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</div>
        <div className="cal-view-toggle">
          <button className={`cal-view-btn ${view==='day'?'active':''}`} onClick={()=>setView('day')}>Dia</button>
          <button className={`cal-view-btn ${view==='week'?'active':''}`} onClick={()=>setView('week')}>Semana</button>
        </div>
        <button className="cal-refresh-btn" onClick={()=>fetchEvents(selectedDate)}>↻</button>
      </div>
      {!calLoading&&events.length>0&&(
        <div className="cal-summary">
          <span className="cal-chip total">{events.length} eventos</span>
          <span className="cal-chip aulas">{events.filter(e=>isClass(e.summary)).length} aulas</span>
          <span className="cal-chip reps">{events.filter(e=>isRep(e.summary)).length} reposições</span>
        </div>
      )}
      {calLoading&&<div className="cal-loading">Carregando agenda... 📅</div>}
      {calError&&!calLoading&&<div className="cal-inline-error">⚠️ {calError}</div>}
      {!calLoading&&view==='day'&&(
        <div className="cal-day-list">
          {events.length===0&&<div className="cal-empty">Nenhum evento 🎉</div>}
          {events.map(ev=>{
            const title=ev.summary||'(sem título)';
            const rep=isRep(title);const pres=isPres(title);const cls=isClass(title);
            let accent='#e0dbd4';
            if(rep)accent='#e53935';else if(pres)accent='#9c27b0';else if(cls)accent='#ff6a00';
            return(
              <div key={ev.id} className="cal-event" style={{borderLeftColor:accent}}>
                <div className="cal-event-time">{fmtTime(ev)}</div>
                <div className="cal-event-title" style={{color:rep?'#e53935':pres?'#9c27b0':cls?'#ff6a00':'#111'}}>{title}</div>
                {rep&&<span className="cal-event-tag rep">REP</span>}
                {pres&&<span className="cal-event-tag pres">PRES</span>}
              </div>
            );
          })}
        </div>
      )}
      {!calLoading&&view==='week'&&(
        <div className="cal-week">
          {Object.entries(groupedByDate).sort().map(([date,evs])=>(
            <div key={date} className="cal-week-day">
              <div className="cal-week-day-header">
                {new Date(date+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'})}
                <span className="cal-week-count">{evs.length}</span>
              </div>
              {evs.map(ev=>{
                const title=ev.summary||'';const rep=isRep(title);const cls=isClass(title);
                return(
                  <div key={ev.id} className="cal-event compact" style={{borderLeftColor:rep?'#e53935':cls?'#ff6a00':'#e0dbd4'}}>
                    <div className="cal-event-time">{fmtTime(ev)}</div>
                    <div className="cal-event-title" style={{color:rep?'#e53935':cls?'#ff6a00':'#111',fontSize:13}}>{title}</div>
                  </div>
                );
              })}
            </div>
          ))}
          {Object.keys(groupedByDate).length===0&&<div className="cal-empty">Sem eventos esta semana 🎉</div>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: PRESENÇA
// ══════════════════════════════════════════════════════════════════════════════
function TabPresenca({students,loading,local,persist,navigate}){
  const [view,setView]=useState('hoje');
  const [search,setSearch]=useState('');
  const [filterStatus,setFilterStatus]=useState('todos');
  const [histDate,setHistDate]=useState(todayKey());
  const [histAluno,setHistAluno]=useState('');
  const [expandedId,setExpandedId]=useState(null);
  const today=todayKey();

  const getStatus=(id,date=today)=>local.presenca?.[date]?.[id]||null;
  const setStatus=(id,status,date=today)=>{
    persist(prev=>({...prev,presenca:{...prev.presenca,[date]:{...(prev.presenca?.[date]||{}),[id]:status}}}));
  };

  const allDates=Object.keys(local.presenca||{}).sort().reverse();
  const getStudentHistory=(id)=>allDates.map(date=>({date,status:local.presenca?.[date]?.[id]||null})).filter(r=>r.status);
  const getDateSummary=(date)=>{const dd=local.presenca?.[date]||{};return students.map(s=>({student:s,status:dd[s.id]||null}));};

  const STATUS_BTNS=[
    {key:'presente',    emoji:'✅',title:'Presente'},
    {key:'falta',       emoji:'❌',title:'Falta'},
    {key:'rep_pendente',emoji:'🔄',title:'Rep. Pendente'},
    {key:'rep_feita',   emoji:'✔️',title:'Rep. Feita'},
    {key:'rep_falta',   emoji:'⚠️',title:'Rep. c/ Falta'},
  ];

  const todayCounts=students.reduce((acc,s)=>{
    const st=getStatus(s.id)||'sem_registro';acc[st]=(acc[st]||0)+1;return acc;
  },{});

  const filteredStudents=students.filter(s=>{
    const match=s.nome.toLowerCase().includes(search.toLowerCase());
    if(!match)return false;
    if(filterStatus==='todos')return true;
    if(filterStatus==='sem_registro')return!getStatus(s.id);
    return getStatus(s.id)===filterStatus;
  });

  if(loading)return<div className="admin-loading">Carregando... ✨</div>;

  return(
    <div className="tab-presenca">
      <div className="presenca-view-toggle">
        <button className={`pv-btn ${view==='hoje'?'active':''}`} onClick={()=>setView('hoje')}>📅 Registro do Dia</button>
        <button className={`pv-btn ${view==='historico'?'active':''}`} onClick={()=>setView('historico')}>🗂️ Histórico</button>
      </div>

      {view==='hoje'&&(
        <>
          <div className="presenca-summary">
            {[['green','Presentes','presente'],['red','Faltas','falta'],['orange','Rep. Pend.','rep_pendente'],['purple','Rep. Feita','rep_feita'],['yellow','Rep. c/ Falta','rep_falta'],['gray','Sem registro','sem_registro']].map(([cls,label,key])=>(
              <div key={key} className={`presenca-stat ${cls}`} onClick={()=>setFilterStatus(key===filterStatus?'todos':key)} style={{cursor:'pointer'}}>
                <span>{todayCounts[key]||0}</span><small>{label}</small>
              </div>
            ))}
          </div>

          {/* Legenda dos emojis */}
          <div className="presenca-legenda">
            {STATUS_BTNS.map(b=>(
              <span key={b.key} className="legenda-item">
                <span>{b.emoji}</span> {b.title}
              </span>
            ))}
            <span className="legenda-item"><span>👁️</span> Ver aluno</span>
          </div>

          <div className="presenca-filters">
            <input className="admin-search" placeholder="🔍 Buscar aluno..." value={search} onChange={e=>setSearch(e.target.value)}/>
            <div className="filter-chips">
              {[['todos','Todos'],['sem_registro','⬜ Sem registro'],['presente','✅ Presentes'],['falta','❌ Faltas'],['rep_pendente','🔄 Rep.']].map(([key,label])=>(
                <button key={key} className={`chip ${filterStatus===key?'active':''}`} onClick={()=>setFilterStatus(key)}>{label}</button>
              ))}
            </div>
          </div>

          <div className="presenca-list">
            {filteredStudents.map(s=>{
              const st=getStatus(s.id);const meta=st?STATUS_META[st]:null;
              const hist=getStudentHistory(s.id);
              const faltas=hist.filter(h=>h.status==='falta'||h.status==='rep_falta').length;
              const expanded=expandedId===s.id;
              return(
                <div key={s.id} className={`presenca-row ${st||'sem-registro'}`}>
                  <div className="presenca-info" onClick={()=>setExpandedId(expanded?null:s.id)} style={{cursor:'pointer'}}>
                    <div className="presenca-avatar" style={{background:LEVEL_COLORS[s.nivel]||'#aaa'}}>{s.nome[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="presenca-nome">{s.nome}</div>
                      <div className="presenca-nivel">
                        <span className="nivel-badge" style={{background:LEVEL_COLORS[s.nivel]||'#aaa'}}>{s.nivel}</span>
                        {meta&&<span className="status-label" style={{color:meta.color}}>{meta.icon} {meta.label}</span>}
                        {faltas>0&&<span className="falta-count">{faltas} falta{faltas>1?'s':''}</span>}
                      </div>
                      {expanded&&(
                        <div className="presenca-hist-inline">
                          {hist.length===0
                            ?<span className="hist-empty">Sem histórico ainda</span>
                            :hist.map(h=>{const m=STATUS_META[h.status];return(
                              <div key={h.date} className="hist-row">
                                <span className="hist-date">{fmtDateFull(h.date)}</span>
                                <span className="hist-badge" style={{background:m?.bg,color:m?.color}}>{m?.icon} {m?.label}</span>
                              </div>
                            );})
                          }
                        </div>
                      )}
                    </div>
                    <span className="expand-chevron">{expanded?'▲':'▼'}</span>
                  </div>
                  <div className="presenca-actions">
                    {STATUS_BTNS.map(btn=>(
                      <button key={btn.key} className={`presenca-btn ${st===btn.key?'active':''}`}
                        style={st===btn.key?{background:STATUS_META[btn.key].color,color:'#fff',borderColor:STATUS_META[btn.key].color}:{}}
                        onClick={()=>setStatus(s.id,st===btn.key?null:btn.key)} title={btn.title}>
                        {btn.emoji}
                      </button>
                    ))}
                    <button className="presenca-btn view-btn" onClick={()=>navigate(`/admin/preview/${s.email}`)} title="Ver como aluno">👁️</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view==='historico'&&(
        <div className="hist-panel">
          <div className="hist-filters">
            <div className="hist-filter-group">
              <label className="hist-label">📅 Ver por data</label>
              <input type="date" className="hist-date-input" value={histDate} onChange={e=>{setHistDate(e.target.value);setHistAluno('');}}/>
            </div>
            <div className="hist-divider">ou</div>
            <div className="hist-filter-group">
              <label className="hist-label">👤 Ver por aluno</label>
              <select className="hist-aluno-sel" value={histAluno} onChange={e=>{setHistAluno(e.target.value);setHistDate('');}}>
                <option value="">Selecionar aluno...</option>
                {students.map(s=><option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
          </div>

          {histAluno&&(()=>{
            const s=students.find(s=>s.id===histAluno);
            const hist=getStudentHistory(s?.id);
            const faltas=hist.filter(h=>h.status==='falta'||h.status==='rep_falta').length;
            const presencas=hist.filter(h=>h.status==='presente').length;
            const reps=hist.filter(h=>h.status?.startsWith('rep')).length;
            return(
              <div className="hist-results">
                <div className="hist-student-header">
                  <div className="presenca-avatar" style={{background:LEVEL_COLORS[s?.nivel]||'#aaa',width:48,height:48,fontSize:18,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>{s?.nome[0]}</div>
                  <div><div style={{fontWeight:700,fontSize:16}}>{s?.nome}</div><div style={{fontSize:13,color:'#888',marginTop:2}}>{s?.nivel}</div></div>
                  <div className="hist-mini-stats">
                    <span className="hist-mini green">✅ {presencas} pres.</span>
                    <span className="hist-mini red">❌ {faltas} faltas</span>
                    <span className="hist-mini orange">🔄 {reps} rep.</span>
                  </div>
                </div>
                {hist.length===0?<div className="hist-empty-msg">Nenhum registro para este aluno.</div>
                  :hist.map(h=>{const m=STATUS_META[h.status];return(
                    <div key={h.date} className="hist-item">
                      <span className="hist-item-date">{fmtDateFull(h.date)}</span>
                      <span className="hist-item-badge" style={{background:m?.bg,color:m?.color,border:`1px solid ${m?.color}`}}>{m?.icon} {m?.label}</span>
                    </div>
                  );})}
              </div>
            );
          })()}

          {histDate&&!histAluno&&(()=>{
            const summary=getDateSummary(histDate).filter(r=>r.status);
            const faltas=summary.filter(r=>r.status==='falta'||r.status==='rep_falta').length;
            const presencas=summary.filter(r=>r.status==='presente').length;
            return(
              <div className="hist-results">
                <div className="hist-date-header">
                  <span className="hist-date-title">{fmtDateFull(histDate)}</span>
                  <div className="hist-mini-stats">
                    <span className="hist-mini green">✅ {presencas}</span>
                    <span className="hist-mini red">❌ {faltas}</span>
                    <span className="hist-mini gray">📋 {summary.length}</span>
                  </div>
                </div>
                {summary.length===0?<div className="hist-empty-msg">Nenhum registro para esta data.</div>
                  :summary.map(({student:s,status})=>{const m=STATUS_META[status];return(
                    <div key={s.id} className="hist-item">
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div className="presenca-avatar" style={{background:LEVEL_COLORS[s.nivel]||'#aaa',width:30,height:30,fontSize:12,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,flexShrink:0}}>{s.nome[0]}</div>
                        <span className="hist-item-date">{s.nome}</span>
                      </div>
                      <span className="hist-item-badge" style={{background:m?.bg,color:m?.color,border:`1px solid ${m?.color}`}}>{m?.icon} {m?.label}</span>
                    </div>
                  );})}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: FINANCEIRO
// ══════════════════════════════════════════════════════════════════════════════
function TabFinanceiro({local,persist}){
  const [viewMode,setViewMode]=useState('geral');
  const [mesSel,setMesSel]=useState(MESES[MES_ATUAL_IDX]);
  const [filter,setFilter]=useState('todos');
  const [alunoSel,setAlunoSel]=useState('');
  const [linkInput,setLinkInput]=useState({});
  const [contratoEdit,setContratoEdit]=useState({});
  const pagStore=local.pagamentos||{};
  const contratosStore=local.contratos||{};
  const mesIdx=MESES.indexOf(mesSel);
  const ST_META={pago:{label:'🟢 Em dia',color:'#1d9e75'},atrasado:{label:'🔴 Inadimplente',color:'#e53935'},aguardando:{label:'🟡 Aguardando',color:'#f9a825'},futuro:{label:'⬜ Futuro',color:'#aaa'}};

  const setPag=(nome,action,link='',mesPag=null)=>{
    const m=mesPag||mesSel;
    persist(prev=>{
      const pg={...(prev.pagamentos||{})};
      if(!pg[m])pg[m]={};
      if(action==='pago')pg[m][nome]={dataPgto:todayKey(),link:link||''};
      else if(action==='aguardando')pg[m][nome]={manualAguardando:true};
      else if(action==='link')pg[m][nome]={...pg[m][nome],link};
      else delete pg[m][nome];
      return{...prev,pagamentos:pg};
    });
  };

  const saveContrato=(nome,dataInicio)=>{
    persist(prev=>({...prev,contratos:{...(prev.contratos||{}),[nome]:dataInicio}}));
  };

  const getMesesContrato=(nome)=>{
    const inicio=contratosStore[nome];
    if(!inicio)return[];
    const parts=inicio.split('/');
    if(parts.length!==2)return[];
    const mesNomeInicio=parts[0];
    const anoInicio=parseInt(parts[1]);
    if(!mesNomeInicio||isNaN(anoInicio))return[];
    const mesIdxInicio=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].indexOf(mesNomeInicio);
    if(mesIdxInicio===-1)return[];
    const start=new Date(anoInicio,mesIdxInicio,1);
    const now=new Date();
    const meses=[];
    let cur=new Date(start);
    while(cur<=now){
      const mesNome=MESES[cur.getMonth()];
      const ano=cur.getFullYear();
      const key=`${mesNome}/${ano}`;
      const rec=pagStore[mesNome]?.[nome];
      let st='nao_pago';
      if(rec?.dataPgto)st='pago';
      else if(rec?.manualAguardando)st='aguardando';
      meses.push({mes:mesNome,ano,key,st,dataPgto:rec?.dataPgto||null,link:rec?.link||''});
      cur.setMonth(cur.getMonth()+1);
    }
    return meses.reverse();
  };

  const rows=ALUNOS_FINANCEIRO.map(([nome,valor,venc])=>({nome,valor,venc,st:getFinStatus(nome,venc,mesIdx,pagStore),dataPgto:pagStore[mesSel]?.[nome]?.dataPgto||null,link:pagStore[mesSel]?.[nome]?.link||''}));
  const filtered=filter==='todos'?rows:rows.filter(r=>r.st===filter);
  filtered.sort((a,b)=>{const o={atrasado:0,aguardando:1,futuro:2,pago:3};return o[a.st]-o[b.st]||a.nome.localeCompare(b.nome);});
  const totalRec=rows.filter(r=>r.st==='pago').reduce((s,r)=>s+r.valor,0);
  const totalEsp=rows.reduce((s,r)=>s+r.valor,0);
  const alunoInfo=alunoSel?ALUNOS_FINANCEIRO.find(([n])=>n===alunoSel):null;
  const mesesContrato=alunoSel?getMesesContrato(alunoSel):[];
  const totalPago=mesesContrato.filter(m=>m.st==='pago').length;
  const totalNaoPago=mesesContrato.filter(m=>m.st==='nao_pago').length;

  return(
    <div className="tab-financeiro">
      <div className="presenca-view-toggle" style={{marginBottom:14}}>
        <button className={`pv-btn ${viewMode==='geral'?'active':''}`} onClick={()=>setViewMode('geral')}>📊 Visão Geral</button>
        <button className={`pv-btn ${viewMode==='aluno'?'active':''}`} onClick={()=>setViewMode('aluno')}>👤 Perfil do Aluno</button>
      </div>

      {viewMode==='geral'&&(<>
        <div className="fin-top-bar">
          <select className="fin-mes-sel" value={mesSel} onChange={e=>setMesSel(e.target.value)}>
            {MESES.map(m=><option key={m} value={m}>{m}/{new Date().getFullYear()}</option>)}
          </select>
        </div>
        <div className="fin-stats">
          <div className="fin-stat"><span className="fin-val green">R$ {fmtMoney(totalRec)}</span><small>Recebido</small></div>
          <div className="fin-stat"><span className="fin-val">R$ {fmtMoney(totalEsp)}</span><small>Esperado</small></div>
          <div className="fin-stat"><span className="fin-val green">{rows.filter(r=>r.st==='pago').length}</span><small>Em dia</small></div>
          <div className="fin-stat"><span className="fin-val red">{rows.filter(r=>r.st==='atrasado').length}</span><small>Inadimplentes</small></div>
        </div>
        <div className="filter-chips" style={{marginBottom:12}}>
          {[['todos','Todos'],['atrasado','🔴 Inadimplentes'],['aguardando','🟡 Aguardando'],['pago','🟢 Em dia']].map(([k,l])=>(
            <button key={k} className={`chip ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>{l}</button>
          ))}
        </div>
        <div className="fin-list">
          {filtered.map(r=>{
            const meta=ST_META[r.st];
            const lKey=r.nome;
            return(
              <div key={r.nome} className="fin-row" style={{flexDirection:'column',alignItems:'stretch',gap:8}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                  <div className="fin-info" style={{cursor:'pointer'}} onClick={()=>{setAlunoSel(r.nome);setViewMode('aluno');}}>
                    <div className="fin-nome" style={{color:meta.color}}>{r.nome} <span style={{fontSize:10,color:'#aaa',fontWeight:400}}>→ ver perfil</span></div>
                    <div className="fin-detalhe">R$ {fmtMoney(r.valor)} · vence dia {r.venc}{r.dataPgto?` · pago ${fmtDate(r.dataPgto)}`:''}</div>
                  </div>
                  <div className="fin-btns">
                    {r.st==='pago'
                      ?<button className="fin-btn undo" onClick={()=>setPag(r.nome,'desfazer')}>✕ Desfazer</button>
                      :<>
                        <button className="fin-btn pay" onClick={()=>setPag(r.nome,'pago',linkInput[lKey]||'')}>✓ Pago</button>
                        {r.st!=='aguardando'&&<button className="fin-btn wait" onClick={()=>setPag(r.nome,'aguardando')}>⏳</button>}
                      </>
                    }
                  </div>
                </div>
                {r.st==='pago'&&(
                  <div className="fin-comprovante">
                    {r.link
                      ?<><a href={r.link} target="_blank" rel="noreferrer" className="fin-link-badge">🔗 Ver comprovante</a>
                        <button className="fin-link-remove" onClick={()=>setPag(r.nome,'link','')}>✕</button></>
                      :<div style={{display:'flex',gap:6}}>
                        <input className="fin-link-input" placeholder="Cole o link do comprovante..." value={linkInput[lKey]||''} onChange={e=>setLinkInput(p=>({...p,[lKey]:e.target.value}))}/>
                        <button className="fin-btn pay" style={{whiteSpace:'nowrap'}} onClick={()=>{setPag(r.nome,'link',linkInput[lKey]||'');setLinkInput(p=>({...p,[lKey]:''}));}}>Salvar</button>
                      </div>
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>)}

      {viewMode==='aluno'&&(
        <div className="fin-perfil">
          <div className="fin-field">
            <label className="diario-label">Selecionar aluno</label>
            <select className="diario-select" value={alunoSel} onChange={e=>setAlunoSel(e.target.value)}>
              <option value="">Selecione...</option>
              {ALUNOS_FINANCEIRO.map(([n])=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {alunoSel&&alunoInfo&&(<>
            <div className="fin-contrato-card">
              <div className="fin-contrato-row">
                <div>
                  <div className="fin-nome" style={{color:'#111',marginBottom:4}}>{alunoSel}</div>
                  <div className="fin-detalhe">R$ {fmtMoney(alunoInfo[1])}/mês · vence dia {alunoInfo[2]}</div>
                </div>
                <div className="fin-contrato-stats">
                  <div className="fin-mini-stat green">{totalPago} pago{totalPago!==1?'s':''}</div>
                  <div className="fin-mini-stat red">{totalNaoPago} em aberto</div>
                  <div className="fin-mini-stat gray">{mesesContrato.length} mes{mesesContrato.length!==1?'es':''}</div>
                </div>
              </div>
              <div className="fin-field" style={{marginTop:12}}>
                <label className="diario-label">Início do contrato</label>
                <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                  <select className="fin-mes-sel" style={{flex:1}}
                    value={(contratoEdit[alunoSel]||contratosStore[alunoSel]||'').split('/')[0]||''}
                    onChange={e=>{
                      const cur=contratoEdit[alunoSel]||contratosStore[alunoSel]||'/';
                      const parts=cur.split('/');
                      setContratoEdit(p=>({...p,[alunoSel]:`${e.target.value}/${parts[1]||new Date().getFullYear()}`}));
                    }}>
                    <option value="">Mês</option>
                    {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                  <select className="fin-mes-sel" style={{flex:1}}
                    value={(contratoEdit[alunoSel]||contratosStore[alunoSel]||'').split('/')[1]||''}
                    onChange={e=>{
                      const cur=contratoEdit[alunoSel]||contratosStore[alunoSel]||'/';
                      const parts=cur.split('/');
                      setContratoEdit(p=>({...p,[alunoSel]:`${parts[0]||'Jan'}/${e.target.value}`}));
                    }}>
                    <option value="">Ano</option>
                    {[2024,2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
                  </select>
                  <button className="fin-btn pay" onClick={()=>{
                    const val=contratoEdit[alunoSel]||contratosStore[alunoSel]||'';
                    if(val.includes('/'))saveContrato(alunoSel,val);
                    setContratoEdit(p=>({...p,[alunoSel]:undefined}));
                  }}>Salvar</button>
                </div>
              </div>
            </div>
            {mesesContrato.length>0?(
              <div className="fin-hist-table">
                <div className="fin-hist-header">
                  <span>Mês</span><span>Status</span><span>Data pgto</span><span>Comprovante</span>
                </div>
                {mesesContrato.map(m=>{
                  const lKey=`${alunoSel}_${m.key}`;
                  const isPago=m.st==='pago';
                  return(
                    <div key={m.key} className={`fin-hist-row ${m.st}`}>
                      <span className="fin-hist-mes">{m.mes}/{m.ano}</span>
                      <span className="fin-hist-st">{isPago?'🟢 Pago':m.st==='aguardando'?'🟡 Aguardando':'🔴 Em aberto'}</span>
                      <span className="fin-hist-data">{m.dataPgto?fmtDate(m.dataPgto):'—'}</span>
                      <span className="fin-hist-link">
                        {m.link
                          ?<a href={m.link} target="_blank" rel="noreferrer" className="fin-link-badge">🔗 Ver</a>
                          :isPago
                            ?<div style={{display:'flex',gap:4}}>
                              <input className="fin-link-input" placeholder="Cole o link..." value={linkInput[lKey]||''} onChange={e=>setLinkInput(p=>({...p,[lKey]:e.target.value}))} style={{width:120,fontSize:11}}/>
                              <button className="fin-btn pay" style={{padding:'4px 8px',fontSize:11}} onClick={()=>{
                                persist(prev=>{const pg={...(prev.pagamentos||{})};if(!pg[m.mes])pg[m.mes]={};pg[m.mes][alunoSel]={...pg[m.mes][alunoSel],link:linkInput[lKey]||''};return{...prev,pagamentos:pg};});
                                setLinkInput(p=>({...p,[lKey]:''}));
                              }}>+</button>
                            </div>
                            :'—'
                        }
                      </span>
                    </div>
                  );
                })}
              </div>
            ):<div className="hist-empty-msg">Insira a data de início do contrato para ver o histórico.</div>}
          </>)}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: DIÁRIO DE AULAS
// ══════════════════════════════════════════════════════════════════════════════
function TabDiario({students,loading,local,persist}){
  const [search,setSearch]=useState('');
  const [openId,setOpenId]=useState(null);
  const [licoesSel,setLicoesSel]=useState({});
  const [obsLocal,setObsLocal]=useState({});
  const [aulaSel,setAulaSel]=useState({});
  const LICAO_OPTS=['A','B','C','D'];
  const NIVEL_KEYS=['A1','A2','B1','B2'];

  const getDiario=(id)=>local.diario?.[id]||{aulaNum:null,licoes:[],obs:'',historico:[]};
  const saveDiario=(id,data)=>persist(prev=>({...prev,diario:{...(prev.diario||{}),[id]:data}}));

  const toggleLicao=(id,l)=>{
    setLicoesSel(prev=>{const curr=prev[id]||[];return{...prev,[id]:curr.includes(l)?curr.filter(x=>x!==l):[...curr,l]};});
  };

  const registrarAula=(s)=>{
    const num=parseInt(aulaSel[s.id])||1;
    const crono=CRONOGRAMAS[s.nivel]||[];
    const aulaInfo=crono.find(a=>a.num===num);
    const novoRegistro={date:todayKey(),aulaNum:num,lesson:aulaInfo?.lesson||'',licoes:licoesSel[s.id]||[],obs:obsLocal[s.id]||''};
    const prev=getDiario(s.id);
    saveDiario(s.id,{aulaNum:num,licoes:licoesSel[s.id]||[],obs:obsLocal[s.id]||'',historico:[novoRegistro,...(prev.historico||[])]});
    setLicoesSel(p=>({...p,[s.id]:[]}));
    setObsLocal(p=>({...p,[s.id]:''}));
    setOpenId(null);
  };

  const filtered=students.filter(s=>s.nome.toLowerCase().includes(search.toLowerCase())||(s.nivel||'').toLowerCase().includes(search.toLowerCase()));

  if(loading)return<div className="admin-loading">Carregando... ✨</div>;

  return(
    <div className="tab-diario">
      <input className="admin-search" placeholder="🔍 Buscar aluno ou nível..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:16}}/>
      {NIVEL_KEYS.map(nivel=>{
        const grupo=filtered.filter(s=>s.nivel===nivel);
        if(grupo.length===0)return null;
        const crono=CRONOGRAMAS[nivel]||[];
        const totalAulas=crono.filter(a=>a.tipo==='aula').length;
        return(
          <div key={nivel} className="diario-nivel-group">
            <div className="diario-nivel-header">
              <span className="diario-nivel-badge" style={{background:NIVEL_BG[nivel]||'#aaa'}}>{nivel}</span>
              <span className="diario-nivel-label">{grupo.length} aluno{grupo.length>1?'s':''} · {totalAulas} aulas no cronograma</span>
            </div>
            {grupo.map(s=>{
              const d=getDiario(s.id);
              const crono=CRONOGRAMAS[s.nivel]||[];
              const totalAulas=crono.filter(a=>a.tipo==='aula').length;
              const aulaAtual=d.aulaNum||0;
              const progresso=totalAulas>0?Math.round((aulaAtual/totalAulas)*100):0;
              const aulaInfo=crono.find(a=>a.num===aulaAtual);
              const proxNum=aulaAtual+1;
              const proxAula=crono.find(a=>a.num===proxNum);
              const open=openId===s.id;
              const lSel=licoesSel[s.id]||[];
              const aNum=aulaSel[s.id]||(proxNum<=crono.length?proxNum:aulaAtual)||1;

              return(
                <div key={s.id} className={`diario-card ${open?'open':''}`}>
                  <div className="diario-card-header" onClick={()=>{
                    setOpenId(open?null:s.id);
                    if(!open){setAulaSel(p=>({...p,[s.id]:proxNum<=crono.length?proxNum:aulaAtual}));}
                  }}>
                    <div className="presenca-avatar" style={{background:NIVEL_BG[s.nivel]||'#aaa',width:38,height:38,fontSize:15,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,flexShrink:0}}>{s.nome[0]}</div>
                    <div className="diario-info">
                      <div className="diario-nome">{s.nome}</div>
                      {aulaAtual>0
                        ?<div className="diario-sub">Aula {aulaAtual}/{totalAulas} — {aulaInfo?.lesson?.substring(0,40)}{aulaInfo?.lesson?.length>40?'…':''}</div>
                        :<div className="diario-sub" style={{color:'#ccc'}}>Sem registro ainda</div>
                      }
                    </div>
                    <div className="diario-progress-wrap">
                      <div className="diario-progress-bar">
                        <div className="diario-progress-fill" style={{width:`${progresso}%`,background:NIVEL_BG[s.nivel]||'#aaa'}}/>
                      </div>
                      <span className="diario-progress-pct">{progresso}%</span>
                    </div>
                    <span className="nota-chevron">{open?'▲':'▼'}</span>
                  </div>

                  {open&&(
                    <div className="diario-body">


                      <div className="diario-field">
                        <label className="diario-label">Aula dada hoje</label>
                        <select className="diario-select" value={aNum} onChange={e=>setAulaSel(p=>({...p,[s.id]:parseInt(e.target.value)}))}>
                          {crono.map(a=>(
                            <option key={a.num} value={a.num}>
                              {a.tipo==='avaliacao'?`⭐ ${a.lesson}`:`Aula ${a.num} — ${a.lesson}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="diario-field">
                        <label className="diario-label">Lições dadas</label>
                        <div className="diario-licoes">
                          {LICAO_OPTS.map(l=>(
                            <button key={l} className={`diario-licao-btn ${lSel.includes(l)?'active':''}`} onClick={()=>toggleLicao(s.id,l)}>{l}</button>
                          ))}
                        </div>
                      </div>

                      <div className="diario-field">
                        <label className="diario-label">Observações</label>
                        <textarea className="nota-textarea" placeholder="Ex: Aluno teve dificuldade com vocab, revisar na próxima..." value={obsLocal[s.id]||''} onChange={e=>setObsLocal(p=>({...p,[s.id]:e.target.value}))} rows={3}/>
                      </div>

                      <button className="diario-save-btn" onClick={()=>registrarAula(s)}>✅ Registrar aula</button>

                      {d.historico?.length>0&&(
                        <div className="diario-hist">
                          <div className="diario-hist-title">📋 Histórico de aulas</div>
                          {d.historico.map((h,i)=>(
                            <div key={i} className="diario-hist-row">
                              <span className="diario-hist-date">{new Date(h.date+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'})}</span>
                              <span className="diario-hist-lesson">Aula {h.aulaNum}{h.licoes?.length>0?` (${h.licoes.join(',')})`:''} — {h.lesson?.substring(0,35)}{h.lesson?.length>35?'…':''}</span>
                              {h.obs&&<span className="diario-hist-obs">💬 {h.obs}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: NOTAS
// ══════════════════════════════════════════════════════════════════════════════
function TabNotas({students,loading,local,persist}){
  const [search,setSearch]=useState('');
  const [openId,setOpenId]=useState(null);
  const getNota=(id)=>local.notas?.[id]||'';
  const setNota=(id,val)=>persist(prev=>({...prev,notas:{...(prev.notas||{}),[id]:val}}));
  if(loading)return<div className="admin-loading">Carregando... ✨</div>;
  return(
    <div className="tab-notas">
      <input className="admin-search" placeholder="🔍 Buscar aluno..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}}/>
      <div className="notas-list">
        {students.filter(s=>s.nome.toLowerCase().includes(search.toLowerCase())).map(s=>{
          const nota=getNota(s.id);const open=openId===s.id;
          return(
            <div key={s.id} className={`nota-card ${open?'open':''}`}>
              <div className="nota-header" onClick={()=>setOpenId(open?null:s.id)}>
                <div className="nota-avatar" style={{background:LEVEL_COLORS[s.nivel]||'#aaa'}}>{s.nome[0]}</div>
                <div className="nota-name-wrap">
                  <div className="nota-nome">{s.nome}</div>
                  {!open&&nota&&<div className="nota-preview">{nota.slice(0,60)}{nota.length>60?'…':''}</div>}
                </div>
                <span className="nota-chevron">{open?'▲':'▼'}</span>
              </div>
              {open&&(
                <div className="nota-body">
                  <textarea className="nota-textarea" placeholder="Anotações, pendências, observações..." value={nota} onChange={e=>setNota(s.id,e.target.value)} rows={5}/>
                  {(s.tarefaPersonalizada||s.tarefaDaSemana||s.paginasDoLivro)&&(
                    <div className="nota-notion-info">
                      {s.tarefaPersonalizada&&<div className="notion-field green"><b>Before class:</b> {s.tarefaPersonalizada}</div>}
                      {s.tarefaDaSemana&&<div className="notion-field orange"><b>Tarefa da semana:</b> {s.tarefaDaSemana}</div>}
                      {s.paginasDoLivro&&<div className="notion-field blue"><b>Páginas:</b> {s.paginasDoLivro}</div>}
                    </div>
                  )}
                  {s.reposicoes>0&&(
                    <div className="notion-field orange" style={{marginTop:8}}>
                      🔄 <b>{s.reposicoes} reposição(ões)</b>
                      {s.dataReposicao&&` · ${new Date(s.dataReposicao+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'})}`}
                    </div>
                  )}
                  <div className="nota-links">
                    {s.meetLink&&<a href={s.meetLink} target="_blank" rel="noreferrer" className="nota-link meet">📹 Meet</a>}
                    {s.kamiLink&&<a href={s.kamiLink} target="_blank" rel="noreferrer" className="nota-link kami">📚 KAMI</a>}
                    {s.classroomLink&&<a href={s.classroomLink} target="_blank" rel="noreferrer" className="nota-link classroom">🎓 Classroom</a>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: EMPRESA
// ══════════════════════════════════════════════════════════════════════════════
function TabEmpresa({local,persist}){
  const today=todayKey();
  const getTasks=(key)=>local.empresa?.[key]||[];
  const setTasks=(key,val)=>persist(prev=>({...prev,empresa:{...(prev.empresa||{}),[key]:val}}));
  const getDiario=()=>local.empresa?.diario?.[today]||'';
  const setDiario=(val)=>persist(prev=>({...prev,empresa:{...(prev.empresa||{}),diario:{...(prev.empresa?.diario||{}),[today]:val}}}));
  return(
    <div className="tab-empresa">
      <div className="empresa-section"><div className="empresa-section-title">📓 Diário do dia</div><textarea className="empresa-textarea" placeholder="Anote aqui o que aconteceu hoje..." value={getDiario()} onChange={e=>setDiario(e.target.value)} rows={4}/></div>
      <div className="empresa-section"><div className="empresa-section-title">📚 Materiais</div><TaskList tasks={getTasks('materiais')} onChange={v=>setTasks('materiais',v)} placeholder="Ex: Criar workbook A2 Unit 3..." categories={['Criar','Otimizar','Remover']}/></div>
      <div className="empresa-section"><div className="empresa-section-title">🎯 Metas e Projetos</div><TaskList tasks={getTasks('metas')} onChange={v=>setTasks('metas',v)} placeholder="Ex: Lançar curso intensivo 2027..." categories={['Em andamento','Próximo','Concluído']}/></div>
      <div className="empresa-section"><div className="empresa-section-title">🔔 Lembretes & Pendências</div><TaskList tasks={getTasks('lembretes')} onChange={v=>setTasks('lembretes',v)} placeholder="Ex: Entregar resultados Rafael 07/07..." categories={['Urgente','Esta semana','Feito']}/></div>
    </div>
  );
}

function TaskList({tasks,onChange,placeholder,categories}){
  const [newText,setNewText]=useState('');
  const [newCat,setNewCat]=useState(categories[0]);
  const add=()=>{if(!newText.trim())return;onChange([...tasks,{id:Date.now(),text:newText.trim(),cat:newCat,done:false}]);setNewText('');};
  const toggle=(id)=>onChange(tasks.map(t=>t.id===id?{...t,done:!t.done}:t));
  const remove=(id)=>onChange(tasks.filter(t=>t.id!==id));
  const CAT_COLORS={'Criar':'#1d9e75','Otimizar':'#2e86c1','Remover':'#e53935','Em andamento':'#ff6a00','Próximo':'#5c6bc0','Concluído':'#aaa','Urgente':'#e53935','Esta semana':'#ff6a00','Feito':'#aaa'};
  return(
    <div className="task-list">
      <div className="task-add-row">
        <select className="task-cat-sel" value={newCat} onChange={e=>setNewCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>
        <input className="task-input" placeholder={placeholder} value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/>
        <button className="task-add-btn" onClick={add}>+</button>
      </div>
      {tasks.map(t=>(
        <div key={t.id} className={`task-item ${t.done?'done':''}`}>
          <button className="task-check" onClick={()=>toggle(t.id)}>{t.done?'✅':'⬜'}</button>
          <span className="task-cat-badge" style={{background:CAT_COLORS[t.cat]||'#aaa'}}>{t.cat}</span>
          <span className="task-text">{t.text}</span>
          <button className="task-del" onClick={()=>remove(t.id)}>✕</button>
        </div>
      ))}
      {tasks.length===0&&<div className="task-empty">Nenhum item ainda.</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function TabDashboard({students,loading,local}){
  const today=todayKey();
  const now=new Date();
  const mesAtual=MESES[now.getMonth()];
  const pagStore=local.pagamentos||{};
  const presStore=local.presenca||{};
  const despStore=local.despesas||{};

  // ── Financeiro ──
  const rows=ALUNOS_FINANCEIRO.map(([nome,valor,venc])=>({nome,valor,st:getFinStatus(nome,venc,now.getMonth(),pagStore)}));
  const recebido=rows.filter(r=>r.st==='pago').reduce((s,r)=>s+r.valor,0);
  // Receita bruta = soma de todas as mensalidades de todos os alunos cadastrados
  const receitaBruta=ALUNOS_FINANCEIRO.reduce((s,[,v])=>s+v,0);
  const inadimplentes=rows.filter(r=>r.st==='atrasado');

  // ── Despesas do mês ──
  const despMes=(despStore.fixas||[]).reduce((s,d)=>s+Number(d.valor),0)+
    (despStore.avulsas||[]).filter(d=>d.mes===mesAtual&&d.ano===String(now.getFullYear())).reduce((s,d)=>s+Number(d.valor),0);
  const lucro=recebido-despMes;

  // ── Alunos por nível ──
  const porNivel=students.reduce((acc,s)=>{acc[s.nivel]=(acc[s.nivel]||0)+1;return acc;},{});

  // ── Presença hoje ──
  const semRegistro=students.filter(s=>!presStore[today]?.[s.id]).length;
  const faltasHoje=students.filter(s=>presStore[today]?.[s.id]==='falta').length;

  // ── Reposições pendentes ──
  const repPendentes=students.filter(s=>{
    const datas=Object.keys(presStore);
    return datas.some(d=>presStore[d]?.[s.id]==='rep_pendente');
  }).length;

  // ── Dias desta semana com aula ──
  const getDiasUteisRestantes=()=>{
    const dias=[];
    const d=new Date(now);
    while(d.getDay()!==0){
      if(d.getDay()!==6)dias.push(new Date(d).toISOString().slice(0,10));
      d.setDate(d.getDate()+1);
    }
    return dias;
  };

  if(loading)return<div className="admin-loading">Carregando dashboard... ✨</div>;

  return(
    <div className="tab-dashboard">
      {/* Saudação */}
      <div className="dash-greeting">
        <div className="dash-greeting-text">
          <span className="dash-ola">
            {now.getHours()<12?'Bom dia':now.getHours()<18?'Boa tarde':'Boa noite'}, Denise! 👋
          </span>
          <span className="dash-data">{now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
        </div>
      </div>

      {/* ── Financeiro do mês ── */}
      <div className="dash-section-title">💰 Financeiro — {mesAtual}/{now.getFullYear()}</div>
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#f0faf5'}}>💵</div>
          <div className="dash-card-val green">R$ {fmtMoney(recebido)}</div>
          <div className="dash-card-label">Recebido</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#f0f4ff'}}>📊</div>
          <div className="dash-card-val blue">R$ {fmtMoney(receitaBruta)}</div>
          <div className="dash-card-label">Receita bruta</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#fdf3f3'}}>💸</div>
          <div className="dash-card-val red">R$ {fmtMoney(despMes)}</div>
          <div className="dash-card-label">Despesas</div>
        </div>
        <div className="dash-card" style={{borderColor:lucro>=0?'#b7e0c8':'#f5b7b7'}}>
          <div className="dash-card-icon" style={{background:lucro>=0?'#f0faf5':'#fdf3f3'}}>📈</div>
          <div className="dash-card-val" style={{color:lucro>=0?'#1d9e75':'#e53935'}}>R$ {fmtMoney(lucro)}</div>
          <div className="dash-card-label">Lucro líquido</div>
        </div>
      </div>

      {/* ── Alunos ── */}
      <div className="dash-section-title">👥 Alunos ativos</div>
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#f8f7f5'}}>🎓</div>
          <div className="dash-card-val blue">{students.length}</div>
          <div className="dash-card-label">Total de alunos</div>
        </div>
        {Object.entries(porNivel).sort().map(([nivel,qtd])=>(
          <div key={nivel} className="dash-card">
            <div className="dash-card-icon" style={{background:LEVEL_COLORS[nivel]+'22'}}>
              <span style={{fontSize:12,fontWeight:700,color:LEVEL_COLORS[nivel]||'#aaa'}}>{nivel}</span>
            </div>
            <div className="dash-card-val" style={{color:LEVEL_COLORS[nivel]||'#aaa'}}>{qtd}</div>
            <div className="dash-card-label">aluno{qtd!==1?'s':''}</div>
          </div>
        ))}
      </div>

      {/* ── Next Classes ── */}
      {(() => {
        const comAula = students
          .filter(s => s.dataProximaAula)
          .sort((a, b) => new Date(a.dataProximaAula) - new Date(b.dataProximaAula));
        const hoje = now.toISOString().slice(0, 10);
        const proximos7 = comAula.filter(s => s.dataProximaAula >= hoje && s.dataProximaAula <= new Date(now.getTime() + 7*24*60*60*1000).toISOString().slice(0,10));
        if (proximos7.length === 0) return null;
        return (
          <>
            <div className="dash-section-title">📅 Next Classes — próximos 7 dias</div>
            <div className="dash-next-classes">
              {proximos7.map(s => {
                const d = new Date(s.dataProximaAula + 'T12:00:00');
                const isHoje = s.dataProximaAula === hoje;
                return (
                  <div key={s.id} className={`dash-next-item ${isHoje ? 'hoje' : ''}`}>
                    <div className="dash-next-date">
                      <div className="dash-next-day">{d.getDate()}</div>
                      <div className="dash-next-mon">{d.toLocaleString('pt-BR', { month: 'short' })}</div>
                    </div>
                    <div className="dash-next-info">
                      <div className="dash-next-name">{s.nome}</div>
                      <div className="dash-next-lesson">{s.proximaAulaTitulo || '—'}</div>
                    </div>
                    <span className="dash-next-nivel" style={{ background: LEVEL_COLORS[s.nivel] || '#aaa', color: '#fff' }}>
                      {s.nivel}
                    </span>
                    {isHoje && <span className="dash-next-hoje-badge">Hoje</span>}
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* ── Urgências ── */}
      <div className="dash-section-title">⚠️ Urgências da semana</div>
      <div className="dash-urgencias">
        {inadimplentes.length>0&&(
          <div className="dash-urgencia red">
            <span className="dash-urg-icon">🔴</span>
            <div>
              <div className="dash-urg-title">{inadimplentes.length} aluno{inadimplentes.length!==1?'s':''} inadimplente{inadimplentes.length!==1?'s':''}</div>
              <div className="dash-urg-sub">{inadimplentes.slice(0,3).map(r=>r.nome.split(' ')[0]).join(', ')}{inadimplentes.length>3?` +${inadimplentes.length-3}`:''}</div>
            </div>
          </div>
        )}
        {repPendentes>0&&(
          <div className="dash-urgencia orange">
            <span className="dash-urg-icon">🔄</span>
            <div>
              <div className="dash-urg-title">{repPendentes} reposição{repPendentes!==1?'ões':''} pendente{repPendentes!==1?'s':''}</div>
              <div className="dash-urg-sub">Acesse Presença → Histórico para ver detalhes</div>
            </div>
          </div>
        )}
        {semRegistro>0&&(
          <div className="dash-urgencia yellow">
            <span className="dash-urg-icon">⬜</span>
            <div>
              <div className="dash-urg-title">{semRegistro} aluno{semRegistro!==1?'s':''} sem registro hoje</div>
              <div className="dash-urg-sub">Registre a presença na aba Presença</div>
            </div>
          </div>
        )}
        {faltasHoje>0&&(
          <div className="dash-urgencia red">
            <span className="dash-urg-icon">❌</span>
            <div>
              <div className="dash-urg-title">{faltasHoje} falta{faltasHoje!==1?'s':''} hoje</div>
              <div className="dash-urg-sub">Verifique se precisam de reposição</div>
            </div>
          </div>
        )}
        {inadimplentes.length===0&&repPendentes===0&&semRegistro===0&&faltasHoje===0&&(
          <div className="dash-urgencia green">
            <span className="dash-urg-icon">✅</span>
            <div>
              <div className="dash-urg-title">Tudo em ordem!</div>
              <div className="dash-urg-sub">Sem urgências para hoje</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Metas ── */}
      {(local.empresa?.metas||[]).filter(m=>!m.done).length>0&&(
        <>
          <div className="dash-section-title">🎯 Metas em andamento</div>
          <div className="dash-metas">
            {(local.empresa?.metas||[]).filter(m=>!m.done).map(m=>(
              <div key={m.id} className="dash-meta-item">
                <span className="dash-meta-cat" style={{background:{'Em andamento':'#ff6a00','Próximo':'#5c6bc0','Concluído':'#aaa'}[m.cat]||'#aaa'}}>{m.cat}</span>
                <span className="dash-meta-text">{m.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Lembretes da empresa ── */}
      {(local.empresa?.lembretes||[]).filter(l=>!l.done&&l.cat==='Urgente').length>0&&(
        <>
          <div className="dash-section-title">🔔 Lembretes urgentes</div>
          <div className="dash-urgencias">
            {(local.empresa?.lembretes||[]).filter(l=>!l.done&&l.cat==='Urgente').map(l=>(
              <div key={l.id} className="dash-urgencia orange">
                <span className="dash-urg-icon">🔔</span>
                <div><div className="dash-urg-title">{l.text}</div></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: DESPESAS
// ══════════════════════════════════════════════════════════════════════════════
function TabDespesas({local,persist}){
  const now=new Date();
  const [mesSel,setMesSel]=useState(MESES[now.getMonth()]);
  const [anoSel,setAnoSel]=useState(String(now.getFullYear()));
  const [novaFixa,setNovaFixa]=useState({nome:'',valor:'',categoria:'Assinatura'});
  const [novaAvulsa,setNovaAvulsa]=useState({nome:'',valor:'',categoria:'Material'});
  const despStore=local.despesas||{fixas:[],avulsas:[]};

  const persist2=(updater)=>persist(prev=>({...prev,despesas:updater(prev.despesas||{fixas:[],avulsas:[]})}));

  const addFixa=()=>{
    if(!novaFixa.nome||!novaFixa.valor)return;
    persist2(d=>({...d,fixas:[...(d.fixas||[]),{id:Date.now(),...novaFixa,valor:Number(novaFixa.valor)}]}));
    setNovaFixa({nome:'',valor:'',categoria:'Assinatura'});
  };

  const removeFixa=(id)=>persist2(d=>({...d,fixas:(d.fixas||[]).filter(f=>f.id!==id)}));

  const addAvulsa=()=>{
    if(!novaAvulsa.nome||!novaAvulsa.valor)return;
    persist2(d=>({...d,avulsas:[...(d.avulsas||[]),{id:Date.now(),...novaAvulsa,valor:Number(novaAvulsa.valor),mes:mesSel,ano:anoSel}]}));
    setNovaAvulsa({nome:'',valor:'',categoria:'Material'});
  };

  const removeAvulsa=(id)=>persist2(d=>({...d,avulsas:(d.avulsas||[]).filter(a=>a.id!==id)}));

  const fixas=despStore.fixas||[];
  const avulsasMes=(despStore.avulsas||[]).filter(a=>a.mes===mesSel&&a.ano===anoSel);
  const totalFixas=fixas.reduce((s,f)=>s+Number(f.valor),0);
  const totalAvulsas=avulsasMes.reduce((s,a)=>s+Number(a.valor),0);
  const totalMes=totalFixas+totalAvulsas;

  const CATS_FIXA=['Assinatura','Ferramenta','Outro'];
  const CATS_AVULSA=['Material','Livro','Curso','Marketing','Equipamento','Outro'];

  const CAT_COLOR={
    'Assinatura':'#185FA5','Ferramenta':'#534AB7','Material':'#ff6a00',
    'Livro':'#1d9e75','Curso':'#D4537E','Marketing':'#f9a825',
    'Equipamento':'#888','Outro':'#aaa',
  };

  return(
    <div className="tab-despesas">
      {/* Resumo do mês */}
      <div className="desp-mes-sel">
        <select className="fin-mes-sel" value={mesSel} onChange={e=>setMesSel(e.target.value)}>
          {MESES.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        <select className="fin-mes-sel" value={anoSel} onChange={e=>setAnoSel(e.target.value)}>
          {[2024,2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="fin-stats">
        <div className="fin-stat"><span className="fin-val red">R$ {fmtMoney(totalFixas)}</span><small>Fixas/mês</small></div>
        <div className="fin-stat"><span className="fin-val orange">R$ {fmtMoney(totalAvulsas)}</span><small>Avulsas ({mesSel})</small></div>
        <div className="fin-stat"><span className="fin-val red">R$ {fmtMoney(totalMes)}</span><small>Total {mesSel}</small></div>
      </div>

      {/* ── DESPESAS FIXAS ── */}
      <div className="empresa-section">
        <div className="empresa-section-title">📌 Despesas fixas mensais</div>
        <div className="task-add-row" style={{marginBottom:10}}>
          <select className="task-cat-sel" value={novaFixa.categoria} onChange={e=>setNovaFixa(p=>({...p,categoria:e.target.value}))}>
            {CATS_FIXA.map(c=><option key={c}>{c}</option>)}
          </select>
          <input className="task-input" placeholder="Nome (ex: Notion)" value={novaFixa.nome} onChange={e=>setNovaFixa(p=>({...p,nome:e.target.value}))}/>
          <input className="task-input" placeholder="R$" type="number" style={{width:80,flexShrink:0}} value={novaFixa.valor} onChange={e=>setNovaFixa(p=>({...p,valor:e.target.value}))}/>
          <button className="task-add-btn" onClick={addFixa}>+</button>
        </div>
        {fixas.length===0&&<div className="task-empty">Nenhuma despesa fixa cadastrada.</div>}
        {fixas.map(f=>(
          <div key={f.id} className="desp-row">
            <span className="task-cat-badge" style={{background:CAT_COLOR[f.categoria]||'#aaa'}}>{f.categoria}</span>
            <span className="desp-nome">{f.nome}</span>
            <span className="desp-valor">R$ {fmtMoney(f.valor)}</span>
            <button className="task-del" onClick={()=>removeFixa(f.id)}>✕</button>
          </div>
        ))}
        {fixas.length>0&&(
          <div className="desp-total">Total fixo/mês: <strong>R$ {fmtMoney(totalFixas)}</strong></div>
        )}
      </div>

      {/* ── DESPESAS AVULSAS ── */}
      <div className="empresa-section">
        <div className="empresa-section-title">🛒 Despesas avulsas — {mesSel}/{anoSel}</div>
        <div className="task-add-row" style={{marginBottom:10}}>
          <select className="task-cat-sel" value={novaAvulsa.categoria} onChange={e=>setNovaAvulsa(p=>({...p,categoria:e.target.value}))}>
            {CATS_AVULSA.map(c=><option key={c}>{c}</option>)}
          </select>
          <input className="task-input" placeholder="Descrição (ex: Livro A2)" value={novaAvulsa.nome} onChange={e=>setNovaAvulsa(p=>({...p,nome:e.target.value}))}/>
          <input className="task-input" placeholder="R$" type="number" style={{width:80,flexShrink:0}} value={novaAvulsa.valor} onChange={e=>setNovaAvulsa(p=>({...p,valor:e.target.value}))}/>
          <button className="task-add-btn" onClick={addAvulsa}>+</button>
        </div>
        {avulsasMes.length===0&&<div className="task-empty">Nenhuma despesa avulsa em {mesSel}/{anoSel}.</div>}
        {avulsasMes.map(a=>(
          <div key={a.id} className="desp-row">
            <span className="task-cat-badge" style={{background:CAT_COLOR[a.categoria]||'#aaa'}}>{a.categoria}</span>
            <span className="desp-nome">{a.nome}</span>
            <span className="desp-valor">R$ {fmtMoney(a.valor)}</span>
            <button className="task-del" onClick={()=>removeAvulsa(a.id)}>✕</button>
          </div>
        ))}
        {avulsasMes.length>0&&(
          <div className="desp-total">Total avulso {mesSel}: <strong>R$ {fmtMoney(totalAvulsas)}</strong></div>
        )}
      </div>
    </div>
  );
}

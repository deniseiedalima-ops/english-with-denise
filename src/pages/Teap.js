import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Teap.css';

/* ═══════════════════════════════════════════════════════════════════════
   TEAP — Painel de Prontidão
   Segue o mesmo sistema visual do Dashboard.js: fundo creme, cards pretos
   com destaque laranja, DM Serif Display + DM Sans, sem libs externas de
   gráfico (SVG puro), mobile-first.

   Dados vêm de /api/index?route=teap-dashboard&email=... . Enquanto os 3
   bancos do Notion (Simulados / Respostas por Categoria / Banco de Palavras)
   não existem, a API responde { configured:false } e esta página usa os
   dados de exemplo abaixo — a estrutura já é a mesma que a API real vai
   devolver, então a troca é direta quando a fase 2 (backend) estiver pronta.
   ═══════════════════════════════════════════════════════════════════════ */

const MOCK = {
  simulados: [
    { data: '12/05', nota: 58, tempoMedio: 74, tempoTotal: 62 },
    { data: '26/05', nota: 63, tempoMedio: 70, tempoTotal: 58 },
    { data: '09/06', nota: 67, tempoMedio: 66, tempoTotal: 55 },
    { data: '23/06', nota: 71, tempoMedio: 64, tempoTotal: 54 },
    { data: '30/06', nota: 76, tempoMedio: 60, tempoTotal: 51 },
    { data: '06/07', nota: 79, tempoMedio: 58, tempoTotal: 49 },
  ],
  categorias: [
    { nome: 'Localização', acerto: 82 },
    { nome: 'Referência Pronominal', acerto: 61 },
    { nome: 'Vocabulário', acerto: 90 },
    { nome: 'Compreensão de Sentença', acerto: 74 },
    { nome: 'Compreensão de Parágrafo', acerto: 68 },
    { nome: 'Ideia Central', acerto: 88 },
  ],
  radar: [
    { nome: 'Reading Speed', valor: 72 },
    { nome: 'Scanning', valor: 80 },
    { nome: 'Skimming', valor: 66 },
    { nome: 'Vocabulary', valor: 90 },
    { nome: 'Pronoun Ref.', valor: 58 },
    { nome: 'Main Idea', valor: 85 },
    { nome: 'Inference', valor: 63 },
    { nome: 'Sentence Mng.', valor: 74 },
    { nome: 'Paragraph Mng.', valor: 70 },
  ],
  vocabulario: [
    { palavra: 'nonetheless', significado: 'mesmo assim, ainda assim', pronuncia: '/ˌnʌn.ðəˈlɛs/', frase: 'The results were inconclusive; nonetheless, the study continued.', status: 'aprendendo' },
    { palavra: 'underlying', significado: 'subjacente, de base', pronuncia: '/ˌʌn.dəˈlaɪ.ɪŋ/', frase: 'The underlying cause was never addressed.', status: 'nova' },
    { palavra: 'yield', significado: 'produzir, render', pronuncia: '/jiːld/', frase: 'The experiment yielded unexpected data.', status: 'dominada' },
    { palavra: 'albeit', significado: 'embora, ainda que', pronuncia: '/ɔːlˈbiː.ɪt/', frase: 'The plan worked, albeit slowly.', status: 'aprendendo' },
  ],
};

/* ── Motor de cálculo do TEAP Readiness ──────────────────────────────────
   precisão 40% · consistência 20% · tempo 15% · evolução 15% · domínio 10%
   Mesma fórmula planejada para rodar no backend — aqui roda no front
   enquanto os dados são mock; troca para vir pronta da API na fase 2. */
function computeReadiness(simulados, categorias) {
  const notas = simulados.map(s => s.nota);
  const precisao = notas[notas.length - 1];

  const mean = notas.reduce((a, b) => a + b, 0) / notas.length;
  const variance = notas.reduce((a, b) => a + (b - mean) ** 2, 0) / notas.length;
  const consistencia = Math.max(0, 100 - Math.sqrt(variance) * 4);

  const tempoAlvo = 60;
  const tempoAtual = simulados[simulados.length - 1].tempoMedio;
  const tempo = Math.max(0, 100 - Math.abs(tempoAtual - tempoAlvo) * 2);

  const evolucao = Math.min(100, Math.max(0, 50 + (notas[notas.length - 1] - notas[0]) * 2));

  const mediaCategoria = categorias.reduce((a, c) => a + c.acerto, 0) / categorias.length;
  const piorCategoria = Math.min(...categorias.map(c => c.acerto));
  const dominio = Math.max(0, 100 - (mediaCategoria - piorCategoria) * 1.5);

  return Math.round(precisao * 0.4 + consistencia * 0.2 + tempo * 0.15 + evolucao * 0.15 + dominio * 0.1);
}

function readinessStatus(score) {
  if (score >= 80) return { label: 'Pronto para o TEAP', tone: 'good' };
  if (score >= 60) return { label: 'Em progresso', tone: 'mid' };
  return { label: 'Fase inicial', tone: 'low' };
}

function ReadinessDial({ score }) {
  const { label, tone } = readinessStatus(score);
  const cx = 100, cy = 100, r = 70;
  // score 0 -> needle points left (180°); score 100 -> needle points right (0°);
  // score 50 -> straight up (-90°). Sweeping through -180..0 keeps this aligned
  // with the semicircle path below (which visually spans left -> top -> right).
  const angle = -180 + (score / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const needleX = cx + r * Math.cos(rad);
  const needleY = cy + r * Math.sin(rad);

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = -180 + (i / 10) * 180;
    const ra = (a * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const rOuter = r;
    const rInner = isMajor ? r - 10 : r - 6;
    return {
      x1: cx + rInner * Math.cos(ra),
      y1: cy + rInner * Math.sin(ra),
      x2: cx + rOuter * Math.cos(ra),
      y2: cy + rOuter * Math.sin(ra),
      isMajor,
    };
  });

  return (
    <div className="teap-dial-wrap">
      <svg viewBox="0 0 200 118" width="200" height="118">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${needleX} ${needleY}`}
          fill="none" stroke="#ff6a00" strokeWidth="9" strokeLinecap="round" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="rgba(255,255,255,0.25)" strokeWidth={t.isMajor ? 1.5 : 1} />
        ))}
        <text x={cx} y={cy - 26} textAnchor="middle"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', fill: '#fff' }}>
          {score}
        </text>
        <circle cx={cx} cy={cy} r="4" fill="#fff" />
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#fff" strokeWidth="2" />
      </svg>
      <div className={`teap-dial-pill tone-${tone}`}>{label}</div>
    </div>
  );
}

function EvolutionChart({ simulados }) {
  const w = 300, h = 100, pad = 8;
  const notas = simulados.map(s => s.nota);
  const min = 40, max = 100;
  const pts = simulados.map((s, i) => {
    const x = pad + (i / (simulados.length - 1)) * (w - pad * 2);
    const y = h - pad - ((s.nota - min) / (max - min)) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100" preserveAspectRatio="none">
      <polyline points={pts.join(' ')} fill="none" stroke="#ff6a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => {
        const [x, y] = p.split(',');
        return <circle key={i} cx={x} cy={y} r="3" fill="#ff6a00" />;
      })}
    </svg>
  );
}

function RadarChart({ data }) {
  const size = 220, cx = size / 2, cy = size / 2, r = 78;
  const n = data.length;
  const point = (i, value) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const dist = (value / 100) * r;
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  };
  const ring = (frac) => Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return `${cx + r * frac * Math.cos(angle)},${cy + r * frac * Math.sin(angle)}`;
  }).join(' ');
  const shape = data.map((d, i) => point(i, d.valor).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="220">
      {[0.33, 0.66, 1].map(f => (
        <polygon key={f} points={ring(f)} fill="none" stroke="#e0dbd4" strokeWidth="1" />
      ))}
      <polygon points={shape} fill="rgba(255,106,0,0.18)" stroke="#ff6a00" strokeWidth="2" />
      {data.map((d, i) => {
        const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const lx = cx + (r + 22) * Math.cos(angle);
        const ly = cy + (r + 22) * Math.sin(angle);
        return (
          <text key={d.nome} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill="#888" fontFamily="DM Sans, sans-serif">
            {d.nome}
          </text>
        );
      })}
    </svg>
  );
}

function CategoryRow({ nome, acerto }) {
  const tone = acerto < 70 ? 'low' : acerto >= 85 ? 'good' : 'mid';
  return (
    <div className="teap-cat-row">
      <div className="teap-cat-top">
        <span className="teap-cat-name">{nome}</span>
        <span className={`teap-cat-pct tone-${tone}`}>{acerto}%</span>
      </div>
      <div className="teap-cat-track">
        <div className={`teap-cat-fill tone-${tone}`} style={{ width: `${acerto}%` }} />
      </div>
    </div>
  );
}

function VocabCard({ item }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="teap-vocab-card" onClick={() => setFlipped(!flipped)}>
      {!flipped ? (
        <>
          <div className="teap-vocab-word">{item.palavra}</div>
          <div className="teap-vocab-pron">{item.pronuncia}</div>
        </>
      ) : (
        <>
          <div className="teap-vocab-meaning">{item.significado}</div>
          <div className="teap-vocab-example">"{item.frase}"</div>
        </>
      )}
    </div>
  );
}

export default function Teap({ user, student, onLogout }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/index?route=teap-dashboard&email=${encodeURIComponent(user?.email || '')}`);
        const json = await res.json();
        if (!active) return;
        if (json.configured && json.simulados?.length > 0 && json.categorias?.length > 0) {
          setData({ ...json, vocabulario: json.vocabulario?.length ? json.vocabulario : MOCK.vocabulario });
          setUsingMock(false);
        } else {
          setData(MOCK);
          setUsingMock(true);
        }
      } catch {
        if (active) { setData(MOCK); setUsingMock(true); }
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [user?.email]);

  const score = useMemo(() => (
    data && data.categorias?.length > 0 ? computeReadiness(data.simulados, data.categorias) : 0
  ), [data]);

  if (loading || !data) {
    return (
      <div className="teap-page">
        <Navbar user={user} student={student} onLogout={onLogout} />
        <main className="teap-content"><p className="teap-loading">Carregando painel TEAP...</p></main>
      </div>
    );
  }

  const ultimo = data.simulados[data.simulados.length - 1];
  const primeiro = data.simulados[0];
  const categoriasReco = data.categoriasUltimoSimulado?.length > 0 ? data.categoriasUltimoSimulado : data.categorias;
  const categoriasSafe = categoriasReco?.length > 0 ? categoriasReco : [{ nome: '—', acerto: 0 }];
  const pontoFraco = categoriasSafe.reduce((min, c) => c.acerto < min.acerto ? c : min, categoriasSafe[0]);
  const pontoForte = categoriasSafe.reduce((max, c) => c.acerto > max.acerto ? c : max, categoriasSafe[0]);
  const ganhoTempo = Math.max(0, primeiro.tempoMedio - ultimo.tempoMedio);

  return (
    <div className="teap-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="teap-content">

        {usingMock && (
          <div className="teap-mock-banner">
            📊 Dados de exemplo — faça seu primeiro simulado para ver suas métricas reais.
          </div>
        )}

        {/* ── ENTRADA: SIMULADOS ─────────────────────── */}
        <div className="teap-simulados-entry" onClick={() => navigate('/teap/simulados')}>
          <div className="teap-simulados-entry-icon">📝</div>
          <div style={{ flex: 1 }}>
            <div className="teap-simulados-entry-title">Simulados</div>
            <div className="teap-simulados-entry-sub">Responda e receba o gabarito na hora</div>
          </div>
          <div className="teap-simulados-entry-arrow">›</div>
        </div>

        {/* ── PONTUAÇÃO + EVOLUÇÃO (lado a lado) ─────── */}
        <div className="teap-grid">
          <div className="teap-score-card">
            <div className="teap-header-eyebrow">TEAP · {student?.areaTeap || 'Prontidão'}</div>
            <ReadinessDial score={score} />
            <div className="teap-score-stats">
              <div className="teap-score-stat">
                <div className="teap-score-stat-value">{ultimo.nota}%</div>
                <div className="teap-score-stat-label">Última nota</div>
              </div>
              <div className="teap-score-stat">
                <div className="teap-score-stat-value">{ultimo.tempoMedio}s</div>
                <div className="teap-score-stat-label">Tempo/questão</div>
              </div>
              <div className="teap-score-stat">
                <div className="teap-score-stat-value">{data.simulados.length}</div>
                <div className="teap-score-stat-label">Simulados</div>
              </div>
            </div>
          </div>

          <div className="teap-card">
            <div className="teap-card-title">Evolução</div>
            <EvolutionChart simulados={data.simulados} />
            <div className="teap-evo-labels">
              {data.simulados.map(s => <span key={s.data}>{s.data}</span>)}
            </div>
          </div>

          {/* ── CATEGORIAS + RADAR ────────────────────── */}
          <div className="teap-card">
            <div className="teap-card-title">Categorias</div>
            {data.categorias.map(c => <CategoryRow key={c.nome} {...c} />)}
          </div>

          <div className="teap-card">
            <div className="teap-card-title">Radar</div>
            <RadarChart data={data.radar} />
          </div>

          {/* ── RECOMENDAÇÕES + HISTÓRICO ─────────────── */}
          <div className="teap-card">
            <div className="teap-card-title">Recomendações</div>
            <div className="teap-reco-grid">
              <div className="teap-reco-box tone-low">
                <div className="teap-reco-label">Fraco</div>
                <div className="teap-reco-value">{pontoFraco.nome}</div>
              </div>
              <div className="teap-reco-box tone-good">
                <div className="teap-reco-label">Forte</div>
                <div className="teap-reco-value">{pontoForte.nome}</div>
              </div>
            </div>
            <p className="teap-reco-text">
              Foque em <strong>{pontoFraco.nome}</strong> antes do próximo simulado.
              {ganhoTempo > 0 && <> Tempo/questão já melhorou {ganhoTempo}s.</>}
            </p>
            {pontoFraco.nome !== '—' && (
              <button className="teap-reco-praticar" onClick={() => navigate(`/teap/praticar/${encodeURIComponent(pontoFraco.nome)}`)}>
                Praticar {pontoFraco.nome} →
              </button>
            )}
          </div>

          <div className="teap-card">
            <div className="teap-card-title">Histórico</div>
            {data.simulados.slice().reverse().map((s, i) => (
              <div key={i} className="teap-hist-row">
                <span className="teap-hist-date">{s.data}</span>
                <span className="teap-hist-nota">{s.nota}%</span>
                <span className="teap-hist-tempo">{s.tempoTotal} min</span>
              </div>
            ))}
          </div>

          {/* ── VOCABULÁRIO (largura total) ───────────── */}
          <div className="teap-card teap-grid-full">
            <div className="teap-card-title">Banco de Palavras</div>
            <div className="teap-vocab-grid">
              {data.vocabulario.map(v => <VocabCard key={v.palavra} item={v} />)}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeapSimuladoExam.css';

/* ═══════════════════════════════════════════════════════════════════════
   Tela do simulado — landscape, tela cheia, sem Navbar (foco total).
   Feita para computador/tablet (aviso é mostrado em telas estreitas via CSS,
   sem depender de rotação forçada — não há API confiável pra isso no iOS).
   ═══════════════════════════════════════════════════════════════════════ */

export default function TeapSimuladoExam({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sim, setSim] = useState(null);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [activeText, setActiveText] = useState(1);
  const [resultado, setResultado] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/index?route=teap-simulado-detail&id=${encodeURIComponent(id)}`);
        const json = await res.json();
        if (!active) return;
        setSim(json);
        if (json.questoes?.[0]) setActiveText(json.questoes[0].textoReferencia === 'Texto 2' ? 2 : 1);
      } catch {
        if (active) setError(true);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const questao = sim?.questoes?.[current];

  const answer = (value) => {
    setRespostas(prev => ({ ...prev, [questao.numero]: value }));
  };

  const goTo = (idx) => {
    if (idx < 0 || idx >= sim.questoes.length) return;
    setCurrent(idx);
    const q = sim.questoes[idx];
    setActiveText(q.textoReferencia === 'Texto 2' ? 2 : 1);
  };

  const finalizar = async () => {
    setSubmitting(true);
    const tempoTotalMin = (Date.now() - startTimeRef.current) / 60000;
    const tempoMedioSeg = ((Date.now() - startTimeRef.current) / 1000) / sim.questoes.length;
    try {
      const res = await fetch('/api/index?route=teap-simulado-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email, simuladoId: id, respostas,
          tempoTotalMin: tempoTotalMin.toFixed(1), tempoMedioSeg: tempoMedioSeg.toFixed(0),
        }),
      });
      const json = await res.json();
      setResultado(json);
    } catch {
      setError(true);
    }
    setSubmitting(false);
  };

  if (error) {
    return (
      <div className="texam-page">
        <div className="texam-narrow-guard">
          <p>Não foi possível carregar o simulado. <button onClick={() => navigate('/teap/simulados')}>Voltar</button></p>
        </div>
      </div>
    );
  }

  if (!sim) {
    return <div className="texam-page"><p className="texam-loading">Carregando simulado...</p></div>;
  }

  // ── TELA DE RESULTADO (gabarito na hora) ──────────────────────────────
  if (resultado) {
    return (
      <div className="texam-page">
        <div className="texam-narrow-guard">
          <div className="texam-rotate-icon">↻</div>
          <p>Essa atividade funciona melhor em computador ou tablet.</p>
        </div>
        <div className="texam-content texam-result-content">
          <div className="texam-result-score">
            <div className="texam-result-number">{resultado.acertos}<span>/{resultado.total}</span></div>
            <div className="texam-result-note">Nota: {resultado.nota}% — salva no seu histórico ✓</div>
          </div>
          <div className="texam-result-list">
            {resultado.gabarito?.map(g => (
              <div key={g.numero} className="texam-result-row">
                <span className="texam-result-q">Q{g.numero}</span>
                <span className="texam-result-enunciado">{g.enunciado}</span>
                <span className={g.correta ? 'texam-result-ok' : 'texam-result-bad'}>
                  {g.correta ? `✓ ${g.respostaAluno || '—'}` : `✗ ${g.respostaAluno || '—'} (certa: ${g.respostaCerta})`}
                </span>
              </div>
            ))}
          </div>
          <button className="texam-finish-btn" onClick={() => navigate('/teap')}>Voltar ao painel</button>
        </div>
      </div>
    );
  }

  // ── TELA DE RESPOSTA ───────────────────────────────────────────────────
  const isLast = current === sim.questoes.length - 1;
  const answered = respostas[questao.numero];

  return (
    <div className="texam-page">
      <div className="texam-narrow-guard">
        <div className="texam-rotate-icon">↻</div>
        <p>Essa atividade funciona melhor em computador ou tablet.</p>
      </div>

      <div className="texam-content">
        <div className="texam-topbar">
          <span>{sim.titulo} · Questão {current + 1}/{sim.questoes.length}</span>
          <button className="texam-exit" onClick={() => navigate('/teap/simulados')}>Sair</button>
        </div>
        <div className="texam-progress">
          <div className="texam-progress-fill" style={{ width: `${((current + 1) / sim.questoes.length) * 100}%` }} />
        </div>

        <div className="texam-panels">
          <div className="texam-text-panel">
            <div className="texam-text-tabs">
              <button className={activeText === 1 ? 'active' : ''} onClick={() => setActiveText(1)}>Texto 1</button>
              <button className={activeText === 2 ? 'active' : ''} onClick={() => setActiveText(2)}>Texto 2</button>
            </div>
            <div className="texam-text-body">
              {(activeText === 1 ? sim.texto1 : sim.texto2)
                .split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="texam-question-panel">
            <div className="texam-question-body">{questao.enunciado}</div>
            <div className="texam-answer-list">
              {Object.entries(questao.alternativas || {}).map(([letra, texto]) => (
                <button
                  key={letra}
                  className={`texam-answer ${answered === letra ? 'selected' : ''}`}
                  onClick={() => answer(letra)}
                >
                  <span className="texam-answer-letter">{letra}</span>
                  <span className="texam-answer-text">{texto}</span>
                </button>
              ))}
            </div>
            <div className="texam-nav">
              <button disabled={current === 0} onClick={() => goTo(current - 1)}>‹ Anterior</button>
              {isLast
                ? <button className="texam-finalizar" disabled={submitting} onClick={finalizar}>
                    {submitting ? 'Enviando...' : 'Finalizar simulado'}
                  </button>
                : <button className="texam-next" onClick={() => goTo(current + 1)}>Próxima ›</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

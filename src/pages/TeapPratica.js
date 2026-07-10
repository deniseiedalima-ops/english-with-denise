import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './TeapPratica.css';

export default function TeapPratica({ user, student, onLogout }) {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState(null);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [respondida, setRespondida] = useState(null); // letra escolhida, ou null

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/index?route=teap-pratica&categoria=${encodeURIComponent(categoria)}`);
        const json = await res.json();
        if (!active) return;
        setQuestoes(json.questoes || []);
      } catch {
        if (active) setError(true);
      }
    })();
    return () => { active = false; };
  }, [categoria]);

  const questao = questoes?.[current];

  const proxima = () => {
    setRespondida(null);
    setCurrent(c => c + 1);
  };

  return (
    <div className="tprat-page">
      <Navbar user={user} student={student} onLogout={onLogout} />
      <main className="tprat-content">
        <button className="tprat-back" onClick={() => navigate('/teap')}>← Painel TEAP</button>
        <h1 className="tprat-title">Praticar: {categoria}</h1>

        {error && <p className="tprat-empty">Não foi possível carregar as questões.</p>}
        {!error && questoes === null && <p className="tprat-empty">Carregando...</p>}
        {!error && questoes && questoes.length === 0 && (
          <p className="tprat-empty">Ainda não há questões de prática cadastradas para esta categoria.</p>
        )}

        {questoes && questoes.length > 0 && current >= questoes.length && (
          <div className="tprat-done">
            <div className="tprat-done-icon">✓</div>
            <p>Você praticou todas as {questoes.length} questões desta categoria.</p>
            <button className="tprat-done-btn" onClick={() => navigate('/teap')}>Voltar ao painel</button>
          </div>
        )}

        {questao && (
          <div className="tprat-card">
            <div className="tprat-progress">Questão {current + 1} de {questoes.length}</div>
            <div className="tprat-enunciado">{questao.enunciado}</div>
            <div className="tprat-alternativas">
              {Object.entries(questao.alternativas || {}).map(([letra, texto]) => {
                const isCerta = letra === questao.respostaCerta;
                const isEscolhida = letra === respondida;
                let cls = 'tprat-alt';
                if (respondida) {
                  if (isCerta) cls += ' correta';
                  else if (isEscolhida) cls += ' errada';
                }
                return (
                  <button
                    key={letra}
                    className={cls}
                    disabled={!!respondida}
                    onClick={() => setRespondida(letra)}
                  >
                    <span className="tprat-alt-letter">{letra}</span>
                    <span>{texto}</span>
                  </button>
                );
              })}
            </div>

            {respondida && (
              <div className={`tprat-feedback ${respondida === questao.respostaCerta ? 'ok' : 'bad'}`}>
                <div className="tprat-feedback-title">
                  {respondida === questao.respostaCerta ? '✓ Certa!' : `✗ A certa era ${questao.respostaCerta}`}
                </div>
                {questao.explicacao && <p>{questao.explicacao}</p>}
                <button className="tprat-next-btn" onClick={proxima}>
                  {current + 1 < questoes.length ? 'Próxima questão →' : 'Concluir →'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

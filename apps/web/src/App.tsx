import { FormEvent, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

type Step = "diagnostico" | "orientacao" | "acompanhamento" | "ouvidoria";

const priorities = [
  {
    component: "Gestão de riscos climáticos",
    level: "Estágio inicial",
    score: "1,2 / 4",
    reason: "Não há processo estruturado de prevenção e monitoramento.",
  },
  {
    component: "Adaptação e resiliência",
    level: "Em desenvolvimento",
    score: "1,8 / 4",
    reason: "O plano existe, mas não cobre metas, orçamento e responsáveis.",
  },
  {
    component: "Inventário de emissões",
    level: "Em desenvolvimento",
    score: "2,1 / 4",
    reason: "A última atualização está fora do período recomendado.",
  },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<FinalPlaceholder />} />
      <Route path="/prototipo-baixa" element={<LowFidelityPrototype />} />
      <Route path="*" element={<Navigate to="/prototipo-baixa" replace />} />
    </Routes>
  );
}

function FinalPlaceholder() {
  return (
    <main className="final-placeholder">
      <p>Vozes do Cerrado</p>
      <h1>A versão final será construída aqui.</h1>
      <Link to="/prototipo-baixa">Abrir sandbox do protótipo de baixa</Link>
    </main>
  );
}

function LowFidelityPrototype() {
  const [step, setStep] = useState<Step>("diagnostico");

  return (
    <div className="prototype-shell">
      <div className="draft-ribbon" aria-label="Ambiente de protótipo">
        MODO RASCUNHO · DADOS ILUSTRATIVOS · NÃO É A INTERFACE FINAL
      </div>

      <header className="prototype-header">
        <div className="brand-block">
          <span className="sketch-logo" aria-hidden="true">VC</span>
          <div>
            <strong>Vozes do Cerrado</strong>
            <small>Protótipo de baixa fidelidade</small>
          </div>
        </div>
        <div className="header-actions">
          <button
            className={`ombudsman-button ${step === "ouvidoria" ? "is-active" : ""}`}
            onClick={() => setStep("ouvidoria")}
            aria-pressed={step === "ouvidoria"}
          >
            Ouvidoria
          </button>
          <label>
            Estado analisado
            <select defaultValue="GO">
              <option value="GO">Goiás</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
            </select>
          </label>
        </div>
      </header>

      <div className="prototype-grid">
        <aside className="prototype-sidebar" aria-label="Etapas da jornada">
          <p className="sidebar-label">Jornada do gestor</p>
          <StepButton number="1" label="Diagnóstico" active={step === "diagnostico"} onClick={() => setStep("diagnostico")} />
          <StepButton number="2" label="Orientação" active={step === "orientacao"} onClick={() => setStep("orientacao")} />
          <StepButton number="3" label="Acompanhamento" active={step === "acompanhamento"} onClick={() => setStep("acompanhamento")} />
          <div className="wire-note">
            <strong>Objetivo do teste</strong>
            <p>O gestor consegue identificar uma prioridade, entender o risco e acompanhar a ação publicada pelo TCU?</p>
          </div>
        </aside>

        <main className="prototype-main" id="conteudo">
          {step === "diagnostico" && <Diagnosis onContinue={() => setStep("orientacao")} />}
          {step === "orientacao" && <Guidance onBack={() => setStep("diagnostico")} onContinue={() => setStep("acompanhamento")} />}
          {step === "acompanhamento" && (
            <PlanTracking onBack={() => setStep("orientacao")} onOpenOmbudsman={() => setStep("ouvidoria")} />
          )}
          {step === "ouvidoria" && <Ombudsman onBack={() => setStep("acompanhamento")} />}
        </main>
      </div>
    </div>
  );
}

function StepButton({ number, label, active, onClick }: { number: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={`step-button ${active ? "is-active" : ""}`} onClick={onClick} aria-current={active ? "step" : undefined}>
      <span>{number}</span>
      {label}
    </button>
  );
}

function Diagnosis({ onContinue }: { onContinue: () => void }) {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Diagnóstico estadual</p>
          <h1>Onde Goiás precisa agir primeiro?</h1>
          <p>As lacunas abaixo foram ordenadas por nota, risco e ausência de evidências.</p>
        </div>
        <div className="score-box">
          <small>Nota geral</small>
          <strong>1,9</strong>
          <span>de 4</span>
        </div>
      </div>

      <div className="summary-strip" aria-label="Resumo dos dados">
        <span><strong>3</strong> prioridades críticas</span>
        <span><strong>72%</strong> dos dados cobertos</span>
        <span><strong>2026</strong> última avaliação</span>
      </div>

      <div className="section-heading">
        <h2>Prioridades recomendadas</h2>
        <button className="text-button">Como a ordem foi calculada?</button>
      </div>

      <div className="priority-list">
        {priorities.map((priority, index) => (
          <article className="priority-card" key={priority.component}>
            <span className="priority-position">#{index + 1}</span>
            <div>
              <p className="wire-tag">{priority.level}</p>
              <h3>{priority.component}</h3>
              <p>{priority.reason}</p>
            </div>
            <div className="priority-action">
              <strong>{priority.score}</strong>
              <button onClick={index === 0 ? onContinue : undefined}>Ver lacuna →</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Guidance({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <section>
      <button className="back-button" onClick={onBack}>← Voltar ao diagnóstico</button>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">Prioridade #1</p>
          <h1>Gestão de riscos climáticos</h1>
          <p>Seu estado está em estágio inicial. A avaliação não encontrou um processo estruturado de prevenção e monitoramento.</p>
        </div>
        <div className="score-box"><small>Nível atual</small><strong>1</strong><span>Inicial</span></div>
      </div>

      <article className="risk-placeholder risk-first">
        <div className="fake-map" aria-label="Espaço reservado para mapa de risco">
          <span>MAPA DE RISCO</span>
          <i className="map-area one" />
          <i className="map-area two" />
          <i className="map-area three" />
        </div>
        <div>
          <p className="eyebrow">Riscos da inação</p>
          <h2>Eventos extremos encontram uma resposta mais lenta</h2>
          <ul>
            <li>maior exposição da população;</li>
            <li>perdas humanas e materiais;</li>
            <li>mais recursos usados em resposta, menos em prevenção.</li>
          </ul>
          <small>[Fonte, período e metodologia entram aqui]</small>
        </div>
      </article>

      <div className="two-column">
        <article className="wire-panel">
          <span className="panel-index">A</span>
          <h2>O que falta para avançar</h2>
          <ul className="check-list">
            <li><span>□</span> Mapeamento atualizado de áreas de risco</li>
            <li><span>□</span> Responsáveis formalmente definidos</li>
            <li><span>□</span> Rotina de prevenção e monitoramento</li>
            <li><span>✓</span> Plano de contingência publicado</li>
          </ul>
        </article>
        <article className="wire-panel">
          <span className="panel-index">B</span>
          <h2>Referência comparável</h2>
          <p><strong>Estado X · nível avançado</strong></p>
          <p>Selecionado por semelhança regional e exposição a períodos de seca.</p>
          <button className="text-button">Ver evidências da referência</button>
        </article>
      </div>

      <div className="prototype-callout">
        <strong>Próximo passo sugerido</strong>
        <p>Verificar o mapeamento existente, definir responsáveis e estabelecer uma rotina de monitoramento.</p>
        <button className="primary-button" onClick={onContinue}>Acompanhar plano de ação →</button>
      </div>
    </section>
  );
}

function PlanTracking({ onBack, onOpenOmbudsman }: { onBack: () => void; onOpenOmbudsman: () => void }) {
  return (
    <section>
      <button className="back-button" onClick={onBack}>← Voltar à orientação</button>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">Acompanhamento</p>
          <h1>Acompanhe o plano de ação</h1>
          <p>Consulte o andamento, os responsáveis e as evidências publicadas.</p>
        </div>
        <div className="score-box"><small>Status atual</small><strong>2</strong><span>Em andamento</span></div>
      </div>

      <aside className="ownership-notice" aria-label="Responsabilidade pela atualização">
        <span aria-hidden="true">i</span>
        <div>
          <strong>Atualização feita pelo TCU</strong>
          <p>Esta plataforma é somente para acompanhamento. O plano, os prazos e as evidências são atualizados pelo TCU.</p>
        </div>
      </aside>

      <div className="tracking-layout">
        <article className="tracking-summary">
          <p className="eyebrow">Ação acompanhada</p>
          <h2>Atualizar o mapeamento estadual de áreas de risco</h2>
          <dl className="tracking-details">
            <div><dt>Ligada a</dt><dd>Gestão de riscos climáticos · prioridade #1</dd></div>
            <div><dt>Responsável</dt><dd>[Órgão informado pelo TCU]</dd></div>
            <div><dt>Prazo</dt><dd>[Data informada pelo TCU]</dd></div>
            <div><dt>Última atualização</dt><dd>[Data e hora da publicação]</dd></div>
          </dl>
          <button className="text-button">Ver evidências publicadas</button>
        </article>

        <article className="tracking-progress" aria-labelledby="progress-title">
          <p className="eyebrow">Andamento</p>
          <h2 id="progress-title">Histórico do plano</h2>
          <ol className="status-timeline">
            <li className="is-complete"><span>✓</span><div><strong>Plano publicado</strong><small>Concluído</small></div></li>
            <li className="is-current"><span>2</span><div><strong>Responsável designado</strong><small>Etapa atual</small></div></li>
            <li><span>3</span><div><strong>Execução acompanhada</strong><small>Aguardando atualização</small></div></li>
            <li><span>4</span><div><strong>Evidência final publicada</strong><small>Aguardando atualização</small></div></li>
          </ol>
        </article>
      </div>

      <div className="prototype-callout support-callout">
        <div>
          <strong>Precisa esclarecer ou contestar uma informação?</strong>
          <p>A Ouvidoria recebe dúvidas, correções, reclamações e sugestões sobre os dados apresentados.</p>
        </div>
        <button className="primary-button" onClick={onOpenOmbudsman}>Falar com a Ouvidoria →</button>
      </div>
    </section>
  );
}

function Ombudsman({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <section className="success-state">
        <div className="success-mark">✓</div>
        <p className="eyebrow">Ouvidoria</p>
        <h1>Manifestação registrada no protótipo</h1>
        <p>Nenhuma informação foi enviada. Esta etapa serve para validar o fluxo e a clareza do canal.</p>
        <button className="primary-button" onClick={onBack}>Voltar ao acompanhamento</button>
      </section>
    );
  }

  return (
    <section>
      <button className="back-button" onClick={onBack}>← Voltar ao acompanhamento</button>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">Canal do cliente</p>
          <h1>Fale com a Ouvidoria</h1>
          <p>Envie dúvidas, pedidos de correção, reclamações ou sugestões sobre os dados e o acompanhamento.</p>
        </div>
      </div>

      <aside className="ownership-notice">
        <span aria-hidden="true">!</span>
        <div>
          <strong>A Ouvidoria não altera o plano de ação</strong>
          <p>As atualizações continuam sob responsabilidade do TCU. Este canal registra a manifestação do cliente.</p>
        </div>
      </aside>

      <form className="ombudsman-form" onSubmit={submit}>
        <label>
          Tipo de manifestação
          <select required defaultValue="">
            <option value="" disabled>Selecione uma opção</option>
            <option>Dúvida sobre os dados</option>
            <option>Pedido de correção</option>
            <option>Reclamação</option>
            <option>Sugestão</option>
          </select>
        </label>
        <label>
          Assunto
          <input required placeholder="Resuma o motivo do contato" />
        </label>
        <label>
          Mensagem
          <textarea required placeholder="Descreva o que aconteceu e qual informação precisa ser analisada" />
        </label>
        <label className="consent-field">
          <input type="checkbox" required />
          <span>Confirmo que revisei a mensagem e autorizo o registro desta manifestação.</span>
        </label>
        <div className="form-footer">
          <small>Campos obrigatórios. O prazo de resposta será definido no serviço oficial.</small>
          <button className="primary-button" type="submit">Registrar manifestação</button>
        </div>
      </form>
    </section>
  );
}

export default App;

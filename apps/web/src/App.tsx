import { FormEvent, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

type Step = "diagnostico" | "orientacao" | "plano" | "salvo";

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
        <div>
          <span className="sketch-logo" aria-hidden="true">VC</span>
          <div>
            <strong>Vozes do Cerrado</strong>
            <small>Protótipo de baixa fidelidade</small>
          </div>
        </div>
        <label>
          Estado analisado
          <select defaultValue="GO">
            <option value="GO">Goiás</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
          </select>
        </label>
      </header>

      <div className="prototype-grid">
        <aside className="prototype-sidebar" aria-label="Etapas da jornada">
          <p className="sidebar-label">Jornada do gestor</p>
          <StepButton number="1" label="Diagnóstico" active={step === "diagnostico"} onClick={() => setStep("diagnostico")} />
          <StepButton number="2" label="Orientação" active={step === "orientacao"} onClick={() => setStep("orientacao")} />
          <StepButton number="3" label="Plano de ação" active={step === "plano" || step === "salvo"} onClick={() => setStep("plano")} />
          <div className="wire-note">
            <strong>Objetivo do teste</strong>
            <p>O gestor consegue identificar uma prioridade e transformá-la em ação?</p>
          </div>
        </aside>

        <main className="prototype-main" id="conteudo">
          {step === "diagnostico" && <Diagnosis onContinue={() => setStep("orientacao")} />}
          {step === "orientacao" && <Guidance onBack={() => setStep("diagnostico")} onContinue={() => setStep("plano")} />}
          {step === "plano" && <ActionPlan onBack={() => setStep("orientacao")} onSave={() => setStep("salvo")} />}
          {step === "salvo" && <SavedPlan onRestart={() => setStep("diagnostico")} />}
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

      <article className="risk-placeholder">
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

      <div className="prototype-callout">
        <strong>Próximo passo sugerido</strong>
        <p>Verificar o mapeamento existente, definir responsáveis e estabelecer uma rotina de monitoramento.</p>
        <button className="primary-button" onClick={onContinue}>Transformar em plano de ação →</button>
      </div>
    </section>
  );
}

function ActionPlan({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave();
  }

  return (
    <section>
      <button className="back-button" onClick={onBack}>← Voltar à orientação</button>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">Nova ação</p>
          <h1>Organizar o primeiro avanço</h1>
          <p>Adapte a sugestão ao contexto do estado antes de salvar.</p>
        </div>
      </div>

      <form className="action-form" onSubmit={submit}>
        <label className="full-field">
          Ação
          <input required defaultValue="Atualizar o mapeamento estadual de áreas de risco" />
        </label>
        <label>
          Responsável
          <input required placeholder="Nome ou órgão" />
        </label>
        <label>
          Prazo
          <input required type="date" />
        </label>
        <label>
          Indicador
          <input required defaultValue="Percentual do território mapeado" />
        </label>
        <label>
          Meta
          <input required defaultValue="100% das áreas prioritárias" />
        </label>
        <label className="full-field">
          Evidência esperada
          <textarea required defaultValue="Mapa atualizado, ato de aprovação e relatório metodológico." />
        </label>
        <div className="form-footer full-field">
          <p><strong>Ligada a:</strong> Gestão de riscos climáticos · prioridade #1</p>
          <button className="primary-button" type="submit">Salvar plano de ação</button>
        </div>
      </form>
    </section>
  );
}

function SavedPlan({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="success-state">
      <div className="success-mark">✓</div>
      <p className="eyebrow">Fluxo concluído</p>
      <h1>Plano de ação salvo no protótipo</h1>
      <p>Nesta sandbox, nada foi enviado para um banco de dados. O objetivo é validar se o fluxo faz sentido.</p>
      <div className="saved-summary">
        <span>Ação</span><strong>Atualizar o mapeamento estadual de áreas de risco</strong>
        <span>Status</span><strong>Não iniciada</strong>
        <span>Próxima etapa</span><strong>Definir responsável e validar com a equipe</strong>
      </div>
      <button className="primary-button" onClick={onRestart}>Testar novamente</button>
    </section>
  );
}

export default App;


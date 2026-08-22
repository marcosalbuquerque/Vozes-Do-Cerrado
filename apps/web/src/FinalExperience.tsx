import { FormEvent, ReactNode, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

type IconName = "arrow" | "check" | "chevron" | "clock" | "download" | "info" | "message" | "shield";

const finalPriorities = [
  {
    position: "01",
    component: "Gestão de riscos climáticos",
    level: "Estágio inicial",
    score: "1,2",
    reason: "Faltam mapeamento atualizado, responsáveis definidos e uma rotina de prevenção.",
    tone: "critical",
    to: "/prioridade/gestao-de-riscos",
  },
  {
    position: "02",
    component: "Adaptação e resiliência",
    level: "Em desenvolvimento",
    score: "1,8",
    reason: "O plano existe, mas ainda não conecta metas, orçamento e responsáveis.",
    tone: "attention",
  },
  {
    position: "03",
    component: "Inventário de emissões",
    level: "Em desenvolvimento",
    score: "2,1",
    reason: "A última atualização está fora do período recomendado para a análise.",
    tone: "moderate",
  },
];

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></>,
    message: <><path d="M5 18 3 21l1-5a8 8 0 1 1 3 3Z"/><path d="M8 12h8M8 9h5"/></>,
    shield: <><path d="M12 3 4.5 6v5c0 4.8 3.2 8.1 7.5 10 4.3-1.9 7.5-5.2 7.5-10V6Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  };
  return <svg className="vc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function EvidenceWave({ compact = false }: { compact?: boolean }) {
  const bars = [26, 46, 31, 68, 43, 82, 57, 91, 73, 100, 66, 88];
  return (
    <div className={`vc-wave ${compact ? "is-compact" : ""}`} aria-hidden="true">
      {bars.map((height, index) => <i key={index} style={{ "--bar": `${height}%`, "--delay": `${index * 45}ms` } as React.CSSProperties} />)}
    </div>
  );
}

export function FinalLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="vc-app">
      <a className="vc-skip" href="#conteudo-principal">Pular para o conteúdo</a>
      <div className="vc-demo-bar"><span>Cenário demonstrativo</span><span>Dados ilustrativos para validação da experiência</span></div>
      <header className="vc-header">
        <Link className="vc-brand" to="/" aria-label="Vozes do Cerrado — página inicial">
          <span className="vc-brand-mark" aria-hidden="true"><i/><i/><i/><i/><i/></span>
          <span><strong>Vozes</strong> do Cerrado</span>
        </Link>
        <button className="vc-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="navegacao-principal">Menu</button>
        <nav id="navegacao-principal" className={menuOpen ? "is-open" : ""} aria-label="Navegação principal">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Diagnóstico</NavLink>
          <NavLink to="/acompanhamento" onClick={() => setMenuOpen(false)}>Acompanhamento</NavLink>
          <NavLink className="vc-nav-support" to="/ouvidoria" onClick={() => setMenuOpen(false)}><Icon name="message"/> Ouvidoria</NavLink>
        </nav>
      </header>
      <main id="conteudo-principal"><Outlet /></main>
      <footer className="vc-footer">
        <div className="vc-brand vc-brand-footer"><span className="vc-brand-mark" aria-hidden="true"><i/><i/><i/><i/><i/></span><span><strong>Vozes</strong> do Cerrado</span></div>
        <p>Inteligência territorial para transformar evidências climáticas em ação pública.</p>
        <div><Link to="/ouvidoria">Ouvidoria</Link><Link to="/prototipo-baixa">Ver protótipo de baixa</Link></div>
      </footer>
    </div>
  );
}

export function FinalDashboard() {
  return (
    <>
      <section className="vc-hero">
        <div className="vc-hero-copy">
          <p className="vc-kicker">Painel ClimaBrasil · inteligência territorial</p>
          <h1>Onde agir <em>primeiro?</em></h1>
          <p className="vc-lead">Encontre as lacunas que mais ampliam o risco climático e acompanhe a resposta pública com evidências claras.</p>
          <div className="vc-filter-row">
            <label htmlFor="state-select">Território analisado</label>
            <select id="state-select" defaultValue="GO"><option value="GO">Goiás</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option></select>
            <a href="#prioridades" className="vc-button vc-button-lime">Ver prioridades <Icon name="arrow"/></a>
          </div>
        </div>
        <div className="vc-hero-data">
          <div className="vc-score-orbit"><span>Nota geral</span><strong>1,9</strong><small>de 4 pontos</small></div>
          <EvidenceWave />
          <p><span>72%</span> dos itens avaliados têm evidência disponível</p>
        </div>
      </section>

      <section className="vc-overview" aria-label="Resumo do diagnóstico">
        <div><span className="vc-metric">03</span><p><strong>prioridades críticas</strong> pedem resposta coordenada</p></div>
        <div><span className="vc-metric">2026</span><p><strong>ano da avaliação</strong> usada neste cenário</p></div>
        <div><span className="vc-status-dot"/><p><strong>Dados demonstrativos</strong> não representam avaliação oficial</p></div>
      </section>

      <section className="vc-section vc-priorities" id="prioridades">
        <header className="vc-section-heading">
          <div><p className="vc-kicker vc-kicker-dark">Diagnóstico estadual</p><h2>Prioridades recomendadas</h2></div>
          <p>Ordenadas por nota, exposição ao risco e ausência de evidências.</p>
        </header>
        <div className="vc-priority-list">
          {finalPriorities.map((priority) => (
            <article className="vc-priority" key={priority.position}>
              <div className={`vc-priority-index is-${priority.tone}`}><span>{priority.position}</span><i/></div>
              <div className="vc-priority-main"><span className={`vc-pill is-${priority.tone}`}>{priority.level}</span><h3>{priority.component}</h3><p>{priority.reason}</p></div>
              <div className="vc-priority-score"><span>Nota</span><strong>{priority.score}</strong><small>de 4</small></div>
              {priority.to ? <Link className="vc-round-link" to={priority.to} aria-label={`Ver detalhes de ${priority.component}`}><Icon name="arrow"/></Link> : <button className="vc-round-link" type="button" disabled aria-label={`${priority.component}: detalhe indisponível nesta demonstração`}><Icon name="arrow"/></button>}
            </article>
          ))}
        </div>
        <aside className="vc-method-note"><Icon name="info"/><div><strong>Como calculamos a ordem?</strong><p>Combinamos a nota do componente, a exposição territorial e a disponibilidade de evidências. A metodologia completa acompanha cada resultado.</p></div><button type="button">Ver metodologia</button></aside>
      </section>
    </>
  );
}

export function FinalPriority() {
  return (
    <>
      <section className="vc-detail-hero">
        <div className="vc-detail-top"><Link to="/" className="vc-back">← Voltar ao diagnóstico</Link><span className="vc-pill is-critical">Prioridade 01</span></div>
        <div className="vc-detail-title"><div><p className="vc-kicker">Governança · gestão de riscos</p><h1>Gestão de riscos climáticos</h1><p>A avaliação não encontrou um processo estruturado de prevenção e monitoramento.</p></div><div className="vc-level"><span>Nível atual</span><strong>1</strong><small>Estágio inicial</small></div></div>
      </section>

      <section className="vc-risk-section" aria-labelledby="riscos-title">
        <div className="vc-risk-map" role="img" aria-label="Visualização ilustrativa de áreas expostas a risco climático em Goiás">
          <div className="vc-map-grid"/><span className="vc-map-label label-a">Seca severa <strong>Alta</strong></span><span className="vc-map-label label-b">Incêndios <strong>Alta</strong></span><span className="vc-map-label label-c">Inundação <strong>Média</strong></span><div className="vc-map-shape"><i/><i/><i/></div><small>Mapa ilustrativo · não representa dados reais</small>
        </div>
        <div className="vc-risk-copy"><p className="vc-kicker vc-kicker-red">Primeiro, entenda a urgência</p><h2 id="riscos-title">Riscos da inação</h2><p className="vc-risk-lead">Eventos extremos encontram uma resposta mais lenta quando o território não tem um ciclo contínuo de prevenção.</p><ul><li><span>01</span><div><strong>Mais pessoas expostas</strong><p>Alertas e respostas chegam depois do agravamento do evento.</p></div></li><li><span>02</span><div><strong>Perdas humanas e materiais</strong><p>A ausência de preparação aumenta impactos evitáveis.</p></div></li><li><span>03</span><div><strong>Mais gasto em resposta</strong><p>Recursos emergenciais substituem investimentos em prevenção.</p></div></li></ul><button className="vc-source" type="button"><Icon name="info"/> Fonte e metodologia deste cenário</button></div>
      </section>

      <section className="vc-section vc-guidance" aria-label="Orientação para avançar">
        <header className="vc-section-heading"><div><p className="vc-kicker vc-kicker-dark">Da urgência para a ação</p><h2>O que falta para avançar</h2></div><p>Quatro evidências tornam a gestão de riscos verificável.</p></header>
        <div className="vc-guidance-grid">
          <ol className="vc-evidence-list">
            <li><span>01</span><div><strong>Mapeamento atualizado de áreas de risco</strong><small>Não identificado na avaliação</small></div><i aria-label="Pendente">Pendente</i></li>
            <li><span>02</span><div><strong>Responsáveis formalmente definidos</strong><small>Não identificado na avaliação</small></div><i aria-label="Pendente">Pendente</i></li>
            <li><span>03</span><div><strong>Rotina de prevenção e monitoramento</strong><small>Não identificado na avaliação</small></div><i aria-label="Pendente">Pendente</i></li>
            <li className="is-done"><span><Icon name="check"/></span><div><strong>Plano de contingência publicado</strong><small>Evidência encontrada</small></div><i aria-label="Concluído">Concluído</i></li>
          </ol>
          <article className="vc-benchmark"><span className="vc-benchmark-letter">B</span><p className="vc-kicker vc-kicker-dark">Referência comparável</p><h3>Estado X <span>· nível avançado</span></h3><p>Selecionado por semelhança regional e exposição a períodos de seca.</p><aside><Icon name="info"/><p>Comparações são orientativas. Contexto, capacidade institucional e território devem ser considerados.</p></aside><button type="button">Ver evidências da referência <Icon name="arrow"/></button></article>
        </div>
      </section>

      <section className="vc-next-action"><div><p className="vc-kicker">Próximo passo sugerido</p><h2>Acompanhe como o plano responde a esta lacuna.</h2><p>O TCU publica responsáveis, prazos e evidências. Nesta plataforma, você consulta o andamento sem alterar o plano.</p></div><Link to="/acompanhamento" className="vc-button vc-button-lime">Acompanhar plano <Icon name="arrow"/></Link><EvidenceWave compact /></section>
    </>
  );
}

export function FinalTracking() {
  return (
    <>
      <section className="vc-page-intro"><div><p className="vc-kicker vc-kicker-dark">Acompanhamento público</p><h1>Da prioridade à entrega</h1><p>Consulte o andamento, os responsáveis e as evidências publicadas para cada ação.</p></div><div className="vc-readonly-seal"><Icon name="shield"/><span><strong>Somente leitura</strong>Atualizado pelo TCU</span></div></section>
      <section className="vc-section vc-tracking">
        <aside className="vc-tcu-notice"><Icon name="info"/><div><strong>O plano de ação é atualizado pelo TCU</strong><p>O cliente acompanha por esta plataforma. Prazos, responsáveis, status e evidências não podem ser alterados aqui.</p></div></aside>
        <div className="vc-tracking-grid">
          <article className="vc-action-summary"><div className="vc-action-heading"><span className="vc-pill is-attention">Em andamento</span><small>Ação 01 de 03</small></div><h2>Atualizar o mapeamento estadual de áreas de risco</h2><p>Resposta vinculada à prioridade “Gestão de riscos climáticos”.</p><dl><div><dt>Responsável</dt><dd>Aguardando publicação do TCU</dd></div><div><dt>Prazo</dt><dd>Aguardando publicação do TCU</dd></div><div><dt>Última atualização</dt><dd>15 ago 2026 · cenário demonstrativo</dd></div></dl><button type="button" className="vc-evidence-button"><Icon name="download"/> Consultar evidências publicadas</button></article>
          <article className="vc-timeline"><p className="vc-kicker vc-kicker-dark">Histórico do plano</p><h2>Andamento registrado</h2><ol><li className="is-complete"><span><Icon name="check"/></span><div><strong>Plano publicado</strong><small>Etapa concluída</small></div></li><li className="is-current"><span>02</span><div><strong>Responsável designado</strong><small>Etapa atual</small></div></li><li><span>03</span><div><strong>Execução acompanhada</strong><small>Aguardando atualização</small></div></li><li><span>04</span><div><strong>Evidência final publicada</strong><small>Aguardando atualização</small></div></li></ol></article>
        </div>
      </section>
      <section className="vc-support-band"><div><Icon name="message"/><span><strong>Encontrou uma informação incorreta?</strong>Envie uma dúvida, correção, reclamação ou sugestão.</span></div><Link to="/ouvidoria" className="vc-button vc-button-dark">Falar com a Ouvidoria <Icon name="arrow"/></Link></section>
    </>
  );
}

export function FinalOmbudsman() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <section className="vc-form-shell vc-success"><span className="vc-success-mark"><Icon name="check"/></span><p className="vc-kicker vc-kicker-dark">Demonstração da Ouvidoria</p><h1>Manifestação registrada neste cenário</h1><p>Nenhuma informação foi enviada. O retorno confirma apenas o comportamento da interface.</p><Link to="/acompanhamento" className="vc-button vc-button-dark">Voltar ao acompanhamento <Icon name="arrow"/></Link></section>;
  return (
    <section className="vc-form-shell">
      <div className="vc-form-intro"><Link to="/acompanhamento" className="vc-back">← Voltar ao acompanhamento</Link><p className="vc-kicker vc-kicker-dark">Canal do cliente</p><h1>Fale com a Ouvidoria</h1><p>Registre dúvidas, pedidos de correção, reclamações ou sugestões sobre os dados e o acompanhamento.</p><aside><Icon name="info"/><p><strong>A Ouvidoria não altera o plano.</strong> As atualizações continuam sob responsabilidade do TCU.</p></aside></div>
      <form className="vc-final-form" onSubmit={submit}><p className="vc-form-required">Todos os campos são obrigatórios</p><label>Tipo de manifestação<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Dúvida sobre os dados</option><option>Pedido de correção</option><option>Reclamação</option><option>Sugestão</option></select></label><label>Assunto<input required placeholder="Resuma o motivo do contato"/></label><label>Mensagem<textarea required placeholder="Descreva a informação que precisa ser analisada"/></label><label className="vc-consent"><input type="checkbox" required/><span>Confirmo que revisei a mensagem e autorizo o registro desta manifestação.</span></label><small>Ambiente demonstrativo: nenhuma informação será enviada.</small><button className="vc-button vc-button-dark" type="submit">Registrar manifestação <Icon name="arrow"/></button></form>
    </section>
  );
}

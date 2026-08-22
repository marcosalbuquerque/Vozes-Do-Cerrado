import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import {
  ComponentScore,
  formatScore,
  getComponentStage,
  getLowestItem,
  useDfAssessment,
} from "./dfData";

type IconName = "arrow" | "check" | "chevron" | "clock" | "download" | "info" | "message" | "shield";

const riskIndicators = [
  { id: "water", shortLabel: "Estresse hídrico", label: "Risco de impacto do estresse hídrico", value: 0.82, year: 2050, level: "Muito alto", color: "#f40000", source: "AdaptaBrasil MCTI · município" },
  { id: "biodiversity", shortLabel: "Biodiversidade", label: "Resiliência climática da biodiversidade", value: 0.91, year: 2017, level: "Muito alto", color: "#f40000", source: "AdaptaBrasil MCTI · município" },
  { id: "food", shortLabel: "Segurança alimentar", label: "Ameaça climática à segurança alimentar", value: 0.45, year: 2050, level: "Médio", color: "#f6a21a", source: "AdaptaBrasil MCTI · mesorregião" },
  { id: "health", shortLabel: "Saúde", label: "Ameaça climática à saúde", value: 0.26, year: 2050, level: "Baixo", color: "#8fcf54", source: "AdaptaBrasil MCTI · município" },
] as const;

function getScoreTone(score: number) {
  if (score < 2) return "critical";
  if (score < 3) return "attention";
  return "positive";
}

function getScoreStatus(score: number) {
  if (score < 2) return "Crítico";
  if (score < 3) return "Intermediário";
  return "Avançado";
}

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
  return <div className={`vc-wave ${compact ? "is-compact" : ""}`} aria-hidden="true">{bars.map((height, index) => <i key={index} style={{ "--bar": `${height}%`, "--delay": `${index * 45}ms` } as React.CSSProperties} />)}</div>;
}

function DataState({ error, loading }: { error: string | null; loading: boolean }) {
  if (loading) return <section className="vc-data-state" aria-live="polite"><span className="vc-data-spinner"/><h2>Calculando as notas do DF</h2><p>A avaliação de 2025 está sendo processada diretamente da base do Painel ClimaBrasil.</p></section>;
  if (error) return <section className="vc-data-state is-error" role="alert"><h2>Dados indisponíveis</h2><p>{error} Verifique se a API está ativa e tente novamente.</p></section>;
  return null;
}

function summarizeProblem(component: ComponentScore) {
  const lowestItem = getLowestItem(component);
  if (!lowestItem) return "Não há item calculável neste componente.";
  const comment = lowestItem.assessmentComment.replace(/\s+/g, " ").trim();
  const excerpt = comment.length > 190 ? `${comment.slice(0, 187).trimEnd()}…` : comment;
  return excerpt || `O item “${lowestItem.itemName}” recebeu a menor classificação do componente.`;
}

export function FinalLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="vc-app">
      <a className="vc-skip" href="#conteudo-principal">Pular para o conteúdo</a>
      <div className="vc-demo-bar"><span>Dados oficiais · Distrito Federal</span><span>Painel ClimaBrasil 2025 + AdaptaBrasil MCTI</span></div>
      <header className="vc-header">
        <Link className="vc-brand" to="/" aria-label="Vozes do Cerrado — página inicial"><span className="vc-brand-mark" aria-hidden="true"><i/><i/><i/><i/><i/></span><span><strong>Vozes</strong> do Cerrado</span></Link>
        <button className="vc-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="navegacao-principal">Menu</button>
        <nav id="navegacao-principal" className={menuOpen ? "is-open" : ""} aria-label="Navegação principal">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Diagnóstico</NavLink>
          <NavLink to="/acompanhamento" onClick={() => setMenuOpen(false)}>Acompanhamento</NavLink>
          <NavLink className="vc-nav-support" to="/ouvidoria" onClick={() => setMenuOpen(false)}><Icon name="message"/> Ouvidoria</NavLink>
        </nav>
      </header>
      <main id="conteudo-principal"><Outlet /></main>
      <footer className="vc-footer"><div className="vc-brand vc-brand-footer"><span className="vc-brand-mark" aria-hidden="true"><i/><i/><i/><i/><i/></span><span><strong>Vozes</strong> do Cerrado</span></div><p>Inteligência territorial para transformar evidências climáticas em ação pública.</p><div><Link to="/ouvidoria">Ouvidoria</Link><a href="https://painelclimabrasil.tcu.gov.br/" target="_blank" rel="noreferrer">Painel ClimaBrasil</a></div></footer>
    </div>
  );
}

export function FinalDashboard() {
  const [methodOpen, setMethodOpen] = useState(false);
  const { data, error, loading } = useDfAssessment();
  const calculable = useMemo(() => data?.componentes.filter((component) => component.score !== null) ?? [], [data]);
  const priorities = useMemo(() => calculable.filter((component) => component.eligible), [calculable]);
  const overallScore = calculable.length ? calculable.reduce((sum, component) => sum + (component.score ?? 0), 0) / calculable.length : 0;
  const evaluatedItems = calculable.flatMap((component) => component.items).filter((item) => item.normalizedScore !== null);
  const evidencedItems = evaluatedItems.filter((item) => item.confidentialityStatus === "P" && item.assessmentComment.trim());
  const evidenceCoverage = evaluatedItems.length ? Math.round((evidencedItems.length / evaluatedItems.length) * 100) : 0;

  useEffect(() => {
    if (!methodOpen) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setMethodOpen(false); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [methodOpen]);

  if (!data) return <DataState error={error} loading={loading} />;

  return (
    <>
      <section className="vc-hero">
        <div className="vc-hero-copy">
          <p className="vc-kicker">Painel ClimaBrasil · avaliação 2025</p>
          <h1>Onde o DF precisa agir <em>primeiro?</em></h1>
          <p className="vc-lead">As prioridades abaixo vêm diretamente da avaliação oficial. A menor nota aparece primeiro.</p>
          <div className="vc-filter-row"><label htmlFor="state-select">Território analisado</label><select id="state-select" value="DF" disabled aria-readonly="true"><option value="DF">Distrito Federal</option></select><a href="#prioridades" className="vc-button vc-button-lime">Ver prioridades <Icon name="arrow"/></a></div>
        </div>
        <div className={`vc-hero-data is-${getScoreTone(overallScore)}`}>
          <div className="vc-score-cluster"><p className={`vc-score-status is-${getScoreTone(overallScore)}`}>{getScoreStatus(overallScore)}</p><div className={`vc-score-orbit is-${getScoreTone(overallScore)}`}><span>Média dos componentes</span><strong>{formatScore(overallScore)}</strong><small>de 4 pontos</small></div></div>
          <EvidenceWave />
          <p><span>{evidenceCoverage}%</span> dos {evaluatedItems.length} itens avaliados têm comentário público</p>
        </div>
      </section>

      <section className="vc-overview" aria-label="Resumo do diagnóstico">
        <div><span className="vc-metric">{String(priorities.length).padStart(2, "0")}</span><p><strong>Componentes críticos</strong><span>Nota abaixo de 2,00</span></p></div>
        <div><span className="vc-metric">2025</span><p><strong>Ano da avaliação</strong><span>{calculable.length} componentes calculáveis</span></p></div>
        <div className="vc-order-method"><p><strong>Como calculamos a ordem?</strong></p><button type="button" onClick={() => setMethodOpen(true)} aria-haspopup="dialog">Ver metodologia</button></div>
      </section>

      {methodOpen && <div className="vc-method-layer"><button className="vc-method-backdrop" type="button" aria-label="Fechar explicação" onClick={() => setMethodOpen(false)} /><aside className="vc-method-panel" role="dialog" aria-modal="true" aria-labelledby="method-title"><button className="vc-method-close" type="button" onClick={() => setMethodOpen(false)} autoFocus aria-label="Fechar">×</button><p className="vc-kicker vc-kicker-dark">Metodologia verificável</p><h2 id="method-title">A menor nota vem primeiro</h2><p>Cada classificação do Painel ClimaBrasil é convertida para a escala de 0 a 4. A nota do componente é a média aritmética dos itens avaliados. Componentes com nota abaixo de 2,00 entram na lista crítica e são ordenados do menor para o maior.</p><p>Itens “Não avaliados” não viram zero. Se um componente contém essa classificação, ele fica fora da priorização até que a avaliação seja concluída.</p></aside></div>}

      <section className="vc-section vc-priorities" id="prioridades">
        <header className="vc-section-heading"><div><p className="vc-kicker vc-kicker-dark">Distrito Federal</p><h2>Prioridades por menor nota</h2></div><p>{priorities.length} componentes abaixo de 2,00, sem ponderação adicional ou dado ilustrativo.</p></header>
        <div className="vc-priority-list">
          {priorities.map((priority, index) => <article className={`vc-priority is-${getScoreTone(priority.score ?? 0)} ${index === 0 ? "is-featured" : ""}`} key={priority.componentIdentifier}>
            <div className="vc-priority-index">{index === 0 ? <span className="vc-priority-index-alert" role="img" aria-label="Menor nota"><b aria-hidden="true">!</b></span> : <span>{String(index + 1).padStart(2, "0")}</span>}</div>
            <div className="vc-priority-main"><div className="vc-priority-status"><span className="vc-pill is-critical">{getComponentStage(priority.score ?? 0)}</span><span className="vc-component-code">{priority.componentIdentifier} · {priority.axisName}</span></div><h3>{priority.componentName}</h3><p>{summarizeProblem(priority)}</p></div>
            <div className={`vc-priority-score is-${getScoreTone(priority.score ?? 0)}`}><span>Nota real</span><strong>{formatScore(priority.score ?? 0)}</strong><small>de 4</small></div>
            <Link className="vc-round-link" to={`/prioridade/${priority.componentIdentifier}`} aria-label={`Ver dados de ${priority.componentName}`}><Icon name="arrow"/></Link>
          </article>)}
        </div>
      </section>
    </>
  );
}

type GeoJson = { features: Array<{ geometry: { type: "MultiPolygon"; coordinates: number[][][][] } }> };

function DfRiskMap() {
  const [selectedId, setSelectedId] = useState<(typeof riskIndicators)[number]["id"]>("water");
  const [geoJson, setGeoJson] = useState<GeoJson | null>(null);
  const indicator = riskIndicators.find((item) => item.id === selectedId) ?? riskIndicators[0];

  useEffect(() => {
    fetch("/data/df-estresse-hidrico-2050.geojson").then((response) => {
      if (!response.ok) throw new Error("Mapa indisponível");
      return response.json() as Promise<GeoJson>;
    }).then(setGeoJson).catch(() => setGeoJson(null));
  }, []);

  const mapPaths = useMemo(() => {
    const polygons = geoJson?.features[0]?.geometry.coordinates ?? [];
    const points = polygons.flat(2) as number[][];
    if (!points.length) return [];
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const minX = Math.min(...xs); const maxX = Math.max(...xs); const minY = Math.min(...ys); const maxY = Math.max(...ys);
    const width = 520; const height = 360; const padding = 34;
    const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY));
    return polygons.map((polygon) => polygon.map((ring) => ring.map(([x, y], index) => `${index === 0 ? "M" : "L"}${padding + (x - minX) * scale} ${height - padding - (y - minY) * scale}`).join(" ") + " Z").join(" "));
  }, [geoJson]);

  return <div className="vc-real-map">
    <div className="vc-map-tabs" role="tablist" aria-label="Indicador climático">{riskIndicators.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === selectedId} onClick={() => setSelectedId(item.id)}>{item.shortLabel}</button>)}</div>
    <div className="vc-map-canvas">
      <svg viewBox="0 0 520 360" role="img" aria-label={`${indicator.label} no Distrito Federal: índice ${indicator.value}, classe ${indicator.level}, ${indicator.year}`}>
        <defs><pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1"/></pattern></defs>
        <rect width="520" height="360" fill="url(#map-grid)"/>
        {mapPaths.map((path, index) => <path key={index} d={path} fill={indicator.color} fillOpacity=".82" stroke="#f6f7ea" strokeWidth="2" vectorEffect="non-scaling-stroke"/>)}
      </svg>
      <div className="vc-map-reading"><span>{indicator.year}</span><strong>{formatScore(indicator.value)}</strong><small>índice de 0 a 1</small><b style={{ color: indicator.color }}>{indicator.level}</b></div>
    </div>
    <div className="vc-map-caption"><div><strong>{indicator.label}</strong><span>Brasília/DF · código IBGE 5300108</span></div><small>{indicator.source}</small></div>
  </div>;
}

export function FinalPriority() {
  const { componentId = "F3" } = useParams();
  const { data, error, loading } = useDfAssessment();
  if (!data) return <DataState error={error} loading={loading} />;
  const component = data.componentes.find((item) => item.componentIdentifier === componentId);
  if (!component || component.score === null) return <section className="vc-data-state is-error"><h2>Componente não encontrado</h2><Link to="/">Voltar ao diagnóstico</Link></section>;
  const assessedItems = component.items.filter((item) => item.normalizedScore !== null).sort((left, right) => (left.normalizedScore ?? 1) - (right.normalizedScore ?? 1));

  return <>
    <section className="vc-detail-hero">
      <div className="vc-detail-top"><Link to="/" className="vc-back">← Voltar ao diagnóstico</Link><span className="vc-detail-priority">{component.componentIdentifier} · nota {formatScore(component.score)}</span></div>
      <div className="vc-detail-title"><div><p className="vc-kicker">{component.axisName} · avaliação 2025</p><h1>{component.componentName}</h1><p>{summarizeProblem(component)}</p></div><div className="vc-level"><span>Nível calculado</span><strong>{getComponentStage(component.score)}</strong></div></div>
    </section>

    <section className="vc-risk-section" aria-labelledby="mapa-title"><DfRiskMap/><div className="vc-risk-copy"><p className="vc-kicker vc-kicker-red">Contexto territorial real</p><h2 id="mapa-title">Riscos climáticos do DF</h2><p className="vc-risk-lead">O mapa usa o limite oficial disponibilizado nos arquivos do AdaptaBrasil e permite comparar quatro indicadores do território.</p><ul>{riskIndicators.slice(0, 3).map((indicator, index) => <li key={indicator.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{indicator.shortLabel}: {indicator.level}</strong><p>Índice {formatScore(indicator.value)} em {indicator.year}.</p></div></li>)}</ul><p className="vc-source"><Icon name="info"/> Fonte: arquivos AdaptaBrasil MCTI fornecidos para este projeto.</p></div></section>

    <section className="vc-section vc-guidance" aria-label="Itens avaliados do componente">
      <header className="vc-section-heading"><div><p className="vc-kicker vc-kicker-dark">Evidências da avaliação</p><h2>Problemas registrados no Painel</h2></div><p>{component.calculation.evaluatedItems} de {component.calculation.totalItems} itens avaliados.</p></header>
      <ol className="vc-real-evidence-list">{assessedItems.map((item) => <li key={item.assessmentItemId}><div className="vc-evidence-score"><span>{component.componentIdentifier}-{item.itemIdentifier}</span><strong>{formatScore((item.normalizedScore ?? 0) * 4)}</strong><small>de 4</small></div><div><p className="vc-kicker vc-kicker-dark">{item.scoreText}</p><h3>{item.itemName}</h3><p>{item.assessmentComment || "O comentário deste item não está disponível publicamente."}</p></div></li>)}</ol>
    </section>

    <section className="vc-next-action"><div><p className="vc-kicker">Leitura responsável</p><h2>Nota institucional e risco territorial são fontes diferentes.</h2><p>A prioridade usa somente a menor nota do Painel ClimaBrasil, como definido para este recorte. Os indicadores do mapa contextualizam a urgência climática sem alterar a nota oficial.</p><Link to="/acompanhamento" className="vc-button vc-button-lime">Ver situação dos planos <Icon name="arrow"/></Link></div><EvidenceWave compact /></section>
  </>;
}

export function FinalTracking() {
  const { data, error, loading } = useDfAssessment();
  if (!data) return <DataState error={error} loading={loading} />;
  const priorities = data.componentes.filter((component) => component.eligible);
  return <>
    <section className="vc-page-intro"><div><p className="vc-kicker vc-kicker-dark">Acompanhamento público</p><h1>Planos ainda não publicados nesta base</h1><p>O CSV de avaliação contém notas, itens e comentários. Ele não contém responsáveis, prazos, status de execução ou evidências de entrega.</p></div><div className="vc-readonly-seal"><Icon name="shield"/><span><strong>Sem dados inventados</strong>Recorte: Distrito Federal</span></div></section>
    <section className="vc-section vc-tracking"><aside className="vc-tcu-notice"><Icon name="info"/><div><strong>Nenhum andamento foi inferido</strong><p>Quando uma fonte oficial de planos for integrada, esta área poderá mostrar responsáveis, prazos e histórico. Até lá, os campos permanecem explicitamente indisponíveis.</p></div></aside><div className="vc-tracking-grid"><article className="vc-action-summary"><div className="vc-action-heading"><span className="vc-pill is-critical">{priorities.length} lacunas críticas</span><small>Avaliação 2025</small></div><h2>Distrito Federal</h2><p>A menor nota é {formatScore(priorities[0]?.score ?? 0)} em “{priorities[0]?.componentName}”.</p><dl><div><dt>Responsável pelo plano</dt><dd>Não informado na base</dd></div><div><dt>Prazo</dt><dd>Não informado na base</dd></div><div><dt>Status de execução</dt><dd>Não informado na base</dd></div></dl></article><article className="vc-timeline"><p className="vc-kicker vc-kicker-dark">Integração de dados</p><h2>O que já está disponível</h2><ol><li className="is-complete"><span aria-label="Concluído"><Icon name="check"/></span><div><strong>Notas e comentários</strong><small>Painel ClimaBrasil 2025</small></div></li><li className="is-complete"><span aria-label="Concluído"><Icon name="check"/></span><div><strong>Indicadores territoriais</strong><small>AdaptaBrasil MCTI</small></div></li><li><span>03</span><div><strong>Planos de ação</strong><small>Fonte ainda não integrada</small></div></li></ol></article></div></section>
    <section className="vc-support-band"><div><Icon name="message"/><span><strong>Tem uma fonte oficial para os planos?</strong>Envie a referência para análise e integração.</span></div><Link to="/ouvidoria" className="vc-button vc-button-dark">Falar com a Ouvidoria <Icon name="arrow"/></Link></section>
  </>;
}

export function FinalOmbudsman() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <section className="vc-form-shell vc-success"><span className="vc-success-mark"><Icon name="check"/></span><p className="vc-kicker vc-kicker-dark">Demonstração da Ouvidoria</p><h1>Manifestação registrada neste cenário</h1><p>Nenhuma informação foi enviada. O retorno confirma apenas o comportamento da interface.</p><Link to="/acompanhamento" className="vc-button vc-button-dark">Voltar ao acompanhamento <Icon name="arrow"/></Link></section>;
  return <section className="vc-form-shell"><div className="vc-form-intro"><Link to="/acompanhamento" className="vc-back">← Voltar ao acompanhamento</Link><p className="vc-kicker vc-kicker-dark">Canal do cliente</p><h1>Fale com a Ouvidoria</h1><p>Registre dúvidas, pedidos de correção, reclamações ou sugestões sobre os dados e o acompanhamento.</p></div><form className="vc-final-form" onSubmit={submit}><p className="vc-form-required">Todos os campos são obrigatórios</p><label>Tipo de manifestação<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Dúvida sobre os dados</option><option>Pedido de correção</option><option>Reclamação</option><option>Sugestão</option></select></label><label>Assunto<input required placeholder="Resuma o motivo do contato"/></label><label>Mensagem<textarea required placeholder="Descreva a informação que precisa ser analisada"/></label><label className="vc-consent"><input type="checkbox" required/><span>Confirmo que revisei a mensagem e autorizo o registro desta manifestação.</span></label><small>Ambiente demonstrativo: nenhuma informação será enviada.</small><button className="vc-button vc-button-dark" type="submit">Registrar manifestação <Icon name="arrow"/></button></form></section>;
}

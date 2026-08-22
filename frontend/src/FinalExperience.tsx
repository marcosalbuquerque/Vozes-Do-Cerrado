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

type RiskObservation = { year: number; value: number; level: string; color: string; label?: string };
type RiskIndicator = { id: string; shortLabel: string; label: string; source: string; observations: RiskObservation[] };

const riskIndicators: RiskIndicator[] = [
  {
    id: "water",
    shortLabel: "Estresse hídrico",
    label: "Risco de impacto do estresse hídrico",
    source: "AdaptaBrasil MCTI · município",
    observations: [
      { year: 2020, value: 0.67, level: "Alto", color: "#ff7a1a", label: "Atual" },
      { year: 2030, value: 0.72, level: "Alto", color: "#e8590c", label: "Projeção 2030" },
      { year: 2050, value: 0.82, level: "Muito alto", color: "#cb1615", label: "Projeção 2050" },
    ],
  },
  {
    id: "food",
    shortLabel: "Segurança alimentar",
    label: "Ameaça climática à segurança alimentar",
    source: "AdaptaBrasil MCTI · mesorregião",
    observations: [
      { year: 2020, value: 0.30, level: "Baixo", color: "#8fcf54", label: "Histórico" },
      { year: 2030, value: 0.37, level: "Médio", color: "#f8d668", label: "Projeção 2030" },
      { year: 2050, value: 0.45, level: "Médio", color: "#eea10d", label: "Projeção 2050" },
    ],
  },
  {
    id: "biodiversity",
    shortLabel: "Biodiversidade",
    label: "Resiliência climática da biodiversidade",
    source: "AdaptaBrasil MCTI · município",
    observations: [
      { year: 2020, value: 0.91, level: "Muito alto", color: "#cb1615", label: "Histórico" },
      { year: 2030, value: 0.84, level: "Alto", color: "#e8590c", label: "Projeção 2030" },
      { year: 2050, value: 0.76, level: "Alto", color: "#ff7a1a", label: "Projeção 2050" },
    ],
  },
  {
    id: "health",
    shortLabel: "Saúde",
    label: "Ameaça climática à saúde",
    source: "AdaptaBrasil MCTI · município",
    observations: [
      { year: 2020, value: 0.20, level: "Baixo", color: "#4cca0f", label: "Histórico" },
      { year: 2030, value: 0.23, level: "Baixo", color: "#8fcf54", label: "Projeção 2030" },
      { year: 2050, value: 0.26, level: "Baixo", color: "#8fcf54", label: "Projeção 2050" },
    ],
  },
  {
    id: "solar",
    shortLabel: "Energia solar",
    label: "Potencial de geração solar",
    source: "AdaptaBrasil MCTI · município",
    observations: [
      { year: 2020, value: 0.72, level: "Alto", color: "#eea10d", label: "Histórico" },
      { year: 2030, value: 0.76, level: "Alto", color: "#eea10d", label: "Projeção 2030" },
      { year: 2050, value: 0.80, level: "Muito alto", color: "#cb1615", label: "Projeção 2050" },
    ],
  },
];

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
          <div className="vc-filter-row"><label htmlFor="state-select">Território analisado</label><div className="vc-state-select"><select id="state-select" defaultValue="DF"><option value="DF">Distrito Federal</option></select><Icon name="chevron"/></div><a href="#prioridades" className="vc-button vc-button-lime">Ver critérios <Icon name="arrow"/></a></div>
          <h1>Onde o DF precisa agir <em>primeiro?</em></h1>
          <p className="vc-lead">As prioridades abaixo vêm diretamente da avaliação oficial. A menor nota aparece primeiro.</p>
        </div>
        <div className={`vc-hero-data is-${getScoreTone(overallScore)}`}>
          <div className="vc-score-cluster"><p className={`vc-score-status is-${getScoreTone(overallScore)}`}>{getScoreStatus(overallScore)}</p><div className={`vc-score-orbit is-${getScoreTone(overallScore)}`}><span>Média dos componentes</span><strong>{formatScore(overallScore)}</strong><small>de 4 pontos</small></div></div>
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
        <header className="vc-section-heading"><div><p className="vc-kicker vc-kicker-dark">Distrito Federal</p><h2>Critérios de priorização</h2></div></header>
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

function interpolateData(observations: RiskObservation[], targetYear: number) {
  if (observations.length === 0) return { year: targetYear, value: 0, level: "", color: "#018a3c", label: "" };
  if (targetYear <= observations[0].year) return observations[0];
  if (targetYear >= observations[observations.length - 1].year) return observations[observations.length - 1];

  let left = observations[0];
  let right = observations[observations.length - 1];
  for (let i = 0; i < observations.length - 1; i++) {
    if (targetYear >= observations[i].year && targetYear <= observations[i + 1].year) {
      left = observations[i];
      right = observations[i + 1];
      break;
    }
  }

  const fraction = (targetYear - left.year) / (right.year - left.year);
  const value = left.value + (right.value - left.value) * fraction;
  const observation = fraction > 0.5 ? right : left;
  return {
    year: Math.round(targetYear),
    value: Math.round(value * 100) / 100,
    level: observation.level,
    color: observation.color,
    label: targetYear === 2020 ? "Atual" : targetYear === 2030 ? "Projeção 2030" : targetYear === 2050 ? "Projeção 2050" : `Ano ${Math.round(targetYear)}`,
  };
}

function DfRiskMap() {
  const [selectedId, setSelectedId] = useState("water");
  const [currentYear, setCurrentYear] = useState(2020);
  const [isPlaying, setIsPlaying] = useState(true);
  const [geoJson, setGeoJson] = useState<GeoJson | null>(null);
  const indicator = riskIndicators.find((item) => item.id === selectedId) ?? riskIndicators[0];
  
  const observation = useMemo(() => interpolateData(indicator.observations, currentYear), [indicator, currentYear]);

  useEffect(() => {
    fetch("/data/df-estresse-hidrico-2050.geojson").then((response) => {
      if (!response.ok) throw new Error("Mapa indisponível");
      return response.json() as Promise<GeoJson>;
    }).then(setGeoJson).catch(() => setGeoJson(null));
  }, []);

  useEffect(() => {
    setCurrentYear(2020);
    setIsPlaying(true);
  }, [selectedId]);

  // Animação do ano subindo de 2020 até 2050 passando por 2030
  useEffect(() => {
    if (!isPlaying || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const interval = window.setInterval(() => {
      setCurrentYear((prevYear) => {
        if (prevYear >= 2050) {
          return 2020;
        }
        // Subida suave de anos
        return prevYear + 1;
      });
    }, 280);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

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

  const timelinePercent = ((currentYear - 2020) / (2050 - 2020)) * 100;

  return (
    <div className="vc-real-map">
      <div className="vc-map-tabs" role="tablist" aria-label="Indicador climático">
        {riskIndicators.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === selectedId}
            onClick={() => { setSelectedId(item.id); setCurrentYear(2020); }}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>

      <div className="vc-map-canvas">
        {/* Banner com o ano bem grande no meio e em cima do mapa */}
        <div className="vc-map-year-banner" aria-live="polite">
          <div className="vc-year-kicker">PROJEÇÃO TEMPORAL · ADAPTABRASIL</div>
          <div className="vc-year-big-display">
            <strong className="vc-year-number">{currentYear}</strong>
          </div>
          <div className="vc-year-timeline-bar" role="progressbar" aria-valuenow={currentYear} aria-valuemin={2020} aria-valuemax={2050}>
            <div className="vc-year-timeline-fill" style={{ width: `${timelinePercent}%` }} />
            <div className="vc-year-milestones">
              <button
                type="button"
                className={`vc-year-step ${currentYear === 2020 ? "is-active" : ""}`}
                onClick={() => { setCurrentYear(2020); setIsPlaying(false); }}
                title="Ir para o ano 2020 (Atual)"
              >
                <span>2020</span>
                <small>Atual</small>
              </button>
              <button
                type="button"
                className={`vc-year-step ${currentYear === 2030 ? "is-active" : ""}`}
                onClick={() => { setCurrentYear(2030); setIsPlaying(false); }}
                title="Ir para a projeção de 2030"
              >
                <span>2030</span>
                <small>Projeção</small>
              </button>
              <button
                type="button"
                className={`vc-year-step ${currentYear === 2050 ? "is-active" : ""}`}
                onClick={() => { setCurrentYear(2050); setIsPlaying(false); }}
                title="Ir para a projeção de 2050"
              >
                <span>2050</span>
                <small>Projeção</small>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="vc-timeline-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pausar animação temporal" : "Iniciar animação temporal"}
          >
            {isPlaying ? "⏸ Pausar animação" : "▶ Reproduzir subida (2020 → 2030 → 2050)"}
          </button>
        </div>

        <svg viewBox="0 0 520 360" role="img" aria-label={`${indicator.label} no Distrito Federal: índice ${observation.value}, classe ${observation.level}, ano ${currentYear}`}>
          <defs>
            <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="520" height="360" fill="url(#map-grid)"/>
          {mapPaths.map((path, index) => (
            <path
              className="vc-df-shape"
              key={index}
              d={path}
              style={{ fill: observation.color }}
              fillOpacity=".85"
              stroke="#f6f7ea"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Leitura do dado à direita */}
        <div className="vc-map-reading" aria-label={`Leitura em ${currentYear}: índice ${formatScore(observation.value)}, classe ${observation.level}`}>
          <span>{currentYear <= 2020 ? "Atual" : "Projeção"} · {currentYear}</span>
          <strong>{formatScore(observation.value)}</strong>
          <small>índice de 0 a 1</small>
          <b style={{ color: observation.color }}>{observation.level}</b>
        </div>
      </div>

      <div className="vc-map-caption">
        <div>
          <strong>{indicator.label}</strong>
          <span>Brasília/DF · código IBGE 5300108</span>
        </div>
        <small>{indicator.source}</small>
      </div>
    </div>
  );
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

    <section className="vc-risk-section" aria-labelledby="mapa-title">
      <DfRiskMap/>
      <div className="vc-risk-copy">
        <div className="vc-context-pill-wrap">
          <span className="vc-score-status is-critical">Contexto territorial real</span>
        </div>
        <h2 id="mapa-title">Riscos climáticos do DF</h2>
        <p className="vc-risk-lead">Acompanhe a projeção dos dados climáticos ao longo do tempo (2020 → 2030 → 2050) a partir dos registros do AdaptaBrasil MCTI.</p>
        <ul>
          {riskIndicators.slice(0, 3).map((indicator, index) => {
            const first = indicator.observations[0];
            const mid = indicator.observations[1];
            const last = indicator.observations[indicator.observations.length - 1];
            return (
              <li key={indicator.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{indicator.shortLabel}: {last.level}</strong>
                  <p>{`${formatScore(first.value)} em ${first.year} → ${formatScore(mid.value)} em ${mid.year} → ${formatScore(last.value)} em ${last.year}`}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="vc-source"><Icon name="info"/> Fonte: arquivos AdaptaBrasil MCTI fornecidos para este projeto.</p>
      </div>
    </section>

    <section className="vc-section vc-guidance" aria-label="Itens avaliados do componente">
      <header className="vc-section-heading"><div><p className="vc-kicker vc-kicker-dark">Evidências da avaliação</p><h2>Problemas registrados no Painel</h2></div><p>{component.calculation.evaluatedItems} de {component.calculation.totalItems} itens avaliados.</p></header>
      <ol className="vc-real-evidence-list">{assessedItems.map((item) => <li key={item.assessmentItemId}><div className="vc-evidence-score"><span>{component.componentIdentifier}-{item.itemIdentifier}</span><strong>{formatScore((item.normalizedScore ?? 0) * 4)}</strong><small>de 4</small></div><div><p className="vc-kicker vc-kicker-dark">{item.scoreText}</p><h3>{item.itemName}</h3><p>{item.assessmentComment || "O comentário deste item não está disponível publicamente."}</p></div></li>)}</ol>
    </section>

    <section className="vc-next-action"><div><p className="vc-kicker">Leitura responsável</p><h2>Nota institucional e risco territorial são fontes diferentes.</h2><p>A prioridade usa somente a menor nota do Painel ClimaBrasil, como definido para este recorte. Os indicadores do mapa contextualizam a urgência climática sem alterar a nota oficial.</p><Link to="/acompanhamento" className="vc-button vc-button-lime">Ver situação dos planos <Icon name="arrow"/></Link></div></section>
  </>;
}

export function FinalTracking() {
  const { data, error, loading } = useDfAssessment();
  if (!data) return <DataState error={error} loading={loading} />;
  return <>
    <section className="vc-page-intro"><div><p className="vc-kicker vc-kicker-dark">Acompanhamento público</p><h1>O acompanhamento ainda não começou</h1><p>Ainda não há ações, responsáveis, prazos ou entregas registradas para o Distrito Federal.</p></div></section>
    <section className="vc-support-band"><div><Icon name="message"/><span><strong>Tem uma fonte oficial para os planos?</strong>Envie a referência para análise e integração.</span></div><Link to="/ouvidoria" className="vc-button vc-button-dark">Falar com a Ouvidoria <Icon name="arrow"/></Link></section>
  </>;
}

export function FinalOmbudsman() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <section className="vc-form-shell vc-success"><span className="vc-success-mark"><Icon name="check"/></span><p className="vc-kicker vc-kicker-dark">Demonstração da Ouvidoria</p><h1>Manifestação registrada neste cenário</h1><p>Nenhuma informação foi enviada. O retorno confirma apenas o comportamento da interface.</p><Link to="/acompanhamento" className="vc-button vc-button-dark">Voltar ao acompanhamento <Icon name="arrow"/></Link></section>;
  return <section className="vc-form-shell"><div className="vc-form-intro"><Link to="/acompanhamento" className="vc-back">← Voltar ao acompanhamento</Link><p className="vc-kicker vc-kicker-dark">Canal do cliente</p><h1>Fale com a Ouvidoria</h1><p>Registre dúvidas, pedidos de correção, reclamações ou sugestões sobre os dados e o acompanhamento.</p></div><form className="vc-final-form" onSubmit={submit}><p className="vc-form-required">Todos os campos são obrigatórios</p><label>Tipo de manifestação<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Dúvida sobre os dados</option><option>Pedido de correção</option><option>Reclamação</option><option>Sugestão</option></select></label><label>Assunto<input required placeholder="Resuma o motivo do contato"/></label><label>Mensagem<textarea required placeholder="Descreva a informação que precisa ser analisada"/></label><label className="vc-consent"><input type="checkbox" required/><span>Confirmo que revisei a mensagem e autorizo o registro desta manifestação.</span></label><small>Ambiente demonstrativo: nenhuma informação será enviada.</small><button className="vc-button vc-button-dark" type="submit">Registrar manifestação <Icon name="arrow"/></button></form></section>;
}

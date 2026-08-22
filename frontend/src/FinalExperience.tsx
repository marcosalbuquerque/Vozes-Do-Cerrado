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
    shortLabel: "Acesso à energia",
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
  return comment || `O item “${lowestItem.itemName}” recebeu a menor classificação do componente.`;
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

const prioritizationCriteria = [
  {
    num: 1,
    title: "Efetividade climática",
    desc: "Avalia em que medida a medida contribui efetivamente para enfrentar a mudança do clima, seja por meio da redução de riscos, vulnerabilidades e impactos climáticos, da redução de emissões de gases de efeito estufa, do aumento de remoções ou da combinação desses resultados.",
  },
  {
    num: 2,
    title: "Factibilidade política, institucional, técnica, cultural e econômica",
    desc: "Avalia as condições necessárias para implementação da medida, considerando viabilidade política, capacidade institucional e técnica, aceitação social e cultural, competências legais, disponibilidade de recursos financeiros e capacidade de execução.",
  },
  {
    num: 3,
    title: "Equidade e justiça climática",
    desc: "Avalia em que medida a medida distribui de forma justa seus benefícios, custos e riscos, considerando grupos sociais em situação de maior vulnerabilidade, desigualdades socioeconômicas, gênero, raça, idade, território e direitos humanos.",
  },
  {
    num: 4,
    title: "Cobenefícios e contribuição para o desenvolvimento sustentável",
    desc: "Avalia os benefícios adicionais gerados pela medida além de seu objetivo climático principal, considerando aspectos sociais, econômicos, ambientais e de desenvolvimento sustentável, como saúde, biodiversidade, segurança alimentar e hídrica, geração de renda, emprego e qualidade ambiental.",
  },
  {
    num: 5,
    title: "Externalidades negativas e risco de impactos adversos",
    desc: "Avalia potenciais consequências negativas, intencionais ou não, decorrentes da implementação da medida, incluindo impactos sociais, econômicos e ambientais, bem como riscos de maladaptação, aumento de vulnerabilidades, desigualdades ou emissões.",
  },
  {
    num: 6,
    title: "Potencial de transformação",
    desc: "Avalia a capacidade da medida de promover mudanças estruturais e duradouras nas condições que contribuem para a vulnerabilidade climática e/ou para as emissões de gases de efeito estufa, indo além de respostas pontuais ou incrementais.",
  },
  {
    num: 7,
    title: "Coerência e integração com políticas públicas",
    desc: "Avalia a compatibilidade e a contribuição da medida para outras políticas, planos, programas e estratégias governamentais, considerando sua integração entre setores, escalas territoriais e agendas de adaptação, mitigação e desenvolvimento sustentável.",
  },
  {
    num: 8,
    title: "Durabilidade, flexibilidade e adequação futura",
    desc: "Avalia a capacidade da medida de produzir benefícios duradouros, permanecer adequada diante de mudanças nas condições climáticas, socioeconômicas e tecnológicas e ser ajustada ao longo do tempo conforme novos riscos, conhecimentos e cenários se apresentem.",
  },
];

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
        <div className="vc-order-method"><p><strong>Como calculamos a ordem?</strong></p><button type="button" onClick={() => setMethodOpen(true)} aria-haspopup="dialog">Ver critérios</button></div>
      </section>

      {methodOpen && (
        <div className="vc-method-layer">
          <button className="vc-method-backdrop" type="button" aria-label="Fechar explicação" onClick={() => setMethodOpen(false)} />
          <aside className="vc-method-panel" role="dialog" aria-modal="true" aria-labelledby="method-title">
            <button className="vc-method-close" type="button" onClick={() => setMethodOpen(false)} autoFocus aria-label="Fechar">×</button>
            <p className="vc-kicker vc-kicker-dark">Critérios de Avaliação</p>
            <h2 id="method-title">Critérios de priorização</h2>
            <p className="vc-method-intro">A definição das prioridades e ações de enfrentamento climático baseia-se nos 8 critérios estruturantes de priorização:</p>
            <div className="vc-method-criteria-list">
              {prioritizationCriteria.map((item) => (
                <div key={item.num} className="vc-method-criterion-card">
                  <span className="vc-method-criterion-num">{item.num}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      <section className="vc-section vc-priorities" id="prioridades">
        <header className="vc-section-heading"><div><p className="vc-kicker vc-kicker-dark">Distrito Federal</p><h2>Critérios de priorização</h2></div></header>
        <div className="vc-priority-list">
          {priorities.map((priority, index) => <article className={`vc-priority is-${getScoreTone(priority.score ?? 0)} ${index === 0 ? "is-featured" : ""}`} key={priority.componentIdentifier}>
            <div className="vc-priority-index">{index === 0 ? <span className="vc-priority-index-alert" role="img" aria-label="Menor nota"><b aria-hidden="true">!</b></span> : <span>{String(index + 1).padStart(2, "0")}</span>}</div>
            <div className="vc-priority-main"><div className="vc-priority-status"><span className="vc-score-status is-critical">{getComponentStage(priority.score ?? 0)}</span><span className="vc-component-code">{priority.componentIdentifier} · {priority.axisName}</span></div><h3>{priority.componentName}</h3></div>
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

function DfRiskMap({ indicators = riskIndicators }: { indicators?: RiskIndicator[] }) {
  const [selectedId, setSelectedId] = useState(indicators[0]?.id ?? "water");
  const [currentYear, setCurrentYear] = useState(2020);
  const [geoJson, setGeoJson] = useState<GeoJson | null>(null);
  const indicator = indicators.find((item) => item.id === selectedId) ?? indicators[0];
  
  const observation = useMemo(() => interpolateData(indicator.observations, currentYear), [indicator, currentYear]);

  useEffect(() => {
    fetch("/data/df-estresse-hidrico-2050.geojson").then((response) => {
      if (!response.ok) throw new Error("Mapa indisponível");
      return response.json() as Promise<GeoJson>;
    }).then(setGeoJson).catch(() => setGeoJson(null));
  }, []);

  useEffect(() => {
    setCurrentYear(2020);
  }, [selectedId]);

  // Animação contínua e suave do ano subindo de 2020 até 2050 passando por 2030
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const interval = window.setInterval(() => {
      setCurrentYear((prevYear) => {
        if (prevYear >= 2050) {
          return 2020;
        }
        return prevYear + 1;
      });
    }, 280);

    return () => window.clearInterval(interval);
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

  const timelinePercent = ((currentYear - 2020) / (2050 - 2020)) * 100;

  return (
    <div className="vc-real-map">
      <div className="vc-map-tabs" role="tablist" aria-label="Indicador climático">
        {indicators.map((item) => (
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
        {/* Banner limpo com apenas o ano grande subindo no meio e sobre o mapa */}
        <div className="vc-map-year-banner" aria-live="polite">
          <div className="vc-year-kicker">PROJEÇÃO TEMPORAL · ADAPTABRASIL</div>
          <div className="vc-year-big-display">
            <strong className="vc-year-number">{currentYear}</strong>
          </div>
          <div className="vc-year-timeline-bar" role="progressbar" aria-valuenow={currentYear} aria-valuemin={2020} aria-valuemax={2050}>
            <div className="vc-year-timeline-fill" style={{ width: `${timelinePercent}%` }} />
          </div>
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

const componentRiskMapping: Record<string, string[]> = {
  "F1": ["energy", "biodiversity"],
  "F2": ["energy", "biodiversity"],
  "F3": ["energy", "biodiversity"],
  "G6": ["health", "food", "water"],
  "P2": ["water", "health", "food"],
  "P3": ["water", "health", "food"],
  "P4": ["biodiversity", "water", "health"],
  "P5": ["biodiversity", "water", "health"]
};

function ExpandableText({ text, limit = 250 }: { text: string, limit?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return <p>O comentário deste item não está disponível publicamente.</p>;
  if (text.length <= limit) return <p>{text}</p>;
  return (
    <p>
      {expanded ? text : text.slice(0, limit) + '... '}
      <button type="button" className="vc-text-link" onClick={() => setExpanded(!expanded)} style={{ background: "transparent", border: "none", color: "var(--deep-green)", fontWeight: 700, cursor: "pointer", textDecoration: "underline", padding: 0 }}>
        {expanded ? "Ver menos" : "Ver mais"}
      </button>
    </p>
  );
}

export function FinalPriority() {
  const { componentId = "F3" } = useParams();
  const { data, error, loading } = useDfAssessment();
  if (!data) return <DataState error={error} loading={loading} />;
  const component = data.componentes.find((item) => item.componentIdentifier === componentId);
  if (!component || component.score === null) return <section className="vc-data-state is-error"><h2>Componente não encontrado</h2><Link to="/">Voltar ao diagnóstico</Link></section>;
  const assessedItems = component.items.filter((item) => item.normalizedScore !== null).sort((left, right) => (left.normalizedScore ?? 1) - (right.normalizedScore ?? 1));

  const allowedRiskIds = componentRiskMapping[component.componentIdentifier] || ["water", "energy", "biodiversity"];
  const activeRiskIndicators = riskIndicators.filter(r => allowedRiskIds.includes(r.id));

  return <>
    <section className="vc-detail-hero">
      <div className="vc-detail-top"><Link to="/" className="vc-back">← Voltar ao diagnóstico</Link><span className="vc-detail-priority">{component.componentIdentifier} · nota {formatScore(component.score)}</span></div>
      <div className="vc-detail-title">
        <div>
          <p className="vc-kicker vc-kicker-dark">{component.axisName} · avaliação 2025</p>
          <h1>{component.componentName}</h1>
          <p>{summarizeProblem(component)}</p>
        </div>
        <div className="vc-level">
          <span>Nível calculado</span>
          <strong className="vc-level-stage is-critical">{getComponentStage(component.score)}</strong>
        </div>
      </div>
    </section>

    <section className="vc-risk-section" aria-labelledby="mapa-title">
      <DfRiskMap indicators={activeRiskIndicators} />
      <div className="vc-risk-copy">
        <div className="vc-context-pill-wrap">
          <span className="vc-score-status is-critical">Contexto territorial real</span>
        </div>
        <h2 id="mapa-title">Riscos climáticos do DF</h2>
        <p className="vc-risk-lead">As projeções oficiais do AdaptaBrasil MCTI revelam um agravamento contínuo dos riscos climáticos no Distrito Federal até 2050. Sem medidas estruturantes de adaptação, o estresse hídrico e as ameaças territoriais atingem níveis críticos, tornando a ação pública preventiva cada vez mais urgente.</p>
        <ul>
          {activeRiskIndicators.slice(0, 3).map((indicator, index) => {
            const first = indicator.observations[0];
            const last = indicator.observations[indicator.observations.length - 1];
            return (
              <li key={indicator.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{indicator.shortLabel}</strong>
                  <p>Risco <b>{first.level.toLowerCase()}</b> hoje. Projeção indica agravamento para nível <b>{last.level.toLowerCase()}</b> até 2050.</p>
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
      <ol className="vc-real-evidence-list">{assessedItems.map((item) => <li key={item.assessmentItemId}><div className="vc-evidence-score"><span>{component.componentIdentifier}-{item.itemIdentifier}</span><strong>{formatScore((item.normalizedScore ?? 0) * 4)}</strong><small>de 4</small></div><div><p className="vc-kicker vc-kicker-dark">{item.scoreText}</p><h3>{item.itemName}</h3><ExpandableText text={item.assessmentComment} limit={220} /></div></li>)}</ol>
    </section>

    <section className="vc-next-action"><div><p className="vc-kicker">Leitura responsável</p><h2>Nota institucional e risco territorial são fontes diferentes.</h2><p>A prioridade usa somente a menor nota do Painel ClimaBrasil, como definido para este recorte. Os indicadores do mapa contextualizam a urgência climática sem alterar a nota oficial.</p><Link to="/acompanhamento" className="vc-button vc-button-lime">Ver situação dos planos <Icon name="arrow"/></Link></div></section>
  </>;
}

type BenchmarkItem = {
  id: string;
  componentCode: string;
  componentName: string;
  dfScore: number;
  dfStatus: string;
  benchmarkState: string;
  benchmarkScore: number;
  auditHighlight: string;
  nextSteps: string[];
};

const benchmarksData: BenchmarkItem[] = [
  {
    id: "justica-climatica",
    componentCode: "G6",
    componentName: "Justiça climática e salvaguardas sociais",
    dfScore: 1.33,
    dfStatus: "Estágio crítico",
    benchmarkState: "Salvador (BA)",
    benchmarkScore: 4.00,
    auditHighlight: "A liderança da agenda climática em Salvador está em estágio avançado pela SECIS (Secretaria Municipal de Sustentabilidade, Inovação e Resiliência), com posição hierárquica e autoridade para mobilizar setores, canal direto com o Executivo, composição mista técnica/política e salvaguardas para populações vulneráveis integradas ao Plano de Ação Climática (PLAC).",
    nextSteps: [
      "Instituir o Comitê Distrital de Justiça Climática com participação de comunidades periféricas e vulneráveis do DF.",
      "Integrar mapeamento de vulnerabilidade climática e salvaguardas socioambientais nas 35 Regiões Administrativas.",
      "Estabelecer canal direto de reporte ao Governador para coordenação intersetorial e priorização de recursos nas áreas de risco.",
    ],
  },
  {
    id: "investimentos-privados",
    componentCode: "F3",
    componentName: "Mobilização de investimentos privados e capital verde",
    dfScore: 0.00,
    dfStatus: "Sem progresso",
    benchmarkState: "Alagoas / Minas Gerais",
    benchmarkScore: 4.00,
    auditHighlight: "Estruturação de instrumentos econômicos de transição justa, editais de atração de capital privado, parcerias público-privadas (PPPs) em energias renováveis e saneamento, e linhas de crédito com contrapartidas de descarbonização e resiliência hídrica.",
    nextSteps: [
      "Regulamentar o Fundo Distrital de Mudança do Clima com mecanismos de cofinanciamento privado e emissão de Green Bonds.",
      "Lançar editais de PPPs e incentivos fiscais para eficiência hídrica e geração solar comunitária nas áreas rurais e urbanas do DF.",
      "Estabelecer critérios socioambientais obrigatórios nas contratações e compras públicas do Governo do Distrito Federal.",
    ],
  },
  {
    id: "estrategias-adaptacao",
    componentCode: "P2",
    componentName: "Estratégias e planos de adaptação climática",
    dfScore: 1.33,
    dfStatus: "Estágio crítico",
    benchmarkState: "Recife (PE) / Acre",
    benchmarkScore: 4.00,
    auditHighlight: "Recife aprovou o PLAC com análise de riscos e vulnerabilidades e implantou Dashboard online em tempo real. O Acre instituiu o Plano de Adaptação por Lei Estadual (Lei nº 3.880/2021) com departamento permanente de monitoramento e sistema hidrometeorológico contínuo (Plano MEL).",
    nextSteps: [
      "Elaborar e aprovar por Lei Distrital o Plano de Ação e Adaptação Climática do Distrito Federal.",
      "Definir metas setoriais quantitativas para enfrentamento do estresse hídrico e segurança alimentar até 2030 e 2050.",
      "Disponibilizar painel público com indicadores em tempo real para transparência ativa e auditoria social.",
    ],
  },
  {
    id: "estrutura-governanca",
    componentCode: "G2",
    componentName: "Estrutura governamental e governança intersetorial",
    dfScore: 1.33,
    dfStatus: "Estágio crítico",
    benchmarkState: "Bahia / São Paulo",
    benchmarkScore: 4.00,
    auditHighlight: "Reorganização do Comitê Gestor da Política Estadual de Mudanças Climáticas (Decreto Regulamentador) com atribuições claras sem sobreposições ou lacunas entre órgãos, equipe técnica multidisciplinar dedicada e atas e agendas de reuniões públicas.",
    nextSteps: [
      "Reativar o Fórum Distrital de Mudança do Clima com calendário público e reuniões periódicas.",
      "Definir matriz formal de competências sem lacunas entre IBRAM, SEMA, ADASA, Defesa Civil e Terracap.",
      "Capacitar o corpo técnico das administrações regionais para implementação descentralizada das ações climáticas.",
    ],
  },
];

export function FinalTracking() {
  const { data, error, loading } = useDfAssessment();
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>("justica-climatica");

  if (!data) return <DataState error={error} loading={loading} />;

  const activeBenchmark = benchmarksData.find((b) => b.id === selectedBenchmarkId) ?? benchmarksData[0];

  return (
    <>
      <section className="vc-page-intro">
        <div>
          <p className="vc-kicker vc-kicker-dark">Benchmarking Federativo · Próximos Passos</p>
          <h1>O que o DF pode aprender com os estados líderes</h1>
          <p>
            Analisamos os relatórios de auditoria do Painel ClimaBrasil para identificar o que deu certo nos estados com as maiores notas e traçar os próximos passos estratégicos para o Distrito Federal.
          </p>
        </div>
        <div className="vc-readonly-seal">
          <Icon name="shield" />
          <div>
            <span>Fonte de Referência</span>
            <strong>Auditorias TCU / TCEs 2025</strong>
          </div>
        </div>
      </section>

      <section className="vc-tracking-section">
        <div className="vc-benchmark-tabs" role="tablist" aria-label="Áreas de benchmark">
          {benchmarksData.map((b) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={b.id === activeBenchmark.id}
              onClick={() => setSelectedBenchmarkId(b.id)}
            >
              <span>{b.componentCode}</span>
              <strong>{b.componentName}</strong>
            </button>
          ))}
        </div>

        <div className="vc-benchmark-showcase">
          <div className="vc-benchmark-header">
            <div>
              <div className="vc-context-pill-wrap">
                <span className="vc-score-status is-critical">{activeBenchmark.dfStatus}</span>
              </div>
              <h2>{activeBenchmark.componentName} ({activeBenchmark.componentCode})</h2>
            </div>
            <div className="vc-benchmark-comparison-badge">
              <div className="vc-score-comparison-item is-df">
                <small>Distrito Federal</small>
                <strong>{formatScore(activeBenchmark.dfScore)}</strong>
                <span>de 4,00</span>
              </div>
              <div className="vc-score-comparison-arrow">→</div>
              <div className="vc-score-comparison-item is-benchmark">
                <small>Referência: {activeBenchmark.benchmarkState}</small>
                <strong>{formatScore(activeBenchmark.benchmarkScore)}</strong>
                <span>de 4,00</span>
              </div>
            </div>
          </div>

          <div className="vc-benchmark-content-grid">
            <div className="vc-benchmark-audit-box">
              <p className="vc-kicker vc-kicker-dark">Evidência registrada pelos auditores no Painel</p>
              <h3>O que deu certo em {activeBenchmark.benchmarkState}</h3>
              <blockquote className="vc-audit-quote">
                “{activeBenchmark.auditHighlight}”
              </blockquote>
              <div className="vc-audit-source-tag">
                <Icon name="info" />
                <span>Registro oficial auditado · Versão de Avaliação 2025</span>
              </div>
            </div>

            <div className="vc-benchmark-actions-box">
              <p className="vc-kicker vc-kicker-dark">Roteiro de ação pública</p>
              <h3>Próximos passos recomendados para o DF</h3>
              <ol className="vc-next-steps-list">
                {activeBenchmark.nextSteps.map((step, index) => (
                  <li key={index}>
                    <span className="vc-step-number">{String(index + 1).padStart(2, "0")}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="vc-support-band">
        <div>
          <Icon name="message" />
          <span>
            <strong>Tem propostas ou documentos de planos para o DF?</strong>
            Envie sua manifestação ou contribuição diretamente para a Ouvidoria.
          </span>
        </div>
        <Link to="/ouvidoria" className="vc-button vc-button-dark">
          Falar com a Ouvidoria <Icon name="arrow" />
        </Link>
      </section>
    </>
  );
}

export function FinalOmbudsman() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <section className="vc-form-shell vc-success"><span className="vc-success-mark"><Icon name="check"/></span><p className="vc-kicker vc-kicker-dark">Demonstração da Ouvidoria</p><h1>Manifestação registrada neste cenário</h1><p>Nenhuma informação foi enviada. O retorno confirma apenas o comportamento da interface.</p><Link to="/acompanhamento" className="vc-button vc-button-dark">Voltar ao acompanhamento <Icon name="arrow"/></Link></section>;
  return <section className="vc-form-shell"><div className="vc-form-intro"><Link to="/acompanhamento" className="vc-back">← Voltar ao acompanhamento</Link><p className="vc-kicker vc-kicker-dark">Canal do cliente</p><h1>Fale com a Ouvidoria</h1><p>Registre dúvidas, pedidos de correção, reclamações ou sugestões sobre os dados e o acompanhamento.</p></div><form className="vc-final-form" onSubmit={submit}><p className="vc-form-required">Todos os campos são obrigatórios</p><label>Tipo de manifestação<select required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Dúvida sobre os dados</option><option>Pedido de correção</option><option>Reclamação</option><option>Sugestão</option></select></label><label>Assunto<input required placeholder="Resuma o motivo do contato"/></label><label>Mensagem<textarea required placeholder="Descreva a informação que precisa ser analisada"/></label><label className="vc-consent"><input type="checkbox" required/><span>Confirmo que revisei a mensagem e autorizo o registro desta manifestação.</span></label><small>Ambiente demonstrativo: nenhuma informação será enviada.</small><button className="vc-button vc-button-dark" type="submit">Registrar manifestação <Icon name="arrow"/></button></form></section>;
}

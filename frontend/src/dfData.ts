import pcbRawData from "./data/pcb-raw-data.csv?raw";
import taxonomyRawData from "./data/painel-climabrasil-taxonomia.csv?raw";

export type AssessmentItem = {
  assessmentItemId: string;
  axisName: string;
  componentIdentifier: string;
  componentName: string;
  itemIdentifier: string;
  itemName: string;
  scoreText: string;
  normalizedScore: number | null;
  assessmentComment: string;
  confidentialityStatus: string;
};

export type ComponentScore = {
  componentIdentifier: string;
  componentName: string;
  axisName: string;
  status: "calculavel" | "nao_avaliado" | "sem_itens_avaliados";
  score: number | null;
  eligible: boolean;
  calculation: {
    evaluatedItems: number;
    totalItems: number;
    normalizedAverage: number | null;
    displayScale: "0-4";
  };
  items: AssessmentItem[];
};

export type AssessmentResponse = {
  territorio: "Distrito Federal";
  versaoAvaliacao: string;
  componentes: ComponentScore[];
};

type CsvRow = Record<string, string>;

function parseCsv(source: string, delimiter = ","): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === delimiter) {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  const [headerRow = [], ...dataRows] = rows;
  const headers = headerRow.map((header, index) => index === 0 ? header.replace(/^\uFEFF/, "") : header);
  return dataRows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function normalizeScore(scoreText: string, rawValue: string): number | null {
  const normalizedText = scoreText.trim().toLocaleLowerCase("pt-BR");
  if (normalizedText === "não avaliado" || normalizedText === "não se aplica") return null;
  if (normalizedText === "sem progresso") return 0;
  const value = Number(rawValue.replace(",", "."));
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

function round(value: number, decimalPlaces = 2) {
  const factor = 10 ** decimalPlaces;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function buildAssessment(): AssessmentResponse {
  const taxonomy = new Map(
    parseCsv(taxonomyRawData).map((row) => [
      `${row.component_identifier}.${row.item_identifier}`,
      { componentName: row.component_name, itemName: row.item_name },
    ]),
  );

  const assessmentRows = parseCsv(pcbRawData).filter((row) =>
    row.entity_type === "Distrito Federal" &&
    row.entity_name === "Distrito Federal" &&
    row.assessment_version === "Versão de Avaliação 2025"
  );
  const grouped = new Map<string, AssessmentItem[]>();

  for (const row of assessmentRows) {
    const taxonomyItem = taxonomy.get(`${row.component_identifier}.${row.item_identifier}`);
    if (!taxonomyItem) continue;
    const item: AssessmentItem = {
      assessmentItemId: row.assessment_item_id,
      axisName: row.axis_name,
      componentIdentifier: row.component_identifier,
      componentName: taxonomyItem.componentName,
      itemIdentifier: row.item_identifier,
      itemName: taxonomyItem.itemName,
      scoreText: row.score_text,
      normalizedScore: normalizeScore(row.score_text, row.score_value),
      assessmentComment: row.confidentiality_status === "P" ? row.assessment_comment.trim() : "",
      confidentialityStatus: row.confidentiality_status,
    };
    grouped.set(item.componentIdentifier, [...(grouped.get(item.componentIdentifier) ?? []), item]);
  }

  const componentes = [...grouped.entries()].map(([componentIdentifier, items]): ComponentScore => {
    const containsNotAssessed = items.some((item) => item.scoreText.trim().toLocaleLowerCase("pt-BR") === "não avaliado");
    const evaluatedItems = items.filter((item) => item.normalizedScore !== null);
    if (containsNotAssessed || evaluatedItems.length === 0) {
      return {
        componentIdentifier,
        componentName: items[0]?.componentName ?? componentIdentifier,
        axisName: items[0]?.axisName ?? "",
        status: containsNotAssessed ? "nao_avaliado" : "sem_itens_avaliados",
        score: null,
        eligible: false,
        calculation: { evaluatedItems: evaluatedItems.length, totalItems: items.length, normalizedAverage: null, displayScale: "0-4" },
        items,
      };
    }
    const normalizedAverage = evaluatedItems.reduce((sum, item) => sum + (item.normalizedScore ?? 0), 0) / evaluatedItems.length;
    const score = round(normalizedAverage * 4);
    return {
      componentIdentifier,
      componentName: items[0]?.componentName ?? componentIdentifier,
      axisName: items[0]?.axisName ?? "",
      status: "calculavel",
      score,
      eligible: score < 2,
      calculation: { evaluatedItems: evaluatedItems.length, totalItems: items.length, normalizedAverage: round(normalizedAverage, 4), displayScale: "0-4" },
      items,
    };
  }).sort((left, right) => {
    if (left.score === null) return 1;
    if (right.score === null) return -1;
    return left.score - right.score;
  });

  return { territorio: "Distrito Federal", versaoAvaliacao: "Versão de Avaliação 2025", componentes };
}

const assessment = buildAssessment();

export function useDfAssessment() {
  return { data: assessment, error: null, loading: false };
}

export function formatScore(score: number, digits = 2) {
  return score.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function getComponentStage(score: number) {
  if (score === 0) return "Sem progresso";
  if (score < 2) return "Estágio crítico";
  if (score < 3) return "Estágio intermediário";
  return "Estágio avançado";
}

export function getLowestItem(component: ComponentScore) {
  return component.items.filter((item) => item.normalizedScore !== null).sort((left, right) => (left.normalizedScore ?? 1) - (right.normalizedScore ?? 1))[0];
}

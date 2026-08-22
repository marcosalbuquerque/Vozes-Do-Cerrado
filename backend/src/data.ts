import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import type { AssessmentItem, ComponentScore } from "./types.js";

const rawAssessmentSchema = z.object({
  assessment_item_id: z.string().min(1),
  axis_name: z.string().min(1),
  assessment_version: z.string().min(1),
  entity_type: z.string().min(1),
  entity_name: z.string().min(1),
  component_identifier: z.string().min(1),
  item_identifier: z.string().min(1),
  score_text: z.string().min(1),
  score_value: z.string(),
  assessment_comment: z.string(),
  confidentiality_status: z.string(),
});

const rawAssessmentLocatorSchema = z.object({
  entity_type: z.string(),
  entity_name: z.string(),
  assessment_version: z.string(),
});

const taxonomySchema = z.object({
  component_identifier: z.string().min(1),
  component_name: z.string().min(1),
  item_identifier: z.string().min(1),
  item_name: z.string().min(1),
});

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultDataDirectory = path.join(backendRoot, "data");

function readCsv(filePath: string): unknown[] {
  return parse(fs.readFileSync(filePath, "utf8"), {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_column_count: false,
  }) as unknown[];
}

function normalizeScore(scoreText: string, rawValue: string): number | null {
  const normalizedText = scoreText.trim().toLocaleLowerCase("pt-BR");

  if (normalizedText === "não avaliado" || normalizedText === "não se aplica") {
    return null;
  }

  if (normalizedText === "sem progresso") {
    return 0;
  }

  const numericValue = Number(rawValue.replace(",", "."));
  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 1) {
    throw new Error(`Nota inválida para a classificação ${scoreText}.`);
  }

  return numericValue;
}

function round(value: number, decimalPlaces = 2): number {
  const factor = 10 ** decimalPlaces;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function loadDistritoFederalComponents(
  dataDirectory = defaultDataDirectory,
): ComponentScore[] {
  const taxonomyRows = readCsv(
    path.join(dataDirectory, "painel-climabrasil-taxonomia.csv"),
  ).map((row) => taxonomySchema.parse(row));

  const taxonomy = new Map(
    taxonomyRows.map((row) => [
      `${row.component_identifier}.${row.item_identifier}`,
      row,
    ]),
  );

  const assessmentRows = readCsv(path.join(dataDirectory, "pcb-raw-data.csv"))
    .filter((row) => {
      const locator = rawAssessmentLocatorSchema.safeParse(row);
      return (
        locator.success &&
        locator.data.entity_type === "Distrito Federal" &&
        locator.data.entity_name === "Distrito Federal" &&
        locator.data.assessment_version === "Versão de Avaliação 2025"
      );
    })
    .map((row) => rawAssessmentSchema.parse(row));

  const grouped = new Map<string, AssessmentItem[]>();

  for (const row of assessmentRows) {
    const taxonomyItem = taxonomy.get(
      `${row.component_identifier}.${row.item_identifier}`,
    );
    if (!taxonomyItem) {
      throw new Error(
        `Taxonomia ausente para ${row.component_identifier}.${row.item_identifier}.`,
      );
    }

    const item: AssessmentItem = {
      assessmentItemId: row.assessment_item_id,
      axisName: row.axis_name,
      componentIdentifier: row.component_identifier,
      componentName: taxonomyItem.component_name,
      itemIdentifier: row.item_identifier,
      itemName: taxonomyItem.item_name,
      scoreText: row.score_text,
      normalizedScore: normalizeScore(row.score_text, row.score_value),
      assessmentComment:
        row.confidentiality_status === "P" ? row.assessment_comment.trim() : "",
      confidentialityStatus: row.confidentiality_status,
    };

    const componentItems = grouped.get(item.componentIdentifier) ?? [];
    componentItems.push(item);
    grouped.set(item.componentIdentifier, componentItems);
  }

  return [...grouped.entries()]
    .map(([componentIdentifier, items]): ComponentScore => {
      const containsNotAssessed = items.some(
        (item) => item.scoreText.trim().toLocaleLowerCase("pt-BR") === "não avaliado",
      );
      const evaluatedItems = items.filter((item) => item.normalizedScore !== null);

      if (containsNotAssessed) {
        return {
          componentIdentifier,
          componentName: items[0]?.componentName ?? componentIdentifier,
          axisName: items[0]?.axisName ?? "",
          status: "nao_avaliado",
          score: null,
          eligible: false,
          calculation: {
            evaluatedItems: evaluatedItems.length,
            totalItems: items.length,
            normalizedAverage: null,
            displayScale: "0-4",
          },
          items,
        };
      }

      if (evaluatedItems.length === 0) {
        return {
          componentIdentifier,
          componentName: items[0]?.componentName ?? componentIdentifier,
          axisName: items[0]?.axisName ?? "",
          status: "sem_itens_avaliados",
          score: null,
          eligible: false,
          calculation: {
            evaluatedItems: 0,
            totalItems: items.length,
            normalizedAverage: null,
            displayScale: "0-4",
          },
          items,
        };
      }

      const normalizedAverage =
        evaluatedItems.reduce((sum, item) => sum + (item.normalizedScore ?? 0), 0) /
        evaluatedItems.length;
      const score = round(normalizedAverage * 4, 2);

      return {
        componentIdentifier,
        componentName: items[0]?.componentName ?? componentIdentifier,
        axisName: items[0]?.axisName ?? "",
        status: "calculavel",
        score,
        eligible: score < 2,
        calculation: {
          evaluatedItems: evaluatedItems.length,
          totalItems: items.length,
          normalizedAverage: round(normalizedAverage, 4),
          displayScale: "0-4",
        },
        items,
      };
    })
    .sort((left, right) => {
      if (left.score === null) return 1;
      if (right.score === null) return -1;
      return left.score - right.score;
    });
}

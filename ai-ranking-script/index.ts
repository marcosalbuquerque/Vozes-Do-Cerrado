import "dotenv/config";
import fs from "fs";
import { parse } from "csv-parse/sync";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("ERRO: GEMINI_API_KEY não encontrada no arquivo .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const CSV_PATH = "../frontend/src/data/pcb-raw-data.csv";
const OUT_PATH = "../frontend/src/data/ai-ranking.json";

const criterionIds = [
  "efetividade_climatica",
  "factibilidade",
  "equidade_justica_climatica",
  "cobeneficios",
  "externalidades_negativas",
  "potencial_transformacao",
  "coerencia_integracao",
  "durabilidade_flexibilidade",
] as const;

const scoreSchema = z.object({
  score: z.number().int().min(0).max(3).nullable().describe("Nota de 0 a 3"),
  justification: z.string().describe("Breve justificativa")
});

const evaluationSchema = z.object({
  criteria: z.record(z.enum(criterionIds), scoreSchema),
  totalAiScore: z.number().describe("Soma das notas não-nulas. Se for null, vira 0.")
});

async function run() {
  console.log("Lendo CSV...");
  const fileContent = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

  const dfRecords = records.filter(
    (row: any) =>
      row.entity_type === "Distrito Federal" &&
      row.entity_name === "Distrito Federal" &&
      row.assessment_version === "Versão de Avaliação 2025"
  );

  const grouped = new Map<string, any[]>();
  for (const row of dfRecords) {
    const comp = row.component_identifier;
    if (!grouped.has(comp)) grouped.set(comp, []);
    grouped.get(comp)!.push(row);
  }

  const results: Record<string, number> = {};

  console.log(`Encontrados ${grouped.size} componentes. Iniciando avaliação com Gemini...`);

  for (const [compId, items] of grouped.entries()) {
    // Calcular nota oficial
    const evaluated = items.filter((i: any) => i.score_text !== "Não avaliado" && i.score_text !== "Não se aplica");
    if (evaluated.length === 0) continue;
    
    let sum = 0;
    for (const item of evaluated) {
      if (item.score_text === "Sem progresso") sum += 0;
      else sum += Number(item.score_value.replace(",", "."));
    }
    const score = (sum / evaluated.length) * 4;

    // Só priorizamos os elegíveis (nota < 2) ou que têm dados
    if (score >= 2) {
      console.log(`[${compId}] Ignorado (Nota oficial >= 2)`);
      continue;
    }

    const publicItems = items.filter((i: any) => i.confidentiality_status === "P" && i.assessment_comment.trim().length > 0);
    if (publicItems.length === 0) {
      console.log(`[${compId}] Sem comentários públicos para a IA analisar.`);
      results[compId] = 0;
      continue;
    }

    const comments = publicItems.map((i: any) => `- ${i.item_identifier}: ${i.assessment_comment}`).join("\n");

    const prompt = `Você é um avaliador de políticas climáticas. Analise as lacunas abaixo com base nos comentários dos auditores.
Atribua uma nota de 0 a 3 para cada um dos 8 critérios de priorização para agir.
0 = Pouca prioridade ou baixo impacto
3 = Alta prioridade, alto impacto positivo

Componente: ${compId}
Comentários dos auditores:
${comments}
`;

    const jsonSchemaRaw = zodToJsonSchema(evaluationSchema, "evaluation");
    const responseSchema = (jsonSchemaRaw as any).definitions?.evaluation || jsonSchemaRaw;

    try {
      console.log(`[${compId}] Avaliando...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema as any,
        },
      });

      if (!response.text) throw new Error("Sem resposta de texto");
      const parsed = JSON.parse(response.text);
      results[compId] = parsed.totalAiScore || 0;
      console.log(`[${compId}] Pontuação IA: ${results[compId]}`);
    } catch (err: any) {
      console.error(`[${compId}] Erro na avaliação: ${err.message}`);
      results[compId] = 0; // fallback
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  console.log(`\nConcluído! Resultados salvos em: ${OUT_PATH}`);
}

run().catch(console.error);

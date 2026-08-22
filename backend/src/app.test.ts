import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import type { PriorityAnalyzer } from "./prioritization.js";

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

const analyzer: PriorityAnalyzer = async ({ components }) => {
  const buildAnalysis = (component: (typeof components)[number]) => ({
      componentIdentifier: component.componentIdentifier,
      priorityScore: 50,
      criteria: criterionIds.map((criterion) => ({
        criterion,
        score: 1,
        justification: "Justificativa de teste.",
        evidenceItemIds: [component.items[0]?.assessmentItemId ?? ""],
      })),
      missingEvidence: [],
    });

  return {
    analysis: {
      moreCriticalComponent: components[0].componentIdentifier,
      summary: "Comparação de teste.",
      decisiveCriteria: ["efetividade_climatica"],
      analyses: [buildAnalysis(components[0]), buildAnalysis(components[1])],
      confidence: "media",
      requiresHumanReview: true,
    },
    usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
    model: "modelo-de-teste",
  };
};

async function withServer(
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const config = loadConfig({
    NODE_ENV: "test",
    PORT: "3001",
    ALLOWED_ORIGINS: "http://localhost:5173",
    AI_RATE_LIMIT_PER_MINUTE: "100",
    AI_RATE_LIMIT_PER_DAY: "100",
  });
  const server = createApp(config, analyzer).listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;

  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

test("lista os 11 componentes elegíveis do DF", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/df/componentes?elegiveis=true`);
    const body = (await response.json()) as { componentes: unknown[] };
    assert.equal(response.status, 200);
    assert.equal(body.componentes.length, 11);
  });
});

test("compara dois componentes elegíveis sem alterar notas oficiais", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/df/priorizacao/comparar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ componentes: ["G6", "P1"] }),
    });
    const body = (await response.json()) as {
      natureza: string;
      notasOficiaisAlteradas: boolean;
      componentes: unknown[];
    };
    assert.equal(response.status, 200);
    assert.equal(body.natureza, "rascunho_assistido_por_ia");
    assert.equal(body.notasOficiaisAlteradas, false);
    assert.equal(body.componentes.length, 2);
  });
});

test("rejeita componente não calculável", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/df/priorizacao/comparar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ componentes: ["G7", "P1"] }),
    });
    assert.equal(response.status, 422);
  });
});

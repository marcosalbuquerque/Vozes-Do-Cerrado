import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import OpenAI from "openai";
import { z } from "zod";
import { allowedOrigins, type AppConfig } from "./config.js";
import { loadDistritoFederalComponents } from "./data.js";
import {
  createSafetyIdentifier,
  type PriorityAnalyzer,
} from "./prioritization.js";

const comparisonRequestSchema = z
  .object({
    componentes: z
      .array(z.string().trim().regex(/^[FGP]\d{1,2}$/))
      .length(2),
  })
  .strict()
  .refine((body) => new Set(body.componentes).size === 2, {
    message: "Informe dois componentes diferentes.",
    path: ["componentes"],
  });

export function createApp(
  config: AppConfig,
  analyzer: PriorityAnalyzer,
  dataDirectory?: string,
) {
  const app = express();
  const origins = allowedOrigins(config);
  const components = loadDistritoFederalComponents(dataDirectory);

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || origins.has(origin)) return callback(null, true);
        return callback(new Error("Origem não permitida."));
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: "32kb", strict: true }));

  const minuteLimiter = rateLimit({
    windowMs: 60_000,
    limit: config.AI_RATE_LIMIT_PER_MINUTE,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: "Muitas análises em pouco tempo. Aguarde antes de tentar novamente.",
    },
  });
  const dailyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1_000,
    limit: config.AI_RATE_LIMIT_PER_DAY,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: "Limite diário de análises atingido.",
    },
  });

  app.get("/health", (_request, response) => {
    response.json({ status: "ok", service: "vozes-api" });
  });

  app.get("/api/df/componentes", (request, response) => {
    const eligibleOnly = request.query.elegiveis === "true";
    const selected = eligibleOnly
      ? components.filter((component) => component.eligible)
      : components;

    response.json({
      territorio: "Distrito Federal",
      versaoAvaliacao: "Versão de Avaliação 2025",
      componentes: selected,
    });
  });

  app.post(
    "/api/df/priorizacao/comparar",
    minuteLimiter,
    dailyLimiter,
    async (request, response, next) => {
      try {
        const body = comparisonRequestSchema.parse(request.body);
        const requestedComponents = body.componentes.map((identifier) =>
          components.find(
            (component) => component.componentIdentifier === identifier,
          ),
        );

        if (requestedComponents.some((component) => !component)) {
          return response.status(404).json({
            error: "Um dos componentes não existe na base do Distrito Federal.",
          });
        }

        const pair = requestedComponents as [
          (typeof components)[number],
          (typeof components)[number],
        ];
        const ineligible = pair.filter((component) => !component.eligible);
        if (ineligible.length > 0) {
          return response.status(422).json({
            error: "A comparação aceita somente componentes calculáveis com nota abaixo de 2.",
            componentesNaoElegiveis: ineligible.map(
              (component) => component.componentIdentifier,
            ),
          });
        }

        const result = await analyzer({
          components: pair,
          safetyIdentifier: createSafetyIdentifier(
            request.ip ?? request.socket.remoteAddress ?? "unknown",
            config.SAFETY_IDENTIFIER_SECRET,
          ),
        });

        return response.json({
          territorio: "Distrito Federal",
          natureza: "rascunho_assistido_por_ia",
          notasOficiaisAlteradas: false,
          componentes: pair.map((component) => ({
            componentIdentifier: component.componentIdentifier,
            componentName: component.componentName,
            score: component.score,
          })),
          ...result,
        });
      } catch (error) {
        return next(error);
      }
    },
  );

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof z.ZodError) {
      response.status(400).json({
        error: "Requisição inválida.",
        campos: error.issues.map((issue) => ({
          caminho: issue.path.join("."),
          mensagem: issue.message,
        })),
      });
      return;
    }

    if (error instanceof OpenAI.RateLimitError) {
      response.status(503).json({
        error: "O serviço de análise está temporariamente ocupado.",
      });
      return;
    }

    if (error instanceof Error && error.message === "OPENAI_API_KEY_NOT_CONFIGURED") {
      response.status(503).json({
        error: "A análise por IA ainda não foi configurada no servidor.",
      });
      return;
    }

    console.error("Falha segura na rota de priorização", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    response.status(500).json({
      error: "Não foi possível concluir a análise.",
    });
  };

  app.use(errorHandler);
  return app;
}

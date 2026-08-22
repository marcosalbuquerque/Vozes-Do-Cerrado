import { z } from "zod";

const optionalPositiveInteger = (fallback: number) =>
  z.coerce.number().int().positive().default(fallback);

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
  OPENAI_API_KEY: z.string().trim().optional(),
  OPENAI_MODEL: z.string().trim().min(1).default("gpt-5.4"),
  OPENAI_MAX_OUTPUT_TOKENS: optionalPositiveInteger(2200),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  SAFETY_IDENTIFIER_SECRET: z.string().min(32).optional(),
  AI_RATE_LIMIT_PER_MINUTE: optionalPositiveInteger(3),
  AI_RATE_LIMIT_PER_DAY: optionalPositiveInteger(20),
});

export type AppConfig = z.infer<typeof configSchema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = configSchema.parse(environment);

  if (parsed.NODE_ENV === "production" && !parsed.SAFETY_IDENTIFIER_SECRET) {
    throw new Error("SAFETY_IDENTIFIER_SECRET é obrigatório em produção.");
  }

  return parsed;
}

export function allowedOrigins(config: AppConfig): Set<string> {
  return new Set(
    config.ALLOWED_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

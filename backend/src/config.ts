export type ProviderMode = "unified";

export interface AppConfig {
  port: number;
  corsOrigin: string;
  stt: {
    provider: ProviderMode;
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  llm: {
    provider: ProviderMode;
    apiKey: string;
    baseUrl: string;
    model: string;
  };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

function requirePort(): number {
  const raw = process.env.PORT;
  const port = Number(raw);
  if (!raw || !Number.isInteger(port) || port <= 0) {
    throw new Error(`PORT must be a valid positive integer (got: ${raw ?? "empty"}).`);
  }
  return port;
}

function loadConfig(): AppConfig {
  const sttApiKey = process.env.STT_API_KEY || process.env.OPENAI_API_KEY || "";
  const sttBaseUrl = process.env.STT_BASE_URL || "";
  const sttModel = process.env.STT_MODEL || "";

  const llmApiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "";
  const llmBaseUrl = process.env.LLM_BASE_URL || "";
  const llmModel = process.env.LLM_MODEL || "";

  return {
    port: requirePort(),
    corsOrigin: requireEnv("CORS_ORIGIN"),
    stt: {
      provider: "unified",
      apiKey: sttApiKey,
      baseUrl: sttBaseUrl,
      model: sttModel,
    },
    llm: {
      provider: "unified",
      apiKey: llmApiKey,
      baseUrl: llmBaseUrl,
      model: llmModel,
    },
  };
}

export const config: AppConfig = loadConfig();

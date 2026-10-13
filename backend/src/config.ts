export type ProviderMode = "mock" | "unified";

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

function requireProviderMode(name: string): ProviderMode {
  const value = process.env[name];
  if (value !== "mock" && value !== "unified") {
    throw new Error(`${name} must be "mock" or "unified" (got: ${value ?? "empty"}).`);
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
  const sttProvider = requireProviderMode("STT_PROVIDER");
  const llmProvider = requireProviderMode("LLM_PROVIDER");

  const sttApiKey = process.env.STT_API_KEY ?? "";
  const sttBaseUrl = process.env.STT_BASE_URL ?? "";
  const sttModel = process.env.STT_MODEL ?? "";
  const llmApiKey = process.env.LLM_API_KEY ?? "";
  const llmBaseUrl = process.env.LLM_BASE_URL ?? "";
  const llmModel = process.env.LLM_MODEL ?? "";

  if (sttProvider === "unified") {
    if (!sttApiKey) throw new Error("STT_API_KEY is required when STT_PROVIDER=unified.");
    if (!sttBaseUrl) throw new Error("STT_BASE_URL is required when STT_PROVIDER=unified.");
    if (!sttModel) throw new Error("STT_MODEL is required when STT_PROVIDER=unified.");
  }

  if (llmProvider === "unified") {
    if (!llmApiKey) throw new Error("LLM_API_KEY is required when LLM_PROVIDER=unified.");
    if (!llmBaseUrl) throw new Error("LLM_BASE_URL is required when LLM_PROVIDER=unified.");
    if (!llmModel) throw new Error("LLM_MODEL is required when LLM_PROVIDER=unified.");
  }

  return {
    port: requirePort(),
    corsOrigin: requireEnv("CORS_ORIGIN"),
    stt: {
      provider: sttProvider,
      apiKey: sttApiKey,
      baseUrl: sttBaseUrl,
      model: sttModel,
    },
    llm: {
      provider: llmProvider,
      apiKey: llmApiKey,
      baseUrl: llmBaseUrl,
      model: llmModel,
    },
  };
}

export const config: AppConfig = loadConfig();

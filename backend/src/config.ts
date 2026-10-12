export interface AppConfig {
  port: number;
  corsOrigin: string;
  stt: {
    provider: "unified" | "mock";
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  llm: {
    provider: "unified" | "gemini" | "mock";
    apiKey: string;
    baseUrl: string;
    model: string;
    geminiApiKey: string;
    geminiModel: string;
  };
}

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  stt: {
    provider:
      (process.env.STT_PROVIDER as any) ||
      (process.env.STT_API_KEY ? "unified" : "mock"),
    apiKey: process.env.STT_API_KEY || "",
    baseUrl: process.env.STT_BASE_URL || "https://api.groq.com/openai/v1",
    model: process.env.STT_MODEL || "whisper-large-v3-turbo",
  },
  llm: {
    provider:
      (process.env.LLM_PROVIDER as any) ||
      (process.env.LLM_API_KEY ? "unified" : "mock"),
    apiKey: process.env.LLM_API_KEY || "",
    baseUrl: process.env.LLM_BASE_URL || "https://openrouter.ai/api/v1",
    model: process.env.LLM_MODEL || "anthropic/claude-3.5-sonnet",
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  },
};

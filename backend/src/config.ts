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

// Deteksi fallback otomatis bila user mengisi GROQ_API_KEY / OPENAI_API_KEY sebelumnya
const detectedLlmApiKey =
  process.env.LLM_API_KEY ||
  process.env.OPENROUTER_API_KEY ||
  process.env.GROQ_API_KEY ||
  process.env.OPENAI_API_KEY ||
  "";

const detectedLlmBaseUrl =
  process.env.LLM_BASE_URL ||
  (process.env.GROQ_API_KEY && !process.env.LLM_API_KEY
    ? "https://api.groq.com/openai/v1"
    : process.env.OPENAI_API_KEY && !process.env.LLM_API_KEY
    ? "https://api.openai.com/v1"
    : "https://openrouter.ai/api/v1");

const detectedLlmModel =
  process.env.LLM_MODEL ||
  (process.env.GROQ_API_KEY && !process.env.LLM_API_KEY
    ? "llama-3.3-70b-versatile"
    : process.env.OPENAI_API_KEY && !process.env.LLM_API_KEY
    ? "gpt-4o-mini"
    : "anthropic/claude-3.5-sonnet");

const detectedSttApiKey =
  process.env.STT_API_KEY ||
  process.env.GROQ_API_KEY ||
  process.env.OPENAI_API_KEY ||
  "";

const detectedSttBaseUrl =
  process.env.STT_BASE_URL ||
  (process.env.GROQ_API_KEY && !process.env.STT_BASE_URL
    ? "https://api.groq.com/openai/v1"
    : process.env.OPENAI_API_KEY && !process.env.STT_BASE_URL
    ? "https://api.openai.com/v1"
    : "https://api.groq.com/openai/v1");

const detectedSttModel =
  process.env.STT_MODEL ||
  (process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY
    ? "whisper-1"
    : "whisper-large-v3-turbo");

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  stt: {
    provider: (process.env.STT_PROVIDER as any) || (detectedSttApiKey ? "unified" : "mock"),
    apiKey: detectedSttApiKey,
    baseUrl: detectedSttBaseUrl,
    model: detectedSttModel,
  },
  llm: {
    provider: (process.env.LLM_PROVIDER as any) || (detectedLlmApiKey ? "unified" : "mock"),
    apiKey: detectedLlmApiKey,
    baseUrl: detectedLlmBaseUrl,
    model: detectedLlmModel,
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  },
};

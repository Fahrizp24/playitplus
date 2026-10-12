export interface AppConfig {
  port: number;
  corsOrigin: string;
  stt: {
    provider: "mock" | "groq" | "openai";
    groqApiKey: string;
    openaiApiKey: string;
    groqModel: string;
    openaiModel: string;
  };
  llm: {
    provider: "mock" | "gemini" | "openai" | "groq";
    geminiApiKey: string;
    openaiApiKey: string;
    groqApiKey: string;
    geminiModel: string;
    openaiModel: string;
    groqModel: string;
  };
}

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  stt: {
    provider: (process.env.STT_PROVIDER as any) || "mock",
    groqApiKey: process.env.GROQ_API_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    groqModel: process.env.GROQ_STT_MODEL || "whisper-large-v3-turbo",
    openaiModel: process.env.OPENAI_STT_MODEL || "whisper-1",
  },
  llm: {
    provider: (process.env.LLM_PROVIDER as any) || "mock",
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    groqApiKey: process.env.GROQ_API_KEY || "",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
    groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  },
};

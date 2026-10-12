import { config } from "../../config";
import type { LLMProvider } from "../../types/providers";
import { GeminiLLMProvider } from "./gemini-llm";
import { MockLLMProvider } from "./mock-llm";
import { OpenAICompatibleLLMProvider } from "./openai-compatible-llm";

export function getLLMProvider(overrideProvider?: string): LLMProvider {
  const providerType = overrideProvider || config.llm.provider;

  switch (providerType) {
    case "gemini":
      if (config.llm.geminiApiKey) {
        return new GeminiLLMProvider(config.llm.geminiApiKey, config.llm.geminiModel);
      }
      console.warn("⚠️ GEMINI_API_KEY tidak ditemukan, fallback ke MockLLMProvider.");
      return new MockLLMProvider();

    case "openai":
      if (config.llm.openaiApiKey) {
        return new OpenAICompatibleLLMProvider(
          "openai",
          config.llm.openaiApiKey,
          "https://api.openai.com/v1",
          config.llm.openaiModel
        );
      }
      console.warn("⚠️ OPENAI_API_KEY tidak ditemukan, fallback ke MockLLMProvider.");
      return new MockLLMProvider();

    case "groq":
      if (config.llm.groqApiKey) {
        return new OpenAICompatibleLLMProvider(
          "groq",
          config.llm.groqApiKey,
          "https://api.groq.com/openai/v1",
          config.llm.groqModel
        );
      }
      console.warn("⚠️ GROQ_API_KEY tidak ditemukan, fallback ke MockLLMProvider.");
      return new MockLLMProvider();

    case "mock":
    default:
      return new MockLLMProvider();
  }
}

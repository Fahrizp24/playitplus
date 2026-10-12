import { config } from "../../config";
import type { STTProvider } from "../../types/providers";
import { GroqSTTProvider } from "./groq-stt";
import { MockSTTProvider } from "./mock-stt";
import { OpenAISTTProvider } from "./openai-stt";

export function getSTTProvider(overrideProvider?: string): STTProvider {
  const providerType = overrideProvider || config.stt.provider;

  switch (providerType) {
    case "groq":
      if (config.stt.groqApiKey) {
        return new GroqSTTProvider(config.stt.groqApiKey, config.stt.groqModel);
      }
      console.warn("⚠️ GROQ_API_KEY tidak ditemukan, fallback ke MockSTTProvider.");
      return new MockSTTProvider();

    case "openai":
      if (config.stt.openaiApiKey) {
        return new OpenAISTTProvider(config.stt.openaiApiKey, config.stt.openaiModel);
      }
      console.warn("⚠️ OPENAI_API_KEY tidak ditemukan, fallback ke MockSTTProvider.");
      return new MockSTTProvider();

    case "mock":
    default:
      return new MockSTTProvider();
  }
}

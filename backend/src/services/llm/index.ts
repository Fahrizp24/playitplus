import { config } from "../../config";
import type { LLMProvider } from "../../types/providers";
import { GeminiLLMProvider } from "./gemini-llm";
import { MockLLMProvider } from "./mock-llm";
import { OpenAICompatibleLLMProvider } from "./openai-compatible-llm";

export function getLLMProvider(overrideProvider?: string): LLMProvider {
  const providerType = overrideProvider || config.llm.provider;

  if (providerType === "gemini" && config.llm.geminiApiKey) {
    return new GeminiLLMProvider(config.llm.geminiApiKey, config.llm.geminiModel);
  }

  if (providerType === "unified" || (config.llm.apiKey && providerType !== "mock")) {
    return new OpenAICompatibleLLMProvider(
      "unified",
      config.llm.apiKey,
      config.llm.baseUrl,
      config.llm.model
    );
  }

  return new MockLLMProvider();
}

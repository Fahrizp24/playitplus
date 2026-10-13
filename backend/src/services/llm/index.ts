import { config } from "../../config";
import type { LLMProvider } from "../../types/providers";
import { MockLLMProvider } from "./mock-llm";
import { OpenAICompatibleLLMProvider } from "./openai-compatible-llm";

export function getLLMProvider(overrideProvider?: string): LLMProvider {
  const providerType = overrideProvider || config.llm.provider;

  if (providerType === "mock") {
    return new MockLLMProvider();
  }

  if (providerType === "unified") {
    return new OpenAICompatibleLLMProvider(
      "unified",
      config.llm.apiKey,
      config.llm.baseUrl,
      config.llm.model
    );
  }

  throw new Error(`Unknown LLM provider: ${providerType ?? "empty"} (expected "mock" or "unified").`);
}

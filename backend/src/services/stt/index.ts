import { config } from "../../config";
import type { STTProvider } from "../../types/providers";
import { MockSTTProvider } from "./mock-stt";
import { UnifiedSTTProvider } from "./unified-stt";

export function getSTTProvider(overrideProvider?: string): STTProvider {
  const providerType = overrideProvider || config.stt.provider;

  if (providerType === "mock") {
    return new MockSTTProvider();
  }

  if (providerType === "unified") {
    return new UnifiedSTTProvider(config.stt.apiKey, config.stt.baseUrl, config.stt.model);
  }

  throw new Error(`Unknown STT provider: ${providerType ?? "empty"} (expected "mock" or "unified").`);
}

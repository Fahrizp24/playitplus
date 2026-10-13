import { config } from "../../config";

export interface STTTranscriptionOptions {
  language?: string;
  filename?: string;
  prompt?: string;
}

export interface STTTranscriptionResult {
  text: string;
  durationSeconds?: number;
  provider: string;
}

export interface STTProvider {
  name: string;
  transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult>;
}

export class UnifiedSTTProvider implements STTProvider {
  name = "unified";

  constructor(
    private apiKey?: string,
    private baseUrl?: string,
    private model?: string
  ) {}

  private getValidConfig(): { apiKey: string; baseUrl: string; model: string } {
    if (!this.apiKey) {
      throw new Error("STT_API_KEY is not configured.");
    }
    if (!this.baseUrl) {
      throw new Error("STT_BASE_URL is not configured.");
    }
    if (!this.model) {
      throw new Error("STT_MODEL is not configured.");
    }
    return {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      model: this.model,
    };
  }

  async transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult> {
    const { apiKey, baseUrl, model } = this.getValidConfig();

    const filename = options?.filename || (audioData instanceof File ? audioData.name : "");
    if (!filename) {
      throw new Error("Nama berkas audio (filename) wajib disertakan untuk STT.");
    }
    const blob =
      audioData instanceof Blob
        ? audioData
        : new Blob([audioData as any], { type: mimeType });

    const formData = new FormData();
    formData.append("file", blob, filename);
    formData.append("model", model);
    formData.append("language", options?.language || "id");

    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
    const endpoint = cleanBaseUrl.endsWith("/audio/transcriptions")
      ? cleanBaseUrl
      : `${cleanBaseUrl}/audio/transcriptions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Unified STT failed (${response.status}): ${errText}`);
    }

    interface OpenAITranscriptionResponse {
      text?: string;
      duration?: number;
    }

    const data = (await response.json()) as OpenAITranscriptionResponse;
    return {
      text: data.text || "",
      durationSeconds: data.duration,
      provider: `unified (${model})`,
    };
  }
}

import { HuggingFaceSpaceSTTProvider } from "./hf-space";

export { HuggingFaceSpaceSTTProvider };

export function getSTTProvider(): STTProvider {
  if (config.stt.provider === "hf_space" && config.stt.hfSpaceUrl) {
    return new HuggingFaceSpaceSTTProvider(config.stt.hfSpaceUrl, config.stt.hfToken);
  }
  return new UnifiedSTTProvider(config.stt.apiKey, config.stt.baseUrl, config.stt.model);
}

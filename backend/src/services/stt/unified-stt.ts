import type { STTProvider, STTTranscriptionOptions, STTTranscriptionResult } from "../../types/providers";

export class UnifiedSTTProvider implements STTProvider {
  name = "unified";

  constructor(
    private apiKey: string,
    private baseUrl: string = "https://api.groq.com/openai/v1",
    private model: string = "whisper-large-v3-turbo"
  ) {}

  async transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult> {
    if (!this.apiKey) {
      throw new Error("STT_API_KEY is not configured.");
    }

    const filename = options?.filename || "recording.webm";
    const blob =
      audioData instanceof Blob
        ? audioData
        : new Blob([audioData as any], { type: mimeType });

    const formData = new FormData();
    formData.append("file", blob, filename);
    formData.append("model", this.model);
    formData.append("language", options?.language || "id");

    const cleanBaseUrl = this.baseUrl.replace(/\/+$/, "");
    const endpoint = cleanBaseUrl.endsWith("/audio/transcriptions")
      ? cleanBaseUrl
      : `${cleanBaseUrl}/audio/transcriptions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Unified STT failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      text: data.text || "",
      durationSeconds: data.duration,
      provider: `unified (${this.model})`,
    };
  }
}

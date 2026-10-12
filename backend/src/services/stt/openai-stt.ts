import type { STTProvider, STTTranscriptionOptions, STTTranscriptionResult } from "../../types/providers";

export class OpenAISTTProvider implements STTProvider {
  name = "openai";

  constructor(
    private apiKey: string,
    private model: string = "whisper-1"
  ) {}

  async transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
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

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI STT failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      text: data.text || "",
      provider: `openai (${this.model})`,
    };
  }
}

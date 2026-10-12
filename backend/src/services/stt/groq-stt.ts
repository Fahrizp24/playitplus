import type { STTProvider, STTTranscriptionOptions, STTTranscriptionResult } from "../../types/providers";

export class GroqSTTProvider implements STTProvider {
  name = "groq";

  constructor(
    private apiKey: string,
    private model: string = "whisper-large-v3-turbo"
  ) {}

  async transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY is not configured.");
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
    formData.append("response_format", "verbose_json");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq STT failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      text: data.text || "",
      durationSeconds: data.duration,
      provider: `groq (${this.model})`,
    };
  }
}

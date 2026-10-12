export interface STTTranscriptionOptions {
  language?: string;
  filename?: string;
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

export interface LLMGenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  name: string;
  generateText(prompt: string, options?: LLMGenerateOptions): Promise<string>;
  generateJSON<T>(
    prompt: string,
    schemaGuidance?: string,
    options?: LLMGenerateOptions
  ): Promise<T>;
}

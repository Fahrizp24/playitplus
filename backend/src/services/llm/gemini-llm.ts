import type { LLMGenerateOptions, LLMProvider } from "../../types/providers";
import { CLINICAL_EXTRACTION_SYSTEM_PROMPT } from "../clinical-prompts";

export class GeminiLLMProvider implements LLMProvider {
  name = "gemini";

  constructor(
    private apiKey: string,
    private model: string = "gemini-2.5-flash"
  ) {}

  async generateText(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: {
          parts: [{ text: CLINICAL_EXTRACTION_SYSTEM_PROMPT }],
        },
        generationConfig: {
          temperature: options?.temperature ?? 0.2,
          maxOutputTokens: options?.maxTokens ?? 4000,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini generate failed (${response.status}): ${err}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "";
    return text;
  }

  async generateJSON<T>(
    prompt: string,
    schemaGuidance?: string,
    options?: LLMGenerateOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const fullPrompt = `${prompt}\n\n${schemaGuidance || ""}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        systemInstruction: {
          parts: [{ text: CLINICAL_EXTRACTION_SYSTEM_PROMPT }],
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: options?.temperature ?? 0.1,
          maxOutputTokens: options?.maxTokens ?? 4000,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini generateJSON failed (${response.status}): ${err}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const rawText = candidate?.content?.parts?.[0]?.text || "{}";

    try {
      return JSON.parse(rawText) as T;
    } catch (parseErr) {
      // Pembersihan jika ada markdown formatting yang tidak sengaja terikut
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson) as T;
    }
  }
}

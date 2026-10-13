import type { LLMGenerateOptions, LLMProvider } from "../../types/providers";
import { CLINICAL_EXTRACTION_SYSTEM_PROMPT } from "../clinical-prompts";

export class OpenAICompatibleLLMProvider implements LLMProvider {
  constructor(
    public name: string,
    private apiKey?: string,
    private baseUrl?: string,
    private model?: string
  ) {}

  private getValidConfig(): { apiKey: string; baseUrl: string; model: string } {
    if (!this.apiKey) {
      throw new Error("LLM_API_KEY is not configured.");
    }
    if (!this.baseUrl) {
      throw new Error("LLM_BASE_URL is not configured.");
    }
    if (!this.model) {
      throw new Error("LLM_MODEL is not configured.");
    }
    return {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      model: this.model,
    };
  }

  async generateText(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    const { apiKey, baseUrl, model } = this.getValidConfig();

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: CLINICAL_EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: options?.temperature ?? 0.2,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`${this.name} generate failed (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async generateJSON<T>(
    prompt: string,
    schemaGuidance?: string,
    options?: LLMGenerateOptions
  ): Promise<T> {
    const { apiKey, baseUrl, model } = this.getValidConfig();

    const fullPrompt = `${prompt}\n\n${schemaGuidance || ""}`;
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: CLINICAL_EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: fullPrompt },
        ],
        temperature: options?.temperature ?? 0.1,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`${this.name} generateJSON failed (${response.status}): ${err}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "{}";

    try {
      return JSON.parse(rawText) as T;
    } catch (parseErr) {
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson) as T;
    }
  }
}

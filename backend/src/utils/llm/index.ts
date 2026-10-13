import { config } from "../../config";
import type { SOAPData } from "../../modules/consultation/model";

export interface LLMGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
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

export const CLINICAL_EXTRACTION_SYSTEM_PROMPT = `
Anda adalah asisten AI klinis berstandar medis tinggi yang bertugas mengonversi transkrip konsultasi dokter-pasien menjadi catatan SOAP (Subjective, Objective, Assessment, Plan) terstruktur dan ringkasan edukasi pasien.

PEDOMAN KETAT (Berdasarkan Prinsip Keselamatan Klinis):
1. KETERLACAKAN (Traceability): Setiap informasi penting yang diekstrak WAJIB menyertakan kutipan langsung yang persis ada pada transkrip ("quote"). Jangan mengarang kutipan.
2. PRINSIP NEGASI & RIWAYAT:
   - Bedakan antara "Disangkal" (pasien/dokter menyatakan secara eksplisit kondisi tidak ada), "Tidak Disebutkan" (tidak ada pembahasan), dan "Perlu Konfirmasi".
   - Jika tidak ada pembahasan alergi, jangan tulis "tidak memiliki alergi", melainkan status "TIDAK_DISEBUTKAN".
   - Pisahkan riwayat penyakit keluarga dari riwayat penyakit pasien. Jangan masukkan riwayat keluarga ke riwayat penyakit pribadi pasien.
3. OBJEKTIF:
   - Hanya catat tanda vital (tekanan darah, nadi, suhu, napas) atau temuan fisik yang secara eksplisit diucapkan atau diperiksa di transkrip.
   - JANGAN PERNAH menambahkan nilai normal bawaan (default normal values) jika tidak disebutkan!
4. ASESMEN & TINGKAT KEPASTIAN:
   - Catat diagnosis dokter beserta tingkat kepastiannya (PASTI / DUGAAN_KERJA / PERLU_PEMERIKSAAN_LANJUT).
5. PLAN & RESEP:
   - Jangan menebak obat, dosis, atau frekuensi di luar apa yang terucap.
   - Catat anjuran gaya hidup, pantangan makanan/kebiasaan, jadwal kontrol, dan tanda bahaya darurat (red flags) yang harus segera ke IGD.
6. RINGKASAN PASIEN:
   - Buat ringkasan dalam bahasa awam yang mudah dipahami, empati, dan tidak menggunakan jargon rumit tanpa penjelasan.
7. KETIDAKPASTIAN (Uncertainties):
   - Jika ada instruksi yang ambigu, dosis tidak lengkap, atau ketidaksesuaian, masukkan ke dalam daftar 'uncertainties' untuk diverifikasi dokter.

Keluarkan hasil HANYA dalam format JSON valid sesuai skema yang diminta, tanpa markdown tag \`\`\`json di sekitarnya.
`;

export const SOAP_JSON_SCHEMA_GUIDE = `
Struktur JSON yang diharapkan:
{
  "subjective": {
    "chiefComplaint": "string",
    "historyOfPresentIllness": "string",
    "pastMedicalHistory": "string (opsional)",
    "familyMedicalHistory": "string (opsional, dipisahkan)",
    "allergies": {
      "status": "DISANGKAL" | "TERDAPAT" | "TIDAK_DISEBUTKAN" | "PERLU_KONFIRMASI",
      "details": "string (opsional)"
    },
    "evidence": [
      { "quote": "string", "sourceSpeaker": "Pasien" | "Dokter" | "Pendamping", "context": "string" }
    ]
  },
  "objective": {
    "vitalSigns": {
      "bloodPressure": "string",
      "heartRate": "string",
      "temperature": "string",
      "respiratoryRate": "string"
    },
    "physicalExamFindings": "string",
    "evidence": [
      { "quote": "string", "sourceSpeaker": "Dokter" | "Pasien" }
    ]
  },
  "assessment": {
    "primaryDiagnosis": "string",
    "differentialDiagnosis": ["string"],
    "clinicalCertainty": "PASTI" | "DUGAAN_KERJA" | "PERLU_PEMERIKSAAN_LANJUT",
    "evidence": [
      { "quote": "string", "sourceSpeaker": "Dokter" }
    ]
  },
  "plan": {
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "duration": "string",
        "instructions": "string"
      }
    ],
    "diagnosticOrders": ["string"],
    "patientEducation": ["string"],
    "contraindicationsOrRestrictions": ["string"],
    "followUpPlan": "string",
    "emergencyRedFlags": ["string"],
    "evidence": [
      { "quote": "string", "sourceSpeaker": "Dokter" }
    ]
  },
  "patientSummary": {
    "facilityName": "string",
    "doctorName": "string",
    "date": "string",
    "simpleConclusion": "string",
    "medicationInstructions": ["string"],
    "lifestyleAdvice": ["string"],
    "thingsToAvoid": ["string"],
    "controlSchedule": "string",
    "emergencySigns": ["string"]
  },
  "uncertainties": [
    {
      "issue": "string",
      "reason": "AMBIGU" | "TIDAK_LENGKAP" | "KONFLIK" | "PERLU_KONFIRMASI_DOKTER",
      "suggestedAction": "string"
    }
  ]
}
`;



export const DIARIZATION_SYSTEM_PROMPT = `
Anda adalah asisten transkripsi medis profesional yang bertugas melakukan Speaker Diarization dan Role Attribution pada percakapan klinis dokter-pasien.

TUGAS UTAMA:
Terima teks percakapan mentah (hasil Speech-to-Text tanpa label), lalu pisahkan dan susun menjadi dialog terstruktur dengan label "Dokter:" dan "Pasien:".
Jika terdapat anggota keluarga atau pendamping yang berbicara, gunakan label "Pendamping:".

ATURAN KETAT:
1. AKURASI KONTEN: Pertahankan setiap kata, makna medis, dan keluhan yang diucapkan. JANGAN menambahkan hal yang tidak diucapkan, dan JANGAN memotong substansi pembicaraan.
2. PENGENALAN PERAN (ROLE ATTRIBUTION):
   - "Dokter:": Menyapa pasien, menanyakan keluhan utama, menggali riwayat penyakit/alergi, memeriksa fisik, menyampaikan diagnosis, menjelaskan resep obat, memberi anjuran, dan menetapkan jadwal kontrol/tanda bahaya.
   - "Pasien:": Menjawab pertanyaan, menceritakan gejala dan durasi sakit, mengeluhkan rasa nyeri, menyebutkan obat yang sempat diminum, atau mengonfirmasi instruksi dokter.
3. FORMATTING:
   - Setiap giliran bicara (speaker turn) WAJIB dimulai di baris baru dengan format "NamaRole: Kalimat".
   - Rapikan tanda baca (titik, koma, tanda tanya) dan kapitalisasi agar menjadi percakapan klinis yang nyaman dibaca.
   - Contoh format:
     Dokter: Selamat siang, silakan duduk. Apa yang dikeluhkan hari ini?
     Pasien: Siang dok, saya demam sudah tiga hari ini, tenggorokan juga sakit kalau menelan.
     Dokter: Baik, apakah ada batuk atau pilek juga?

Keluarkan HANYA teks dialog yang sudah berlabel tanpa kata pengantar, tanpa penjelasan, dan tanpa markdown fences.
`.trim();

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
    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
    const endpoint = cleanBaseUrl.endsWith("/chat/completions")
      ? cleanBaseUrl
      : `${cleanBaseUrl}/chat/completions`;

    const systemContent = options?.systemPrompt ?? CLINICAL_EXTRACTION_SYSTEM_PROMPT;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: prompt },
        ],
        temperature: options?.temperature ?? 0.2,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`${this.name} generate failed (${response.status}): ${err}`);
    }

    interface OpenAIChatCompletionResponse {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    }

    const data = (await response.json()) as OpenAIChatCompletionResponse;
    return data.choices?.[0]?.message?.content || "";
  }

  async generateJSON<T>(
    prompt: string,
    schemaGuidance?: string,
    options?: LLMGenerateOptions
  ): Promise<T> {
    const { apiKey, baseUrl, model } = this.getValidConfig();
    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
    const endpoint = cleanBaseUrl.endsWith("/chat/completions")
      ? cleanBaseUrl
      : `${cleanBaseUrl}/chat/completions`;

    const fullPrompt = `${prompt}\n\n${schemaGuidance || ""}`;

    // Request payload: attempt with response_format first
    let response = await fetch(endpoint, {
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

    // If provider rejects response_format (e.g. Anthropic Claude via OpenRouter or models without JSON mode support)
    if (!response.ok && response.status === 400) {
      const errText = await response.text();
      if (errText.includes("response_format") || errText.includes("json_object")) {
        // Retry without response_format, relying on system prompt for JSON output
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: CLINICAL_EXTRACTION_SYSTEM_PROMPT },
              { role: "user", content: fullPrompt },
            ],
            temperature: options?.temperature ?? 0.1,
          }),
        });
      } else {
        throw new Error(`${this.name} generateJSON failed (400): ${errText}`);
      }
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`${this.name} generateJSON failed (${response.status}): ${err}`);
    }

    interface OpenAIChatCompletionResponse {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    }

    const data = (await response.json()) as OpenAIChatCompletionResponse;
    const rawText = data.choices?.[0]?.message?.content || "";

    if (!rawText.trim()) {
      throw new Error("Model AI tidak mengembalikan output teks.");
    }

    // Robust parsing: extract JSON block if wrapped in markdown or extra commentary
    const cleanJson = rawText
      .replace(/```(?:json)?/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    const jsonStr =
      firstBrace !== -1 && lastBrace !== -1
        ? cleanJson.substring(firstBrace, lastBrace + 1)
        : cleanJson;

    try {
      return JSON.parse(jsonStr) as T;
    } catch (parseErr: any) {
      throw new Error(
        `Gagal memparsing JSON dari respons model AI: ${parseErr.message}. Output mentah: ${rawText.slice(0, 300)}`
      );
    }
  }
}

export function getLLMProvider(): LLMProvider {
  return new OpenAICompatibleLLMProvider(
    "unified",
    config.llm.apiKey,
    config.llm.baseUrl,
    config.llm.model
  );
}

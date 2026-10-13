import { Elysia, t } from "elysia";
import { config } from "../config";
import { deidentificationService } from "../services/deidentification";
import { getLLMProvider } from "../services/llm";
import { getSTTProvider } from "../services/stt";
import { SAMPLE_CONSULTATION_TRANSCRIPTS } from "../services/stt/mock-stt";
import { SOAP_JSON_SCHEMA_GUIDE } from "../services/clinical-prompts";
import type { ConsultationProcessResult, SOAPData } from "../types/consultation";

export const consultationRoutes = new Elysia({ prefix: "/api/consultation" })
  // 1. Dapatkan daftar sample percakapan klinis (untuk kemudahan testing pengguna)
  .get("/samples", () => {
    return {
      samples: SAMPLE_CONSULTATION_TRANSCRIPTS,
    };
  })

  // 2. Info Status Provider Saat Ini (Agnostik Vendor)
  .get("/status", () => {
    return {
      stt: {
        configuredProvider: config.stt.provider,
        hasKey: Boolean(config.stt.apiKey),
        baseUrl: config.stt.baseUrl,
        model: config.stt.model,
      },
      llm: {
        configuredProvider: config.llm.provider,
        hasKey: Boolean(config.llm.apiKey),
        baseUrl: config.llm.baseUrl,
        model: config.llm.model,
      },
    };
  })

  // 3. Endpoint STT Terpisah: Audio -> Transkripsi
  .post(
    "/stt",
    async ({ body, set }) => {
      try {
        const file = (body as any)?.audio;
        const stt = getSTTProvider();

        if (!file || !(file instanceof Blob)) {
          set.status = 400;
          return { error: "Field 'audio' (file) wajib diisi." };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await stt.transcribe(buffer, file.type || "audio/webm", {
          filename: (file as any).name || "recording.webm",
          language: "id",
        });
        return result;
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal melakukan transkripsi audio." };
      }
    }
  )

  // 4. Endpoint Deidentifikasi Terpisah: Teks Transkrip -> Teks Teranonimasi + Entitas PII
  .post(
    "/deidentify",
    ({ body, set }) => {
      try {
        const text = (body as any)?.text;
        if (typeof text !== "string" || text.trim() === "") {
          set.status = 400;
          return { error: "Field 'text' (string tidak kosong) wajib diisi." };
        }
        return deidentificationService.deidentify(text);
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal melakukan deidentifikasi teks." };
      }
    },
    {
      body: t.Object({
        text: t.String(),
      }),
    }
  )

  // 5. Endpoint Auto-Fill SOAP Terpisah: Teks -> SOAP Terstruktur
  .post(
    "/autofill",
    async ({ body, set }) => {
      try {
        const text = (body as any)?.text;
        if (typeof text !== "string" || text.trim() === "") {
          set.status = 400;
          return { error: "Field 'text' (string tidak kosong) wajib diisi." };
        }
        const llm = getLLMProvider();

        const prompt = `Ekstrak percakapan konsultasi klinis berikut menjadi struktur SOAP medis terstandar:\n\n${text}`;
        const soapData = await llm.generateJSON<SOAPData>(prompt, SOAP_JSON_SCHEMA_GUIDE);

        return {
          providerUsed: llm.name,
          soap: soapData,
        };
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal mengekstrak catatan SOAP." };
      }
    },
    {
      body: t.Object({
        text: t.String(),
      }),
    }
  )

  // 6. Endpoint Pipa Lengkap (Full Pipeline MVP): Audio -> STT -> Deidentifikasi -> Auto-Fill SOAP
  .post(
    "/process",
    async ({ body, set }): Promise<ConsultationProcessResult | { error: string }> => {
      try {
        const file = (body as any)?.audio;
        const textInput = (body as any)?.text;
        const stt = getSTTProvider();
        const llm = getLLMProvider();

        let transcriptText = "";
        let audioMeta = undefined;

        if (file && file instanceof Blob) {
          audioMeta = {
            filename: (file as any).name || "recording.webm",
            sizeBytes: file.size,
            mimeType: file.type || "audio/webm",
          };
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const sttResult = await stt.transcribe(buffer, file.type || "audio/webm", {
            filename: audioMeta.filename,
            language: "id",
          });
          transcriptText = sttResult.text;
        } else if (textInput && typeof textInput === "string" && textInput.trim() !== "") {
          transcriptText = textInput;
        } else {
          set.status = 400;
          return { error: "Wajib kirim salah satu: field 'audio' (file) atau field 'text' (string tidak kosong)." };
        }

        // Tahap 2: Deidentifikasi Privasi PII
        const deidResult = deidentificationService.deidentify(transcriptText);

        // Tahap 3: Auto-Fill SOAP Klinis (menggunakan teks deidentifikasi untuk perlindungan privasi ke model LLM)
        const prompt = `Ekstrak percakapan konsultasi klinis berikut menjadi struktur SOAP medis terstandar:\n\n${deidResult.deidentifiedText}`;
        const soapData = await llm.generateJSON<SOAPData>(prompt, SOAP_JSON_SCHEMA_GUIDE);

        const consultationId = `cons-${Date.now()}`;

        return {
          id: consultationId,
          createdAt: new Date().toISOString(),
          audioMetadata: audioMeta,
          stt: {
            providerUsed: stt.name,
            transcript: transcriptText,
          },
          deidentification: deidResult,
          soap: soapData,
        };
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal memproses alur konsultasi." };
      }
    }
  );

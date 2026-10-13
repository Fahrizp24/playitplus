import { deidentificationService } from "../../utils/deidentification";
import {
  DIARIZATION_SYSTEM_PROMPT,
  getLLMProvider,
  SOAP_JSON_SCHEMA_GUIDE,
} from "../../utils/llm";
import { getSTTProvider } from "../../utils/stt";
import type {
  AudioMetadata,
  ConsultationProcessResult,
  ConsultationSamplesResponse,
  DeidentificationResult,
  SOAPData,
} from "./model";

export class ConsultationService {
  getSamples(): ConsultationSamplesResponse {
    return {
      samples: [],
    };
  }

  async diarizeTranscript(rawText: string): Promise<string> {
    if (!rawText || rawText.trim() === "") return rawText;

    // Jika teks sudah memiliki format peran (Dokter/Pasien), gunakan langsung
    if (/^(?:Dokter|Pasien|dr\.)\s*:/im.test(rawText)) {
      return rawText;
    }

    try {
      const llm = getLLMProvider();
      const diarized = await llm.generateText(
        `Berikut teks mentah transkripsi audio percakapan konsultasi:\n\n${rawText}`,
        {
          systemPrompt: DIARIZATION_SYSTEM_PROMPT,
          temperature: 0.1,
        }
      );

      const cleanDiarized = diarized
        .replace(/```(?:markdown|text)?/gi, "")
        .replace(/```/g, "")
        .trim();

      return cleanDiarized || rawText;
    } catch (err) {
      console.warn("[ConsultationService] Gagal diarize via LLM, menggunakan raw text:", err);
      return rawText;
    }
  }

  async transcribeAudio(
    file: Blob,
    filename?: string
  ): Promise<{ text: string; durationSeconds?: number; provider: string }> {
    const actualFilename = filename || (file as any).name || (file as any).filename;
    if (!actualFilename) {
      throw new Error("Nama berkas audio wajib disertakan.");
    }
    const stt = getSTTProvider();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await stt.transcribe(buffer, file.type || "audio/webm", {
      filename: actualFilename,
      language: "id",
    });
    const diarized = await this.diarizeTranscript(result.text);
    return {
      text: diarized,
      durationSeconds: result.durationSeconds,
      provider: stt.name,
    };
  }

  deidentify(text: string): DeidentificationResult {
    return deidentificationService.deidentify(text);
  }

  async autoFillSOAP(text: string): Promise<{ providerUsed: string; soap: SOAPData }> {
    const llm = getLLMProvider();
    const prompt = `Ekstrak percakapan konsultasi klinis berikut menjadi struktur SOAP medis terstandar:\n\n${text}`;
    const soapData = await llm.generateJSON<SOAPData>(prompt, SOAP_JSON_SCHEMA_GUIDE);
    return {
      providerUsed: llm.name,
      soap: soapData,
    };
  }

  async processPipeline(input: {
    audio?: Blob;
    filename?: string;
    text?: string;
  }): Promise<ConsultationProcessResult> {
    const stt = getSTTProvider();
    const llm = getLLMProvider();

    let rawTranscriptText = "";
    let audioMeta: AudioMetadata | undefined = undefined;

    if (input.audio && input.audio instanceof Blob) {
      const filename = input.filename || (input.audio as any).name || (input.audio as any).filename;
      if (!filename) {
        throw new Error("Nama berkas audio wajib disertakan.");
      }
      audioMeta = {
        filename,
        sizeBytes: input.audio.size,
        mimeType: input.audio.type || "audio/webm",
      };
      const arrayBuffer = await input.audio.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const sttResult = await stt.transcribe(buffer, audioMeta.mimeType, {
        filename: audioMeta.filename,
        language: "id",
      });
      rawTranscriptText = sttResult.text;
      audioMeta.durationSeconds = sttResult.durationSeconds;
    } else if (input.text && typeof input.text === "string" && input.text.trim() !== "") {
      rawTranscriptText = input.text;
    } else {
      throw new Error(
        "Wajib mengirimkan salah satu input: file 'audio' atau 'text' (tidak boleh kosong)."
      );
    }

    // 1. Speaker Diarization via LLM (menentukan aktor Dokter & Pasien dari konteks)
    const diarizedTranscript = await this.diarizeTranscript(rawTranscriptText);

    // 2. Deidentifikasi pada teks beraktor
    const deidResult = deidentificationService.deidentify(diarizedTranscript);

    // 3. Auto-fill SOAP
    const prompt = `Ekstrak percakapan konsultasi klinis berikut menjadi struktur SOAP medis terstandar:\n\n${deidResult.deidentifiedText}`;
    const soapData = await llm.generateJSON<SOAPData>(prompt, SOAP_JSON_SCHEMA_GUIDE);

    return {
      id: `cons-${Date.now()}`,
      createdAt: new Date().toISOString(),
      audioMetadata: audioMeta,
      stt: {
        providerUsed: stt.name,
        transcript: diarizedTranscript,
        rawTranscript: rawTranscriptText,
        durationSeconds: audioMeta?.durationSeconds,
      },
      deidentification: deidResult,
      soap: soapData,
    };
  }
}

export const consultationService = new ConsultationService();

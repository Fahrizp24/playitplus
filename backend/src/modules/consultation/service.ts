import { deidentificationService } from "../../utils/deidentification";
import { getLLMProvider, SOAP_JSON_SCHEMA_GUIDE } from "../../utils/llm";
import { getSTTProvider, SAMPLE_CONSULTATION_TRANSCRIPTS } from "../../utils/stt";
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
      samples: SAMPLE_CONSULTATION_TRANSCRIPTS,
    };
  }

  async transcribeAudio(
    file: Blob,
    filename: string = "recording.webm"
  ): Promise<{ text: string; durationSeconds?: number; provider: string }> {
    const stt = getSTTProvider();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await stt.transcribe(buffer, file.type || "audio/webm", {
      filename,
      language: "id",
    });
    return {
      text: result.text,
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

    let transcriptText = "";
    let audioMeta: AudioMetadata | undefined = undefined;

    if (input.audio && input.audio instanceof Blob) {
      const filename = input.filename || "recording.webm";
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
      transcriptText = sttResult.text;
      audioMeta.durationSeconds = sttResult.durationSeconds;
    } else if (input.text && typeof input.text === "string" && input.text.trim() !== "") {
      transcriptText = input.text;
    } else {
      throw new Error(
        "Wajib mengirimkan salah satu input: file 'audio' atau 'text' (tidak boleh kosong)."
      );
    }

    // Deidentifikasi
    const deidResult = deidentificationService.deidentify(transcriptText);

    // Auto-fill SOAP
    const prompt = `Ekstrak percakapan konsultasi klinis berikut menjadi struktur SOAP medis terstandar:\n\n${deidResult.deidentifiedText}`;
    const soapData = await llm.generateJSON<SOAPData>(prompt, SOAP_JSON_SCHEMA_GUIDE);

    return {
      id: `cons-${Date.now()}`,
      createdAt: new Date().toISOString(),
      audioMetadata: audioMeta,
      stt: {
        providerUsed: stt.name,
        transcript: transcriptText,
        durationSeconds: audioMeta?.durationSeconds,
      },
      deidentification: deidResult,
      soap: soapData,
    };
  }
}

export const consultationService = new ConsultationService();

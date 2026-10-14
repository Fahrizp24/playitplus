import { deidentificationService } from "../../utils/deidentification";
import {
  DIARIZATION_SYSTEM_PROMPT,
  getLLMProvider,
  SOAP_JSON_SCHEMA_GUIDE,
} from "../../utils/llm";
import { getSTTProvider } from "../../utils/stt";
import { DUMMY_AUDIO_PRESETS, DUMMY_CONSULTATION_QUEUE } from "./dummy-queue";
import type {
  AudioMetadata,
  AudioPresetsResponse,
  ConsultationProcessResult,
  ConsultationQueueResponse,
  ConsultationSamplesResponse,
  DeidentificationResult,
  SOAPData,
} from "./model";

export class ConsultationService {
  getQueue(): ConsultationQueueResponse {
    return {
      queue: DUMMY_CONSULTATION_QUEUE,
    };
  }

  getPresets(): AudioPresetsResponse {
    return {
      presets: DUMMY_AUDIO_PRESETS.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        durationLabel: p.durationLabel,
        filename: p.filename,
      })),
    };
  }

  async processPreset(presetId: string): Promise<ConsultationProcessResult> {
    const bunGlobal = (globalThis as unknown as { Bun?: { file: (path: string) => any } }).Bun;
    if (!bunGlobal) {
      throw new Error("Runtime Bun tidak ditemukan untuk membaca berkas audio.");
    }

    const baseName = presetId.replace(/\.(wav|mp3|webm|m4a|ogg)$/i, "");
    const possibleExtensions = [".wav", ".mp3", ".webm", ".m4a", ".ogg"];

    let targetFile: any = null;
    let actualFilename = `${baseName}.wav`;

    for (const ext of possibleExtensions) {
      const filePath = `src/assets/audio/${baseName}${ext}`;
      const f = bunGlobal.file(filePath);
      if (f && f.size > 0) {
        targetFile = f;
        actualFilename = `${baseName}${ext}`;
        break;
      }
    }

    if (!targetFile) {
      throw new Error(
        `Berkas audio untuk '${presetId}' tidak ditemukan di 'src/assets/audio/'. Pastikan berkas preset-1 atau preset-2 tersedia.`
      );
    }

    // Jalankan pipeline AI ASLI: STT (ZeroGPU Whisper) -> Diarization -> Deidentifikasi -> LLM SOAP
    return await this.processPipeline({
      audio: targetFile,
      filename: actualFilename,
    });
  }

  getSamples(): ConsultationSamplesResponse {
    return {
      samples: [],
    };
  }

  async diarizeTranscript(rawText: string): Promise<string> {
    if (!rawText || rawText.trim() === "") return rawText;

    // Jika teks sudah memiliki format peran (Dokter/Pasien), normalisasikan jeda baris antar aktor
    const hasExistingRoles =
      /(?:^|\b|\n|\r|[.?!:,;])\s*(?:[-*•\d.]+\s*)?(?:\*\*)?(?:Dokter|Pasien|dr\.)(?:\*\*)?\s*:/i.test(
        rawText
      );

    if (hasExistingRoles) {
      return rawText
        .replace(
          /(?:^|\b|\n|\r|[.?!:,;])\s*(?:[-*•\d.]+\s*)?(?:\*\*)?(Dokter|Pasien|Pendamping|dr\.)(?:\*\*)?\s*:\s*(?:\*\*)?/gi,
          (match, role) => `\n${role.toLowerCase() === "dr." ? "Dokter" : role}: `
        )
        .trim();
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
        .replace(
          /(?:^|\n|\r|[.?!])\s*(?:[-*•\d.]+\s*)?(?:\*\*)?(Dokter|Pasien|Pendamping|dr\.)(?:\*\*)?\s*:\s*(?:\*\*)?/gi,
          (match, role) => `\n${role.toLowerCase() === "dr." ? "Dokter" : role}: `
        )
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
  ): Promise<{
    text: string;
    deidentification: DeidentificationResult;
    durationSeconds?: number;
    provider: string;
  }> {
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
    const deid = this.deidentify(diarized);
    return {
      text: diarized,
      deidentification: deid,
      durationSeconds: result.durationSeconds,
      provider: stt.name,
    };
  }

  deidentify(text: string): DeidentificationResult {
    return deidentificationService.deidentify(text);
  }

  private sanitizeSOAPData(raw: any): SOAPData {
    if (!raw || typeof raw !== "object") {
      throw new Error("Format data SOAP dari LLM tidak valid (bukan objek JSON).");
    }

    const validAllergyStatuses = ["DISANGKAL", "TERDAPAT", "TIDAK_DISEBUTKAN", "PERLU_KONFIRMASI"];
    const rawAllergyStatus = String(raw.subjective?.allergies?.status || "").toUpperCase().replace(/\s+/g, "_");
    const allergyStatus = validAllergyStatuses.includes(rawAllergyStatus)
      ? rawAllergyStatus
      : "TIDAK_DISEBUTKAN";

    const validClinicalCertainty = ["PASTI", "DUGAAN_KERJA", "PERLU_PEMERIKSAAN_LANJUT"];
    const rawCertainty = String(raw.assessment?.clinicalCertainty || "").toUpperCase().replace(/\s+/g, "_");
    const clinicalCertainty = validClinicalCertainty.includes(rawCertainty)
      ? rawCertainty
      : "DUGAAN_KERJA";

    const validReasons = ["AMBIGU", "TIDAK_LENGKAP", "KONFLIK", "PERLU_KONFIRMASI_DOKTER"];
    const rawUncertainties = Array.isArray(raw.uncertainties) ? raw.uncertainties : [];
    const uncertainties = rawUncertainties.map((u: any) => {
      const rawReason = String(u?.reason || "").toUpperCase().replace(/\s+/g, "_");
      return {
        issue: String(u?.issue || "Perlu konfirmasi klinis"),
        reason: (validReasons.includes(rawReason) ? rawReason : "AMBIGU") as any,
        suggestedAction: String(u?.suggestedAction || "Konfirmasi dengan dokter pemeriksa"),
      };
    });

    const sanitizeQuotes = (quotes: any[]) => {
      if (!Array.isArray(quotes)) return [];
      return quotes.map((q: any) => ({
        quote: String(q?.quote || ""),
        sourceSpeaker: ["Dokter", "Pasien", "Pendamping"].includes(q?.sourceSpeaker)
          ? q.sourceSpeaker
          : null,
        context: q?.context ? String(q.context) : null,
      }));
    };

    const patientSummary = raw.patientSummary || {};

    return {
      subjective: {
        chiefComplaint: String(raw.subjective?.chiefComplaint || "-"),
        historyOfPresentIllness: String(raw.subjective?.historyOfPresentIllness || "-"),
        pastMedicalHistory: raw.subjective?.pastMedicalHistory ? String(raw.subjective.pastMedicalHistory) : null,
        familyMedicalHistory: raw.subjective?.familyMedicalHistory ? String(raw.subjective.familyMedicalHistory) : null,
        allergies: {
          status: allergyStatus as any,
          details: raw.subjective?.allergies?.details ? String(raw.subjective.allergies.details) : null,
        },
        evidence: sanitizeQuotes(raw.subjective?.evidence),
      },
      objective: {
        vitalSigns: raw.objective?.vitalSigns
          ? {
              bloodPressure: raw.objective.vitalSigns.bloodPressure ? String(raw.objective.vitalSigns.bloodPressure) : null,
              heartRate: raw.objective.vitalSigns.heartRate ? String(raw.objective.vitalSigns.heartRate) : null,
              temperature: raw.objective.vitalSigns.temperature ? String(raw.objective.vitalSigns.temperature) : null,
              respiratoryRate: raw.objective.vitalSigns.respiratoryRate ? String(raw.objective.vitalSigns.respiratoryRate) : null,
            }
          : null,
        physicalExamFindings: String(raw.objective?.physicalExamFindings || "Pemeriksaan fisik dalam batas normal"),
        evidence: sanitizeQuotes(raw.objective?.evidence),
      },
      assessment: {
        primaryDiagnosis: String(raw.assessment?.primaryDiagnosis || "Observasi Klinis"),
        differentialDiagnosis: Array.isArray(raw.assessment?.differentialDiagnosis)
          ? raw.assessment.differentialDiagnosis.map(String)
          : null,
        clinicalCertainty: clinicalCertainty as any,
        evidence: sanitizeQuotes(raw.assessment?.evidence),
      },
      plan: {
        medications: Array.isArray(raw.plan?.medications)
          ? raw.plan.medications.map((m: any) => ({
              name: String(m?.name || "Obat"),
              dosage: String(m?.dosage || "-"),
              frequency: String(m?.frequency || "-"),
              duration: String(m?.duration || "-"),
              instructions: m?.instructions ? String(m.instructions) : null,
            }))
          : [],
        diagnosticOrders: Array.isArray(raw.plan?.diagnosticOrders)
          ? raw.plan.diagnosticOrders.map(String)
          : null,
        patientEducation: Array.isArray(raw.plan?.patientEducation)
          ? raw.plan.patientEducation.map(String)
          : [],
        contraindicationsOrRestrictions: Array.isArray(raw.plan?.contraindicationsOrRestrictions)
          ? raw.plan.contraindicationsOrRestrictions.map(String)
          : null,
        followUpPlan: String(raw.plan?.followUpPlan || "Kontrol jika keluhan berlanjut"),
        emergencyRedFlags: Array.isArray(raw.plan?.emergencyRedFlags)
          ? raw.plan.emergencyRedFlags.map(String)
          : [],
        evidence: sanitizeQuotes(raw.plan?.evidence),
      },
      patientSummary: {
        facilityName: patientSummary.facilityName ? String(patientSummary.facilityName) : null,
        doctorName: patientSummary.doctorName ? String(patientSummary.doctorName) : null,
        date: String(patientSummary.date || new Date().toISOString().split("T")[0]),
        simpleConclusion: String(patientSummary.simpleConclusion || "Ringkasan konsultasi"),
        medicationInstructions: Array.isArray(patientSummary.medicationInstructions)
          ? patientSummary.medicationInstructions.map(String)
          : [],
        lifestyleAdvice: Array.isArray(patientSummary.lifestyleAdvice)
          ? patientSummary.lifestyleAdvice.map(String)
          : [],
        thingsToAvoid: Array.isArray(patientSummary.thingsToAvoid)
          ? patientSummary.thingsToAvoid.map(String)
          : [],
        controlSchedule: String(patientSummary.controlSchedule || "Sesuai anjuran"),
        emergencySigns: Array.isArray(patientSummary.emergencySigns)
          ? patientSummary.emergencySigns.map(String)
          : [],
      },
      uncertainties,
    };
  }

  async autoFillSOAP(text: string): Promise<{ providerUsed: string; soap: SOAPData }> {
    const llm = getLLMProvider();
    const prompt = `Ekstrak percakapan konsultasi klinis berikut menjadi struktur SOAP medis terstandar:\n\n${text}`;
    const rawSoap = await llm.generateJSON<SOAPData>(prompt, SOAP_JSON_SCHEMA_GUIDE);
    const soapData = this.sanitizeSOAPData(rawSoap);
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
    const rawSoap = await llm.generateJSON<SOAPData>(prompt, SOAP_JSON_SCHEMA_GUIDE);
    const soapData = this.sanitizeSOAPData(rawSoap);

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

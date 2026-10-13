import {
  getConsultationRepository,
  type ConsultationSamplesResponse,
} from "./repositories";
import type { ConsultationProcessResult } from "./types";

export * from "./repositories";

/**
 * Mengambil daftar preset sampel percakapan konsultasi klinis.
 */
export async function getConsultationSamples(): Promise<ConsultationSamplesResponse> {
  return getConsultationRepository().getSamples();
}

/**
 * Memproses rekaman audio melalui pipeline STT -> Deidentifikasi -> SOAP.
 */
export async function processConsultationAudio(
  audioBlob: Blob,
  filename: string
): Promise<ConsultationProcessResult> {
  return getConsultationRepository().processAudio(audioBlob, filename);
}

/**
 * Memproses teks percakapan melalui pipeline Deidentifikasi -> SOAP.
 */
export async function processConsultationText(
  text: string
): Promise<ConsultationProcessResult> {
  return getConsultationRepository().processText(text);
}

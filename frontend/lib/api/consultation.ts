import { eden } from "./eden";
import type {
  ConsultationProcessResult,
  ConsultationQueueResponse,
  ConsultationSamplesResponse,
  DeidentificationResult,
  SOAPData,
} from "../types";

function extractErrorMessage(errorValue: unknown, defaultMessage: string): string {
  if (
    typeof errorValue === "object" &&
    errorValue !== null &&
    "error" in errorValue &&
    typeof (errorValue as Record<string, unknown>).error === "string"
  ) {
    return (errorValue as Record<string, unknown>).error as string;
  }
  return defaultMessage;
}

/**
 * Mengambil daftar antrean pasien klinis lengkap dengan transkrip & ringkasan dari BE.
 */
export async function getConsultationQueue(): Promise<ConsultationQueueResponse> {
  const { data, error } = await eden.api.consultation.queue.get();
  if (error) {
    throw new Error(
      extractErrorMessage(error.value, "Gagal mengambil daftar antrean pasien.")
    );
  }
  return data;
}

/**
 * Mengambil daftar preset sampel percakapan konsultasi klinis langsung via Eden.
 */
export async function getConsultationSamples(): Promise<ConsultationSamplesResponse> {
  const { data, error } = await eden.api.consultation.samples.get();
  if (error) {
    throw new Error(
      extractErrorMessage(error.value, "Gagal mengambil contoh percakapan klinis.")
    );
  }
  return data;
}

/**
 * Memproses rekaman audio melalui pipeline STT -> Deidentifikasi -> SOAP via Eden.
 */
export async function processConsultationAudio(
  audioBlob: Blob,
  filename: string
): Promise<ConsultationProcessResult> {
  const audioFile =
    audioBlob instanceof File
      ? audioBlob
      : new File([audioBlob], filename, { type: audioBlob.type || "audio/webm" });

  const { data, error } = await eden.api.consultation.process.post({
    audio: audioFile,
  } as Record<string, unknown>);

  if (error) {
    throw new Error(
      extractErrorMessage(error.value, `Gagal memproses berkas audio (${error.status}).`)
    );
  }
  return data as ConsultationProcessResult;
}

/**
 * Memproses teks percakapan melalui pipeline Deidentifikasi -> SOAP via Eden.
 */
export async function processConsultationText(
  text: string
): Promise<ConsultationProcessResult> {
  const { data, error } = await eden.api.consultation.process.post({
    text,
  } as Record<string, unknown>);

  if (error) {
    throw new Error(
      extractErrorMessage(error.value, `Gagal memproses teks klinis (${error.status}).`)
    );
  }
  return data as ConsultationProcessResult;
}

/**
 * Melakukan deidentifikasi PII langsung pada teks.
 */
export async function deidentifyText(
  text: string
): Promise<DeidentificationResult> {
  const { data, error } = await eden.api.consultation.deidentify.post({
    text,
  });

  if (error) {
    throw new Error(
      extractErrorMessage(error.value, "Gagal melakukan deidentifikasi teks.")
    );
  }
  return data;
}

/**
 * Mentranskripsikan berkas audio secara bertahap (STT + Diarization + Deidentifikasi) via Eden.
 */
export async function transcribeConsultationAudio(
  audioBlob: Blob,
  filename: string
): Promise<{
  text: string;
  deidentification: DeidentificationResult;
  durationSeconds?: number;
  provider: string;
}> {
  const audioFile =
    audioBlob instanceof File
      ? audioBlob
      : new File([audioBlob], filename, { type: audioBlob.type || "audio/webm" });

  const { data, error } = await eden.api.consultation.stt.post({
    audio: audioFile,
  } as Record<string, unknown>);

  if (error) {
    throw new Error(
      extractErrorMessage(error.value, `Gagal mentranskripsikan berkas audio (${error.status}).`)
    );
  }
  return data as {
    text: string;
    deidentification: DeidentificationResult;
    durationSeconds?: number;
    provider: string;
  };
}

/**
 * Mengekstrak draf SOAP medis dari teks transkrip percakapan.
 */
export async function autofillConsultationSoap(
  text: string
): Promise<{ providerUsed: string; soap: SOAPData }> {
  const { data, error } = await eden.api.consultation.autofill.post({
    text,
  });

  if (error) {
    throw new Error(
      extractErrorMessage(error.value, "Gagal mengekstrak catatan SOAP medis.")
    );
  }
  return data as { providerUsed: string; soap: SOAPData };
}


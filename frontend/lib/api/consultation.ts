import { eden } from "./eden";
import type {
  ConsultationProcessResult,
  ConsultationSamplesResponse,
  DeidentificationResult,
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

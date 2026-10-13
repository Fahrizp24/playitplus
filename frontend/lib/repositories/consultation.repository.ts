import type { ConsultationProcessResult } from "../types";

export interface ConsultationSampleItem {
  title: string;
  text: string;
}

export interface ConsultationSamplesResponse {
  samples: ConsultationSampleItem[];
}

/**
 * Interface Repository untuk alur konsultasi klinis, STT, deidentifikasi, dan SOAP.
 */
export interface IConsultationRepository {
  getSamples(): Promise<ConsultationSamplesResponse>;
  processAudio(audioBlob: Blob, filename: string): Promise<ConsultationProcessResult>;
  processText(text: string): Promise<ConsultationProcessResult>;
}

/**
 * Implementasi HTTP Client untuk ConsultationRepository.
 * Berkomunikasi dengan Elysia Backend API.
 */
export class HttpConsultationRepository implements IConsultationRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    if (!baseUrl || baseUrl.trim() === "") {
      throw new Error(
        "[HttpConsultationRepository] baseUrl wajib disertakan dan tidak boleh kosong."
      );
    }
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async getSamples(): Promise<ConsultationSamplesResponse> {
    const res = await fetch(`${this.baseUrl}/api/consultation/samples`);
    if (!res.ok) {
      throw new Error(`Gagal mengambil contoh percakapan klinis (${res.status}).`);
    }
    return res.json();
  }

  async processAudio(
    audioBlob: Blob,
    filename: string
  ): Promise<ConsultationProcessResult> {
    if (!filename || filename.trim() === "") {
      throw new Error(
        "[HttpConsultationRepository] filename wajib disertakan untuk memproses audio."
      );
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, filename);

    const res = await fetch(`${this.baseUrl}/api/consultation/process`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Gagal memproses berkas audio pada server (${res.status})`
      );
    }

    return res.json();
  }

  async processText(text: string): Promise<ConsultationProcessResult> {
    if (!text || text.trim() === "") {
      throw new Error(
        "[HttpConsultationRepository] Teks percakapan tidak boleh kosong."
      );
    }

    const res = await fetch(`${this.baseUrl}/api/consultation/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Gagal memproses teks klinis pada server (${res.status})`
      );
    }

    return res.json();
  }
}

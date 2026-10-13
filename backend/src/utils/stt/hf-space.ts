import { Client } from "@gradio/client";
import type {
  STTProvider,
  STTTranscriptionOptions,
  STTTranscriptionResult,
} from "./index";

export class HuggingFaceSpaceSTTProvider implements STTProvider {
  name = "hf_space (MOSS-Transcribe-Diarize)";

  private static cachedClient: any = null;
  private static cachedEndpoint: string = "";
  private static cachedToken: string = "";

  constructor(
    private spaceUrl: string,
    private token?: string
  ) {}

  private getValidConfig(): { spaceEndpoint: string; token: string } {
    if (!this.spaceUrl || !this.spaceUrl.trim()) {
      throw new Error(
        "Variabel lingkungan 'HF_SPACE_URL' wajib diatur di file .env dan tidak boleh kosong."
      );
    }
    if (!this.token || !this.token.trim()) {
      throw new Error(
        "Variabel lingkungan 'HF_TOKEN' wajib diatur di file .env untuk mengakses Hugging Face ZeroGPU."
      );
    }
    return {
      spaceEndpoint: this.spaceUrl.trim(),
      token: this.token.trim(),
    };
  }

  private async getClient(endpoint: string, token: string): Promise<any> {
    if (
      HuggingFaceSpaceSTTProvider.cachedClient &&
      HuggingFaceSpaceSTTProvider.cachedEndpoint === endpoint &&
      HuggingFaceSpaceSTTProvider.cachedToken === token
    ) {
      return HuggingFaceSpaceSTTProvider.cachedClient;
    }

    const client = await Client.connect(endpoint, {
      token,
    });

    HuggingFaceSpaceSTTProvider.cachedClient = client;
    HuggingFaceSpaceSTTProvider.cachedEndpoint = endpoint;
    HuggingFaceSpaceSTTProvider.cachedToken = token;
    return client;
  }

  async transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult> {
    const { spaceEndpoint, token } = this.getValidConfig();

    // 1. Siapkan Blob untuk berkas audio
    const blob =
      audioData instanceof Blob
        ? audioData
        : new Blob([audioData as any], { type: mimeType || "audio/webm" });

    // 2. Hubungkan ke Space menggunakan klien resmi Gradio
    let app: any;
    try {
      app = await this.getClient(spaceEndpoint, token);
    } catch (connErr: any) {
      HuggingFaceSpaceSTTProvider.cachedClient = null;
      throw new Error(
        `Gagal menghubungkan ke Hugging Face Space (${spaceEndpoint}): ${connErr?.message || connErr}`
      );
    }

    // 3. Jalankan inferensi via API /transcribe_audio
    let result: any;
    try {
      result = await app.predict("/transcribe_audio", [
        blob,
        options?.prompt || "",
        2048,
      ]);
    } catch (predErr: any) {
      const msg = predErr?.message || String(predErr);
      if (msg.includes("ZeroGPU quota")) {
        throw new Error(
          `Kuota Hugging Face ZeroGPU terlampaui: ${msg}`
        );
      }
      // Jika terjadi error koneksi, bersihkan cache agar rekoneksi pada pemanggilan berikutnya
      HuggingFaceSpaceSTTProvider.cachedClient = null;
      throw new Error(
        `Hugging Face ZeroGPU mengembalikan status error saat inferensi: ${msg}`
      );
    }

    const rawResult = result?.data;
    let transcriptText = "";

    if (Array.isArray(rawResult)) {
      // Keluaran [formatted_dialogue, raw_transcript, json_output]
      // raw_transcript berada pada indeks 1, atau fallback ke indeks 0
      const rawTranscriptItem = rawResult[1] || rawResult[0] || "";
      if (typeof rawTranscriptItem === "string") {
        transcriptText = rawTranscriptItem;
      } else {
        transcriptText = JSON.stringify(rawTranscriptItem);
      }
    } else if (typeof rawResult === "string") {
      transcriptText = rawResult;
    }

    // Pembersihan jika model mengembalikan format JSON string
    if (transcriptText.includes("'text':") || transcriptText.includes('"text":')) {
      try {
        const parsed = JSON.parse(
          transcriptText
            .replace(/'/g, '"')
            .replace(/True/g, "true")
            .replace(/False/g, "false")
        );
        if (parsed.text) {
          transcriptText = parsed.text;
        }
      } catch {
        const match = transcriptText.match(/['"]text['"]\s*:\s*['"]([^'"]+)['"]/);
        if (match && match[1]) {
          transcriptText = match[1];
        }
      }
    }

    // Normalisasi tag [S01] / [S02] menjadi Dokter & Pasien
    const normalizedText = transcriptText
      .replace(/\[\d+\.\d+\]/g, "")
      .replace(/\[S01\]/gi, "\nDokter: ")
      .replace(/\[S02\]/gi, "\nPasien: ")
      .replace(/\[S03\]/gi, "\nPendamping: ")
      .trim();

    return {
      text: normalizedText || transcriptText,
      provider: this.name,
    };
  }
}

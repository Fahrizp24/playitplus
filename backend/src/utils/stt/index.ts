import { config } from "../../config";

export interface STTTranscriptionOptions {
  language?: string;
  filename?: string;
  prompt?: string;
}

export interface STTTranscriptionResult {
  text: string;
  durationSeconds?: number;
  provider: string;
}

export interface STTProvider {
  name: string;
  transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult>;
}

export const SAMPLE_CONSULTATION_TRANSCRIPTS = [
  {
    title: "Konsultasi Infeksi Saluran Pernapasan & Dispepsia",
    text: `Dokter: Selamat siang Bapak Budi Santoso, silakan duduk. Nomor rekam medisnya RM-882194 ya, NIK 3174021905890003, no WhatsApp aktif 081298765432 ya Pak?
Pasien: Betul Dokter Sarah.
Dokter: Baik Pak Budi, apa keluhan utama yang dirasakan hari ini?
Pasien: Sudah tiga hari ini saya demam naik turun dok, badan meriang, tenggorokan sakit menelan, sama ada batuk kering. Perut ulu hati juga agak perih mual karena kemarin sempat minum obat warung tanpa makan dulu.
Dokter: Baik, demamnya terutama sore atau malam hari? Ada pilek, sesak napas, atau menggigil?
Pasien: Tidak ada sesak dok, pilek sedikit saja. Menggigil terutama malam hari.
Dokter: Ada riwayat penyakit kronis sebelumnya, atau maag?
Pasien: Ada riwayat sakit maag dok sejak dua tahun lalu. Kalau keluarga tidak ada yang sakit begini, tapi ibu saya ada riwayat diabetes.
Dokter: Baik. Apakah ada riwayat alergi obat atau makanan tertentu, Pak?
Pasien: Tidak ada alergi dok, obat amoxicillin dan penisilin aman pernah minum.
Dokter: Saya periksa sebentar ya Pak. Buka mulutnya... ya faring tenggorokan tampak kemerahan hiperemis. Tekanan darah 120/80 mmHg, denyut nadi 84 kali per menit, frekuensi napas 18 kali per menit, suhu tubuh 38.2 derajat Celsius.
Pasien: Bagaimana dok hasilnya?
Dokter: Dari gejala dan pemeriksaan fisik, bapak mengalami faringitis akut atau radang tenggorokan yang disertai dispepsia kambuh.
Dokter: Rencana terapinya, saya resepkan Paracetamol 500 miligram diminum tiga kali sehari satu tablet sesudah makan bila masih demam atau nyeri. Lalu untuk lambungnya diberi Antasida sirup diminum tiga kali sehari satu sendok takar 15 menit sebelum makan. Serta Vitamin C 500 miligram satu kali sehari satu tablet untuk daya tahan tubuh.
Dokter: Anjuran saya, bapak istirahat total, perbanyak minum air hangat minimal dua liter sehari, dan hindari makanan pedas, berminyak, atau minuman dingin sementara waktu.
Dokter: Nanti kontrol kembali tiga hari lagi jika keluhan belum membaik. Tapi jika ada tanda bahaya seperti demam tinggi tidak turun di atas 39 derajat, sesak napas, muntah terus-menerus, atau keluar perdarahan seperti mimisan, langsung bawa ke IGD terdekat ya Pak.
Pasien: Baik dok, terima kasih banyak atas penjelasannya.`,
  },
];

export class MockSTTProvider implements STTProvider {
  name = "mock";

  async transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      text: SAMPLE_CONSULTATION_TRANSCRIPTS[0].text,
      durationSeconds: 125,
      provider: "mock-stt",
    };
  }
}

export class UnifiedSTTProvider implements STTProvider {
  name = "unified";

  constructor(
    private apiKey?: string,
    private baseUrl?: string,
    private model?: string
  ) {}

  private getValidConfig(): { apiKey: string; baseUrl: string; model: string } {
    if (!this.apiKey) {
      throw new Error("STT_API_KEY is not configured.");
    }
    if (!this.baseUrl) {
      throw new Error("STT_BASE_URL is not configured.");
    }
    if (!this.model) {
      throw new Error("STT_MODEL is not configured.");
    }
    return {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      model: this.model,
    };
  }

  async transcribe(
    audioData: Blob | Buffer | Uint8Array,
    mimeType: string,
    options?: STTTranscriptionOptions
  ): Promise<STTTranscriptionResult> {
    const { apiKey, baseUrl, model } = this.getValidConfig();

    const filename = options?.filename || "recording.webm";
    const blob =
      audioData instanceof Blob
        ? audioData
        : new Blob([audioData as any], { type: mimeType });

    const formData = new FormData();
    formData.append("file", blob, filename);
    formData.append("model", model);
    formData.append("language", options?.language || "id");

    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
    const endpoint = cleanBaseUrl.endsWith("/audio/transcriptions")
      ? cleanBaseUrl
      : `${cleanBaseUrl}/audio/transcriptions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Unified STT failed (${response.status}): ${errText}`);
    }

    interface OpenAITranscriptionResponse {
      text?: string;
      duration?: number;
    }

    const data = (await response.json()) as OpenAITranscriptionResponse;
    return {
      text: data.text || "",
      durationSeconds: data.duration,
      provider: `unified (${model})`,
    };
  }
}

export function getSTTProvider(overrideProvider?: string): STTProvider {
  const providerType = overrideProvider || config.stt.provider;

  if (providerType === "mock") {
    return new MockSTTProvider();
  }

  if (providerType === "unified") {
    return new UnifiedSTTProvider(config.stt.apiKey, config.stt.baseUrl, config.stt.model);
  }

  throw new Error(`Unknown STT provider: ${providerType ?? "empty"} (expected "mock" or "unified").`);
}

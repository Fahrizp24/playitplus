import type { STTProvider, STTTranscriptionOptions, STTTranscriptionResult } from "../../types/providers";

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
    // Simulasi jeda network singkat
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      text: SAMPLE_CONSULTATION_TRANSCRIPTS[0].text,
      durationSeconds: 125,
      provider: "mock-stt",
    };
  }
}

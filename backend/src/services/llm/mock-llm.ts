import type { SOAPData } from "../../types/consultation";
import type { LLMGenerateOptions, LLMProvider } from "../../types/providers";

export class MockLLMProvider implements LLMProvider {
  name = "mock";

  async generateText(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    return JSON.stringify(await this.getMockSOAP());
  }

  async generateJSON<T>(
    prompt: string,
    schemaGuidance?: string,
    options?: LLMGenerateOptions
  ): Promise<T> {
    // Simulasi jeda pemrosesan AI
    await new Promise((resolve) => setTimeout(resolve, 900));
    return (await this.getMockSOAP()) as unknown as T;
  }

  private async getMockSOAP(): Promise<SOAPData> {
    const today = new Date().toISOString().split("T")[0];

    return {
      subjective: {
        chiefComplaint: "Demam naik turun selama 3 hari disertai nyeri tenggorokan dan batuk kering.",
        historyOfPresentIllness:
          "Pasien mengeluhkan demam sejak 3 hari yang lalu, terutama menggigil di malam hari. Mengeluh nyeri saat menelan dan batuk kering. Disertai nyeri ulu hati dan mual setelah minum obat warung tanpa makan terlebih dahulu. Sesak napas disangkal, pilek minimal.",
        pastMedicalHistory: "Riwayat dispepsia / sakit maag sejak 2 tahun yang lalu.",
        familyMedicalHistory: "Ibu memiliki riwayat diabetes melitus. Riwayat keluhan serupa dalam keluarga disangkal.",
        allergies: {
          status: "DISANGKAL",
          details: "Pasien menyangkal riwayat alergi obat dan makanan (pernah minum amoxicillin dan penisilin tanpa reaksi alergi).",
        },
        evidence: [
          {
            quote: "Sudah tiga hari ini saya demam naik turun dok, badan meriang, tenggorokan sakit menelan, sama ada batuk kering. Perut ulu hati juga agak perih mual",
            sourceSpeaker: "Pasien",
            context: "Keluhan utama dan riwayat penyakit sekarang",
          },
          {
            quote: "Ada riwayat sakit maag dok sejak dua tahun lalu. Kalau keluarga tidak ada yang sakit begini, tapi ibu saya ada riwayat diabetes.",
            sourceSpeaker: "Pasien",
            context: "Riwayat penyakit dahulu dan keluarga",
          },
          {
            quote: "Tidak ada alergi dok, obat amoxicillin dan penisilin aman pernah minum.",
            sourceSpeaker: "Pasien",
            context: "Penyangkalan riwayat alergi",
          },
        ],
      },
      objective: {
        vitalSigns: {
          bloodPressure: "120/80 mmHg",
          heartRate: "84 x/menit",
          temperature: "38.2 °C",
          respiratoryRate: "18 x/menit",
        },
        physicalExamFindings: "Faring tampak kemerahan hiperemis. Tidak ditemukan ronki atau mengi paru.",
        evidence: [
          {
            quote: "faring tenggorokan tampak kemerahan hiperemis. Tekanan darah 120/80 mmHg, denyut nadi 84 kali per menit, frekuensi napas 18 kali per menit, suhu tubuh 38.2 derajat Celsius.",
            sourceSpeaker: "Dokter",
            context: "Pemeriksaan fisik dan tanda vital",
          },
        ],
      },
      assessment: {
        primaryDiagnosis: "Faringitis Akut (Acute Pharyngitis)",
        differentialDiagnosis: ["Dispepsia Eksaserbasi Akut", "Susp. Demam Dengue Hari ke-3"],
        clinicalCertainty: "DUGAAN_KERJA",
        evidence: [
          {
            quote: "Dari gejala dan pemeriksaan fisik, bapak mengalami faringitis akut atau radang tenggorokan yang disertai dispepsia kambuh.",
            sourceSpeaker: "Dokter",
            context: "Penegakan diagnosis kerja oleh dokter",
          },
        ],
      },
      plan: {
        medications: [
          {
            name: "Paracetamol",
            dosage: "500 mg",
            frequency: "3x1 tablet",
            duration: "Bila demam/nyeri",
            instructions: "Diminum sesudah makan bila masih merasa demam atau nyeri tubuh.",
          },
          {
            name: "Antasida Sirup",
            dosage: "1 sendok takar",
            frequency: "3x1 hari",
            duration: "Hingga perih membaik",
            instructions: "Diminum 15 menit sebelum makan untuk melapisi lambung.",
          },
          {
            name: "Vitamin C",
            dosage: "500 mg",
            frequency: "1x1 tablet",
            duration: "Habiskan",
            instructions: "Diminum sesudah makan untuk membantu imunitas tubuh.",
          },
        ],
        diagnosticOrders: [
          "Pemeriksaan Darah Lengkap (Darah Rutin / Hematologi Lengkap) bila demam menetap hingga hari ke-4 untuk memantau trombosit dan leukosit.",
        ],
        patientEducation: [
          "Istirahat tirah baring yang cukup (bed rest).",
          "Perbanyak konsumsi cairan/air hangat minimal 2 liter per hari.",
          "Hindari sementara makanan berminyak, gorengan, makanan bercitarasa pedas, dan minuman dingin/es.",
        ],
        contraindicationsOrRestrictions: [
          "Hindari konsumsi obat NSAID/analgetik bebas tanpa makan terlebih dahulu.",
          "Hindari makanan pedas, asam tinggi, santan pekat, dan kopi selama lambung masih perih.",
        ],
        followUpPlan: "Kontrol ulang ke poli rawat jalan dalam 3 hari (atau segera jika keluhan memberat).",
        emergencyRedFlags: [
          "Suhu tubuh melonjak tinggi di atas 39°C yang tidak turun dengan obat.",
          "Muncul tanda perdarahan spontan (mimisan, gusi berdarah, bintik merah petekie).",
          "Muntah persisten atau tidak dapat minum.",
          "Sesak napas atau penurunan kesadaran.",
        ],
        evidence: [
          {
            quote: "saya resepkan Paracetamol 500 miligram diminum tiga kali sehari satu tablet sesudah makan bila masih demam atau nyeri. Lalu untuk lambungnya diberi Antasida sirup diminum tiga kali sehari satu sendok takar 15 menit sebelum makan. Serta Vitamin C 500 miligram satu kali sehari",
            sourceSpeaker: "Dokter",
            context: "Resep pengobatan oral",
          },
          {
            quote: "jika ada tanda bahaya seperti demam tinggi tidak turun di atas 39 derajat, sesak napas, muntah terus-menerus, atau keluar perdarahan seperti mimisan, langsung bawa ke IGD terdekat",
            sourceSpeaker: "Dokter",
            context: "Instruksi tanda bahaya darurat",
          },
        ],
      },
      patientSummary: {
        facilityName: "Klinik Pratama PlayItPlus",
        doctorName: "dr. Sarah, Sp.PD",
        date: today,
        simpleConclusion:
          "Bapak mengalami radang tenggorokan (faringitis) yang disertai kambuhnya gangguan lambung (maag). Kondisi ini umumnya dipicu infeksi virus dan pola konsumsi obat pereda nyeri tanpa makan terlebih dahulu.",
        medicationInstructions: [
          "Paracetamol 500 mg: Minum 3x1 tablet sesudah makan hanya bila merasa demam atau sakit kepala/tenggorokan.",
          "Antasida Sirup: Minum 3x1 sendok takar, 15 menit SEBELUM makan untuk meredakan nyeri lambung.",
          "Vitamin C 500 mg: Minum 1x1 tablet setiap hari sesudah sarapan pagi.",
        ],
        lifestyleAdvice: [
          "Banyak istirahat dan tidur yang cukup.",
          "Minum air putih hangat setidaknya 8-10 gelas (2 liter) per hari.",
          "Kumur air garam hangat untuk meringankan sakit tenggorokan.",
        ],
        thingsToAvoid: [
          "Jangan makan gorengan, cabai/makanan pedas, atau asam berlebih.",
          "Hindari minuman dingin ber-es dan kopi.",
        ],
        controlSchedule: "Datang kontrol kembali 3 hari lagi jika demam dan radang belum sembuh.",
        emergencySigns: [
          "Segera ke IGD jika timbul perdarahan (mimisan/gusi berdarah), sesak napas, atau muntah terus-menerus.",
        ],
      },
      uncertainties: [
        {
          issue: "Kondisi lambung pasien pasca konsumsi obat warung",
          reason: "TIDAK_LENGKAP",
          suggestedAction: "Konfirmasi nama obat warung yang sempat diminum pasien untuk mencegah interaksi obat.",
        },
      ],
    };
  }
}

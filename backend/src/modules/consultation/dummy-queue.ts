import type {
  AudioPresetItem,
  ConsultationProcessResult,
  ConsultationQueueItem,
  DeidentificationResult,
  SOAPData,
} from "./model";

// 1. Daftar antrean pasien poli aktif (Data medis belum ada sebelum anamnesis dilakukan)
export const DUMMY_CONSULTATION_QUEUE: ConsultationQueueItem[] = [
  {
    id: "queue-001",
    queueNumber: "A-01",
    patientName: "Budi Santoso",
    patientAge: 58,
    gender: "Laki-laki",
    clinicService: "Poli Penyakit Dalam",
    chiefComplaint: "Kontrol bulanan hipertensi dan diabetes, tengkuk terasa agak kaku",
    status: "Menunggu Anamnesis",
    estimatedTime: "10 Menit",
    transcript: null,
    deidentification: null,
    soap: null,
  },
  {
    id: "queue-002",
    queueNumber: "A-02",
    patientName: "Siti Rahmawati",
    patientAge: 32,
    gender: "Perempuan",
    clinicService: "Poli Umum",
    chiefComplaint: "Nyeri ulu hati perih, mual, dada panas (heartburn) sejak 4 hari",
    status: "Menunggu Anamnesis",
    estimatedTime: "10 Menit",
    transcript: null,
    deidentification: null,
    soap: null,
  },
  {
    id: "queue-003",
    queueNumber: "A-03",
    patientName: "Kenzo Alfarizi",
    patientAge: 6,
    gender: "Laki-laki",
    clinicService: "Poli Anak",
    chiefComplaint: "Demam naik turun 3 hari disertai batuk pilek dan sakit menelan",
    status: "Menunggu Anamnesis",
    estimatedTime: "10 Menit",
    transcript: null,
    deidentification: null,
    soap: null,
  },
  {
    id: "queue-004",
    queueNumber: "A-04",
    patientName: "Dewi Lestari",
    patientAge: 27,
    gender: "Perempuan",
    clinicService: "Poli Paru & Alergi",
    chiefComplaint: "Sesak napas berbunyi mengi ('ngik-ngik') sejak dini hari saat cuaca dingin",
    status: "Menunggu Anamnesis",
    estimatedTime: "10 Menit",
    transcript: null,
    deidentification: null,
    soap: null,
  },
  {
    id: "queue-005",
    queueNumber: "A-05",
    patientName: "Hendra Wijaya",
    patientAge: 42,
    gender: "Laki-laki",
    clinicService: "Poli Kulit & Kelamin",
    chiefComplaint: "Gatal hebat, kemerahan, dan bintil berair di punggung kedua tangan",
    status: "Menunggu Anamnesis",
    estimatedTime: "10 Menit",
    transcript: null,
    deidentification: null,
    soap: null,
  },
];

export interface AudioPresetWithResult extends AudioPresetItem {
  result: {
    transcript: string;
    deidentification: DeidentificationResult;
    soap: SOAPData;
  };
}

// 2. Dua Voice Dummy Presets (Preset 1 & Preset 2) yang siap dipakai sekali klik
export const DUMMY_AUDIO_PRESETS: AudioPresetWithResult[] = [
  {
    id: "preset-1",
    title: "Audio Simulasi 1",
    description: "Anamnesis Hipertensi & Diabetes Melitus (Pak Budi)",
    durationLabel: "01:15",
    filename: "preset-1.wav",
    result: {
      transcript:
        "Dokter: Selamat pagi, Pak Budi. Silakan duduk. Bagaimana kabarnya hari ini?\n" +
        "Pasien: Pagi, Dok. Ini mau kontrol bulanan darah tinggi sama gula, Dok. Akhir-akhir ini tengkuk rasanya agak kaku kalau kecapekan kerja.\n" +
        "Dokter: Baik, obat amlodipine dan metforminnya masih diminum teratur? Ada keluhan pusing berputar atau kaki bengkak?\n" +
        "Pasien: Masih teratur Dok, cuma kemarin sempat telat dua hari karena obat habis. Kaki tidak bengkak Dok, kencing manisnya juga aman tidak sering haus lagi.\n" +
        "Dokter: Tekanan darahnya hari ini 140/90 mmHg, agak naik sedikit dari bulan lalu. Gula darah puasa 138 mg/dL. Kita lanjutkan Amlodipine 5 mg sekali sehari pagi dan Metformin 500 mg dua kali sehari setelah makan ya. Kurangi makanan asin dan jaga jalan pagi 30 menit.\n" +
        "Pasien: Baik, Dok. Siap saya kurangi garamnya. Terima kasih banyak Dokter.",
      deidentification: {
        originalText:
          "Dokter: Selamat pagi, Pak Budi. Silakan duduk. Bagaimana kabarnya hari ini?\n" +
          "Pasien: Pagi, Dok. Ini mau kontrol bulanan darah tinggi sama gula, Dok. Akhir-akhir ini tengkuk rasanya agak kaku kalau kecapekan kerja.\n" +
          "Dokter: Baik, obat amlodipine dan metforminnya masih diminum teratur? Ada keluhan pusing berputar atau kaki bengkak?\n" +
          "Pasien: Masih teratur Dok, cuma kemarin sempat telat dua hari karena obat habis. Kaki tidak bengkak Dok, kencing manisnya juga aman tidak sering haus lagi.\n" +
          "Dokter: Tekanan darahnya hari ini 140/90 mmHg, agak naik sedikit dari bulan lalu. Gula darah puasa 138 mg/dL. Kita lanjutkan Amlodipine 5 mg sekali sehari pagi dan Metformin 500 mg dua kali sehari setelah makan ya. Kurangi makanan asin dan jaga jalan pagi 30 menit.\n" +
          "Pasien: Baik, Dok. Siap saya kurangi garamnya. Terima kasih banyak Dokter.",
        deidentifiedText:
          "Dokter: Selamat pagi, [PASIEN_1]. Silakan duduk. Bagaimana kabarnya hari ini?\n" +
          "Pasien: Pagi, Dok. Ini mau kontrol bulanan darah tinggi sama gula, Dok. Akhir-akhir ini tengkuk rasanya agak kaku kalau kecapekan kerja.\n" +
          "Dokter: Baik, obat amlodipine dan metforminnya masih diminum teratur? Ada keluhan pusing berputar atau kaki bengkak?\n" +
          "Pasien: Masih teratur Dok, cuma kemarin sempat telat dua hari karena obat habis. Kaki tidak bengkak Dok, kencing manisnya juga aman tidak sering haus lagi.\n" +
          "Dokter: Tekanan darahnya hari ini 140/90 mmHg, agak naik sedikit dari bulan lalu. Gula darah puasa 138 mg/dL. Kita lanjutkan Amlodipine 5 mg sekali sehari pagi dan Metformin 500 mg dua kali sehari setelah makan ya. Kurangi makanan asin dan jaga jalan pagi 30 menit.\n" +
          "Pasien: Baik, Dok. Siap saya kurangi garamnya. Terima kasih banyak Dokter.",
        entities: [
          {
            id: "ent-101",
            type: "NAME",
            label: "Nama Pasien",
            originalText: "Pak Budi",
            replacement: "[PASIEN_1]",
            start: 22,
            end: 30,
          },
        ],
        metadata: {
          totalRedacted: 1,
          typesFound: ["NAME"],
        },
      },
      soap: {
        subjective: {
          chiefComplaint: "Kontrol bulanan hipertensi dan diabetes melitus tipe 2",
          historyOfPresentIllness:
            "Pasien pria 58 tahun datang untuk kontrol rutin hipertensi dan DM tipe 2. Mengeluhkan tengkuk terasa agak kaku terutama bila kelelahan beraktivitas. Riwayat obat teratur namun sempat terlambat 2 hari karena stok habis. Keluhan polidipsi, poliuri disangkal. Tidak ada pusing berputar atau edema ekstremitas.",
          pastMedicalHistory: "Hipertensi sejak 4 tahun lalu, Diabetes Melitus tipe 2 sejak 2 tahun lalu",
          familyMedicalHistory: "Ayah memiliki riwayat stroke dan hipertensi",
          allergies: {
            status: "DISANGKAL",
            details: "Tidak ada riwayat alergi obat dan makanan",
          },
          evidence: [
            {
              quote: "Ini mau kontrol bulanan darah tinggi sama gula, Dok. Akhir-akhir ini tengkuk rasanya agak kaku kalau kecapekan kerja.",
              sourceSpeaker: "Pasien",
              context: "Keluhan utama saat kontrol rutin",
            },
          ],
        },
        objective: {
          vitalSigns: {
            bloodPressure: "140/90 mmHg",
            heartRate: "78 x/menit",
            temperature: "36.6 °C",
            respiratoryRate: "18 x/menit",
          },
          physicalExamFindings:
            "Keadaan umum baik, compos mentis. Mata konjungtiva anemis (-/-), sklera ikterik (-/-). Thorax cor dan pulmo dalam batas normal. Abdomen supel, hepar/lien tidak teraba. Ekstremitas inferior akral hangat, edema pitting (-/-). GDS/GDP: 138 mg/dL.",
          evidence: [
            {
              quote: "Tekanan darahnya hari ini 140/90 mmHg, agak naik sedikit dari bulan lalu. Gula darah puasa 138 mg/dL.",
              sourceSpeaker: "Dokter",
              context: "Hasil pemeriksaan tanda vital dan laboratorium dasar",
            },
          ],
        },
        assessment: {
          primaryDiagnosis: "Hipertensi Grade 1 Terkontrol Sebagian (ICD-10: I10)",
          differentialDiagnosis: ["Diabetes Melitus Tipe 2 Tanpa Komplikasi (ICD-10: E11.9)"],
          clinicalCertainty: "PASTI",
          evidence: [
            {
              quote: "Tekanan darahnya hari ini 140/90 mmHg, agak naik sedikit dari bulan lalu.",
              sourceSpeaker: "Dokter",
              context: "Penilaian klinis dokter",
            },
          ],
        },
        plan: {
          medications: [
            {
              name: "Amlodipine",
              dosage: "5 mg",
              frequency: "1 x 1 tablet",
              duration: "30 hari",
              instructions: "Diminum pagi hari sesudah sarapan",
            },
            {
              name: "Metformin",
              dosage: "500 mg",
              frequency: "2 x 1 tablet",
              duration: "30 hari",
              instructions: "Diminum bersama atau segera sesudah makan untuk mengurangi rasa mual",
            },
          ],
          diagnosticOrders: ["Cek HbA1c dan profil lipid berkala bulan depan"],
          patientEducation: [
            "Kurangi asupan garam harian maksimal 1 sendok teh per hari",
            "Hindari makanan cepat saji, gorengan, dan batasi asupan gula sederhana",
            "Lakukan olahraga kardio aerobik ringan (jalan santai/sepeda) 30 menit per hari, 3-5 kali seminggu",
            "Jangan menghentikan obat mandiri bila stok habis, segera kontrol ke faskes",
          ],
          contraindicationsOrRestrictions: ["Hindari konsumsi jamu tradisional tanpa izin dokter"],
          followUpPlan: "Kontrol rutin kembali 1 bulan lagi ke Poli Penyakit Dalam",
          emergencyRedFlags: [
            "Nyeri dada kiri seperti tertindih benda berat menjalar ke lengan/leher",
            "Sakit kepala hebat mendadak, pandangan kabur, atau kelemahan separuh anggota gerak",
            "Sesak napas berat",
          ],
          evidence: [
            {
              quote: "Kita lanjutkan Amlodipine 5 mg sekali sehari pagi dan Metformin 500 mg dua kali sehari setelah makan ya. Kurangi makanan asin dan jaga jalan pagi 30 menit.",
              sourceSpeaker: "Dokter",
              context: "Pemberian resep dan edukasi gaya hidup",
            },
          ],
        },
        patientSummary: {
          facilityName: "Poliklinik Rawat Jalan PlayItPlus",
          doctorName: "dr. Sp.PD",
          date: "2026-10-13",
          simpleConclusion:
            "Kondisi tekanan darah Anda sedikit meningkat (140/90) dan gula darah puasa 138 mg/dL. Secara keseluruhan masih terkontrol baik, namun perlu disiplin menjaga pola makan rendah garam dan olahraga teratur.",
          medicationInstructions: [
            "Amlodipine 5 mg: Minum 1 tablet setiap pagi hari sesudah sarapan",
            "Metformin 500 mg: Minum 1 tablet dua kali sehari (pagi dan malam) sesudah makan",
          ],
          lifestyleAdvice: [
            "Batasi konsumsi garam, kecap asin, dan makanan gurih olahan",
            "Lakukan jalan santai rutin 30 menit setiap hari",
            "Tidur cukup 7-8 jam per hari dan kelola stres kerja",
          ],
          thingsToAvoid: ["Makanan terlalu asin/kerupuk", "Minuman manis bergula tinggi", "Obat herbal tanpa resep"],
          controlSchedule: "Kontrol kembali dalam 30 hari ke Poli Penyakit Dalam",
          emergencySigns: ["Nyeri dada menjalar", "Kelemahan anggota gerak", "Pusing hebat berputar atau pingsan"],
        },
        uncertainties: [],
      },
    },
  },

  {
    id: "preset-2",
    title: "Audio Simulasi 2",
    description: "Anamnesis Dispepsia & Asam Lambung / GERD (Bu Siti)",
    durationLabel: "01:20",
    filename: "preset-2.wav",
    result: {
      transcript:
        "Dokter: Selamat siang, Bu Siti. Ada keluhan apa yang bisa saya bantu?\n" +
        "Pasien: Siang Dok. Lambung saya perih sekali Dok di ulu hati, sering mual dan dada rasanya panas seperti terbakar sudah empat hari ini.\n" +
        "Dokter: Apakah sering bersendawa asam atau terbangun malam hari karena sesak perih?\n" +
        "Pasien: Iya betul Dok, mulut terasa asam pahit kalau bangun tidur. Kebetulan seminggu ini saya sering lembur dan minum kopi hitam tiap malam.\n" +
        "Dokter: Baik, ini gejala dispepsia dengan refluks asam lambung atau GERD. Perut bagian tengah atas agak nyeri tekan ya.\n" +
        "Pasien: Aduh iya Dok, di situ perihnya. Tidak ada muntah darah kan Dok?\n" +
        "Dokter: Tidak ada tanda bahaya. Kita beri Omeprazole 20 mg diminum 30 menit sebelum makan dua kali sehari, dan Antasida sirup saat perih. Hindari dulu kopi, makanan pedas, dan jangan langsung berbaring setelah makan minimal 2 jam ya.\n" +
        "Pasien: Baik Dokter, siap saya kurangi kopinya. Terima kasih banyak.",
      deidentification: {
        originalText:
          "Dokter: Selamat siang, Bu Siti. Ada keluhan apa yang bisa saya bantu?\n" +
          "Pasien: Siang Dok. Lambung saya perih sekali Dok di ulu hati, sering mual dan dada rasanya panas seperti terbakar sudah empat hari ini.\n" +
          "Dokter: Apakah sering bersendawa asam atau terbangun malam hari karena sesak perih?\n" +
          "Pasien: Iya betul Dok, mulut terasa asam pahit kalau bangun tidur. Kebetulan seminggu ini saya sering lembur dan minum kopi hitam tiap malam.\n" +
          "Dokter: Baik, ini gejala dispepsia dengan refluks asam lambung atau GERD. Perut bagian tengah atas agak nyeri tekan ya.\n" +
          "Pasien: Aduh iya Dok, di situ perihnya. Tidak ada muntah darah kan Dok?\n" +
          "Dokter: Tidak ada tanda bahaya. Kita beri Omeprazole 20 mg diminum 30 menit sebelum makan dua kali sehari, dan Antasida sirup saat perih. Hindari dulu kopi, makanan pedas, dan jangan langsung berbaring setelah makan minimal 2 jam ya.\n" +
          "Pasien: Baik Dokter, siap saya kurangi kopinya. Terima kasih banyak.",
        deidentifiedText:
          "Dokter: Selamat siang, [PASIEN_2]. Ada keluhan apa yang bisa saya bantu?\n" +
          "Pasien: Siang Dok. Lambung saya perih sekali Dok di ulu hati, sering mual dan dada rasanya panas seperti terbakar sudah empat hari ini.\n" +
          "Dokter: Apakah sering bersendawa asam atau terbangun malam hari karena sesak perih?\n" +
          "Pasien: Iya betul Dok, mulut terasa asam pahit kalau bangun tidur. Kebetulan seminggu ini saya sering lembur dan minum kopi hitam tiap malam.\n" +
          "Dokter: Baik, ini gejala dispepsia dengan refluks asam lambung atau GERD. Perut bagian tengah atas agak nyeri tekan ya.\n" +
          "Pasien: Aduh iya Dok, di situ perihnya. Tidak ada muntah darah kan Dok?\n" +
          "Dokter: Tidak ada tanda bahaya. Kita beri Omeprazole 20 mg diminum 30 menit sebelum makan dua kali sehari, dan Antasida sirup saat perih. Hindari dulu kopi, makanan pedas, dan jangan langsung berbaring setelah makan minimal 2 jam ya.\n" +
          "Pasien: Baik Dokter, siap saya kurangi kopinya. Terima kasih banyak.",
        entities: [
          {
            id: "ent-201",
            type: "NAME",
            label: "Nama Pasien",
            originalText: "Bu Siti",
            replacement: "[PASIEN_2]",
            start: 22,
            end: 29,
          },
        ],
        metadata: {
          totalRedacted: 1,
          typesFound: ["NAME"],
        },
      },
      soap: {
        subjective: {
          chiefComplaint: "Nyeri ulu hati perih dan heartburn sejak 4 hari",
          historyOfPresentIllness:
            "Pasien wanita 32 tahun mengeluhkan nyeri perih pada area epigastrium sejak 4 hari terakhir. Disertai mual, sensasi panas terbakar pada dada (heartburn), dan mulut terasa pahit-asam saat bangun tidur pagi hari. Riwayat pola makan tidak teratur karena lembur kerja dan konsumsi kopi hitam rutin setiap malam.",
          pastMedicalHistory: "Riwayat maag hilang timbul sejak mahasiswa",
          familyMedicalHistory: "Tidak ada riwayat keganasan lambung dalam keluarga",
          allergies: {
            status: "DISANGKAL",
            details: "Tidak ada riwayat alergi obat",
          },
          evidence: [
            {
              quote: "Lambung saya perih sekali Dok di ulu hati, sering mual dan dada rasanya panas seperti terbakar sudah empat hari ini.",
              sourceSpeaker: "Pasien",
              context: "Anamnesis keluhan lambung dan refluks",
            },
          ],
        },
        objective: {
          vitalSigns: {
            bloodPressure: "115/75 mmHg",
            heartRate: "82 x/menit",
            temperature: "36.5 °C",
            respiratoryRate: "18 x/menit",
          },
          physicalExamFindings:
            "Keadaan umum baik. Konjungtiva merah muda, sklera anikterik. Abdomen: bising usus normal, teraba nyeri tekan ringan pada regio epigastrium, hepatomegali (-), splenomegali (-), defans muskular (-). Tanda bahaya perdarahan saluran cerna disangkal.",
          evidence: [
            {
              quote: "Perut bagian tengah atas agak nyeri tekan ya.",
              sourceSpeaker: "Dokter",
              context: "Pemeriksaan fisik palpasi abdomen",
            },
          ],
        },
        assessment: {
          primaryDiagnosis: "Gastroesophageal Reflux Disease (GERD) dd/ Dispepsia Fungsional (ICD-10: K21.9)",
          differentialDiagnosis: ["Gastritis Akut", "Ulkus Peptikum"],
          clinicalCertainty: "DUGAAN_KERJA",
          evidence: [
            {
              quote: "Baik, ini gejala dispepsia dengan refluks asam lambung atau GERD.",
              sourceSpeaker: "Dokter",
              context: "Diagnosis kerja dokter",
            },
          ],
        },
        plan: {
          medications: [
            {
              name: "Omeprazole",
              dosage: "20 mg",
              frequency: "2 x 1 kapsul",
              duration: "7 hari",
              instructions: "Diminum 30-60 menit sebelum makan (pagi dan malam)",
            },
            {
              name: "Antasida Doen Sirup",
              dosage: "Suspensi 200mg/200mg per 5ml",
              frequency: "3 x 1 sendok takar",
              duration: "5 hari",
              instructions: "Diminum 1 jam sesudah makan atau saat perut terasa perih",
            },
          ],
          diagnosticOrders: ["Bila keluhan tidak membaik dalam 2 minggu dianjurkan endoskopi saluran cerna"],
          patientEducation: [
            "Makan teratur dengan porsi kecil tapi sering (small frequent meals)",
            "Hindari kopi, teh kental, cokelat, makanan asam, dan makanan pedas",
            "Jangan langsung tidur/berbaring minimal 2 jam setelah selesai makan",
            "Tinggikan posisi kepala saat tidur jika sensasi asam naik ke tenggorokan",
          ],
          contraindicationsOrRestrictions: ["Hindari konsumsi obat anti-nyeri NSAID (asam mefenamat, natrium diklofenak)"],
          followUpPlan: "Kontrol evaluasi 7 hari jika gejala masih menetap",
          emergencyRedFlags: [
            "Muntah berwarna hitam seperti kopi atau muntah darah",
            "Buang air besar hitam pekat seperti aspal (melena)",
            "Nyeri perut hebat mendadak tembus ke punggung",
          ],
          evidence: [
            {
              quote: "Kita beri Omeprazole 20 mg diminum 30 menit sebelum makan dua kali sehari, dan Antasida sirup saat perih.",
              sourceSpeaker: "Dokter",
              context: "Terapi medikamentosa asam lambung",
            },
          ],
        },
        patientSummary: {
          facilityName: "Poliklinik Rawat Jalan PlayItPlus",
          doctorName: "dr. Umum",
          date: "2026-10-13",
          simpleConclusion:
            "Anda mengalami peradangan lambung dan naiknya asam lambung ke kerongkongan (GERD/Dispepsia) yang dipicu oleh jadwal makan tidak teratur, kelelahan lembur, dan konsumsi kopi malam.",
          medicationInstructions: [
            "Omeprazole 20 mg: Minum 1 kapsul 30 menit sebelum sarapan dan 30 menit sebelum makan malam",
            "Antasida Sirup: Minum 1 sendok takar 1 jam setelah makan atau saat lambung terasa perih",
          ],
          lifestyleAdvice: [
            "Makan tepat waktu, porsi sedang",
            "Beri jeda minimal 2 jam antara selesai makan dengan waktu tidur",
            "Kelola stres dan istirahat cukup",
          ],
          thingsToAvoid: ["Kopi hitam dan minuman berkafein", "Makanan pedas, bersantan kental, dan asam"],
          controlSchedule: "Kontrol kembali 1 minggu ke Poli Umum jika belum reda",
          emergencySigns: ["Muntah hitam/darah", "BAB hitam lembek", "Nyeri perut tak tertahankan"],
        },
        uncertainties: [],
      },
    },
  },
];

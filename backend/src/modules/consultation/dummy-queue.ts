import type {
  ConsultationQueueItem,
  DeidentificationResult,
  SOAPData,
} from "./model";

export const DUMMY_CONSULTATION_QUEUE: ConsultationQueueItem[] = [
  // 1. Antrean A-01: Hipertensi & Diabetes Melitus Tipe 2 (Penyakit Dalam)
  {
    id: "queue-001",
    queueNumber: "A-01",
    patientName: "Budi Santoso",
    patientAge: 58,
    gender: "Laki-laki",
    clinicService: "Poli Penyakit Dalam",
    chiefComplaint: "Kontrol bulanan hipertensi dan diabetes, tengkuk terasa agak kaku",
    status: "Siap Konsultasi",
    estimatedTime: "10 Menit",
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

  // 2. Antrean A-02: Dispepsia Fungsional & GERD (Penyakit Dalam / Umum)
  {
    id: "queue-002",
    queueNumber: "A-02",
    patientName: "Siti Rahmawati",
    patientAge: 32,
    gender: "Perempuan",
    clinicService: "Poli Umum",
    chiefComplaint: "Nyeri ulu hati perih, mual, dada terasa panas (heartburn) sejak 4 hari",
    status: "Siap Konsultasi",
    estimatedTime: "10 Menit",
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

  // 3. Antrean A-03: Faringitis Akut Anak (Poli Anak)
  {
    id: "queue-003",
    queueNumber: "A-03",
    patientName: "Kenzo Alfarizi",
    patientAge: 6,
    gender: "Laki-laki",
    clinicService: "Poli Anak",
    chiefComplaint: "Demam naik turun 3 hari, batuk pilek, dan sakit menelan",
    status: "Siap Konsultasi",
    estimatedTime: "10 Menit",
    transcript:
      "Dokter: Halo Kenzo, selamat pagi Bu Maria. Kenzo keluhannya apa Bu?\n" +
      "Pendamping: Pagi Dok. Ini Kenzo demam sudah tiga hari naik turun Dok, semalam sampai 38.5 derajat. Disertai batuk berdahak dan pilek, kalau makan nangis katanya tenggorokannya sakit.\n" +
      "Dokter: Ada sesak napas, muntah, atau kejang tidak Bu?\n" +
      "Pendamping: Tidak ada Dok, cuma lemas karena makannya sedikit.\n" +
      "Dokter: Coba buka mulutnya Kenzo... Ah iya, tenggorokannya tampak merah, amandel agak membesar tapi tidak ada bercak nanah putih. Suhu sekarang 38.2 derajat Celsius. Ini faringitis akut karena infeksi virus saluran napas atas.\n" +
      "Pendamping: Butuh antibiotik tidak Dok?\n" +
      "Dokter: Karena infeksinya mengarah ke virus, kita tidak perlu antibiotik dulu Bu. Kita berikan Paracetamol sirup untuk penurun panas dan pereda nyeri telan bila demam di atas 38 derajat, serta Cetirizine sirup untuk pileknya. Berikan banyak minum air hangat dan sup ya Bu.\n" +
      "Pendamping: Baik Dok, terima kasih atas penjelasannya.",
    deidentification: {
      originalText:
        "Dokter: Halo Kenzo, selamat pagi Bu Maria. Kenzo keluhannya apa Bu?\n" +
        "Pendamping: Pagi Dok. Ini Kenzo demam sudah tiga hari naik turun Dok, semalam sampai 38.5 derajat. Disertai batuk berdahak dan pilek, kalau makan nangis katanya tenggorokannya sakit.\n" +
        "Dokter: Ada sesak napas, muntah, atau kejang tidak Bu?\n" +
        "Pendamping: Tidak ada Dok, cuma lemas karena makannya sedikit.\n" +
        "Dokter: Coba buka mulutnya Kenzo... Ah iya, tenggorokannya tampak merah, amandel agak membesar tapi tidak ada bercak nanah putih. Suhu sekarang 38.2 derajat Celsius. Ini faringitis akut karena infeksi virus saluran napas atas.\n" +
        "Pendamping: Butuh antibiotik tidak Dok?\n" +
        "Dokter: Karena infeksinya mengarah ke virus, kita tidak perlu antibiotik dulu Bu. Kita berikan Paracetamol sirup untuk penurun panas dan pereda nyeri telan bila demam di atas 38 derajat, serta Cetirizine sirup untuk pileknya. Berikan banyak minum air hangat dan sup ya Bu.\n" +
        "Pendamping: Baik Dok, terima kasih atas penjelasannya.",
      deidentifiedText:
        "Dokter: Halo [PASIEN_3], selamat pagi [PENDAMPING_1]. [PASIEN_3] keluhannya apa Bu?\n" +
        "Pendamping: Pagi Dok. Ini [PASIEN_3] demam sudah tiga hari naik turun Dok, semalam sampai 38.5 derajat. Disertai batuk berdahak dan pilek, kalau makan nangis katanya tenggorokannya sakit.\n" +
        "Dokter: Ada sesak napas, muntah, atau kejang tidak Bu?\n" +
        "Pendamping: Tidak ada Dok, cuma lemas karena makannya sedikit.\n" +
        "Dokter: Coba buka mulutnya [PASIEN_3]... Ah iya, tenggorokannya tampak merah, amandel agak membesar tapi tidak ada bercak nanah putih. Suhu sekarang 38.2 derajat Celsius. Ini faringitis akut karena infeksi virus saluran napas atas.\n" +
        "Pendamping: Butuh antibiotik tidak Dok?\n" +
        "Dokter: Karena infeksinya mengarah ke virus, kita tidak perlu antibiotik dulu Bu. Kita berikan Paracetamol sirup untuk penurun panas dan pereda nyeri telan bila demam di atas 38 derajat, serta Cetirizine sirup untuk pileknya. Berikan banyak minum air hangat dan sup ya Bu.\n" +
        "Pendamping: Baik Dok, terima kasih atas penjelasannya.",
      entities: [
        {
          id: "ent-301",
          type: "NAME",
          label: "Nama Pasien",
          originalText: "Kenzo",
          replacement: "[PASIEN_3]",
          start: 5,
          end: 10,
        },
        {
          id: "ent-302",
          type: "NAME",
          label: "Nama Pendamping",
          originalText: "Bu Maria",
          replacement: "[PENDAMPING_1]",
          start: 25,
          end: 33,
        },
      ],
      metadata: {
        totalRedacted: 2,
        typesFound: ["NAME"],
      },
    },
    soap: {
      subjective: {
        chiefComplaint: "Demam naik turun 3 hari disertai batuk pilek dan nyeri menelan",
        historyOfPresentIllness:
          "Anak laki-laki usia 6 tahun diantar ibu dengan keluhan demam sejak 3 hari yang lalu, suhu tertinggi di rumah mencapai 38.5°C. Disertai batuk berdahak ringan, pilek, dan nyeri menelan sehingga nafsu makan menurun dan anak rewel saat makan. Riwayat kejang demam disangkal, sesak napas dan muntah disangkal.",
        pastMedicalHistory: "Riwayat imunisasi dasar lengkap sesuai usia",
        familyMedicalHistory: "Kakak pasien sedang mengalami batuk pilek di rumah",
        allergies: {
          status: "DISANGKAL",
          details: "Tidak ada riwayat alergi obat dan makanan",
        },
        evidence: [
          {
            quote: "Ini Kenzo demam sudah tiga hari naik turun Dok, semalam sampai 38.5 derajat. Disertai batuk berdahak dan pilek, kalau makan nangis katanya tenggorokannya sakit.",
            sourceSpeaker: "Pendamping",
            context: "Penjelasan riwayat penyakit oleh ibu pasien",
          },
        ],
      },
      objective: {
        vitalSigns: {
          bloodPressure: "100/65 mmHg",
          heartRate: "98 x/menit",
          temperature: "38.2 °C",
          respiratoryRate: "22 x/menit",
        },
        physicalExamFindings:
          "Keadaan umum tampak sakit sedang, sadar aktif. Faring hiperemis (+), tonsil T2/T2 hiperemis tanpa eksudat putih/pseudomembran. Sekret hidung serosa (+). Paru: suara napas vesikuler, ronki (-/-), wheezing (-/-). Abdomen supel, turgor kulit kembali cepat.",
        evidence: [
          {
            quote: "tenggorokannya tampak merah, amandel agak membesar tapi tidak ada bercak nanah putih. Suhu sekarang 38.2 derajat Celsius.",
            sourceSpeaker: "Dokter",
            context: "Temuan pemeriksaan tenggorokan dan suhu tubuh",
          },
        ],
      },
      assessment: {
        primaryDiagnosis: "Faringitis Akut Viral / ISPA Atas (ICD-10: J02.9)",
        differentialDiagnosis: ["Tonsilitis Akut", "Rinofaringitis Akut"],
        clinicalCertainty: "PASTI",
        evidence: [
          {
            quote: "Ini faringitis akut karena infeksi virus saluran napas atas.",
            sourceSpeaker: "Dokter",
            context: "Penetapan diagnosis dokter spesialis anak",
          },
        ],
      },
      plan: {
        medications: [
          {
            name: "Paracetamol Sirup",
            dosage: "120 mg / 5 ml",
            frequency: "3 - 4 x 1 sendok takar (5 ml)",
            duration: "3 hari",
            instructions: "Diberikan bila demam di atas 38°C atau anak rewel nyeri menelan",
          },
          {
            name: "Cetirizine Sirup",
            dosage: "5 mg / 5 ml",
            frequency: "1 x 1/2 sendok takar (2.5 ml)",
            duration: "5 hari",
            instructions: "Diminum malam hari sesudah makan",
          },
        ],
        diagnosticOrders: ["Belum diperlukan pemeriksaan penunjang darah rutin saat ini"],
        patientEducation: [
          "Infeksi virus tidak memerlukan antibiotik, sembuh dengan daya tahan tubuh anak",
          "Beri makanan lunak bersuhu hangat (bubur, sup ayam) yang mudah ditelan",
          "Beri banyak cairan hangat (air putih, jus buah manis) untuk mencegah dehidrasi",
          "Kompres hangat pada dahi dan lipat ketiak bila demam tinggi",
        ],
        contraindicationsOrRestrictions: ["Hindari es, gorengan berminyak, dan makanan berchiki gurih tajam"],
        followUpPlan: "Kontrol 3 hari lagi jika demam belum reda atau timbul tanda bahaya",
        emergencyRedFlags: [
          "Anak sesak napas, napas cepat, atau cuping hidung kembang kempis",
          "Anak sangat lemas, mengantuk terus, atau sulit dibangunkan",
          "Kejang demam",
          "Sama sekali tidak bisa minum atau kencing berkurang drastis",
        ],
        evidence: [
          {
            quote: "Kita berikan Paracetamol sirup untuk penurun panas dan pereda nyeri telan bila demam di atas 38 derajat, serta Cetirizine sirup untuk pileknya.",
            sourceSpeaker: "Dokter",
            context: "Instruksi pengobatan simptomatis anak",
          },
        ],
      },
      patientSummary: {
        facilityName: "Poliklinik Anak PlayItPlus",
        doctorName: "dr. Sp.A",
        date: "2026-10-13",
        simpleConclusion:
          "Ananda Kenzo mengalami radang tenggorokan akut akibat infeksi virus umum, bukan bakteri, sehingga tidak memerlukan antibiotik. Demam akan mereda seiring perbaikan daya tahan tubuh.",
        medicationInstructions: [
          "Paracetamol Sirup: Berikan 1 sendok takar (5 ml) hanya jika demam >38°C, jeda minimal 4 jam",
          "Cetirizine Sirup: Berikan 1/2 sendok takar (2.5 ml) setiap malam sebelum tidur",
        ],
        lifestyleAdvice: [
          "Beri makanan berkuah hangat yang lembut (sup, bubur)",
          "Banyak minum air putih hangat",
          "Istirahat di rumah sampai demam reda",
        ],
        thingsToAvoid: ["Minuman dingin/es", "Gorengan kering dan jajanan pedas"],
        controlSchedule: "Kontrol 3 hari jika demam menetap di atas 38.5°C",
        emergencySigns: ["Sesak napas", "Anak lemas tak mau minum sama sekali", "Kejang"],
      },
      uncertainties: [],
    },
  },

  // 4. Antrean A-04: Asma Bronkial Eksaserbasi Cuaca Dingin (Poli Paru)
  {
    id: "queue-004",
    queueNumber: "A-04",
    patientName: "Dewi Lestari",
    patientAge: 27,
    gender: "Perempuan",
    clinicService: "Poli Paru & Alergi",
    chiefComplaint: "Sesak napas berbunyi mengi ('ngik-ngik') sejak dini hari saat cuaca dingin",
    status: "Siap Konsultasi",
    estimatedTime: "10 Menit",
    transcript:
      "Dokter: Selamat pagi Mbak Dewi. Tampak agak terengah-engah ya, ada keluhan sesak napas?\n" +
      "Pasien: Pagi Dok. Iya Dok, dada rasanya sempit sekali dari jam tiga pagi tadi, napasnya bunyi ngik-ngik. Udara dini hari tadi dingin sekali Dok.\n" +
      "Dokter: Punya riwayat asma sebelumnya Mbak?\n" +
      "Pasien: Ada Dok dari SMA, tapi sudah hampir setahun tidak pernah kambuh. Inhaler pelega saya yang lama sudah kedaluwarsa.\n" +
      "Dokter: Baik, saya periksa suara napasnya dulu... Tarik napas panjang, hembuskan... Ya, terdengar suara mengi atau wheezing di kedua lapang paru, saturasi oksigen 96%. Ini serangan asma ringan ke sedang dipicu cuaca dingin.\n" +
      "Pasien: Iya Dok, dada rasanya berat sekali.\n" +
      "Dokter: Kita resepkan Salbutamol inhaler baru ya Mbak, gunakan 2 semprotan saat sesak kambuh. Dan Cetirizine 10 mg malam hari bila ada gejala alergi dingin. Jika setelah 2 kali semprotan masih sesak berat atau bibir membiru, langsung ke IGD ya Mbak.\n" +
      "Pasien: Baik Dokter, terima kasih banyak.",
    deidentification: {
      originalText:
        "Dokter: Selamat pagi Mbak Dewi. Tampak agak terengah-engah ya, ada keluhan sesak napas?\n" +
        "Pasien: Pagi Dok. Iya Dok, dada rasanya sempit sekali dari jam tiga pagi tadi, napasnya bunyi ngik-ngik. Udara dini hari tadi dingin sekali Dok.\n" +
        "Dokter: Punya riwayat asma sebelumnya Mbak?\n" +
        "Pasien: Ada Dok dari SMA, tapi sudah hampir setahun tidak pernah kambuh. Inhaler pelega saya yang lama sudah kedaluwarsa.\n" +
        "Dokter: Baik, saya periksa suara napasnya dulu... Tarik napas panjang, hembuskan... Ya, terdengar suara mengi atau wheezing di kedua lapang paru, saturasi oksigen 96%. Ini serangan asma ringan ke sedang dipicu cuaca dingin.\n" +
        "Pasien: Iya Dok, dada rasanya berat sekali.\n" +
        "Dokter: Kita resepkan Salbutamol inhaler baru ya Mbak, gunakan 2 semprotan saat sesak kambuh. Dan Cetirizine 10 mg malam hari bila ada gejala alergi dingin. Jika setelah 2 kali semprotan masih sesak berat atau bibir membiru, langsung ke IGD ya Mbak.\n" +
        "Pasien: Baik Dokter, terima kasih banyak.",
      deidentifiedText:
        "Dokter: Selamat pagi [PASIEN_4]. Tampak agak terengah-engah ya, ada keluhan sesak napas?\n" +
        "Pasien: Pagi Dok. Iya Dok, dada rasanya sempit sekali dari jam tiga pagi tadi, napasnya bunyi ngik-ngik. Udara dini hari tadi dingin sekali Dok.\n" +
        "Dokter: Punya riwayat asma sebelumnya Mbak?\n" +
        "Pasien: Ada Dok dari SMA, tapi sudah hampir setahun tidak pernah kambuh. Inhaler pelega saya yang lama sudah kedaluwarsa.\n" +
        "Dokter: Baik, saya periksa suara napasnya dulu... Tarik napas panjang, hembuskan... Ya, terdengar suara mengi atau wheezing di kedua lapang paru, saturasi oksigen 96%. Ini serangan asma ringan ke sedang dipicu cuaca dingin.\n" +
        "Pasien: Iya Dok, dada rasanya berat sekali.\n" +
        "Dokter: Kita resepkan Salbutamol inhaler baru ya Mbak, gunakan 2 semprotan saat sesak kambuh. Dan Cetirizine 10 mg malam hari bila ada gejala alergi dingin. Jika setelah 2 kali semprotan masih sesak berat atau bibir membiru, langsung ke IGD ya Mbak.\n" +
        "Pasien: Baik Dokter, terima kasih banyak.",
      entities: [
        {
          id: "ent-401",
          type: "NAME",
          label: "Nama Pasien",
          originalText: "Mbak Dewi",
          replacement: "[PASIEN_4]",
          start: 22,
          end: 31,
        },
      ],
      metadata: {
        totalRedacted: 1,
        typesFound: ["NAME"],
      },
    },
    soap: {
      subjective: {
        chiefComplaint: "Sesak napas berbunyi mengi sejak dini hari",
        historyOfPresentIllness:
          "Pasien perempuan 27 tahun datang dengan sesak napas yang timbul mendadak sejak pukul 03.00 dini hari setelah terpapar suhu udara dingin. Disertai napas berbunyi 'ngik-ngik' (mengi) dan rasa berat di dada. Pasien memiliki riwayat asma bronkial sejak masa SMA, namun terkontrol dan jarang kambuh. Obat inhaler pelega di rumah sudah kedaluwarsa.",
        pastMedicalHistory: "Asma bronkial intermiten, rinitis alergi terhadap debu dan udara dingin",
        familyMedicalHistory: "Ibu memiliki riwayat asma dan alergi kulit",
        allergies: {
          status: "TERDAPAT",
          details: "Alergi debu rumah dan perubahan suhu dingin ekstrem",
        },
        evidence: [
          {
            quote: "Iya Dok, dada rasanya sempit sekali dari jam tiga pagi tadi, napasnya bunyi ngik-ngik. Udara dini hari tadi dingin sekali Dok.",
            sourceSpeaker: "Pasien",
            context: "Anamnesis serangan asma dipicu cuaca dingin",
          },
        ],
      },
      objective: {
        vitalSigns: {
          bloodPressure: "118/78 mmHg",
          heartRate: "88 x/menit",
          temperature: "36.6 °C",
          respiratoryRate: "24 x/menit",
        },
        physicalExamFindings:
          "Keadaan umum tampak sedikit sesak namun masih mampu berbicara dalam kalimat utuh. Saturasi SpO2: 96% pada udara ruangan. Pemeriksaan paru: retraksi interkostal minimal, terdengar ekspirasi memanjang dengan wheezing bilateral di kedua lapang paru. Sianosis (-).",
        evidence: [
          {
            quote: "terdengar suara mengi atau wheezing di kedua lapang paru, saturasi oksigen 96%.",
            sourceSpeaker: "Dokter",
            context: "Auskultasi paru dan pemantauan pulse oximetry",
          },
        ],
      },
      assessment: {
        primaryDiagnosis: "Asma Bronkial Eksaserbasi Akut Ringan-Sedang (ICD-10: J45.901)",
        differentialDiagnosis: ["Bronkitis Akut"],
        clinicalCertainty: "PASTI",
        evidence: [
          {
            quote: "Ini serangan asma ringan ke sedang dipicu cuaca dingin.",
            sourceSpeaker: "Dokter",
            context: "Diagnosis asma eksaserbasi",
          },
        ],
      },
      plan: {
        medications: [
          {
            name: "Salbutamol Inhaler (MDI)",
            dosage: "100 mcg / semprot",
            frequency: "1 - 2 semprotan",
            duration: "Bila perlu (prn)",
            instructions: "Kocok inhaler, hirup dalam saat tombol ditekan, tahan napas 10 detik. Ulangi bila belum lega.",
          },
          {
            name: "Cetirizine",
            dosage: "10 mg",
            frequency: "1 x 1 tablet",
            duration: "5 hari",
            instructions: "Diminum malam hari sesudah makan",
          },
        ],
        diagnosticOrders: ["Spirometri berkala bila serangan akut telah tenang"],
        patientEducation: [
          "Selalu sediakan inhaler pelega di dalam tas kemana pun bepergian",
          "Gunakan jaket tebal dan syal saat cuaca dingin",
          "Hindari paparan asap rokok, debu kasur, dan bulu hewan peliharaan",
          "Pelajari teknik pernapasan bibir terkatup (pursed-lip breathing) saat mulai terasa sesak",
        ],
        contraindicationsOrRestrictions: ["Hindari obat golongan beta-bloker dan NSAID yang dapat memicu bronkospasme"],
        followUpPlan: "Kontrol 1 bulan lagi ke Poli Paru untuk evaluasi derajat kontrol asma",
        emergencyRedFlags: [
          "Sesak napas makin memberat setelah 2-3 kali semprotan inhaler",
          "Kesulitan berbicara kalimat utuh karena kehabisan napas",
          "Ujung jari atau bibir tampak membiru atau pucat",
        ],
        evidence: [
          {
            quote: "Kita resepkan Salbutamol inhaler baru ya Mbak, gunakan 2 semprotan saat sesak kambuh. Dan Cetirizine 10 mg malam hari bila ada gejala alergi dingin.",
            sourceSpeaker: "Dokter",
            context: "Peresepan bronkodilator inhalasi dan antihistamin",
          },
        ],
      },
      patientSummary: {
        facilityName: "Poliklinik Paru & Alergi PlayItPlus",
        doctorName: "dr. Sp.P",
        date: "2026-10-13",
        simpleConclusion:
          "Anda mengalami kekambuhan serangan asma derajat ringan akibat paparan udara dingin dini hari. Saluran napas mengalami penyempitan sementara sehingga terdengar bunyi mengi.",
        medicationInstructions: [
          "Salbutamol Inhaler 100 mcg: Semprotkan 1-2 kali langsung ke mulut saat dada terasa sesak/mengi",
          "Cetirizine 10 mg: Minum 1 tablet di malam hari sebelum tidur untuk mengontrol reaksi alergi",
        ],
        lifestyleAdvice: [
          "Gunakan pakaian hangat dan selimut tebal saat suhu dingin",
          "Bersihkan sprei dan tirai dari debu secara teratur",
          "Bawa selalu inhaler pelega kemanapun Anda beraktivitas",
        ],
        thingsToAvoid: ["Paparan asap rokok dan polusi udara", "Minuman es saat cuaca dingin"],
        controlSchedule: "Kontrol 1 bulan ke Poli Paru",
        emergencySigns: ["Sesak napas tak kunjung reda setelah inhaler", "Bibir biru", "Sulit berbicara"],
      },
      uncertainties: [],
    },
  },

  // 5. Antrean A-05: Dermatitis Kontak Alergi Deterjen (Poli Kulit & Kelamin)
  {
    id: "queue-005",
    queueNumber: "A-05",
    patientName: "Hendra Wijaya",
    patientAge: 42,
    gender: "Laki-laki",
    clinicService: "Poli Kulit & Kelamin",
    chiefComplaint: "Gatal hebat, kemerahan, dan bintil berair di punggung kedua tangan",
    status: "Siap Konsultasi",
    estimatedTime: "10 Menit",
    transcript:
      "Dokter: Selamat siang Pak Hendra. Ada keluhan di bagian kulit ya?\n" +
      "Pasien: Siang Dok. Ini Dok, tangan saya dari pergelangan sampai punggung tangan gatal luar biasa, merah-merah dan ada bintil kecil berair sejak tiga hari lalu.\n" +
      "Dokter: Apakah sebelumnya ada kontak dengan bahan kimia, sabun baru, semen, atau deterjen?\n" +
      "Pasien: Betul Dok! Tiga hari lalu saya mencuci karpet pakai cairan pemutih dan deterjen konsentrat baru tanpa sarung tangan karet. Setelah itu mulai panas dan gatal sekali.\n" +
      "Dokter: Baik, ini tampak bercak eritema berbatas tegas dengan vesikel milier di regio punggung tangan kanan dan kiri. Diagnosisnya dermatitis kontak iritan atau alergi akibat zat kimia deterjen.\n" +
      "Pasien: Jangan digaruk ya Dok? Rasanya gemas sekali ingin digaruk.\n" +
      "Dokter: Jangan digaruk Pak, nanti bisa infeksi bakteri sekunder. Saya resepkan salep Mometasone furoate 0.1% dioles tipis sehari sekali pada area yang merah gatal, dan tablet Loratadine 10 mg sehari sekali diminum pagi untuk meredakan gatalnya. Wajib pakai sarung tangan karet jika memegang sabun/deterjen ya Pak.\n" +
      "Pasien: Siap Dokter, akan saya hindari menyentuh langsung sabunnya. Terima kasih banyak.",
    deidentification: {
      originalText:
        "Dokter: Selamat siang Pak Hendra. Ada keluhan di bagian kulit ya?\n" +
        "Pasien: Siang Dok. Ini Dok, tangan saya dari pergelangan sampai punggung tangan gatal luar biasa, merah-merah dan ada bintil kecil berair sejak tiga hari lalu.\n" +
        "Dokter: Apakah sebelumnya ada kontak dengan bahan kimia, sabun baru, semen, atau deterjen?\n" +
        "Pasien: Betul Dok! Tiga hari lalu saya mencuci karpet pakai cairan pemutih dan deterjen konsentrat baru tanpa sarung tangan karet. Setelah itu mulai panas dan gatal sekali.\n" +
        "Dokter: Baik, ini tampak bercak eritema berbatas tegas dengan vesikel milier di regio punggung tangan kanan dan kiri. Diagnosisnya dermatitis kontak iritan atau alergi akibat zat kimia deterjen.\n" +
        "Pasien: Jangan digaruk ya Dok? Rasanya gemas sekali ingin digaruk.\n" +
        "Dokter: Jangan digaruk Pak, nanti bisa infeksi bakteri sekunder. Saya resepkan salep Mometasone furoate 0.1% dioles tipis sehari sekali pada area yang merah gatal, dan tablet Loratadine 10 mg sehari sekali diminum pagi untuk meredakan gatalnya. Wajib pakai sarung tangan karet jika memegang sabun/deterjen ya Pak.\n" +
        "Pasien: Siap Dokter, akan saya hindari menyentuh langsung sabunnya. Terima kasih banyak.",
      deidentifiedText:
        "Dokter: Selamat siang [PASIEN_5]. Ada keluhan di bagian kulit ya?\n" +
        "Pasien: Siang Dok. Ini Dok, tangan saya dari pergelangan sampai punggung tangan gatal luar biasa, merah-merah dan ada bintil kecil berair sejak tiga hari lalu.\n" +
        "Dokter: Apakah sebelumnya ada kontak dengan bahan kimia, sabun baru, semen, atau deterjen?\n" +
        "Pasien: Betul Dok! Tiga hari lalu saya mencuci karpet pakai cairan pemutih dan deterjen konsentrat baru tanpa sarung tangan karet. Setelah itu mulai panas dan gatal sekali.\n" +
        "Dokter: Baik, ini tampak bercak eritema berbatas tegas dengan vesikel milier di regio punggung tangan kanan dan kiri. Diagnosisnya dermatitis kontak iritan atau alergi akibat zat kimia deterjen.\n" +
        "Pasien: Jangan digaruk ya Dok? Rasanya gemas sekali ingin digaruk.\n" +
        "Dokter: Jangan digaruk Pak, nanti bisa infeksi bakteri sekunder. Saya resepkan salep Mometasone furoate 0.1% dioles tipis sehari sekali pada area yang merah gatal, dan tablet Loratadine 10 mg sehari sekali diminum pagi untuk meredakan gatalnya. Wajib pakai sarung tangan karet jika memegang sabun/deterjen ya Pak.\n" +
        "Pasien: Siap Dokter, akan saya hindari menyentuh langsung sabunnya. Terima kasih banyak.",
      entities: [
        {
          id: "ent-501",
          type: "NAME",
          label: "Nama Pasien",
          originalText: "Pak Hendra",
          replacement: "[PASIEN_5]",
          start: 22,
          end: 32,
        },
      ],
      metadata: {
        totalRedacted: 1,
        typesFound: ["NAME"],
      },
    },
    soap: {
      subjective: {
        chiefComplaint: "Gatal dan bercak merah berbintil air pada kedua punggung tangan sejak 3 hari",
        historyOfPresentIllness:
          "Pasien pria 42 tahun mengeluhkan kedua punggung tangan dan pergelangan tangan terasa sangat gatal, panas, dan timbul bintil kemerahan berisi cairan sejak 3 hari lalu. Riwayat mencuci karpet menggunakan cairan pemutih pakaian dan deterjen konsentrat pekat tanpa menggunakan sarung tangan pelindung karet. Keluhan demam disangkal.",
        pastMedicalHistory: "Tidak ada riwayat alergi obat sebelumnya",
        familyMedicalHistory: "Tidak ada riwayat dermatitis atopi dalam keluarga",
        allergies: {
          status: "TERDAPAT",
          details: "Sensitivitas kulit terhadap bahan kimia keras dan deterjen konsentrat",
        },
        evidence: [
          {
            quote: "Tiga hari lalu saya mencuci karpet pakai cairan pemutih dan deterjen konsentrat baru tanpa sarung tangan karet. Setelah itu mulai panas dan gatal sekali.",
            sourceSpeaker: "Pasien",
            context: "Riwayat kontak langsung zat iritan kimia",
          },
        ],
      },
      objective: {
        vitalSigns: {
          bloodPressure: "120/80 mmHg",
          heartRate: "76 x/menit",
          temperature: "36.7 °C",
          respiratoryRate: "16 x/menit",
        },
        physicalExamFindings:
          "Status dermatologis regio dorsum manus bilateral et pergelangan tangan: tampak makula eritematosa berbatas relatif tegas disertai papulovesikel multipel dan ekskoriasi minimal akibat garukan. Tanda infeksi sekunder purulen (-).",
        evidence: [
          {
            quote: "ini tampak bercak eritema berbatas tegas dengan vesikel milier di regio punggung tangan kanan dan kiri.",
            sourceSpeaker: "Dokter",
            context: "Efloresensi kulit oleh dokter pemeriksa",
          },
        ],
      },
      assessment: {
        primaryDiagnosis: "Dermatitis Kontak Iritan / Alergi Akut Regio Manus Bilateral (ICD-10: L24.9)",
        differentialDiagnosis: ["Dermatitis Numularis", "Tinea Manuum"],
        clinicalCertainty: "PASTI",
        evidence: [
          {
            quote: "Diagnosisnya dermatitis kontak iritan atau alergi akibat zat kimia deterjen.",
            sourceSpeaker: "Dokter",
            context: "Penetapan diagnosis klinis",
          },
        ],
      },
      plan: {
        medications: [
          {
            name: "Mometasone Furoate Krim 0.1%",
            dosage: "Tube 10 gram",
            frequency: "1 x sehari",
            duration: "7 hari",
            instructions: "Oleskan tipis-tipis pada area kulit yang merah gatal setelah mandi",
          },
          {
            name: "Loratadine",
            dosage: "10 mg",
            frequency: "1 x 1 tablet",
            duration: "5 hari",
            instructions: "Diminum pagi hari sesudah makan untuk mengurangi sensasi gatal",
          },
        ],
        diagnosticOrders: ["Uji tempel (patch test) bila keluhan sering berulang setelah sembuh"],
        patientEducation: [
          "Wajib menggunakan sarung tangan karet tebal saat mencuci atau memegang bahan kimia",
          "Jangan menggaruk area kulit yang gatal agar tidak terjadi infeksi bakteri dan luka bernanah",
          "Gunakan sabun mandi berpelembab tanpa parfum",
          "Bilas tangan dengan air mengalir jika tak sengaja terkena sabun pembersih",
        ],
        contraindicationsOrRestrictions: ["Hindari kontak langsung dengan cairan pemutih, deterjen, dan tiner"],
        followUpPlan: "Kontrol 7 hari jika lesi kulit belum membaik",
        emergencyRedFlags: [
          "Area kulit bengkak hebat, timbul nanah kuning, atau terasa panas berdenyut",
          "Timbul demam tinggi menggigil",
        ],
        evidence: [
          {
            quote: "Saya resepkan salep Mometasone furoate 0.1% dioles tipis sehari sekali pada area yang merah gatal, dan tablet Loratadine 10 mg sehari sekali diminum pagi untuk meredakan gatalnya.",
            sourceSpeaker: "Dokter",
            context: "Terapi topikal kortikosteroid dan antihistamin oral",
          },
        ],
      },
      patientSummary: {
        facilityName: "Poliklinik Kulit & Kelamin PlayItPlus",
        doctorName: "dr. Sp.DVE",
        date: "2026-10-13",
        simpleConclusion:
          "Kulit tangan Anda mengalami reaksi peradangan dan alergi (Dermatitis Kontak) akibat kontak langsung dengan zat kimia pemutih dan deterjen keras tanpa pelindung tangan.",
        medicationInstructions: [
          "Mometasone Furoate Krim 0.1%: Oleskan tipis pada bagian punggung tangan yang gatal 1x sehari",
          "Loratadine 10 mg: Minum 1 tablet di pagi hari untuk meredakan rasa gatal",
        ],
        lifestyleAdvice: [
          "Wajib memakai sarung tangan karet pelindung saat mencuci pakaian atau piring",
          "Kompres dingin jika rasa gatal sangat mengganggu",
          "Gunakan pelembab kulit tanpa pewangi setelah mandi",
        ],
        thingsToAvoid: ["Menggaruk kulit dengan kuku", "Menyentuh langsung cairan pemutih/deterjen"],
        controlSchedule: "Kontrol 7 hari jika belum ada perbaikan",
        emergencySigns: ["Keluar nanah kuning kental", "Demam tinggi", "Bengkak meluas ke lengan"],
      },
      uncertainties: [],
    },
  },
];

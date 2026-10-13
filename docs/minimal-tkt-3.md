# Minimal TKT 3 — PlayItPlus

## Status yang dapat dipertanggungjawabkan

PlayItPlus berada pada **kandidat TKT 3**: pembuktian konsep awal perangkat lunak dalam lingkungan terbatas. Status ini belum berarti TKT 3 telah ditetapkan secara formal oleh penilai.

Dasar penilaian: TKT 3 mensyaratkan pembuktian konsep fungsi dan/atau karakteristik penting secara analitis dan eksperimental. Untuk perangkat lunak, indikator praktisnya mencakup komponen yang dapat bekerja, eksperimen dengan data dummy, serta kelayakan ilmiah yang ditunjukkan melalui studi, model, simulasi, atau eksperimen.[1][2]

## Bukti yang sudah tersedia

| Indikator | Bukti | Status |
|---|---|---|
| Alur fungsi inti diwujudkan | `backend/src/routes/consultation.ts`: `/samples`, `/status`, `/stt`, `/deidentify`, `/autofill`, `/process` | Terpenuhi secara terbatas |
| Transkripsi dapat dipanggil melalui abstraksi provider | `backend/src/services/stt/index.ts`, `unified-stt.ts`, dan `mock-stt.ts` | Terpenuhi pada purwarupa; provider default masih mock bila kunci layanan tidak tersedia |
| De-identifikasi sebelum pemrosesan LLM | `backend/src/services/deidentification/index.ts` dan `pii-patterns.ts` | Terpenuhi pada pola PII yang telah dirancang |
| Penyusunan SOAP dan ringkasan pasien | `backend/src/services/llm/mock-llm.ts`, `clinical-prompts.ts`, serta tipe `SOAPData` | Terpenuhi sebagai draf purwarupa |
| Demonstrasi dengan data dummy | Uji cepat lokal terhadap konsultasi simulasi: 7 entitas PII terdeteksi dan diganti; struktur SOAP serta ringkasan terbentuk | Terpenuhi untuk demonstrasi awal |
| Pemeriksaan manusia | `frontend/components/feature/SoapWorkspacePanel.tsx` menyediakan ruang kerja review dan koreksi | Terpenuhi pada rancangan antarmuka; belum menjadi validasi klinis |
| Keterlacakan sumber | Tipe dan tampilan `TraceableQuote` tersedia pada antarmuka | Terpenuhi sebagai fungsi purwarupa; manfaat penghematan waktu belum diukur |

## Batas bukti

Bukti di atas hanya menunjukkan bahwa pipeline teknis awal dapat dijalankan. Belum ada dasar untuk menyatakan bahwa sistem:

- akurat pada percakapan klinis nyata;
- aman digunakan dalam pelayanan pasien;
- memenuhi seluruh ketentuan perlindungan data atau rekam medis;
- telah memiliki pengiriman otomatis WhatsApp setelah dokter memberi persetujuan; purwarupa baru menampilkan format pesan dan tombol salin, sehingga pengiriman otomatis setelah acc menjadi target MVP berikutnya;
- telah diuji oleh dokter, pasien, atau mitra fasilitas kesehatan;
- mengurangi waktu dokumentasi atau meningkatkan pemahaman pasien;
- mencapai target akurasi, WER, F1, ROUGE, atau metrik klinis tertentu.

STT, de-identifikasi, ekstraksi SOAP, omission, hallucination, negasi, dosis, serta ketepatan kutipan belum memiliki pengukuran formal. Data uji yang tersedia bersifat simulasi, bukan data pasien.

## Rencana minimum untuk menguatkan TKT 3

1. Tetapkan satu format SOAP dan satu skenario rawat jalan.
2. Susun kumpulan konsultasi simulasi yang mencakup negasi, riwayat keluarga, angka/dosis, istilah medis, pembicara bertumpuk, dan ucapan ambigu.
3. Ukur secara terpisah: WER atau kesalahan transkripsi, recall/precision PII, kelengkapan field SOAP, fakta tanpa sumber, kesalahan negasi, kesalahan obat/dosis, serta ketepatan kutipan.
4. Minta tenaga kesehatan menilai keluaran dengan rubrik yang disepakati; jangan menyebutnya validasi klinis bila belum melibatkan pengguna berwenang.
5. Uji bahwa catatan dan ringkasan tidak dapat disahkan, atau dikirim tanpa pemeriksaan manusia.
6. Dokumentasikan konfigurasi, data uji, hasil, kegagalan, dan keputusan perbaikan.

Target numerik ditetapkan setelah baseline tersedia. Angka dari literatur tidak boleh dipindahkan menjadi hasil PlayItPlus.

## Posisi teknis dan nilai pembeda

Voice-to-text, draf SOAP, serta pengiriman ringkasan bukan keunggulan yang dapat diklaim eksklusif. Pembeda yang layak diuji adalah satu alur verifikasi:

1. satu konsultasi menghasilkan draf catatan klinis dan ringkasan pasien;
2. ringkasan pasien hanya dibuat dari catatan yang telah disahkan, bukan dari transkrip mentah;
3. setiap fakta dapat ditelusuri ke kutipan sumber atau ditandai sebagai input dokter;
4. sistem membedakan informasi tidak disebutkan, disangkal, ambigu, dan perlu dikonfirmasi;
5. pengiriman kepada pasien memiliki persetujuan, verifikasi penerima, versi dokumen, dan status audit.

Pesan pelanggan: **fasilitas kesehatan tidak membeli AI yang mengambil keputusan; fasilitas membeli alur dokumentasi dan tindak lanjut yang lebih mudah diaudit, dengan dokter tetap memegang keputusan akhir.**

## Rujukan

[1] Kementerian Riset, Teknologi, dan Pendidikan Tinggi Republik Indonesia. *Peraturan Menteri Riset, Teknologi, dan Pendidikan Tinggi Nomor 42 Tahun 2016 tentang Pengukuran dan Penetapan Tingkat Kesiapterapan Teknologi*. https://peraturan.bpk.go.id/Details/141280/permen-ristekdikti-no-42-tahun-2016

[2] Direktorat Riset, Teknologi, dan Pengabdian kepada Masyarakat. *Panduan Penelitian dan Pengabdian kepada Masyarakat Tahun 2023*, Lampiran Deskripsi TKT. Kemdikbudristek/Kemdiktisaintek. https://kemdiktisaintek.go.id/api/file/humas-production/2023/03/Panduan-Penelitian-dan-Pengabdian-kepada-Masyarakat-Tahun-2023.pdf

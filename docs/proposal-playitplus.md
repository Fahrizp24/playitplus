# PROPOSAL PURWARUPA — DEEPTECH HACKATHON 2026

## 1. Judul Proposal

**PlayItPlus: Satu Konsultasi, Dua Keluaran Tervalidasi untuk Dokumentasi Klinis dan Tindak Lanjut Pasien**

**Tema fokus:** Digitalisasi AI Bidang Kesehatan

## 2. Executive Summary (maksimum 250 kata)

Fasilitas kesehatan tidak hanya membutuhkan transkripsi percakapan. Mereka membutuhkan catatan yang dapat diperiksa, instruksi pasien yang tidak berubah makna, dan jejak siapa yang menyetujui setiap keluaran. PlayItPlus mengembangkan asisten dokumentasi konsultasi berbasis AI yang mengubah percakapan dokter–pasien, dengan persetujuan pihak terkait, menjadi dua keluaran: draf dokumentasi klinis terstruktur untuk tenaga kesehatan dan ringkasan tindak lanjut berbahasa sederhana untuk pasien yang dikirim melalui WhatsApp. Ringkasan kedua hanya dibuat dari catatan yang telah diperiksa dan disahkan dokter; sistem tidak mendiagnosis, meresepkan, atau mengirim pesan tanpa persetujuan.

Kebutuhan ini berangkat dari beban dokumentasi yang nyata. Studi pada layanan rawat jalan melaporkan penggunaan ambient scribe berkaitan dengan penurunan waktu pencatatan per kunjungan 20,4% dan pekerjaan setelah jam layanan 30,0%, tetapi catatan tetap memerlukan pemeriksaan klinisi [1]. Pada sisi pasien, sedikitnya 78% pasien yang pulang dari instalasi gawat darurat mengalami defisit pemahaman pada sedikitnya satu bagian instruksi [2].

Nilai PlayItPlus bukan klaim sebagai AI scribe pertama. Pembeda yang diuji adalah lapisan verifikasi: setiap informasi penting ditautkan ke kutipan sumber atau input dokter; sistem menandai informasi yang tidak disebutkan, disangkal, ambigu, atau perlu dikonfirmasi; lalu menghasilkan catatan internal dan ringkasan pasien yang konsisten dari versi yang disahkan. Purwarupa awal telah menjalankan alur transkripsi, de-identifikasi, penyusunan SOAP, ringkasan pasien, dan ruang review pada data simulasi. Perkiraan kesiapan awal: kandidat TKT 3. Hilirisasi dimulai melalui satu alur rawat jalan dan satu fasilitas mitra setelah baseline, tata kelola, serta izin penggunaan ditetapkan.

## 3. Deskripsi Inovasi (maksimum 2 halaman)

### 3.1 Masalah, sasaran pengguna, dan bukti kebutuhan

Dokumentasi konsultasi masih menuntut tenaga kesehatan memindahkan percakapan ke format catatan secara manual. Beban ini tidak berhenti saat pasien meninggalkan ruang periksa. Tinjauan Budd melaporkan, mengutip studi lain, bahwa klinisi dapat membutuhkan hingga dua jam tambahan untuk entri data elektronik pada setiap satu jam kontak langsung dengan pasien [3]. Studi prospektif pada 46 klinisi dari 17 spesialisasi menemukan ambient scribe berkaitan dengan penurunan waktu pencatatan per janji temu dari 10,3 menjadi 8,2 menit (20,4%) serta pekerjaan setelah jam layanan sebesar 30,0%; penulis tetap melaporkan perlunya editing dan proofreading substansial pada catatan AI [1]. Dengan demikian, masalah pelanggan bukan sekadar “belum ada transkripsi”, melainkan biaya waktu dokumentasi dan risiko bahwa otomatisasi memindahkan beban menjadi audit yang sulit.

Masalah kedua berada pada sisi pasien. Instruksi lisan mudah terlupa, terutama ketika memuat diagnosis, perubahan obat, dosis, kontrol, dan tanda bahaya. DeSai dkk. melaporkan sedikitnya 78% pasien yang dipulangkan dari instalasi gawat darurat mengalami defisit pemahaman pada setidaknya satu area perawatan [2]. Studi Parikh dkk. juga menguji ringkasan satu halaman dan teach-back pada konteks rawat inap [4]. Temuan tersebut tidak otomatis membuktikan kondisi yang sama pada seluruh pasien rawat jalan; temuan tersebut menjadi alasan untuk menguji apakah ringkasan tertulis yang disahkan dokter membantu pasien menjelaskan kembali instruksinya.

Sasaran pembeli adalah fasilitas kesehatan atau jaringan klinik dengan volume konsultasi berulang dan format dokumentasi yang dapat disepakati. Pengguna harian adalah dokter atau tenaga kesehatan yang memeriksa catatan. Penerima manfaat adalah pasien dan pendamping yang diberi izin. PlayItPlus tidak menggantikan rekam medis, resep, diagnosis, atau keputusan dokter.

### 3.2 Pesan produk dan solusi

**PlayItPlus membuat satu konsultasi menjadi dua keluaran yang konsisten dan dapat diaudit: catatan untuk tenaga kesehatan serta instruksi tindak lanjut yang siap dipahami pasien—dengan dokter tetap memegang keputusan akhir.**

Alur solusi:

1. Petugas memilih kunjungan; perekaman dimulai hanya setelah persetujuan dicatat.
2. Audio diubah menjadi transkrip. Bagian yang tidak jelas tidak diperlakukan sebagai fakta pasti.
3. Identitas langsung seperti nama, nomor rekam medis, NIK, telepon, tanggal lahir, dan alamat disamarkan sebelum teks dikirim ke model bahasa sesuai konfigurasi layanan.
4. Sistem mengekstrak informasi ke draf SOAP: Subjective, Objective, Assessment, dan Plan.
5. Setiap field menampilkan kutipan sumber atau status “tidak disebutkan”, “disangkal”, “ambigu”, atau “perlu konfirmasi”.
6. Dokter mengoreksi dan mengesahkan catatan. Draf AI tidak menjadi rekam medis final secara otomatis.
7. Sistem membuat ringkasan pasien dari catatan yang telah disahkan, bukan dari transkrip mentah. Ringkasan hanya berisi kesimpulan, instruksi obat yang lengkap, anjuran, hal yang perlu dihindari, kontrol, dan tanda bahaya yang memang disetujui dokter.
8. Begitu dokter menyetujui (acc) dan izin serta penerima terverifikasi, sistem otomatis mengirim ringkasan melalui WhatsApp sebagai kanal pengiriman MVP; tanpa acc, tidak ada pengiriman. Versi, approver, dan status pengiriman dicatat. Purwarupa saat ini baru menyediakan format pesan WhatsApp dan aksi salin; pengiriman otomatis setelah acc adalah target MVP, belum diimplementasikan.

Pendekatan ini sengaja menempatkan AI sebagai penyusun draf, bukan pengambil keputusan. Riset digital scribe membedakan validitas teknis, validitas klinis, usability, dan utilitas; sistem yang hanya menghasilkan teks belum membuktikan manfaat klinis [5]. Karena itu, evaluasi PlayItPlus mengukur waktu dokumentasi total termasuk review, kelengkapan, kesalahan negasi dan obat, fakta tanpa sumber, ketepatan kutipan, konsistensi ringkasan, pemahaman pasien, serta kegagalan integrasi.

### 3.3 Keunggulan dibanding solusi yang ada

Transkripsi audio, voice-to-SOAP, dan ringkasan pasien sudah menjadi kemampuan pasar; Abridge, misalnya, mendokumentasikan linked evidence dan patient visit summary [6]. PlayItPlus tidak mengklaim sebagai produk pertama atau paling akurat. Keunggulan yang diajukan adalah kombinasi mekanisme berikut:

- **Evidence-linked review:** dokter dapat memeriksa sumber per klaim, bukan membaca ulang seluruh transkrip untuk mencari asal kalimat.
- **Satu sumber yang disahkan:** keluaran internal dan keluaran pasien diturunkan dari versi final yang sama; perubahan catatan memicu pemeriksaan ulang ringkasan.
- **Ketidakpastian eksplisit:** “tidak dibahas” tidak diubah menjadi “tidak ada”; negasi, ambiguitas, dan informasi yang perlu dikonfirmasi dipisahkan.
- **Safety gate:** tidak ada finalisasi catatan atau pengiriman pasien tanpa review, persetujuan, dan verifikasi penerima.
- **Adaptasi lokal:** format SOAP, bahasa, kanal, dan jalur integrasi ditentukan bersama fasilitas, bukan diasumsikan seragam.

### 3.4 Target kinerja dan rencana validasi

Target awal berupa kriteria penerimaan purwarupa, bukan hasil yang telah dicapai:

- setiap field klinis pada skenario uji memiliki kutipan, input dokter, atau status ketidaktersediaan;
- catatan tidak dapat disahkan tanpa review dokter dan ringkasan tidak dapat dikirim tanpa approval serta izin penerima;
- skenario negasi, riwayat keluarga, pembicara bertumpuk, angka/dosis, ucapan ambigu, dan informasi obat yang tidak lengkap menghasilkan penanda untuk pemeriksaan;
- seluruh perubahan draf, approver, versi ringkasan, dan status pengiriman dapat ditelusuri;
- target efisiensi numerik ditetapkan setelah baseline alur manual dan beban review diperoleh.

Validasi tahap awal menggunakan konsultasi simulasi yang ditinjau tenaga kesehatan. Metrik mencakup WER atau kesalahan transkripsi, precision/recall de-identifikasi, kelengkapan SOAP, omission, hallucination, kesalahan klinis penting, waktu review, dan konsistensi ringkasan. Data pasien nyata tidak digunakan sebelum persetujuan, tata kelola, dan dasar pemrosesan tersedia.

### 3.5 Perkiraan TKT dan potensi hilirisasi

PlayItPlus diposisikan sebagai **kandidat TKT 3** menurut kerangka Permenristekdikti [7]: fungsi inti telah dibuktikan melalui purwarupa perangkat lunak dan eksperimen terbatas dengan data dummy, tetapi belum tervalidasi pada pelayanan nyata. Bukti yang tersedia pada purwarupa mencakup endpoint transkripsi, de-identifikasi, ekstraksi SOAP, ringkasan pasien, tipe kutipan, serta ruang kerja review. Uji lokal terhadap konsultasi simulasi mendeteksi dan mengganti tujuh entitas PII serta membentuk struktur SOAP dan ringkasan. Performa klinis belum boleh disimpulkan dari uji tersebut.

Tahap hilirisasi dimulai pada satu fasilitas atau jaringan dengan satu alur rawat jalan, satu format catatan, dan satu sandbox atau mekanisme ekspor resmi. Nilai komersialnya adalah pengurangan kerja dokumentasi bersih setelah memperhitungkan waktu review, bukan sekadar jumlah teks yang dihasilkan. Model harga per fasilitas, per tenaga kesehatan, atau per penggunaan masih menjadi hipotesis yang perlu diuji bersama calon pembeli. Status mitra, akses produksi, dan komitmen pilot diisi hanya setelah ada dokumen dukungan resmi.

## 4. Pembagian Tugas dan Tanggung Jawab Tim

| Peran | Tanggung jawab |
|---|---|
| Ketua tim / product lead — [DIISI] | Menetapkan ruang lingkup, kebutuhan pengguna, koordinasi, dan dokumentasi proposal. |
| Backend/AI engineer — [DIISI] | Pipeline STT, de-identifikasi, ekstraksi terstruktur, validasi output, dan audit trail. |
| Frontend/UX engineer — [DIISI] | Antarmuka recording, consent, evidence review, approval, dan ringkasan pasien. |
| Clinical/safety lead — [DIISI] | Skenario uji, rubrik review, risiko klinis, dan batas penggunaan. |
| Integration/business lead — [DIISI] | Pemetaan format mitra, sandbox/API, analisis biaya, dan rencana pilot. |

## 5. Daftar Pustaka

[1] Duggan, M. J., et al. “Clinician Experiences With Ambient Scribe Technology to Assist With Documentation Burden and Efficiency.” *JAMA Network Open*, 8(2), e2460637, 2025. https://doi.org/10.1001/jamanetworkopen.2024.60637

[2] DeSai, C., et al. “Empowering patients: simplifying discharge instructions.” *BMJ Open Quality*, 10, e001419, 2021. https://doi.org/10.1136/bmjoq-2021-001419

[3] Budd, J. “Burnout Related to Electronic Health Record Use in Primary Care.” *Journal of Primary Care & Community Health*, 14, 2023. https://doi.org/10.1177/21501319231166921

[4] Parikh, P., et al. “Enhancing Patient Understanding of Hospitalization and Post-Discharge Needs: The Impact of Physician-Led Verbal Communication and Teach-Back Method.” *Journal of General Internal Medicine*, 40(9), 2103–2110, 2025. https://doi.org/10.1007/s11606-025-09510-w

[5] van Buchem, M. M., et al. “The digital scribe in clinical practice: a scoping review and research agenda.” *npj Digital Medicine*, 4, 57, 2021. https://doi.org/10.1038/s41746-021-00432-5

[6] Abridge. “Verify a Note With Linked Evidence” dan “Patient Visit Summaries—Now Generated in Real-Time.” Dokumentasi produk. https://support.abridge.com/hc/en-us/articles/30235128433811-Verify-a-Note-With-Linked-Evidence ; https://www.abridge.com/blog/patient-visit-summaries--now-generated-in-real-time

[7] Kementerian Riset, Teknologi, dan Pendidikan Tinggi Republik Indonesia. *Peraturan Menteri Riset, Teknologi, dan Pendidikan Tinggi Nomor 42 Tahun 2016 tentang Pengukuran dan Penetapan Tingkat Kesiapterapan Teknologi*. https://peraturan.bpk.go.id/Details/141280/permen-ristekdikti-no-42-tahun-2016

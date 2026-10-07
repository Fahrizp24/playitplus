# Konsep Proyek: Asisten Dokumentasi Konsultasi dan Ringkasan Tindak Lanjut Pasien Berbasis AI

> **Kategori:** Digitalisasi AI untuk Kesehatan — PLAY IT Hackathon DeepTech 2026  
> **Status:** Konsep awal untuk validasi kebutuhan dan pengembangan purwarupa.  
> **Judul kerja:** Asisten Dokumentasi Konsultasi dan Ringkasan Tindak Lanjut Pasien Berbasis AI.  
> **Batas utama:** Sistem membantu dokumentasi dan komunikasi. Sistem tidak menetapkan diagnosis, meresepkan obat, atau menggantikan keputusan dokter.

## 1. Ringkasan Eksekutif

Proyek ini mengembangkan asisten berbasis kecerdasan artifisial yang mengolah percakapan konsultasi dokter dan pasien menjadi dua keluaran: draf dokumentasi klinis terstruktur untuk tenaga kesehatan dan ringkasan tindak lanjut dalam bahasa yang mudah dipahami pasien.

Dengan persetujuan pihak yang terlibat, percakapan direkam dan diubah menjadi teks. Sistem kemudian mengidentifikasi informasi yang relevan, seperti keluhan, riwayat penyakit, hasil pemeriksaan yang disebutkan, asesmen dokter, dan rencana tindak lanjut. Informasi tersebut disusun menjadi draf sesuai format mitra. Dokter memeriksa, memperbaiki, dan mengesahkan draf sebelum disimpan ke sistem informasi pelayanan kesehatan.

Ringkasan pasien disusun dari catatan yang telah disahkan, bukan langsung dari transkrip mentah. Ringkasan dapat memuat kesimpulan konsultasi, instruksi pengobatan, anjuran, hal yang perlu dihindari, pemeriksaan lanjutan, dan jadwal kontrol sesuai informasi yang disetujui dokter. Setelah diverifikasi, ringkasan dikirim melalui WhatsApp kepada pasien atau pendamping yang diberi izin.

Pengembangan awal berfokus pada satu alur konsultasi rawat jalan, satu format dokumentasi, dan satu jalur integrasi. Manfaat yang hendak diuji adalah pengurangan waktu dokumentasi, peningkatan kelengkapan catatan, dan peningkatan pemahaman pasien terhadap instruksi setelah konsultasi. Seluruh manfaat tersebut merupakan sasaran pengujian, bukan hasil yang sudah terbukti.

## 2. Latar Belakang dan Kesesuaian dengan Kompetisi

### 2.1 Permasalahan yang disebutkan dalam pedoman

Pedoman kompetisi bagian 7.2 menyebutkan bahwa pencatatan keluhan secara manual memakan waktu dan dapat menghasilkan format catatan yang tidak seragam. Pedoman juga menyoroti riwayat pasien yang tersebar serta penginputan data berulang pada platform yang berjalan sendiri-sendiri.[1]

Fokus utama proyek ini adalah mengurangi beban pencatatan saat atau setelah anamnesis. Integrasi ke sistem mitra menjadi langkah pendukung untuk mengurangi penyalinan data. Namun, pengisian otomatis pada satu sistem tidak dengan sendirinya menyelesaikan seluruh persoalan interoperabilitas.

### 2.2 Permasalahan tambahan yang hendak divalidasi

Hipotesis kebutuhan pasien adalah bahwa sebagian pasien dan keluarga hanya mendengarkan penjelasan selama konsultasi tanpa mencatatnya. Akibatnya, mereka berpotensi lupa atau salah memahami instruksi setelah meninggalkan fasilitas kesehatan.

Hipotesis tersebut perlu dikonfirmasi melalui wawancara dan pengujian bersama pasien serta tenaga kesehatan. Dokumen ini tidak menganggap seluruh pasien mengalami masalah yang sama.

## 3. Rumusan Masalah

1. Bagaimana mengubah percakapan konsultasi menjadi draf catatan klinis yang terstruktur tanpa menambahkan informasi yang tidak tersedia?
2. Bagaimana membantu tenaga kesehatan mengurangi waktu dokumentasi tanpa menambah beban pemeriksaan hasil AI secara berlebihan?
3. Bagaimana menyediakan ringkasan instruksi yang mudah dipahami pasien dan tetap konsisten dengan catatan yang disahkan dokter?
4. Bagaimana menghubungkan keluaran sistem dengan aplikasi mitra secara aman dan sesuai akses yang diberikan?
5. Bagaimana menjaga persetujuan, kerahasiaan, ketepatan penerima, serta keterlacakan setiap perubahan dan pengiriman informasi?

## 4. Tujuan dan Manfaat yang Diharapkan

### 4.1 Tujuan utama

Mengembangkan dan menguji asisten dokumentasi konsultasi yang menghasilkan draf catatan klinis serta ringkasan tindak lanjut pasien dengan kendali akhir pada dokter.

### 4.2 Tujuan khusus

- Mengubah rekaman konsultasi menjadi transkrip yang dapat diperiksa.
- Menyusun informasi konsultasi ke dalam struktur yang disepakati mitra.
- Menampilkan sumber informasi agar kesalahan lebih mudah ditemukan.
- Mendukung koreksi dan pengesahan oleh tenaga kesehatan yang berwenang.
- Mengirim ringkasan yang telah disetujui kepada penerima terverifikasi.
- Mengukur waktu kerja, kualitas dokumentasi, dan pemahaman pasien.

### 4.3 Manfaat yang hendak diuji

| Pihak | Manfaat yang diharapkan | Bukti yang perlu dikumpulkan |
|---|---|---|
| Dokter dan tenaga kesehatan | Berkurangnya waktu pencatatan dan penyalinan | Perbandingan waktu dokumentasi manual dengan waktu pemeriksaan serta koreksi draf AI |
| Fasilitas kesehatan | Format catatan lebih konsisten | Pemeriksaan kelengkapan kolom dan kesesuaian format |
| Pasien | Instruksi konsultasi lebih mudah diakses kembali | Uji pemahaman setelah menerima ringkasan |
| Pendamping yang diberi izin | Akses terhadap instruksi yang relevan | Konfirmasi izin dan evaluasi kejelasan ringkasan |

Peningkatan kepatuhan pengobatan atau perbaikan hasil klinis belum menjadi klaim proyek. Klaim tersebut memerlukan rancangan penelitian lanjutan.

## 5. Sasaran Pengguna dan Peran

### 5.1 Pengguna utama

Dokter atau tenaga kesehatan yang bertanggung jawab atas dokumentasi konsultasi pada layanan yang dipilih bersama mitra.

### 5.2 Penerima manfaat

Pasien dan pendamping yang secara sah diberi izin menerima ringkasan konsultasi.

### 5.3 Pengelola dan calon pembeli

Pengelola fasilitas kesehatan atau jaringan layanan menjadi calon pengambil keputusan penerapan. Tim teknologi informasi mitra menjadi pihak penting dalam penentuan integrasi, keamanan, dan operasional.

### 5.4 Pembagian kewenangan

| Peran | Kewenangan yang diusulkan |
|---|---|
| Dokter | Memeriksa, mengubah, dan mengesahkan isi klinis serta ringkasan pasien |
| Petugas berwenang | Memilih kunjungan dan memverifikasi identitas sesuai kewenangan yang diberikan |
| Pasien | Memberi atau menolak persetujuan perekaman dan pengiriman ringkasan |
| Pendamping | Menerima ringkasan hanya jika ada dasar izin yang sesuai |
| Administrator | Mengelola konfigurasi dan akses tanpa otomatis memiliki akses seluruh isi konsultasi |

Pembagian akhir harus mengikuti alur kerja dan kebijakan mitra, bukan asumsi tim pengembang.

## 6. Konsep Solusi

### 6.1 Prinsip satu konsultasi, dua keluaran

**Keluaran pertama: dokumentasi untuk tenaga kesehatan.** Informasi disusun secara terstruktur sesuai kebutuhan pencatatan mitra.

**Keluaran kedua: ringkasan untuk pasien.** Isi klinis yang sudah disahkan disajikan kembali menggunakan bahasa yang lebih sederhana tanpa mengubah makna.

Kedua keluaran harus berasal dari informasi yang konsisten. Perubahan pada catatan klinis setelah persetujuan harus memicu pemeriksaan ulang ringkasan yang terdampak.

### 6.2 Peran AI

AI digunakan untuk transkripsi, pengenalan peran pembicara, ekstraksi informasi, penyusunan draf, dan penyederhanaan bahasa. AI tidak diberi kewenangan untuk menetapkan keputusan klinis secara mandiri.

### 6.3 Prinsip pengesahan

Otomatisasi berlangsung setelah pemeriksaan yang diperlukan. Draf AI bukan rekam medis final, bukan resep final, dan bukan pesan yang boleh langsung dikirim tanpa persetujuan.

### 6.4 Informasi yang tidak tersedia

Sistem harus membedakan:

- **Tidak disebutkan:** percakapan tidak memuat informasi tersebut.
- **Tidak jelas:** informasi terdengar atau terbaca ambigu.
- **Disangkal:** pembicara secara eksplisit menyatakan kondisi tidak ada.
- **Perlu konfirmasi:** terdapat ketidaksesuaian atau informasi belum lengkap.

Sebagai contoh, tidak adanya pembahasan alergi tidak boleh ditulis sebagai “pasien tidak memiliki alergi”.

## 7. Alur Penggunaan

1. **Pemilihan kunjungan.** Petugas memilih pasien dan kunjungan yang sesuai. Identitas tidak ditentukan hanya berdasarkan pengenalan suara.
2. **Persetujuan.** Tujuan perekaman dan penggunaan data dijelaskan. Persetujuan perekaman dipisahkan dari izin pengiriman ringkasan.
3. **Perekaman konsultasi.** Perekaman dapat dihentikan atau dijeda. Penolakan perekaman tidak boleh menghalangi pelayanan melalui alur biasa.
4. **Transkripsi.** Sistem mengubah audio menjadi teks dan menandai bagian yang kurang jelas. Pemisahan pembicara digunakan jika hasilnya memadai; bagian ambigu memerlukan koreksi.
5. **Penyusunan draf.** Informasi dipetakan ke format dokumentasi dengan kutipan sumber dan penanda waktu bila tersedia.
6. **Pemeriksaan dokter.** Dokter mengoreksi kesalahan, melengkapi informasi, dan menyetujui catatan.
7. **Penyimpanan.** Catatan yang disahkan dikirim melalui jalur integrasi yang diizinkan. Kegagalan penyimpanan ditampilkan dengan jelas.
8. **Penyusunan ringkasan pasien.** Ringkasan dibuat dari versi catatan final, lalu diperiksa untuk memastikan makna dan instruksinya tetap benar.
9. **Verifikasi penerima dan pengiriman.** Sistem memeriksa izin serta nomor penerima sebelum mengirim melalui kanal resmi yang disetujui mitra.
10. **Pencatatan status.** Sistem mencatat versi dokumen, pemberi persetujuan, hasil penyimpanan, dan status pengiriman yang benar-benar tersedia dari penyedia layanan.

Apabila konsultasi melibatkan beberapa pembicara, sistem harus mencegah informasi milik pendamping atau anggota keluarga dianggap sebagai kondisi pasien.

## 8. Struktur Informasi

### 8.1 Draf dokumentasi klinis

Format awal yang diusulkan adalah SOAP. Format ini merupakan pilihan rancangan dan dapat disesuaikan dengan formulir mitra.

| Bagian | Isi | Batas pengisian |
|---|---|---|
| Subjective | Keluhan, durasi, riwayat yang disampaikan, alergi yang dibahas | Bedakan pernyataan pasien, pendamping, dan riwayat keluarga |
| Objective | Temuan pemeriksaan atau hasil penunjang | Hanya dari informasi yang disebutkan atau sumber terverifikasi yang diizinkan |
| Assessment | Asesmen atau diagnosis dokter | Pertahankan status dugaan, diagnosis kerja, atau konfirmasi sebagaimana disahkan dokter |
| Plan | Terapi, instruksi, pemeriksaan lanjutan, kontrol | Tidak menambah tindakan atau aturan obat berdasarkan dugaan AI |

Data identitas dan kunjungan berasal dari pemilihan pasien atau sistem mitra. Bagian objektif yang tidak tersedia tidak boleh diisi dengan nilai normal bawaan.

### 8.2 Ringkasan pasien

| Komponen | Isi yang diusulkan |
|---|---|
| Informasi kunjungan | Informasi minimum untuk mengenali konsultasi tanpa membuka data berlebihan |
| Kesimpulan konsultasi | Penjelasan dokter yang telah disetujui, termasuk ketidakpastian diagnosis |
| Instruksi obat | Hanya instruksi lengkap yang cocok dengan catatan atau resep final terverifikasi |
| Anjuran | Tindakan yang disetujui dokter |
| Hal yang perlu dihindari | Pantangan atau larangan hanya jika memang diberikan |
| Pemeriksaan dan kontrol | Rencana yang sudah ditetapkan |
| Tanda bahaya | Hanya arahan yang telah disetujui dokter |
| Kontak layanan | Kanal fasilitas kesehatan yang disepakati untuk pertanyaan lanjutan |

Ringkasan tidak harus memiliki semua komponen. Ketiadaan informasi bukan alasan untuk menghasilkan rekomendasi baru.

### 8.3 Contoh struktur pesan

Contoh berikut adalah struktur komunikasi, bukan nasihat medis atau keluaran konsultasi nyata.

```text
Ringkasan konsultasi Anda

Fasilitas: [nama fasilitas]
Tanggal: [tanggal konsultasi]

Kesimpulan dokter:
[isi yang telah disahkan]

Anjuran:
[instruksi yang telah disahkan]

Hal yang perlu dihindari:
[ditampilkan hanya jika tersedia]

Rencana tindak lanjut:
[pemeriksaan atau kontrol yang disetujui]

Untuk pertanyaan, hubungi [kanal resmi fasilitas].
Pesan ini merupakan ringkasan konsultasi, bukan layanan diagnosis otomatis.
```

Untuk informasi sensitif, alternatif rancangan adalah notifikasi WhatsApp yang mengarah ke ringkasan melalui akses berautentikasi. Tautan saja tanpa pengendalian akses tidak dianggap sebagai perlindungan yang memadai.

## 9. Ruang Lingkup MVP

### 9.1 Fitur yang diprioritaskan

| Fitur | Hasil minimum |
|---|---|
| Pemilihan pasien dan kunjungan | Setiap rekaman terikat pada kunjungan yang benar |
| Persetujuan dan kendali rekaman | Perekaman tidak berjalan tanpa persetujuan yang dicatat |
| Transkripsi | Teks dapat diperiksa dan diperbaiki |
| Struktur catatan | Draf mengikuti satu format yang disepakati |
| Keterlacakan | Informasi hasil ekstraksi dapat ditelusuri ke kutipan sumber; tambahan dokter diberi asal yang berbeda |
| Penanda ketidakjelasan | Bagian ambigu tidak disajikan sebagai fakta pasti |
| Review dan pengesahan | Catatan belum final sebelum disetujui |
| Integrasi terbatas | Satu jalur penyimpanan atau ekspor yang telah disepakati |
| Ringkasan pasien | Berasal dari catatan final dan disetujui sebelum dikirim |
| Pengiriman | Penerima terverifikasi, status kegagalan terlihat, pengiriman ganda dicegah |
| Catatan audit | Perubahan, persetujuan, dan pengiriman dapat ditelusuri |

### 9.2 Fitur di luar MVP

- Diagnosis atau rekomendasi terapi mandiri.
- Pembuatan resep otomatis tanpa pengesahan dokter.
- Chatbot konsultasi medis lanjutan.
- Integrasi serentak ke seluruh produk SIMRS.
- Integrasi langsung ke seluruh platform kesehatan nasional.
- Dukungan semua spesialisasi dan seluruh bahasa daerah.
- Pelatihan model dasar dari awal.
- Klaim peningkatan hasil klinis tanpa penelitian.

Bahasa Indonesia menjadi fokus awal yang diusulkan. Percakapan campuran bahasa daerah tetap perlu masuk pengujian risiko, meskipun dukungan penuh belum dijanjikan.

## 10. Rancangan Teknis Tingkat Tinggi

### 10.1 Komponen

1. **Antarmuka konsultasi:** pemilihan kunjungan, persetujuan, perekaman, dan pemeriksaan draf.
2. **Layanan transkripsi:** konversi audio menjadi teks dengan penanda waktu jika tersedia.
3. **Pemrosesan informasi:** ekstraksi ke struktur data yang dibatasi dan pemeriksaan kelengkapan.
4. **Pemeriksaan manusia:** koreksi, peninjauan sumber, dan pengesahan.
5. **Penghubung sistem mitra:** pemetaan kolom serta pengiriman data melalui akses resmi.
6. **Penyusun ringkasan:** penyederhanaan catatan final menjadi bahasa pasien.
7. **Layanan pengiriman:** verifikasi penerima, pengiriman resmi, dan penanganan kegagalan.
8. **Penyimpanan dan audit:** pengendalian akses, versi dokumen, serta kebijakan retensi.

### 10.2 Prinsip implementasi

Pemilihan model dan teknologi belum ditetapkan. Model harus dipilih berdasarkan pengujian rekaman representatif, bukan hanya popularitas atau skor umum.

Implementasi awal mengutamakan komponen yang sudah tersedia. Transkripsi setelah konsultasi dapat digunakan terlebih dahulu jika sudah memenuhi kebutuhan. Tampilan transkripsi langsung hanya ditambahkan jika manfaatnya terbukti dalam alur kerja mitra.

Keluaran model diperiksa terhadap struktur data yang diizinkan. Teks transkrip diperlakukan sebagai data, bukan instruksi yang dapat mengubah aturan sistem atau memicu tindakan eksternal. Nilai keyakinan yang dibuat model tidak boleh dianggap sebagai ukuran kepastian klinis tanpa validasi.

### 10.3 Status proses

Sistem membedakan status perekaman, pemrosesan, draf, menunggu pemeriksaan, disahkan, tersimpan, menunggu pengiriman, terkirim, dan gagal. Catatan klinis dan pengiriman pesan memiliki status terpisah agar satu keberhasilan tidak menutupi kegagalan yang lain.

Jika catatan final berubah setelah ringkasan dibuat, ringkasan lama ditandai tidak berlaku untuk pengiriman baru. Jika sudah terkirim, mekanisme koreksi mengikuti kebijakan mitra dan tidak menghapus riwayat secara diam-diam.

## 11. Strategi Integrasi Sistem Mitra

Istilah SIMRS digunakan sebagai acuan awal sesuai ide proyek. Produk yang digunakan mitra bisa berupa SIMRS, sistem informasi klinik, atau aplikasi rekam medis elektronik lainnya. Bentuk sebenarnya harus dikonfirmasi.

Urutan pendekatan yang diusulkan:

1. Gunakan API atau mekanisme integrasi resmi jika tersedia.
2. Gunakan fasilitas impor atau ekspor terstruktur yang disetujui mitra jika API belum tersedia.
3. Gunakan sandbox atau formulir simulasi untuk pembuktian awal apabila akses integrasi belum diberikan.

Pengisian otomatis berbasis antarmuka tidak menjadi pilihan awal karena bergantung pada bentuk tampilan dan izin penggunaan. Tidak ada penulisan ke data produksi tanpa pengujian, persetujuan, dan batas akses yang jelas.

Pengujian harus memverifikasi pasien, kunjungan, kolom tujuan, serta isi yang benar-benar tersimpan. Sistem juga perlu mencegah pengiriman ulang menghasilkan catatan ganda. Integrasi sandbox harus dilaporkan sebagai sandbox, bukan sebagai integrasi produksi.

## 12. Keselamatan, Privasi, dan Tata Kelola

Bagian ini merupakan persyaratan rancangan awal, bukan pernyataan bahwa produk telah memenuhi seluruh ketentuan hukum atau standar pelayanan kesehatan.

### 12.1 Keselamatan informasi klinis

- Pertahankan negasi, seperti “tidak mengalami” atau “tidak memiliki”.
- Pisahkan riwayat pasien dari riwayat keluarga.
- Pertahankan tingkat kepastian diagnosis.
- Jangan menebak nama obat, dosis, satuan, frekuensi, atau durasi.
- Jangan menambahkan pantangan berdasarkan nama penyakit saja.
- Tampilkan informasi yang saling bertentangan untuk diselesaikan dokter.
- Hindari pengiriman otomatis ketika isi penting masih tidak jelas.
- Jangan menjadikan ringkasan pengganti resep atau instruksi resmi yang seharusnya digunakan pasien.

### 12.2 Persetujuan dan penerima

Persetujuan harus menjelaskan tujuan perekaman, pemrosesan, penyimpanan, dan pengiriman. Izin mengirim kepada pasien dibedakan dari izin mengirim kepada anggota keluarga. Nomor WhatsApp tidak otomatis membuktikan identitas atau kewenangan penerima.

### 12.3 Pengelolaan data

- Batasi data yang dikumpulkan pada kebutuhan pelayanan dan pengujian yang disetujui.
- Terapkan pengendalian akses berdasarkan peran dan prinsip hak akses minimum.
- Lindungi data saat dikirim dan disimpan.
- Tetapkan retensi audio, transkrip, dan catatan bersama mitra; jangan menyimpan audio tanpa batas.
- Hindari memasukkan isi konsultasi atau kredensial ke log teknis umum.
- Jangan memakai data pasien untuk pelatihan model tanpa dasar dan persetujuan yang sesuai.
- Evaluasi lokasi pemrosesan, retensi, dan penggunaan data oleh penyedia AI maupun pengiriman pesan.
- Siapkan prosedur penanganan insiden dan permintaan terkait data sesuai tanggung jawab masing-masing pihak.

### 12.4 Peninjauan sebelum penggunaan nyata

Kesesuaian dengan ketentuan perlindungan data pribadi, rekam medis, kebijakan fasilitas, dan kebijakan penyedia WhatsApp harus ditinjau menggunakan sumber resmi serta pihak yang berwenang sebelum penerapan. Persetujuan pasien saja tidak dianggap menyelesaikan seluruh kewajiban tersebut.

## 13. Nilai Pembeda dan Posisi Inovasi

Nilai pembeda yang diusulkan bukan sekadar penggunaan voice-to-text atau pengiriman WhatsApp, melainkan:

1. **Dua keluaran yang konsisten:** dokumentasi klinis dan ringkasan pasien berasal dari informasi yang telah disahkan.
2. **Keterlacakan informasi:** dokter dapat meninjau sumber kutipan tanpa harus membaca ulang seluruh transkrip.
3. **Pengelolaan ketidakpastian:** sistem membedakan informasi tidak disebutkan, disangkal, ambigu, dan perlu dikonfirmasi.
4. **Kesesuaian alur kerja lokal:** format catatan, bahasa, serta integrasi ditentukan bersama mitra.
5. **Evaluasi klinis yang terarah:** pengujian menilai kesalahan penting, bukan hanya kelancaran kalimat.

Klaim bahwa produk merupakan yang pertama, paling akurat, atau lebih unggul daripada produk lain belum dapat dibuat. Kajian pembanding dan pengukuran diperlukan terlebih dahulu.

Untuk memperkuat aspek deeptech, tim perlu menunjukkan tantangan teknis yang benar-benar ditangani dan bukti hasil pengujiannya. Penggabungan beberapa API saja tidak dijadikan bukti kebaruan ilmiah.

## 14. Rencana Validasi dan Evaluasi

### 14.1 Validasi kebutuhan

Wawancara awal diarahkan untuk menjawab:

- Siapa yang mencatat anamnesis dan pada tahap apa pencatatan dilakukan?
- Kolom apa yang paling sering terlambat, kosong, atau perlu disalin ulang?
- Berapa waktu dokumentasi pada alur saat ini?
- Apakah perekaman diterima oleh tenaga kesehatan dan pasien?
- Apakah mitra mempunyai sandbox, API, atau format impor?
- Apakah pasien membutuhkan pesan lengkap atau akses ke ringkasan?
- Siapa yang memeriksa ringkasan dan bertanggung jawab atas koreksi?

### 14.2 Data pengujian

Pengujian awal menggunakan konsultasi simulasi yang ditinjau tenaga kesehatan. Skenario mencakup suara bertumpuk, istilah medis, bahasa campuran, riwayat keluarga, negasi, koreksi ucapan, serta instruksi yang tidak lengkap.

Penggunaan data pasien nyata hanya dilakukan setelah persetujuan dan tata kelola yang diperlukan tersedia. Data untuk pengembangan dipisahkan dari data evaluasi akhir agar hasil tidak hanya mencerminkan skenario yang sudah dihafal sistem.

### 14.3 Indikator evaluasi

| Indikator | Cara penilaian | Makna |
|---|---|---|
| Waktu dokumentasi | Bandingkan alur manual dengan seluruh waktu review, koreksi, dan penyimpanan berbantuan AI | Menilai manfaat bersih, bukan hanya kecepatan transkripsi |
| Kelengkapan catatan | Bandingkan dengan catatan acuan yang disusun tenaga kesehatan | Menilai informasi relevan yang tercatat dan terlewat |
| Kesalahan klinis penting | Tinjau diagnosis, negasi, identitas, alergi, serta rincian obat | Menilai kesalahan yang berpotensi mengubah makna |
| Informasi tanpa dasar | Periksa fakta yang tidak terdapat pada sumber sah | Menilai penambahan informasi oleh model |
| Ketepatan sumber | Cocokkan isi draf dengan kutipan atau masukan dokter | Menilai kegunaan keterlacakan |
| Konsistensi ringkasan | Bandingkan ringkasan pasien dengan catatan final | Menilai perubahan atau kehilangan makna |
| Pemahaman pasien | Minta peserta menjelaskan kembali instruksi dengan rubrik yang sama | Menilai pemahaman, bukan sekadar status pesan |
| Keandalan integrasi | Periksa hasil penyimpanan, kegagalan, dan percobaan ulang | Menilai ketepatan serta pencegahan duplikasi |
| Biaya dan waktu proses | Catat pemakaian layanan dan durasi pada skenario uji | Menilai kelayakan operasional awal |

Target numerik ditentukan setelah baseline tersedia dan disepakati mitra. Hasil simulasi tidak digeneralisasi sebagai bukti keberhasilan pada seluruh pasien atau fasilitas.

### 14.4 Syarat minimum sebelum pilot terbatas

- Draf tidak bisa menjadi catatan final tanpa pengesahan.
- Ringkasan tidak dapat dikirim tanpa pemeriksaan, izin, dan penerima yang sesuai.
- Informasi ambigu pada unsur klinis penting memerlukan penyelesaian sebelum finalisasi.
- Semua skenario uji keselamatan yang disepakati telah dijalankan dan temuan kritis ditangani.
- Perubahan catatan dapat ditelusuri.
- Kegagalan layanan tidak menghilangkan catatan yang telah disimpan atau memaksa penggunaan hasil yang belum lengkap.
- Mitra menyetujui ruang lingkup, penanggung jawab, dan prosedur penghentian pilot.

Kelulusan pengujian terbatas bukan jaminan tidak adanya kesalahan pada penggunaan berikutnya.

## 15. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi awal |
|---|---|---|
| Audio tidak jelas | Informasi hilang atau salah | Uji perangkat dan lingkungan; sediakan koreksi manual |
| Pembicara tertukar | Riwayat keluarga dianggap kondisi pasien | Label pembicara dan penanda ambigu; pemeriksaan sumber |
| AI menambah fakta | Catatan atau instruksi menyesatkan | Ekstraksi terbatas, sumber bukti, dan pengesahan dokter |
| Review terlalu lama | Manfaat efisiensi tidak tercapai | Ukur waktu total; sederhanakan tampilan dan ruang lingkup |
| API tidak tersedia | Integrasi terhambat | Sepakati ekspor atau sandbox tanpa klaim produksi |
| Salah pasien atau nomor | Kebocoran informasi dan kesalahan dokumentasi | Verifikasi kunjungan serta penerima sebelum tindakan |
| Layanan AI atau jaringan gagal | Dokumentasi tertunda | Pertahankan alur manual; tampilkan kegagalan secara jelas |
| Pengiriman berulang | Pesan atau catatan ganda | Identitas transaksi, pencatatan status, dan percobaan ulang terkendali |
| Catatan berubah setelah pesan dikirim | Pasien menerima informasi lama | Versi dokumen dan prosedur koreksi yang disetujui mitra |
| Penyimpanan berlebihan | Paparan data meningkat | Retensi terbatas dan pembatasan akses |
| Ringkasan dianggap konsultasi baru | Pasien mengandalkan pesan di luar konteks | Jelaskan cakupan pesan dan kanal layanan resmi |

## 16. Tahapan Pengembangan

### 16.1 Tahap pertama: penyelarasan masalah

Konfirmasi mitra, pengguna, formulir, kebutuhan perekaman, serta akses integrasi. Luaran: satu alur prioritas, contoh formulir tanpa data sensitif, dan daftar kebutuhan yang disepakati.

### 16.2 Tahap kedua: purwarupa alur inti

Bangun perekaman, transkripsi, draf terstruktur, sumber kutipan, dan review dokter. Luaran: satu konsultasi simulasi dapat diproses sampai catatan disahkan.

### 16.3 Tahap ketiga: ringkasan dan integrasi terbatas

Tambahkan ringkasan pasien, pemeriksaan isi, verifikasi penerima, integrasi sandbox, serta pengiriman melalui kanal yang diizinkan. Jika akses pengiriman nyata belum siap, nyatakan status simulasi secara terbuka.

### 16.4 Tahap keempat: pengujian dan perbaikan

Uji skenario normal serta kegagalan. Ukur manfaat dan kesalahan, perbaiki temuan, lalu dokumentasikan batas kemampuan.

### 16.5 Tahap kelima: demonstrasi dan kesiapan pilot

Siapkan demonstrasi lengkap, bukti hasil evaluasi, batas ruang lingkup, dan rencana penerapan bersama mitra. Jangan menggunakan data pasien nyata dalam demonstrasi publik tanpa dasar izin yang sesuai.

## 17. Potensi Hilirisasi

Calon pelanggan adalah fasilitas kesehatan atau jaringan layanan yang memiliki kebutuhan dokumentasi dan kesiapan integrasi. Model bisnis awal dapat dievaluasi sebagai langganan per fasilitas, per tenaga kesehatan, atau berdasarkan penggunaan. Pilihan tersebut masih hipotesis, bukan keputusan harga.

Biaya yang perlu dihitung meliputi pemrosesan audio, model bahasa, penyimpanan, pengiriman pesan, integrasi, serta dukungan operasional. Kelayakan bisnis dinilai dari manfaat yang diakui mitra dibandingkan biaya keseluruhan, bukan semata-mata biaya API.

Tahap awal hilirisasi berfokus pada satu mitra dengan proses yang terukur. Perluasan dilakukan setelah manfaat, keselamatan, dan kebutuhan dukungan dapat dibuktikan.

## 18. Hal yang Masih Harus Diputuskan

| Keputusan | Status awal | Pihak yang perlu dilibatkan |
|---|---|---|
| Identitas dan kesiapan mitra | Belum terverifikasi | Panitia dan calon mitra |
| Jenis layanan prioritas | Diusulkan satu alur rawat jalan | Tenaga kesehatan mitra |
| Format dokumentasi | SOAP sebagai rancangan awal | Dokter dan pengelola rekam medis |
| Produk sistem informasi | Belum diketahui | Tim teknologi informasi mitra |
| Akses integrasi | Belum tersedia dalam konteks pembahasan | Mitra dan penyedia sistem |
| Perangkat dan lokasi pemrosesan | Belum ditetapkan | Tim teknis dan pengelola data |
| Model transkripsi dan bahasa | Dipilih setelah pengujian | Tim teknis serta evaluator klinis |
| Isi pesan atau tautan berautentikasi | Perlu keputusan berbasis sensitivitas data | Mitra dan perwakilan pengguna |
| Retensi dan persetujuan | Belum ditetapkan | Mitra dan pihak tata kelola terkait |
| Target kinerja | Menunggu baseline | Tim dan mitra |
| Nama produk serta harga | Belum ditetapkan | Tim dan calon pengguna |

## 19. Pernyataan Posisi Proyek

> **Satu konsultasi, dua keluaran tervalidasi: catatan klinis terstruktur untuk tenaga kesehatan dan panduan tindak lanjut yang mudah dipahami pasien.**

Keberhasilan proyek dinilai dari kemampuannya mengurangi beban dokumentasi tanpa mengorbankan ketepatan informasi, sekaligus menyediakan ringkasan yang konsisten dengan keputusan dokter. Prioritas pengembangan adalah alur yang aman, sederhana, dan dapat diuji bersama mitra, bukan banyaknya fitur.

## 20. Dasar Penyusunan dan Batas Verifikasi

Dokumen ini menggabungkan gagasan awal pengguna, evaluasi konseptual, dan pedoman kompetisi yang telah dibaca. Bagian rancangan, ruang lingkup MVP, mitigasi, serta metode evaluasi merupakan usulan pengembangan; bukan ketentuan resmi panitia atau hasil uji yang telah dilakukan.

Acuan pedoman yang digunakan adalah bagian 7 dan 7.2. Situs resmi kompetisi, https://playit.polinema.ac.id/, belum berhasil diakses melalui alat penelusuran pada pembahasan awal. Karena itu, identitas mitra dan informasi situs tidak diperlakukan sebagai fakta terverifikasi.

Dokumen ini merupakan dasar diskusi dan pengembangan, bukan proposal final sesuai seluruh batas halaman dan format pengumpulan kompetisi.

## Sources

[1] file:///C:/Users/pradi/Downloads/Buku%20Pedoman%20Peserta%20-%20PLAY%20IT%20Hackathon%20DeepTech%202026.pdf — Buku Pedoman Peserta - PLAY IT Hackathon DeepTech 2026

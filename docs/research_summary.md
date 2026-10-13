# Research Summary: SIMRS, Dokumentasi Klinis, AI Scribe, Privasi

Tanggal: 2026-10-12
Cakupan: global + Indonesia
Korpus: 34 artikel/sumber ilmiah; 30 awal + 4 tambahan karena argumen privasi, AI, OpenNotes, dan WhatsApp perlu dilengkapi.

## 1. Metode pencarian

- Pencarian berbasis topik: SIMRS/EMR/EHR, implementasi nasional, beban dokumentasi, AI scribe, clinical summarisation, OpenNotes, discharge communication, WhatsApp, de-identification, SATUSEHAT/FHIR.
- Prioritas tahun 2019–2026. Studi sebelum 2019 dipertahankan jika menjadi bukti dasar yang langsung relevan.
- Prioritas sumber: PubMed/PMC, publisher, arXiv/repository, jurnal Indonesia.
- Setiap URL pada CSV diperiksa dua kali. Kolom `http_check_1`, `http_check_2`, `verification_status` menjadi audit trail.
- PDF yang berhasil diunduh berada di `docs/research_papers/`. Sumber lain tetap memiliki URL artikel pada CSV.

## 2. Temuan utama untuk argumen proyek

### 2.1 Implementasi SIMRS/EMR bukan hanya masalah teknologi

Literatur implementasi menemukan faktor yang saling terkait: governance, kepemimpinan, budaya, keterlibatan pengguna, pelatihan, dukungan, sumber daya, workflow, usability, interoperabilitas, infrastruktur, regulasi, standar, dan pengujian. Studi Indonesia menambahkan masalah koneksi internet, literasi digital, ketergantungan pada kertas, variasi kesiapan antarwilayah, serta implementasi yang didorong kepatuhan regulasi.

Implikasi: sistem harus mengikuti workflow klinis. AI tidak boleh menjadi jalur pintas yang melewati review dan persetujuan dokter.

### 2.2 Beban dokumentasi nyata

Beban EHR berkaitan dengan waktu dokumentasi, usability yang buruk, pekerjaan setelah jam layanan, dan burnout. Studi AI scribe terbaru menunjukkan pengurangan waktu/beban mungkin terjadi, tetapi manfaat tidak seragam dan ketidakakuratan masih muncul. Efisiensi bukan bukti bahwa keluaran aman secara klinis.

Implikasi: ukur waktu membuat catatan, waktu review, koreksi, omission, hallucination, dan insiden; jangan hanya mengukur jumlah dokumen otomatis.

### 2.3 Pasien membutuhkan keluaran yang lebih sederhana

Studi komunikasi pulang menunjukkan pasien sering tidak memahami atau mengingat diagnosis, perubahan obat, dosis, durasi, follow-up, dan tanda bahaya. Intervensi tertulis dan komunikasi terstruktur membantu. Namun studi AI discharge instruction menemukan bahwa AI bisa menghilangkan tindakan penting atau menambahkan risiko baru.

Implikasi: keluaran pasien harus berupa instruksi yang disahkan dokter, bahasa sederhana, terstruktur, dan dapat dikonfirmasi melalui teach-back. WhatsApp hanya kanal pengiriman; bukan rekam medis utama.

### 2.4 Catatan klinis tidak otomatis menjadi dokumen pasien

OpenNotes menunjukkan akses pasien dapat meningkatkan pemahaman, kontrol, recall, dan deteksi kesalahan. Risiko tetap ada: bingung, cemas, salah tafsir istilah, masalah proxy access, dan privasi. Karena itu, transparansi tidak berarti semua catatan internal dibagikan tanpa klasifikasi.

Implikasi desain:

- Catatan internal: SOAP/CPPT/RME, analisis klinis, diagnosis, differential diagnosis, pertimbangan, observasi, dan histori lengkap; akses berbasis peran.
- Resume medis: ringkasan resmi sesuai template fasilitas; dibuat setelah data final dan approval dokter.
- Ringkasan/instruksi pasien: diagnosis yang telah dikonfirmasi bila memang perlu disampaikan, obat, cara minum, pantangan/anjuran, follow-up, tanda bahaya; bahasa umum; tanpa analisis internal yang tidak perlu.
- Resep/dokumen obat: hanya memformat instruksi obat yang telah diisi dan disahkan dokter; AI tidak boleh menentukan obat, dosis, frekuensi, atau durasi.
- WhatsApp: kanal komunikasi dengan consent, akun/fasilitas resmi, audit pengiriman, dan aturan retensi; salinan resmi tetap berada pada sistem fasilitas.

## 3. Alur produk yang disarankan

1. Audio konsultasi masuk.
2. Transkripsi lokal/terkendali.
3. Consent, klasifikasi data, dan de-identifikasi sebelum LLM.
4. LLM merapikan transkrip menjadi draft berbasis bukti; setiap field memiliki sumber atau status kosong.
5. Dokter/asisten meninjau; dokter mengisi informasi yang belum disebut, khususnya obat dan instruksi.
6. Dokter menyetujui versi final.
7. Sistem memilih output berdasarkan template yang tersedia; tidak langsung menebak antara resume dan catatan konsultasi.
8. Generate resume resmi atau catatan konsultasi internal.
9. Generate ringkasan/instruksi pasien terpisah.
10. Dokter menyetujui keluaran pasien.
11. Kirim pesan melalui kanal resmi.
12. Generate dokumen obat/resep dari data yang sudah disahkan; tidak membuat keputusan klinis baru.
13. Simpan audit trail: sumber audio/transkrip, versi draft, perubahan reviewer, approver, waktu, template, dan status pengiriman.

### Aturan template

Jika template resume tersedia dan dipilih dokter/fasilitas, auto-generate resume. Jika tidak tersedia, sistem berhenti pada draft terstruktur dan meminta pemilihan jenis dokumen. Jangan menganggap auto-fill sebagai resume atau catatan konsultasi secara otomatis.

## 4. Guardrail privasi sebelum LLM

Minimum pipeline:

1. Pisahkan data identitas dari isi klinis.
2. Deteksi nama pasien, NIK/nomor rekam medis, nomor telepon, alamat, tanggal lahir, email, nama dokter, nama fasilitas, nomor izin, dan identitas keluarga.
3. Ganti dengan token kategori seperti `[PATIENT]`, `[MRN]`, `[PHONE]`, `[CLINIC]`, bukan data palsu yang dapat tertukar sebagai fakta.
4. Terapkan rule/regex/dictionary + NER; lakukan pemeriksaan kedua berbasis allowlist/denylist.
5. Jalankan fail-closed: jika confidence rendah atau ada identifier tersisa, jangan kirim ke LLM.
6. Jangan kirim audio mentah, mapping token-identitas, atau database identitas ke LLM pihak ketiga.
7. Simpan mapping hanya di lingkungan fasilitas dengan enkripsi, access control, retention, dan audit log.
8. Setelah respons LLM, validasi tidak ada token bocor, identitas muncul kembali, obat/dosis berubah, fakta baru ditambahkan, atau informasi penting hilang.
9. Dokter tetap menjadi approver; de-identifikasi bukan pengganti consent, perjanjian pemrosesan data, dan penilaian hukum fasilitas.

Catatan: de-identification tidak sama dengan anonimisasi sempurna. Evaluasi recall identifier, precision, false negative, over-scrubbing, dan re-identification risk pada data lokal Bahasa Indonesia.

## 5. Masalah nyata yang wajib diuji

- Internet tidak stabil; sistem harus memiliki queue/offline-safe tanpa kehilangan data.
- Staff belum siap; perlu pelatihan dan dukungan, bukan hanya deployment.
- Sistem lokal dan SATUSEHAT dapat berbeda format; mapping FHIR/terminologi memerlukan validasi.
- Data tidak lengkap/tidak konsisten menyebabkan penolakan integrasi.
- WhatsApp cepat tetapi berisiko menjadi rekam medis tidak resmi, tersebar di perangkat pribadi, dan sulit diaudit.
- LLM dapat berhalusinasi, menghilangkan informasi, atau menambah instruksi.
- Pasien dapat salah memahami bahasa medis; sediakan format sederhana dan konfirmasi pemahaman.
- Resume medis, catatan konsultasi, ringkasan pasien, resep, dan pesan WhatsApp memiliki tujuan serta tingkat akses berbeda.

## 6. File pendukung

- `research_papers.csv`: daftar artikel, topik, link, status PDF, dua pemeriksaan HTTP.
- `research_metadata.json`: metadata terstruktur.
- `research_papers/`: PDF yang berhasil diunduh; artikel lain tersedia melalui link CSV.
- `research_search_results.json`: hasil pencarian mentah untuk audit lanjutan.

## 7. Batas interpretasi

Riset ini mendukung argumen desain, bukan opini hukum final. Hak akses rekam medis, pengiriman WhatsApp, retensi, consent, dan kewenangan dokumen harus dikonfirmasi dengan dokter penanggung jawab, pengelola rekam medis, DPO/petugas perlindungan data, dan penasihat hukum fasilitas kesehatan berdasarkan regulasi Indonesia yang berlaku.

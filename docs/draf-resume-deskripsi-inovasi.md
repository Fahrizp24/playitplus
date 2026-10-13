# Draf resume dan deskripsi inovasi

Judul kerja: Asisten Dokumentasi Konsultasi dan Ringkasan Tindak Lanjut Pasien Berbasis AI
Tema: Digitalisasi AI Bidang Kesehatan

## Resume

Dua masalah muncul pada satu kejadian yang sama, yaitu konsultasi rawat jalan. Dokter mencatat anamnesis secara manual sehingga waktu konsultasi terpakai untuk menulis dan format catatan antar dokter tidak seragam. Beban dokumentasi klinis telah dikaji dalam berbagai penelitian, tetapi cara mengukurnya belum seragam [1]. Di sisi lain pasien keluar dari ruang periksa membawa instruksi lisan yang mudah terlupakan. Pada studi instalasi gawat darurat, lembar instruksi yang panjang membuat pasien sulit menemukan informasi obat dan jadwal kontrol [2]. Temuan tersebut berasal dari luar negeri dan kami pakai sebagai dasar pengujian, bukan sebagai bukti kondisi mitra.

Solusi kami memperlakukan keduanya sebagai satu alur. Percakapan direkam setelah pasien menyetujui, lalu sistem menyusun draf catatan klinis terstruktur. Setiap butir catatan ditautkan ke kutipan percakapan, dan bagian yang tidak disebutkan atau ambigu diberi tanda agar dokter tidak membacanya sebagai hasil pemeriksaan normal. Dokter mengoreksi dan mengesahkan catatan. Ringkasan tindak lanjut untuk pasien dibuat dari catatan yang sudah disahkan, bukan dari transkrip, sehingga instruksi pasien tidak menyimpang dari keputusan klinis. AI tidak menetapkan diagnosis atau resep.

Pengguna hariannya dokter rawat jalan dan calon pembelinya fasilitas kesehatan. Nilai komersialnya terletak pada pengurangan beban dokumentasi dan tersedianya keluaran pasien yang dapat digunakan dalam alur layanan fasilitas. Proyek dikerjakan melalui perancangan alur, pengembangan purwarupa, pengujian konsultasi simulasi, dan penyempurnaan. Yang kami ukur adalah waktu dokumentasi setelah waktu koreksi draf dihitung, kesalahan pada negasi dan rincian obat, serta kemampuan pasien mengulang instruksi. Purwarupa dibatasi pada satu alur konsultasi dan satu format catatan. Pengiriman ringkasan lewat WhatsApp menjadi target pengembangan berikutnya.

## Deskripsi inovasi

### Masalah

Beban dokumentasi klinis mencakup waktu penggunaan rekam kesehatan elektronik, peninjauan catatan, pekerjaan administratif, gangguan alur kerja, dan pekerjaan setelah jam layanan [1]. Dokter tetap bertanggung jawab atas isi rekam medis, sehingga catatan otomatis yang tidak dapat ditelusuri justru dapat menambah pekerjaan verifikasi. Studi observasional pada 57 dokter rawat jalan menemukan 49,2% waktu kerja digunakan untuk rekam kesehatan elektronik dan pekerjaan meja. Sebanyak 37,0% waktu di ruang pemeriksaan digunakan untuk pekerjaan tersebut [3]. Temuan ini memperkuat urgensi pengembangan solusi dokumentasi yang lebih efisien untuk layanan rawat jalan.

Subtema yang dipilih adalah Digitalisasi AI Bidang Kesehatan. Problem statement proyek ini adalah: bagaimana membantu dokter mengubah percakapan konsultasi menjadi catatan klinis yang terstruktur dan mudah diperiksa, sekaligus menghasilkan instruksi tindak lanjut yang konsisten bagi pasien tanpa mengambil alih keputusan dokter?

Masalah kedua berada di sisi pasien. Instruksi yang disampaikan secara lisan di akhir konsultasi sulit diingat, sedangkan dokumen tertulis yang panjang tidak membantu. Penelitian di instalasi gawat darurat Amerika Serikat menemukan pasien kesulitan menemukan informasi obat dan tindak lanjut pada lembar instruksi panjang, dan ringkasan satu halaman meningkatkan pemahaman mereka [2]. Temuan ini menunjukkan bahwa ringkasan tindak lanjut yang ringkas dan terstruktur layak dikembangkan untuk layanan rawat jalan.

Kedua masalah bersumber dari satu percakapan yang isinya tidak pernah diubah menjadi catatan yang terpercaya sekaligus instruksi yang dapat dibaca ulang. Pengguna hariannya dokter, penerima ringkasannya pasien atau pendamping yang diberi izin, dan calon pelanggannya fasilitas kesehatan.

### Solusi dan keunggulan

Dengan persetujuan perekaman, percakapan dokter dan pasien diubah menjadi transkrip, lalu sistem menyusun draf catatan klinis dalam format yang disepakati fasilitas. Setiap informasi penting ditautkan ke kutipan percakapan. Informasi yang tidak disebutkan, disangkal, atau ambigu ditandai berbeda sehingga ketiadaan data tidak terbaca sebagai temuan normal. Dokter memeriksa, mengoreksi, dan mengesahkan catatan sebelum disimpan ke dalam sistem rekam medis fasilitas.

Dari versi yang disahkan, sistem menyiapkan ringkasan berbahasa sederhana berisi instruksi obat, anjuran, dan jadwal kontrol yang memang diberikan. Ringkasan bukan diagnosis baru dan bukan pengganti rekam medis. Bila catatan berubah, ringkasan diperbarui dan diperiksa ulang. Pengiriman melalui WhatsApp dengan persetujuan pasien dan verifikasi penerima menjadi tahap pengembangan berikutnya.

Transkripsi, draf SOAP, dan ringkasan pasien sudah ada pada berbagai produk. Keunggulan kami terletak pada rantai yang dijaga dari awal sampai akhir: setiap fakta dapat dilacak ke sumbernya, dan instruksi pasien selalu berasal dari catatan yang telah disahkan dokter.

### Target kinerja dan hilirisasi

Pengujian awal memakai konsultasi simulasi dengan satu format catatan. Indikator yang diukur adalah waktu dokumentasi total termasuk koreksi, kelengkapan informasi, kesalahan pada negasi dan rincian obat, jumlah fakta tanpa sumber, konsistensi ringkasan terhadap catatan, dan kemampuan peserta mengulang instruksi. Target awalnya adalah waktu dokumentasi total yang lebih rendah daripada pencatatan manual dengan kesalahan klinis yang tidak meningkat. Hilirisasi diarahkan ke satu fasilitas layanan primer dengan satu alur rawat jalan, lalu diperluas ke fasilitas lain yang memiliki alur serupa. Model bisnis yang dipertimbangkan adalah langganan per fasilitas atau per dokter.

### Tingkat kesiapan teknologi dan dukungan

Tingkat kesiapan teknologi saat ini diperkirakan berada pada TKT 2 menuju TKT 3. Konsep teknologi telah dirumuskan dan didukung literatur tentang beban dokumentasi [1], [3] dan pemahaman instruksi pasien [2]. Tahap berikutnya adalah pembuktian fungsi inti pada konsultasi simulasi. Proyek ini mengajukan penyelesaian problem statement dari panitia pada subtema Digitalisasi AI Bidang Kesehatan. Dukungan mitra formal belum dimiliki pada tahap ini, dan kami membuka kerja sama pilot dengan fasilitas layanan kesehatan primer.

## Daftar pustaka

[1] Moy, A. J., Schwartz, J. M., Chen, R., Sadri, S., Lucas, E., Cato, K. D., dan Zabar, S. “Measurement of clinical documentation burden among physicians and nurses using electronic health records: a scoping review.” Journal of the American Medical Informatics Association, 28(5), 998–1008, 2021. https://doi.org/10.1093/jamia/ocaa325

[2] DeSai, C., dkk. “Empowering patients: simplifying discharge instructions.” BMJ Open Quality, 10, e001419, 2021. https://doi.org/10.1136/bmjoq-2021-001419

[3] Sinsky, C., Colligan, L., Li, L., Prgomet, M., Reynolds, S., Goeders, L., Westbrook, J., Tutty, M., dan Blike, G. “Allocation of Physician Time in Ambulatory Practice: A Time and Motion Study in 4 Specialties.” Annals of Internal Medicine, 165(11), 753–760, 2016. https://doi.org/10.7326/M16-0961

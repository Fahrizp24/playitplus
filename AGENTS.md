# Global Agents Guide — PlayItPlus

Dokumen ini berisi gambaran arsitektur, struktur repositori, standar alur kerja (workflow), serta aturan global untuk setiap AI Agent yang berkontribusi pada proyek **PlayItPlus**.

---

## 1. Status Proyek Saat Ini

> [!NOTE]
> **CATATAN STATUS AKTIF**:
> Saat ini, inisialisasi dan konfigurasi teknis **baru dilakukan untuk bagian `frontend/`**.
> Folder `backend/` dan `docs/` saat ini masih kosong / pending dan akan disetup pada fase berikutnya.

---

## 2. Struktur Repositori Global

```
playitplus/
├── .husky/              # Git hooks global (commit-msg, pre-push)
├── backend/             # Service Backend (Status: Pending / Belum disetup)
├── docs/                # Dokumentasi proyek & arsitektur
├── frontend/            # Aplikasi Frontend (Next.js 16, React 19, Tailwind v4, Bun)
│   ├── .agents/skills/  # Skill agent internal (postcss-px-viewport)
│   ├── app/             # Next.js App Router
│   ├── lib/             # Utility & helpers
│   ├── scripts/         # Skrip validasi & otomasi
│   ├── AGENTS.md        # Panduan spesifik & aturan ketat frontend
│   └── package.json     # Konfigurasi dependency Bun & script
├── .gitignore           # File ignore global Git
├── AGENTS.md            # Panduan global ini
```

---

## 3. Aturan & Standar Global Proyek

### A. Format Pesan Commit (Conventional Commits)
Semua pesan commit **WAJIB** mengikuti spesifikasi [Conventional Commits](https://www.conventionalcommits.org/):
```
<type>(<scope optional>): <deskripsi singkat>
```
- **Type yang diizinkan**:
  - `feat`: Fitur baru untuk pengguna
  - `fix`: Perbaikan bug
  - `docs`: Perubahan atau penambahan dokumentasi
  - `style`: Format kode (tanpa mengubah logika/fungsionalitas)
  - `refactor`: Restrukturisasi kode tanpa menambah fitur atau memperbaiki bug
  - `perf`: Peningkatan performa
  - `test`: Penambahan atau perbaikan unit/integration tests
  - `chore`: Pembaruan build, dependency, konfigurasi repositori
  - `ci`: Konfigurasi CI/CD pipelines
- **Contoh Valid**:
  - `feat(auth): add login with google oauth`
  - `fix(header): correct navbar responsive spacing`
  - `chore(deps): update postcss viewport plugin`
- **Enforcement**: Divalidasi secara otomatis melalui Git hook `commit-msg` menggunakan Commitlint. Pesan commit non-konvensional akan **otomatis ditolak**.

### B. Proteksi Sebelum Push ke Remote (`pre-push`)
Sebelum kode di-push ke remote repository Git, hook `.husky/pre-push` secara otomatis menjalankan tiga tahapan verifikasi:
1. **Validasi Tailwind Desktop Viewport**: Memastikan tidak ada numeric scale bawaan Tailwind di `lg:`, `xl:`, `2xl:` pada frontend.
2. **ESLint**: Memastikan kode frontend bersih dari lint error dan warning.
3. **Production Build**: Memastikan kompilasi frontend (`bun run build`) berhasil tanpa error.

Jika ada salah satu tahapan yang gagal, perintah `git push` akan **dibatalkan**.

### C. Package Manager
- Untuk folder `frontend/`, gunakan selalu **`bun`** (bukan `npm` atau `yarn`).

---

## 4. Panduan Kerja Tiap Folder

| Folder | Status | Panduan Agent |
|---|---|---|
| `frontend/` | **Aktif** | Baca [frontend/AGENTS.md](file:///D:/playitplus/frontend/AGENTS.md) sebelum mengubah atau membuat kode. Patuhi Rule A (arbitrary `[Npx]` pada breakpoint desktop `lg:`, `xl:`, `2xl:`). |
| `backend/` | *Pending* | Belum ada kode. Jangan menambahkan dependensi atau file kecuali diminta secara spesifik oleh user. |
| `docs/` | *Pending* | Dokumentasi pendukung proyek. |

---

## 5. Pedoman AI Agent
1. **Integritas Konfigurasi**: Jangan menghapus atau mengubah konfigurasi `postcss.config.mjs`, `next.config.ts`, atau hook `.husky/` tanpa instruksi eksplisit.
2. **Verifikasi Mandiri**: Sebelum menyelesaikan task frontend, selalu jalankan `bun run validate:lg`, `bun run lint`, dan `bun run build`.
3. **No Hook Bypass**: Jangan menyarankan atau menggunakan opsi `--no-verify` saat commit/push kecuali terjadi kondisi darurat yang diinstruksikan oleh user.

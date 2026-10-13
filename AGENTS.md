# Global Agents Guide — PlayItPlus

Dokumen ini berisi gambaran arsitektur, struktur repositori, standar alur kerja (workflow), serta aturan global untuk setiap AI Agent yang berkontribusi pada proyek **PlayItPlus**.

> [!IMPORTANT]
> Sebelum merencanakan atau mengimplementasikan perubahan, **wajib baca `KONSEP_PROYEK.md`** dan gunakan sebagai pedoman utama kebutuhan, ruang lingkup, batasan, serta alur sistem. Jika instruksi teknis bertentangan dengan konsep proyek, minta klarifikasi sebelum melanjutkan.

---

## 1. Status Proyek Saat Ini

> [!NOTE]
> **CATATAN STATUS AKTIF**:
> - `frontend/`: Aktif (Next.js 16, React 19, Tailwind v4, Bun).
> - `backend/`: Aktif (Scaffold minimal Elysia, Bun — siap diimplementasikan).
> - `docs/`: Aktif (Konsep proyek & jurnal riset klinis).

---

## 2. Struktur Repositori Global

```
playitplus/
├── .husky/              # Git hooks global (commit-msg, pre-push)
├── backend/             # Service Backend (Elysia, Bun)
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
└── package.json         # Root scripts (bun run:frontend, bun run:backend)
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

### C. Package Manager & Menjalankan Proyek
- Gunakan selalu **`bun`** (bukan `npm` atau `yarn`) untuk seluruh repositori (`frontend/` dan `backend/`).
- Dari root direktori proyek, Anda dapat langsung menjalankan:
  - `bun run:frontend` : Menjalankan dev server frontend Next.js (port 3000)
  - `bun run:backend`  : Menjalankan dev server backend Elysia (port 3001)
  - `bun build:frontend` : Melakukan build frontend Next.js
  - `bun build:backend`  : Melakukan build backend Elysia
  - `bun validate:lg`    : Memvalidasi kepatuhan kelas Tailwind desktop arbitrary px

---

## 4. Panduan Kerja Tiap Folder

| Folder | Status | Panduan Agent |
|---|---|---|
| `frontend/` | **Aktif** | Baca [frontend/AGENTS.md](file:///D:/playitplus/frontend/AGENTS.md) sebelum mengubah atau membuat kode. Patuhi Rule A (arbitrary `[Npx]` pada breakpoint desktop `lg:`, `xl:`, `2xl:`). |
| `backend/` | **Aktif (Scaffold)** | Menggunakan Bun + Elysia (`src/index.ts`). Jalankan dengan `bun run dev`. |
| `docs/` | **Aktif** | Dokumentasi pendukung proyek ([KONSEP_PROYEK.md](file:///D:/playitplus/docs/KONSEP_PROYEK.md) & jurnal). |

---

## 5. Pedoman AI Agent
1. **Integritas Konfigurasi**: Jangan menghapus atau mengubah konfigurasi `postcss.config.mjs`, `next.config.ts`, atau hook `.husky/` tanpa instruksi eksplisit.
2. **Verifikasi Mandiri**: Sebelum menyelesaikan task frontend, selalu jalankan `bun run validate:lg`, `bun run lint`, dan `bun run build`.
3. **No Hook Bypass**: Jangan menyarankan atau menggunakan opsi `--no-verify` saat commit/push kecuali terjadi kondisi darurat yang diinstruksikan oleh user.

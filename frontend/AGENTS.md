<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frontend Guidelines & Architecture

Panduan instruksi dan standar teknis untuk AI agent yang bekerja di folder `frontend/`.

---

## 1. Tech Stack & Runtime
- **Package Manager & Runtime**: [Bun](https://bun.sh) (`bun@1.4.2`)
- **Framework**: Next.js 16.4.0 (App Router, Turbopack)
- **UI Library**: React 19.3.0
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + PostCSS 8
- **Scaling Plugin**: `postcss-px-to-viewport-8-plugin` (Design frame: **1920px**)
- **Linting & Code Quality**: ESLint 9, TypeScript 5, Commitlint

---

## 2. Struktur Direktori `frontend/`
```
frontend/
├── app/                  # Next.js App Router (Layouts, Pages, CSS global)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Import Tailwind & CSS variables
├── lib/                  # Shared utilities & helpers
│   └── viewport.ts       # Helper pxToVw() untuk styling inline dinamis
├── public/               # Asset statis (SVG, gambar, icons)
├── scripts/              # Skrip otomasi & validasi
│   └── validate-viewport-classes.mjs  # Validator kepatuhan arbitrary desktop
├── .agents/skills/       # Skill agent bawaan (misal: postcss-px-viewport)
├── next.config.ts        # Konfigurasi Next.js 16
├── postcss.config.mjs    # Konfigurasi PostCSS Tailwind + px-to-viewport
├── commitlint.config.mjs # Konfigurasi Conventional Commits
├── package.json          # Dependency & script npm/bun
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## 3. ATURAN WAJIB: Viewport Scaling (`postcss-px-viewport`)

Project ini menggunakan teknik `postcss-px-to-viewport-8-plugin` untuk menghasilkan UI desktop yang *pixel-perfect* dan skalabel secara proporsional dari 1920px ke layar laptop yang lebih kecil (1366px, 1280px) tanpa JavaScript runtime.

> **Plugin hanya mengonversi unit `px` di hasil kompilasi CSS menjadi `vw`. Unit `rem` TIDAK dikonversi.**

### Rule A — Desktop Layer (`lg:`, `xl:`, `2xl:`)
Setiap nilai *spacing*, *sizing*, dan *typography* **WAJIB menggunakan arbitrary `[Npx]`**:
- ✅ **BENAR**:
  ```html
  <div class="lg:gap-[32px] lg:p-[40px] lg:mt-[50px] lg:w-[500px] lg:h-[300px] lg:text-[24px] lg:leading-[32px]">
  ```
- ❌ **DILARANG KERAS** (numeric scale bawaan Tailwind di `lg:+`):
  ```html
  <div class="lg:gap-6 lg:p-4 lg:mt-2 lg:w-96 lg:h-64 lg:text-base lg:leading-6">
  ```
  *Alasan: Kelas seperti `lg:gap-6` menghasilkan unit `rem` yang beku dan tidak mengecil di laptop 1280/1366px, sehingga merusak proporsi desain.*

- **Pengecualian yang diperbolehkan di desktop (`lg:+`)**:
  - Kelas relatif: `w-full`, `w-1/2`, `flex-1`, `h-screen`, `h-full`, `h-auto`.
  - Utilitas non-px: warna (`lg:text-red-500`), weight (`lg:font-bold`), grid template (`lg:grid-cols-3`), flexbox/alignment.
  - Border radius & width: gunakan arbitrary px jika ≥2px (`lg:rounded-[16px]`, `lg:border-[2px]`). Garis hairline 1px (`border`) tetap terjaga 1px karena `minPixelValue: 1`.

### Rule B — Mobile Layer (base, `sm:`, `md:`)
Gunakan kelas numerik bawaan Tailwind (`w-full`, `p-4`, `gap-4`, `text-base`):
- ✅ **BENAR**:
  ```html
  <div class="w-full text-base p-4 gap-4 lg:w-[600px] lg:text-[20px] lg:p-[32px] lg:gap-[24px]">
  ```
- ❌ **DILARANG**: Menggunakan arbitrary px tanpa prefix breakpoint desktop di mobile layer (`p-[20px]`).

### Inline Styles & Non-Shrinking Elements
1. **Dynamic Inline Styles**: Hindari `style={{ width: '300px' }}` karena tidak melewati PostCSS. Gunakan helper dari `lib/viewport.ts`:
   ```tsx
   import { pxToVw } from '@/lib/viewport';
   <div style={{ width: pxToVw(300) }}>...</div>
   ```
2. **Elemen yang Tidak Boleh Mengecil**: Beri awalan kelas `ignore-` (misal: `ignore-icon w-[24px] h-[24px]`) karena telah didaftarkan pada `selectorBlackList`.

---

## 4. Perintah & Skrip yang Tersedia

Jalankan selalu perintah dengan **`bun`**:
| Perintah | Deskripsi |
|---|---|
| `bun run dev` | Menjalankan server development Next.js (Turbopack) |
| `bun run build` | Melakukan build aplikasi untuk production |
| `bun run lint` | Menjalankan ESLint untuk memeriksa kode |
| `bun run validate:lg` | Memvalidasi kepatuhan arbitrary px pada breakpoint desktop (`lg`, `xl`, `2xl`) |
| `bun run commitlint` | Memeriksa format Conventional Commits secara manual |

---

## 5. Checklist Verifikasi Mandiri Sebelum Menyelesaikan Task

Sebelum menyatakan task selesai di folder frontend:
1. Jalankan `bun run validate:lg` dan pastikan **0 violations**.
2. Jalankan `bun run lint` dan pastikan **0 errors / 0 warnings**.
3. Jalankan `bun run build` dan pastikan build **berhasil**.

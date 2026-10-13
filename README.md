# PlayItPlus

Asisten dokumentasi konsultasi dan ringkasan tindak lanjut pasien berbasis AI. Satu rekaman konsultasi menghasilkan dua keluaran tervalidasi: draf catatan klinis terstruktur (SOAP) untuk tenaga kesehatan dan ringkasan bahasa awam untuk pasien. Detail konsep: `docs/KONSEP_PROYEK.md`.

Alur inti backend: Audio → STT → Deidentifikasi PII → Auto-fill SOAP (dengan kutipan sumber + penanda ketidakpastian). Draf bersifat usulan — final setelah pengesahan dokter.

## Struktur

- `frontend/` — Next.js 16 + React 19 + Tailwind v4 (port 3000)
- `backend/` — Elysia + Bun (port 3001). Provider agnostik vendor via antarmuka OpenAI-compatible (`LLM_*` / `STT_*`), tanpa fallback tersembunyi
- `docs/` — konsep proyek & jurnal riset

## Prasyarat

- `bun@1.4.2`

## Cara run

```bash
# 1. Siapkan env backend
cp backend/.env.example backend/.env

# 2. Install dependency
bun install --cwd frontend
bun install --cwd backend

# 3. Jalan dev (dari root)
bun run:backend    # http://localhost:3001
bun run:frontend   # http://localhost:3000
```

Build / cek:

```bash
bun build:backend
bun build:frontend
bun validate:lg        # validasi kelas Tailwind desktop (frontend)
bun lint:frontend      # eslint frontend
```

## Konfigurasi backend (`backend/.env`)

| Key | Isi |
|---|---|
| `PORT`, `CORS_ORIGIN` | Wajib. Server gagal start kalau kosong/salah |
| `LLM_PROVIDER`, `STT_PROVIDER` | Hanya `mock` atau `unified`. Typo langsung error saat boot |
| `LLM_*` / `STT_*` (`API_KEY`, `BASE_URL`, `MODEL`) | Wajib diisi saat mode `unified`. Contoh `BASE_URL`: OpenRouter `https://openrouter.ai/api/v1`, Groq `https://api.groq.com/openai/v1`, Ollama `http://localhost:11434/v1` |

Mode `mock` untuk demo offline. Mode `unified` memanggil endpoint OpenAI-compatible sesuai `BASE_URL` — ganti vendor cukup ganti env, tanpa ubah kode.

## Endpoint backend

- `GET /` — info API
- `GET /api/consultation/samples` — contoh transkrip untuk testing
- `GET /api/consultation/status` — provider aktif (tanpa membocorkan key)
- `POST /api/consultation/stt` — `audio` (file) → transkrip
- `POST /api/consultation/deidentify` — `text` → teks teranonimasi + entitas PII
- `POST /api/consultation/autofill` — `text` → SOAP
- `POST /api/consultation/process` — `audio` atau `text` → pipeline lengkap

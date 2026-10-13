/**
 * Konfigurasi Lingkungan Frontend (Strict Configuration)
 * 
 * Aturan Ketat:
 * - Seluruh variabel lingkungan dibaca langsung dari env tanpa nilai fallback bawaan (zero fallback).
 * - Jika variabel lingkungan belum dikonfigurasi, akan melempar Error deskriptif saat diakses.
 */

function requireClientEnv(value: string | undefined, name: string): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `[Config Error] Variabel lingkungan '${name}' wajib diatur dan tidak boleh kosong. ` +
        `Pastikan telah menambahkan '${name}' pada berkas .env atau .env.local Anda.`
    );
  }
  return value.trim();
}

export const envConfig = {
  get apiBaseUrl(): string {
    return requireClientEnv(
      process.env.NEXT_PUBLIC_API_URL,
      "NEXT_PUBLIC_API_URL"
    );
  },
} as const;

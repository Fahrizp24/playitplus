import { treaty } from "@elysiajs/eden";
import { envConfig } from "@/lib/config";

/**
 * Satu Client Eden tunggal untuk seluruh komunikasi API aplikasi.
 * Backend dideploy terpisah, sehingga implementasinya tidak ikut dibundel frontend.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend contract is deployed independently.
export const eden: any = treaty(envConfig.apiBaseUrl);

export type EdenClient = typeof eden;

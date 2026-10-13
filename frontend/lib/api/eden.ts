import { treaty } from "@elysiajs/eden";
import type { App } from "@backend/index";
import { envConfig } from "@/lib/config";

/**
 * Satu Client Eden tunggal untuk seluruh komunikasi API aplikasi.
 * Terhubung langsung dengan type definisi backend Elysia (App).
 */
export const eden = treaty<App>(envConfig.apiBaseUrl);

export type EdenClient = typeof eden;

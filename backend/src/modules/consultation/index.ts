import { Elysia, t } from "elysia";
import {
  AudioPresetsResponseSchema,
  AutofillBodySchema,
  ConsultationProcessResultSchema,
  ConsultationQueueResponseSchema,
  ConsultationSamplesResponseSchema,
  DeidentificationResultSchema,
  DeidentifyBodySchema,
  ProcessTextBodySchema,
} from "./model";
import { consultationService } from "./service";

export const consultationController = new Elysia({ prefix: "/api/consultation" })
  // 1. Dapatkan daftar antrean pasien klinis lengkap (dummy queue)
  .get(
    "/queue",
    () => {
      return consultationService.getQueue();
    },
    {
      response: ConsultationQueueResponseSchema,
    }
  )

  // 2. Dapatkan daftar preset suara simulasi
  .get(
    "/presets",
    () => {
      return consultationService.getPresets();
    },
    {
      response: AudioPresetsResponseSchema,
    }
  )

  // 3. Proses preset suara simulasi langsung menghasilkan transkrip & SOAP
  .post(
    "/presets/:id/process",
    ({ params, set }) => {
      try {
        return consultationService.processPreset(params.id);
      } catch (err: any) {
        set.status = 404;
        return { error: err.message || "Preset suara tidak ditemukan." };
      }
    },
    {
      response: {
        200: ConsultationProcessResultSchema,
        404: t.Object({ error: t.String() }),
      },
    }
  )

  // 4. Unduh berkas audio preset
  .get(
    "/presets/:id/audio",
    ({ params, set }) => {
      const bunGlobal = (globalThis as unknown as { Bun?: { file: (path: string) => any } }).Bun;
      if (!bunGlobal) {
        return new Response("Not implemented", { status: 501 });
      }

      const baseName = params.id.replace(/\.(wav|mp3|webm|m4a|ogg)$/i, "");
      const possibleExtensions = [".wav", ".mp3", ".webm", ".m4a", ".ogg"];

      for (const ext of possibleExtensions) {
        const filePath = `src/assets/audio/${baseName}${ext}`;
        const file = bunGlobal.file(filePath);
        if (file && file.size > 0) {
          return file;
        }
      }

      set.status = 404;
      return { error: `Berkas audio untuk preset '${params.id}' tidak ditemukan di 'src/assets/audio/'.` };
    }
  )

  // 5. Dapatkan daftar sample percakapan klinis
  .get(
    "/samples",
    () => {
      return consultationService.getSamples();
    },
    {
      response: ConsultationSamplesResponseSchema,
    }
  )

  // 2. Transkripsi STT Audio Terpisah
  .post(
    "/stt",
    async ({ body, set }) => {
      try {
        const file = (body as any)?.audio;
        if (!file || !(file instanceof Blob)) {
          set.status = 400;
          return { error: "Field 'audio' (file) wajib diisi." };
        }

        const filename = (file as any).name || (file as any).filename;
        if (!filename) {
          set.status = 400;
          return { error: "Nama berkas audio wajib disertakan." };
        }
        return await consultationService.transcribeAudio(file, filename);
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal melakukan transkripsi audio." };
      }
    }
  )

  // 3. Deidentifikasi Terpisah
  .post(
    "/deidentify",
    ({ body, set }) => {
      try {
        return consultationService.deidentify(body.text);
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal melakukan deidentifikasi teks." };
      }
    },
    {
      body: DeidentifyBodySchema,
      response: {
        200: DeidentificationResultSchema,
        500: t.Object({ error: t.String() }),
      },
    }
  )

  // 4. Auto-Fill SOAP Terpisah
  .post(
    "/autofill",
    async ({ body, set }) => {
      try {
        return await consultationService.autoFillSOAP(body.text);
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal mengekstrak catatan SOAP." };
      }
    },
    {
      body: AutofillBodySchema,
    }
  )

  // 5. Full Pipeline: Audio / Text -> STT -> Deidentifikasi -> SOAP
  .post(
    "/process",
    async ({ body, set }) => {
      try {
        const file = (body as any)?.audio;
        const text = (body as any)?.text;

        const result = await consultationService.processPipeline({
          audio: file instanceof Blob ? file : undefined,
          filename: (file as any)?.name,
          text: typeof text === "string" ? text : undefined,
        });

        return result;
      } catch (err: any) {
        set.status = 500;
        return { error: err.message || "Gagal memproses alur konsultasi." };
      }
    },
    {
      response: {
        200: ConsultationProcessResultSchema,
        400: t.Object({ error: t.String() }),
        500: t.Object({ error: t.String() }),
      },
    }
  );

import { Elysia, t } from "elysia";
import {
  AutofillBodySchema,
  ConsultationProcessResultSchema,
  ConsultationSamplesResponseSchema,
  DeidentificationResultSchema,
  DeidentifyBodySchema,
  ProcessTextBodySchema,
} from "./model";
import { consultationService } from "./service";

export const consultationController = new Elysia({ prefix: "/api/consultation" })
  // 1. Dapatkan daftar sample percakapan klinis
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

        const filename = (file as any).name || "recording.webm";
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

import type { eden } from "./api/eden";

/**
 * Tipe-tipe aplikasi diturunkan langsung dari Eden Client (Elysia Backend Schema).
 * Menjamin 100% end-to-end type safety tanpa duplikasi manual.
 */

// 1. Consultation Types
export type ConsultationQueueResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.consultation.queue.get>>["data"]
>;

export type ConsultationQueueItem = ConsultationQueueResponse["queue"][number];

export type ConsultationSamplesResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.consultation.samples.get>>["data"]
>;

export type ConsultationSampleItem = ConsultationSamplesResponse["samples"][number];

export type AudioPresetsResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.consultation.presets.get>>["data"]
>;

export type AudioPresetItem = AudioPresetsResponse["presets"][number];

export type ConsultationProcessResult = NonNullable<
  Awaited<ReturnType<typeof eden.api.consultation.process.post>>["data"]
>;

export type DeidentificationResult = ConsultationProcessResult["deidentification"];
export type PIIEntity = DeidentificationResult["entities"][number];

export type SOAPData = ConsultationProcessResult["soap"];
export type TraceableQuote = SOAPData["subjective"]["evidence"][number];
export type Medication = SOAPData["plan"]["medications"][number];

// 2. Auth Types
export type AuthResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.auth.login.post>>["data"]
>;

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof eden.api.auth.me.get>>["data"]
>;

// 3. User Types
export type UserProfile = NonNullable<
  Awaited<ReturnType<typeof eden.api.user.profile.get>>["data"]
>;

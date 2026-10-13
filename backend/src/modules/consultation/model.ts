import { t, type Static } from "elysia";

export const PIIEntitySchema = t.Object({
  id: t.String(),
  type: t.Union([
    t.Literal("NAME"),
    t.Literal("NIK"),
    t.Literal("PHONE"),
    t.Literal("DOB"),
    t.Literal("ADDRESS"),
    t.Literal("MEDICAL_RECORD_NO"),
  ]),
  label: t.String(),
  originalText: t.String(),
  replacement: t.String(),
  start: t.Number(),
  end: t.Number(),
});

export type PIIEntity = Static<typeof PIIEntitySchema>;

export const DeidentificationResultSchema = t.Object({
  originalText: t.String(),
  deidentifiedText: t.String(),
  entities: t.Array(PIIEntitySchema),
  metadata: t.Object({
    totalRedacted: t.Number(),
    typesFound: t.Array(t.String()),
  }),
});

export type DeidentificationResult = Static<typeof DeidentificationResultSchema>;

export const TraceableQuoteSchema = t.Object({
  quote: t.String(),
  sourceSpeaker: t.Optional(
    t.Nullable(
      t.Union([t.Literal("Dokter"), t.Literal("Pasien"), t.Literal("Pendamping")])
    )
  ),
  context: t.Optional(t.Nullable(t.String())),
});

export type TraceableQuote = Static<typeof TraceableQuoteSchema>;

export const MedicationSchema = t.Object({
  name: t.String(),
  dosage: t.String(),
  frequency: t.String(),
  duration: t.String(),
  instructions: t.Optional(t.Nullable(t.String())),
});

export type Medication = Static<typeof MedicationSchema>;

export const SOAPDataSchema = t.Object({
  subjective: t.Object({
    chiefComplaint: t.String(),
    historyOfPresentIllness: t.String(),
    pastMedicalHistory: t.Optional(t.Nullable(t.String())),
    familyMedicalHistory: t.Optional(t.Nullable(t.String())),
    allergies: t.Object({
      status: t.Union([
        t.Literal("DISANGKAL"),
        t.Literal("TERDAPAT"),
        t.Literal("TIDAK_DISEBUTKAN"),
        t.Literal("PERLU_KONFIRMASI"),
      ]),
      details: t.Optional(t.Nullable(t.String())),
    }),
    evidence: t.Array(TraceableQuoteSchema),
  }),
  objective: t.Object({
    vitalSigns: t.Optional(
      t.Nullable(
        t.Object({
          bloodPressure: t.Optional(t.Nullable(t.String())),
          heartRate: t.Optional(t.Nullable(t.String())),
          temperature: t.Optional(t.Nullable(t.String())),
          respiratoryRate: t.Optional(t.Nullable(t.String())),
        })
      )
    ),
    physicalExamFindings: t.String(),
    evidence: t.Array(TraceableQuoteSchema),
  }),
  assessment: t.Object({
    primaryDiagnosis: t.String(),
    differentialDiagnosis: t.Optional(t.Nullable(t.Array(t.String()))),
    clinicalCertainty: t.Union([
      t.Literal("PASTI"),
      t.Literal("DUGAAN_KERJA"),
      t.Literal("PERLU_PEMERIKSAAN_LANJUT"),
    ]),
    evidence: t.Array(TraceableQuoteSchema),
  }),
  plan: t.Object({
    medications: t.Array(MedicationSchema),
    diagnosticOrders: t.Optional(t.Nullable(t.Array(t.String()))),
    patientEducation: t.Array(t.String()),
    contraindicationsOrRestrictions: t.Optional(t.Nullable(t.Array(t.String()))),
    followUpPlan: t.String(),
    emergencyRedFlags: t.Array(t.String()),
    evidence: t.Array(TraceableQuoteSchema),
  }),
  patientSummary: t.Object({
    facilityName: t.Optional(t.Nullable(t.String())),
    doctorName: t.Optional(t.Nullable(t.String())),
    date: t.String(),
    simpleConclusion: t.String(),
    medicationInstructions: t.Array(t.String()),
    lifestyleAdvice: t.Array(t.String()),
    thingsToAvoid: t.Array(t.String()),
    controlSchedule: t.String(),
    emergencySigns: t.Array(t.String()),
  }),
  uncertainties: t.Array(
    t.Object({
      issue: t.String(),
      reason: t.Union([
        t.Literal("AMBIGU"),
        t.Literal("TIDAK_LENGKAP"),
        t.Literal("KONFLIK"),
        t.Literal("PERLU_KONFIRMASI_DOKTER"),
      ]),
      suggestedAction: t.String(),
    })
  ),
});

export type SOAPData = Static<typeof SOAPDataSchema>;

export const AudioMetadataSchema = t.Object({
  filename: t.String(),
  sizeBytes: t.Number(),
  mimeType: t.String(),
  durationSeconds: t.Optional(t.Number()),
});

export type AudioMetadata = Static<typeof AudioMetadataSchema>;

export const ConsultationProcessResultSchema = t.Object({
  id: t.String(),
  createdAt: t.String(),
  audioMetadata: t.Optional(AudioMetadataSchema),
  stt: t.Object({
    providerUsed: t.String(),
    transcript: t.String(),
    rawTranscript: t.Optional(t.String()),
    durationSeconds: t.Optional(t.Number()),
  }),
  deidentification: DeidentificationResultSchema,
  soap: SOAPDataSchema,
});

export type ConsultationProcessResult = Static<typeof ConsultationProcessResultSchema>;

export const ConsultationSampleItemSchema = t.Object({
  title: t.String(),
  text: t.String(),
});

export type ConsultationSampleItem = Static<typeof ConsultationSampleItemSchema>;

export const ConsultationSamplesResponseSchema = t.Object({
  samples: t.Array(ConsultationSampleItemSchema),
});

export type ConsultationSamplesResponse = Static<typeof ConsultationSamplesResponseSchema>;

export const ProcessTextBodySchema = t.Object({
  text: t.String({ minLength: 1 }),
});

export const DeidentifyBodySchema = t.Object({
  text: t.String({ minLength: 1 }),
});

export const AutofillBodySchema = t.Object({
  text: t.String({ minLength: 1 }),
});

export const ConsultationQueueItemSchema = t.Object({
  id: t.String(),
  queueNumber: t.String(),
  patientName: t.String(),
  patientAge: t.Number(),
  gender: t.Union([t.Literal("Laki-laki"), t.Literal("Perempuan")]),
  clinicService: t.String(),
  chiefComplaint: t.String(),
  status: t.String(),
  estimatedTime: t.String(),
  transcript: t.String(),
  deidentification: DeidentificationResultSchema,
  soap: SOAPDataSchema,
});

export type ConsultationQueueItem = Static<typeof ConsultationQueueItemSchema>;

export const ConsultationQueueResponseSchema = t.Object({
  queue: t.Array(ConsultationQueueItemSchema),
});

export type ConsultationQueueResponse = Static<typeof ConsultationQueueResponseSchema>;


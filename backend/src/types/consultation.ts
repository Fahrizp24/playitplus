export interface PIIEntity {
  id: string;
  type: "NAME" | "NIK" | "PHONE" | "DOB" | "ADDRESS" | "MEDICAL_RECORD_NO";
  label: string;
  originalText: string;
  replacement: string;
  start: number;
  end: number;
}

export interface DeidentificationResult {
  originalText: string;
  deidentifiedText: string;
  entities: PIIEntity[];
  metadata: {
    totalRedacted: number;
    typesFound: string[];
    isMock?: boolean;
  };
}

export interface TraceableQuote {
  quote: string;
  sourceSpeaker?: "Dokter" | "Pasien" | "Pendamping";
  context?: string;
}

export interface SOAPData {
  subjective: {
    chiefComplaint: string;
    historyOfPresentIllness: string;
    pastMedicalHistory?: string;
    familyMedicalHistory?: string;
    allergies: {
      status: "DISANGKAL" | "TERDAPAT" | "TIDAK_DISEBUTKAN" | "PERLU_KONFIRMASI";
      details?: string;
    };
    evidence: TraceableQuote[];
  };
  objective: {
    vitalSigns?: {
      bloodPressure?: string;
      heartRate?: string;
      temperature?: string;
      respiratoryRate?: string;
    };
    physicalExamFindings: string;
    evidence: TraceableQuote[];
  };
  assessment: {
    primaryDiagnosis: string;
    differentialDiagnosis?: string[];
    clinicalCertainty: "PASTI" | "DUGAAN_KERJA" | "PERLU_PEMERIKSAAN_LANJUT";
    evidence: TraceableQuote[];
  };
  plan: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    diagnosticOrders?: string[];
    patientEducation: string[];
    contraindicationsOrRestrictions?: string[];
    followUpPlan: string;
    emergencyRedFlags: string[];
    evidence: TraceableQuote[];
  };
  patientSummary: {
    facilityName?: string;
    doctorName?: string;
    date: string;
    simpleConclusion: string;
    medicationInstructions: string[];
    lifestyleAdvice: string[];
    thingsToAvoid: string[];
    controlSchedule: string;
    emergencySigns: string[];
  };
  uncertainties: Array<{
    issue: string;
    reason: "AMBIGU" | "TIDAK_LENGKAP" | "KONFLIK" | "PERLU_KONFIRMASI_DOKTER";
    suggestedAction: string;
  }>;
}

export interface ConsultationProcessResult {
  id: string;
  createdAt: string;
  audioMetadata?: {
    filename?: string;
    sizeBytes?: number;
    mimeType?: string;
    durationSeconds?: number;
  };
  stt: {
    providerUsed: string;
    transcript: string;
    durationSeconds?: number;
  };
  deidentification: DeidentificationResult;
  soap: SOAPData;
}

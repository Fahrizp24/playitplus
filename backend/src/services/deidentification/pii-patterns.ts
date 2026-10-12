export interface PIIRule {
  type: "NAME" | "NIK" | "PHONE" | "DOB" | "ADDRESS" | "MEDICAL_RECORD_NO";
  label: string;
  regex: RegExp;
  replacementGenerator: (match: string, group?: string) => string;
}

export const INDONESIAN_PII_RULES: PIIRule[] = [
  // 1. NIK (16 digit)
  {
    type: "NIK",
    label: "Nomor Induk Kependudukan",
    regex: /\b\d{16}\b/g,
    replacementGenerator: () => "[NIK]",
  },
  // 2. Nomor Rekam Medis (RM-xxxxxx)
  {
    type: "MEDICAL_RECORD_NO",
    label: "Nomor Rekam Medis",
    regex: /\b(?:RM[- ]?\d{4,8}|no(?:mor)?\s*rekam\s*medis\s*[:\s]?\s*[\w-]+)\b/gi,
    replacementGenerator: () => "[NO_REKAM_MEDIS]",
  },
  // 3. Nomor Telepon / WhatsApp Indonesia (08xxx / +62xxx / 62xxx)
  {
    type: "PHONE",
    label: "Nomor Telepon",
    regex: /\b(?:\+?62|08)[0-9]{8,12}\b/g,
    replacementGenerator: () => "[NO_TELEPON]",
  },
  // 4. Tanggal Lahir / Tanggal Spesifik
  {
    type: "DOB",
    label: "Tanggal Lahir / Tanggal Spesifik",
    regex: /\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4})\b/gi,
    replacementGenerator: () => "[TANGGAL_LAHIR]",
  },
  // 5. Nama Dokter (dr. X / Dokter X)
  {
    type: "NAME",
    label: "Nama Tenaga Medis",
    regex: /(?:Dokter|dr\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*Sp\.[A-Z]{2,4})?)/g,
    replacementGenerator: () => "Dokter [DOKTER]",
  },
  // 6. Nama Pasien dengan panggilan (Bapak X / Ibu X / Sdr X / Sdri X)
  {
    type: "NAME",
    label: "Nama Pasien",
    regex: /(?:Bapak|Ibu|Sdr|Sdri|Tn|Ny|Nn)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
    replacementGenerator: (match) => {
      const prefix = match.split(" ")[0];
      return `${prefix} [NAMA_PASIEN]`;
    },
  },
  // 7. Nama Pasien dari frasa deklarasi (nama saya X / atas nama X)
  {
    type: "NAME",
    label: "Nama Pasien",
    regex: /(?:atas nama|nama saya)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi,
    replacementGenerator: (match) => {
      const prefix = match.split(" ")[0] + " " + match.split(" ")[1];
      return `${prefix} [NAMA_PASIEN]`;
    },
  },
  // 8. Alamat tempat tinggal
  {
    type: "ADDRESS",
    label: "Alamat Pasien",
    regex: /(?:tinggal di|alamat(?:nya)? di)\s+([A-Z0-9a-z\s,.-]{8,40})(?=[,\n.]|$)/gi,
    replacementGenerator: (match) => {
      const prefix = match.startsWith("tinggal di") ? "tinggal di" : "alamat di";
      return `${prefix} [ALAMAT]`;
    },
  },
];

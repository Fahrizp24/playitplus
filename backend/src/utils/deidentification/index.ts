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
  };
}

export interface PIIRule {
  type: PIIEntity["type"];
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
    regex: /(?:Dokter|dr\.)[ \t]+([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+)*(?:,[ \t]*Sp\.[A-Z]{2,4})?)/g,
    replacementGenerator: () => "Dokter [DOKTER]",
  },
  // 6. Nama Pasien dengan panggilan (Bapak X / Ibu X / Sdr X / Sdri X)
  {
    type: "NAME",
    label: "Nama Pasien",
    regex: /(?:Bapak|Ibu|Sdr|Sdri|Tn|Ny|Nn)\.?[ \t]+([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){1,3})/g,
    replacementGenerator: (match) => {
      const prefix = match.split(" ")[0];
      return `${prefix} [NAMA_PASIEN]`;
    },
  },
  // 7. Nama Pasien dari frasa deklarasi (nama saya X / atas nama X)
  {
    type: "NAME",
    label: "Nama Pasien",
    regex: /(?:atas nama|nama saya)[ \t]+([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){1,3})/gi,
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

export class DeidentificationService {
  deidentify(text: string): DeidentificationResult {
    if (!text || text.trim() === "") {
      return {
        originalText: text,
        deidentifiedText: text,
        entities: [],
        metadata: {
          totalRedacted: 0,
          typesFound: [],
        },
      };
    }

    const matches: PIIEntity[] = [];

    for (const rule of INDONESIAN_PII_RULES) {
      const regex = new RegExp(rule.regex.source, rule.regex.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const fullMatch = match[0];
        const start = match.index;
        const end = start + fullMatch.length;
        const replacement = rule.replacementGenerator(fullMatch);

        const isOverlapping = matches.some(
          (m) => (start >= m.start && start < m.end) || (end > m.start && end <= m.end)
        );

        if (!isOverlapping) {
          matches.push({
            id: `pii-${matches.length + 1}`,
            type: rule.type,
            label: rule.label,
            originalText: fullMatch,
            replacement,
            start,
            end,
          });
        }
      }
    }

    matches.sort((a, b) => a.start - b.start);

    let deidentifiedText = "";
    let currentIndex = 0;

    for (const entity of matches) {
      deidentifiedText += text.substring(currentIndex, entity.start);
      deidentifiedText += entity.replacement;
      currentIndex = entity.end;
    }
    deidentifiedText += text.substring(currentIndex);

    const typesFound = Array.from(new Set(matches.map((m) => m.type)));

    return {
      originalText: text,
      deidentifiedText,
      entities: matches,
      metadata: {
        totalRedacted: matches.length,
        typesFound,
      },
    };
  }
}

export const deidentificationService = new DeidentificationService();

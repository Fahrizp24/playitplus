import type { DeidentificationResult, PIIEntity } from "../../types/consultation";
import { INDONESIAN_PII_RULES } from "./pii-patterns";

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

    const matches: Array<{
      id: string;
      type: PIIEntity["type"];
      label: string;
      originalText: string;
      replacement: string;
      start: number;
      end: number;
    }> = [];

    // Jalankan setiap aturan PII
    for (const rule of INDONESIAN_PII_RULES) {
      const regex = new RegExp(rule.regex.source, rule.regex.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const fullMatch = match[0];
        const start = match.index;
        const end = start + fullMatch.length;
        const replacement = rule.replacementGenerator(fullMatch);

        // Periksa apakah bertabrakan dengan match yang sudah ada
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

    // Urutkan match berdasarkan indeks kemunculan (dari kiri ke kanan)
    matches.sort((a, b) => a.start - b.start);

    // Bangun deidentifiedText dari urutan index
    let deidentifiedText = "";
    let currentIndex = 0;

    for (const entity of matches) {
      // Tambahkan teks sebelum match
      deidentifiedText += text.substring(currentIndex, entity.start);
      // Tambahkan token replacement
      deidentifiedText += entity.replacement;
      currentIndex = entity.end;
    }
    // Tambahkan sisa teks
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

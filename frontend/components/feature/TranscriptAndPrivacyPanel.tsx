"use client";

import React, { useState } from "react";
import type { DeidentificationResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface TranscriptAndPrivacyPanelProps {
  transcript: string;
  deidentification: DeidentificationResult | null;
  highlightQuote: string | null;
}

export function TranscriptAndPrivacyPanel({
  transcript,
  deidentification,
  highlightQuote,
}: TranscriptAndPrivacyPanelProps) {
  const [viewMode, setViewMode] = useState<"deidentified" | "original">("deidentified");

  if (!transcript) {
    return null;
  }

  const displayText =
    viewMode === "deidentified" && deidentification
      ? deidentification.deidentifiedText
      : transcript;

  const renderHighlightedText = (text: string, quoteToHighlight: string | null) => {
    if (!quoteToHighlight || !text.includes(quoteToHighlight)) {
      return <span>{text}</span>;
    }

    const parts = text.split(quoteToHighlight);
    return (
      <span>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <mark className="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold lg:px-[4px] lg:py-[2px]">
                {quoteToHighlight}
              </mark>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  const parseDialogueTurns = (rawText: string) => {
    if (!rawText || rawText.trim() === "") return [];

    let clean = rawText.trim();
    clean = clean.replace(/```(?:markdown|text)?/gi, "").replace(/```/g, "");

    // Normalisasi semua variasi format peran:
    // **Dokter:**, **Dokter**:
    // - Dokter:, * Dokter:, 1. Dokter:
    // dr.:, Dokter :
    // Pemisahan inline dialogue turn ke baris baru
    clean = clean.replace(
      /(?:^|\b|\n|\r|[.?!:,;])\s*(?:[-*•\d.]+\s*)?(?:\*\*)?(Dokter|Pasien|Pendamping|dr\.)(?:\*\*)?\s*:\s*(?:\*\*)?/gi,
      (match, role) => `\n${role.toLowerCase() === "dr." ? "Dokter" : role}: `
    );

    const lines = clean
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const turns: Array<{ role: "Dokter" | "Pasien" | "Pendamping"; speech: string }> = [];

    for (const line of lines) {
      const match = line.match(
        /^(?:[-*•\d.]+\s*)?(?:\*\*)?(Dokter|Pasien|Pendamping|dr\.)(?:\*\*)?\s*:\s*(?:\*\*)?(.*)$/i
      );

      if (match) {
        const rawRole = match[1].toLowerCase();
        const role: "Dokter" | "Pasien" | "Pendamping" =
          rawRole === "dr." || rawRole === "dokter"
            ? "Dokter"
            : rawRole === "pasien"
            ? "Pasien"
            : "Pendamping";

        const speech = match[2].replace(/^\*+|\*+$/g, "").trim();
        if (speech) {
          turns.push({ role, speech });
        }
      } else if (turns.length > 0) {
        turns[turns.length - 1].speech += " " + line;
      }
    }

    return turns;
  };

  const renderDialogue = (text: string, quoteToHighlight: string | null) => {
    const turns = parseDialogueTurns(text);

    if (turns.length === 0) {
      return (
        <div className="whitespace-pre-wrap">
          {renderHighlightedText(text, quoteToHighlight)}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2.5 lg:gap-[10px]">
        {turns.map((turn, idx) => {
          const isDoctor = turn.role === "Dokter";
          const isPatient = turn.role === "Pasien";

          return (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded-lg bg-white/80 border border-slate-200/70 lg:p-[8px] lg:gap-[8px] lg:rounded-[6px]"
            >
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 lg:px-[6px] lg:py-[2px] lg:text-[10px] lg:rounded-[4px] ${
                  isDoctor
                    ? "bg-blue-100 text-blue-700"
                    : isPatient
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {turn.role}
              </span>
              <div className="flex-1 leading-relaxed text-slate-800">
                {renderHighlightedText(turn.speech, quoteToHighlight)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const totalRedacted = deidentification?.metadata?.totalRedacted ?? 0;

  return (
    <Card className="p-5 lg:p-[20px]">
      <div className="flex flex-col gap-3.5 lg:gap-[16px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 lg:gap-[12px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 lg:text-[15px] lg:leading-[18px]">
              Transkrip Percakapan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 lg:text-[12px] lg:mt-[2px]">
              {totalRedacted > 0
                ? `${totalRedacted} entitas sensitif disamarkan otomatis`
                : "Dokumentasi audio anamnesis"}
            </p>
          </div>

          {/* Toggle View */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 lg:p-[3px] lg:rounded-[8px]">
            <button
              type="button"
              onClick={() => setViewMode("deidentified")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer lg:px-[10px] lg:py-[4px] lg:text-[11px] lg:rounded-[6px] ${
                viewMode === "deidentified"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Terproteksi
            </button>
            <button
              type="button"
              onClick={() => setViewMode("original")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer lg:px-[10px] lg:py-[4px] lg:text-[11px] lg:rounded-[6px] ${
                viewMode === "original"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Asli
            </button>
          </div>
        </div>

        {/* Transcript Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 max-h-80 overflow-y-auto text-xs leading-relaxed text-slate-800 lg:p-[16px] lg:max-h-[340px] lg:text-[13px] lg:leading-[20px] lg:rounded-[10px]">
          {renderDialogue(displayText, highlightQuote)}
        </div>
      </div>
    </Card>
  );
}

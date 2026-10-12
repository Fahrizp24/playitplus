"use client";

import React, { useState } from "react";
import type { DeidentificationResult } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
    return (
      <Card className="p-6 text-center text-zinc-400 lg:p-[32px]">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-zinc-300 dark:text-zinc-700 lg:w-[48px] lg:h-[48px] lg:mb-[8px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
          />
        </svg>
        <p className="text-sm font-medium lg:text-[14px]">Belum ada transkrip audio.</p>
        <p className="text-xs text-zinc-500 lg:text-[12px]">
          Mulai rekam suara atau unggah berkas untuk melihat hasil STT dan deidentifikasi privasi.
        </p>
      </Card>
    );
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
              <mark className="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold transition-all dark:bg-amber-500/40 dark:text-amber-200 lg:px-[4px] lg:py-[2px]">
                {quoteToHighlight}
              </mark>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <Card className="p-5 lg:p-[24px]">
      <div className="flex flex-col gap-4 lg:gap-[18px]">
        {/* Header & Toggle Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-[14px]">
          <div>
            <div className="flex items-center gap-2 lg:gap-[8px]">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 lg:text-[17px] lg:leading-[22px]">
                Tahap 2 & 3: Transkripsi (STT) & Deidentifikasi Privasi
              </h3>
              {deidentification && (
                <Badge variant="success" size="sm">
                  {deidentification.metadata.totalRedacted} Entitas PII Disamarkan
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 lg:text-[13px]">
              Data sensitif (NIK, Nama, No. HP, No. RM) disamarkan sebelum diproses ke LLM.
            </p>
          </div>

          {/* Toggle View Mode */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 lg:p-[4px] lg:rounded-[10px]">
            <button
              type="button"
              onClick={() => setViewMode("deidentified")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all lg:px-[12px] lg:py-[6px] lg:text-[12px] lg:rounded-[8px] ${
                viewMode === "deidentified"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Terdeidentifikasi (Aman)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("original")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all lg:px-[12px] lg:py-[6px] lg:text-[12px] lg:rounded-[8px] ${
                viewMode === "original"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Transkrip Asli
            </button>
          </div>
        </div>

        {/* PII Summary Badges */}
        {deidentification && deidentification.entities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800 lg:p-[12px] lg:rounded-[10px] lg:gap-[8px]">
            <span className="text-[11px] font-semibold text-zinc-500 self-center dark:text-zinc-400 lg:text-[12px]">
              Entitas Terdeteksi:
            </span>
            {deidentification.entities.map((entity) => (
              <span
                key={entity.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 lg:text-[11px] lg:px-[8px] lg:py-[2px]"
                title={`Nilai asli: ${entity.originalText}`}
              >
                <span className="font-bold text-[10px] text-amber-600 dark:text-amber-400 lg:text-[10px]">
                  {entity.type}:
                </span>
                {viewMode === "deidentified" ? entity.replacement : entity.originalText}
              </span>
            ))}
          </div>
        )}

        {/* Active Highlight Context Notice */}
        {highlightQuote && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800 lg:px-[12px] lg:py-[6px] lg:text-[12px]">
            <span>
              Menyorot bukti kutipan klinis: <strong>&ldquo;{highlightQuote}&rdquo;</strong>
            </span>
          </div>
        )}

        {/* Transcript Text Viewer */}
        <div className="relative p-4 rounded-xl bg-zinc-50 border border-zinc-200 max-h-72 overflow-y-auto text-xs leading-relaxed text-zinc-800 whitespace-pre-wrap font-sans dark:bg-zinc-900/30 dark:border-zinc-800 dark:text-zinc-200 lg:p-[18px] lg:max-h-[300px] lg:text-[13px] lg:leading-[20px] lg:rounded-[12px]">
          {renderHighlightedText(displayText, highlightQuote)}
        </div>
      </div>
    </Card>
  );
}

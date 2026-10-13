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
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 max-h-80 overflow-y-auto text-xs leading-relaxed text-slate-800 whitespace-pre-wrap lg:p-[16px] lg:max-h-[340px] lg:text-[13px] lg:leading-[20px] lg:rounded-[10px]">
          {renderHighlightedText(displayText, highlightQuote)}
        </div>
      </div>
    </Card>
  );
}

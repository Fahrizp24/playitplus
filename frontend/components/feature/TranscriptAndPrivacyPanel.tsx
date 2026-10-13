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

  const renderDialogue = (text: string, quoteToHighlight: string | null) => {
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    const hasSpeakers = lines.some((line) => /^(?:Dokter|Pasien|Pendamping):\s*/i.test(line));

    if (!hasSpeakers) {
      return (
        <div className="whitespace-pre-wrap">
          {renderHighlightedText(text, quoteToHighlight)}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2.5 lg:gap-[10px]">
        {lines.map((line, idx) => {
          const match = line.match(/^(Dokter|Pasien|Pendamping):\s*(.*)$/i);
          if (match) {
            const role = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
            const speech = match[2];
            const isDoctor = role.toLowerCase() === "dokter";
            const isPatient = role.toLowerCase() === "pasien";

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
                  {role}
                </span>
                <div className="flex-1 leading-relaxed text-slate-800">
                  {renderHighlightedText(speech, quoteToHighlight)}
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="leading-relaxed text-slate-800">
              {renderHighlightedText(line, quoteToHighlight)}
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

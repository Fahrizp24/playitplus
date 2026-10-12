"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export type PipelineStep = "audio" | "stt" | "deidentify" | "autofill";

interface PipelineStepTrackerProps {
  currentStep: PipelineStep | null;
  isProcessing: boolean;
  completedSteps: PipelineStep[];
}

export function PipelineStepTracker({
  currentStep,
  isProcessing,
  completedSteps,
}: PipelineStepTrackerProps) {
  const steps: Array<{ id: PipelineStep; number: number; title: string; desc: string }> = [
    {
      id: "audio",
      number: 1,
      title: "Audio Input",
      desc: "Rekam Mic / Upload File",
    },
    {
      id: "stt",
      number: 2,
      title: "STT Transkripsi",
      desc: "Konversi Suara ke Teks",
    },
    {
      id: "deidentify",
      number: 3,
      title: "Deidentifikasi Privasi",
      desc: "Redaksi PII (NIK, Nama, Telp)",
    },
    {
      id: "autofill",
      number: 4,
      title: "Auto-Fill SOAP",
      desc: "Draf Klinis & Ringkasan",
    },
  ];

  return (
    <Card className="p-4 lg:p-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-[16px]">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id && isProcessing;

          let badgeStyle =
            "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
          let borderStyle = "border-zinc-200 dark:border-zinc-800";
          let bgStyle = "bg-zinc-50/50 dark:bg-zinc-900/30";

          if (isDone) {
            badgeStyle =
              "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20";
            borderStyle = "border-emerald-200 dark:border-emerald-900/50";
            bgStyle = "bg-emerald-50/30 dark:bg-emerald-950/10";
          } else if (isCurrent) {
            badgeStyle = "bg-blue-600 text-white border-blue-600 animate-pulse";
            borderStyle = "border-blue-400 dark:border-blue-700";
            bgStyle = "bg-blue-50/40 dark:bg-blue-950/20";
          }

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${borderStyle} ${bgStyle} lg:p-[14px] lg:rounded-[12px] lg:gap-[12px]`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold shrink-0 transition-colors ${badgeStyle} lg:w-[32px] lg:h-[32px] lg:text-[13px] lg:rounded-[9999px]`}
              >
                {isDone ? (
                  <svg
                    className="w-4 h-4 lg:w-[16px] lg:h-[16px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-zinc-900 truncate dark:text-zinc-100 lg:text-[14px] lg:leading-[18px]">
                    {step.title}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] text-blue-600 font-medium animate-pulse dark:text-blue-400 lg:text-[11px]">
                      Memproses...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] text-emerald-600 font-medium dark:text-emerald-400 lg:text-[11px]">
                      Selesai
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 truncate dark:text-zinc-400 lg:text-[12px] lg:leading-[16px]">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

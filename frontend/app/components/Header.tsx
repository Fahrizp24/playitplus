"use client";

import React from "react";
import type { ProviderStatus } from "@/lib/types";

interface HeaderProps {
  providerStatus: ProviderStatus | null;
}

export function Header({ providerStatus }: HeaderProps) {
  const sttProvider = providerStatus?.stt.configuredProvider || "mock";
  const llmProvider = providerStatus?.llm.configuredProvider || "mock";

  return (
    <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:px-[32px] lg:py-[16px] lg:gap-[16px]">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 lg:gap-[14px]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 lg:w-[44px] lg:h-[44px] lg:rounded-[12px] lg:text-[18px]">
            P+
          </div>
          <div>
            <div className="flex items-center gap-2 lg:gap-[8px]">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-[20px] lg:leading-[24px]">
                PlayItPlus
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 lg:text-[12px] lg:px-[8px] lg:py-[2px] lg:rounded-[9999px]">
                MVP Flow
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 lg:text-[13px] lg:leading-[16px]">
              Audio &rarr; STT &rarr; Deidentifikasi Privasi &rarr; Auto-Fill SOAP
            </p>
          </div>
        </div>

        {/* Agnostic Provider Status Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs lg:gap-[10px] lg:text-[12px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 lg:px-[12px] lg:py-[6px] lg:rounded-[8px] lg:gap-[6px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 lg:w-[8px] lg:h-[8px]" />
            <span className="text-zinc-500 font-medium dark:text-zinc-400">STT:</span>
            <span className="font-semibold uppercase text-zinc-900 dark:text-zinc-100">
              {sttProvider}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 lg:px-[12px] lg:py-[6px] lg:rounded-[8px] lg:gap-[6px]">
            <span className="w-2 h-2 rounded-full bg-blue-500 lg:w-[8px] lg:h-[8px]" />
            <span className="text-zinc-500 font-medium dark:text-zinc-400">LLM:</span>
            <span className="font-semibold uppercase text-zinc-900 dark:text-zinc-100">
              {llmProvider}
            </span>
          </div>

          <span className="text-[11px] text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 lg:text-[11px] lg:px-[8px] lg:py-[2px]">
            Agnostik Vendor
          </span>
        </div>
      </div>
    </header>
  );
}

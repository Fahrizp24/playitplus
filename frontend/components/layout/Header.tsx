"use client";

import React from "react";

interface HeaderProps {
  doctorName?: string;
  clinicName?: string;
}

const emptySubscribe = () => () => {};

function getTodayClientDate(): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

export function Header({
  doctorName,
  clinicName,
}: HeaderProps) {
  const todayFormatted = React.useSyncExternalStore(
    emptySubscribe,
    getTodayClientDate,
    () => ""
  );

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl w-full mx-auto px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:px-[32px] lg:py-[14px] lg:gap-[16px]">
        {/* Brand Header */}
        <div className="flex items-center gap-3 lg:gap-[14px]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-black shadow-sm lg:w-[42px] lg:h-[42px] lg:rounded-[12px] lg:text-[17px]">
            +
          </div>
          <div>
            <div className="flex items-center gap-2 lg:gap-[8px]">
              <h1 className="text-base font-bold tracking-tight text-slate-900 lg:text-[18px] lg:leading-[22px]">
                PlayItPlus <span className="text-blue-600 font-semibold">SIMRS</span>
              </h1>
            </div>
            {clinicName && (
              <p className="text-xs text-slate-500 font-medium lg:text-[12px] lg:leading-[16px]">
                {clinicName}
              </p>
            )}
          </div>
        </div>

        {/* Clean Essential Utilities */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs text-slate-600 lg:gap-[14px] lg:text-[13px]">
          {/* Profil Dokter (Hanya tampil jika ada data riil) */}
          {doctorName && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 lg:px-[12px] lg:py-[6px] lg:rounded-[8px] lg:gap-[8px]">
              <svg
                className="w-4 h-4 text-blue-600 lg:w-[16px] lg:h-[16px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-semibold text-slate-900 text-[11px] lg:text-[12px]">
                {doctorName}
              </span>
            </div>
          )}

          {/* Tanggal Layanan */}
          {todayFormatted && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 lg:px-[12px] lg:py-[6px] lg:rounded-[8px] lg:gap-[6px]">
              <svg
                className="w-3.5 h-3.5 text-slate-400 lg:w-[14px] lg:h-[14px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[11px] font-medium lg:text-[12px]">
                {todayFormatted}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

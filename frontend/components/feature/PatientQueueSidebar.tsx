"use client";

import React from "react";
import type { ConsultationQueueItem } from "@/lib/types";

interface PatientQueueSidebarProps {
  queue: ConsultationQueueItem[];
  selectedPatientId: string | null;
  onSelectPatient: (patient: ConsultationQueueItem) => void;
  isLoading: boolean;
  onRefresh: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function PatientQueueSidebar({
  queue,
  selectedPatientId,
  onSelectPatient,
  isLoading,
  onRefresh,
  isOpenMobile,
  onCloseMobile,
}: PatientQueueSidebarProps) {
  const content = (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:rounded-[14px]">
      {/* Header Sidebar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0 lg:p-[16px]">
        <div className="flex items-center gap-2.5 lg:gap-[10px]">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-xs lg:w-[32px] lg:h-[32px] lg:rounded-[8px] lg:text-[13px]">
            <svg className="w-4 h-4 lg:w-[16px] lg:h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 lg:text-[14px] lg:leading-[18px]">
              Antrean Pasien
            </h2>
            <p className="text-[10px] text-slate-500 lg:text-[11px] lg:leading-[14px]">
              {queue.length} Pasien Terdaftar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 lg:gap-[4px]">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Segarkan antrean"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 lg:w-[28px] lg:h-[28px] lg:rounded-[6px]"
          >
            <svg
              className={`w-3.5 h-3.5 lg:w-[14px] lg:h-[14px] ${isLoading ? "animate-spin text-blue-600" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          {isOpenMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* List Pasien Antrean */}
      <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 flex flex-col gap-2 divide-y divide-transparent lg:p-[12px] lg:gap-[8px]">
        {isLoading && queue.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2 lg:py-[32px] lg:gap-[8px]">
            <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin lg:w-[24px] lg:h-[24px]" />
            <p className="text-[11px] text-slate-500 lg:text-[12px]">Memuat data antrean SIMRS...</p>
          </div>
        )}

        {!isLoading && queue.length === 0 && (
          <div className="py-8 text-center text-[11px] text-slate-500 lg:py-[32px] lg:text-[12px]">
            Belum ada pasien dalam antrean hari ini.
          </div>
        )}

        {queue.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          const isExamined = Boolean(patient.soap || patient.transcript || patient.status === "Selesai Anamnesis");

          return (
            <div
              key={patient.id}
              onClick={() => {
                onSelectPatient(patient);
                if (isOpenMobile) onCloseMobile();
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 lg:p-[12px] lg:rounded-[10px] lg:gap-[8px] ${
                isSelected
                  ? "bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-300"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60"
              }`}
            >
              {/* Row Atas: Nomor Antrean & Status Badge */}
              <div className="flex items-center justify-between gap-2 lg:gap-[8px]">
                <div className="flex items-center gap-2 lg:gap-[8px]">
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs tracking-wider shrink-0 lg:px-[8px] lg:py-[2px] lg:text-[12px] lg:rounded-[6px] ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {patient.queueNumber}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 lg:text-[11px]">
                    {patient.clinicService}
                  </span>
                </div>

                {isExamined ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 lg:text-[10px] lg:px-[6px] lg:py-[2px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 lg:w-[6px] lg:h-[6px]" />
                    Selesai
                  </span>
                ) : isSelected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded border border-blue-200 lg:text-[10px] lg:px-[6px] lg:py-[2px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse lg:w-[6px] lg:h-[6px]" />
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 lg:text-[10px] lg:px-[6px] lg:py-[2px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 lg:w-[6px] lg:h-[6px]" />
                    Menunggu
                  </span>
                )}
              </div>

              {/* Row Tengah: Nama & Profil */}
              <div>
                <h3
                  className={`text-xs font-bold leading-tight lg:text-[13px] lg:leading-[17px] ${
                    isSelected ? "text-blue-900" : "text-slate-900"
                  }`}
                >
                  {patient.patientName}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 lg:text-[11px] lg:leading-[14px] lg:mt-[2px]">
                  {patient.patientAge} th • {patient.gender}
                </p>
              </div>

              {/* Row Bawah: Keluhan Awal Singkat */}
              <p className="text-[10px] text-slate-600 line-clamp-1 italic bg-slate-50/80 px-2 py-1 rounded border border-slate-100 lg:text-[11px] lg:px-[8px] lg:py-[4px] lg:rounded-[4px]">
                {patient.chiefComplaint}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Sidebar Info */}
      <div className="p-2.5 sm:p-3 border-t border-slate-100 bg-slate-50/40 text-[10px] text-slate-400 flex items-center justify-between shrink-0 lg:p-[10px] lg:text-[11px]">
        <span>SIMRS Real-time Queue</span>
        <span className="flex items-center gap-1 text-emerald-600 font-medium lg:gap-[4px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 lg:w-[6px] lg:h-[6px]" />
          Online
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:block lg:w-[320px] shrink-0 lg:sticky lg:top-[76px] lg:h-[calc(100vh-96px)]">
        {content}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-4/5 max-w-xs h-full bg-white z-10 p-2 shadow-2xl flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

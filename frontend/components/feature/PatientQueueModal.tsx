"use client";

import React, { useEffect, useState } from "react";
import { getConsultationQueue } from "@/lib/api/consultation";
import type { ConsultationQueueItem } from "@/lib/types";

interface PatientQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (patient: ConsultationQueueItem) => void;
}

export function PatientQueueModal({
  isOpen,
  onClose,
  onSelectPatient,
}: PatientQueueModalProps) {
  const [queue, setQueue] = useState<ConsultationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchQueue = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getConsultationQueue();
      setQueue(data.queue);
    } catch (err: unknown) {
      console.error("Gagal memuat antrean:", err);
      const msg = err instanceof Error ? err.message : "Gagal memuat daftar antrean.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (isOpen) {
      void getConsultationQueue()
        .then((data) => {
          if (!ignore) {
            setQueue(data.queue);
            setIsLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (!ignore) {
            const msg = err instanceof Error ? err.message : "Gagal memuat daftar antrean.";
            setErrorMessage(msg);
            setIsLoading(false);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto lg:max-w-[720px] lg:rounded-[16px]">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 lg:p-[20px]">
          <div className="flex items-center gap-3 lg:gap-[12px]">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold shadow-xs lg:w-[42px] lg:h-[42px] lg:rounded-[10px]">
              <svg className="w-5 h-5 lg:w-[22px] lg:h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 lg:text-[17px] lg:leading-[22px]">
                Daftar Antrean Pasien Rawat Jalan
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 lg:text-[12px] lg:leading-[16px] lg:mt-[2px]">
                Pilih pasien dari SIMRS untuk langsung memuat transkrip dan analisis medis SOAP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer lg:w-[32px] lg:h-[32px] lg:rounded-[6px]"
          >
            <svg className="w-5 h-5 lg:w-[18px] lg:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-3 lg:p-[20px] lg:gap-[12px]">
          {/* Loading State */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3 lg:py-[48px] lg:gap-[12px]">
              <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin lg:w-[32px] lg:h-[32px]" />
              <p className="text-xs text-slate-600 font-medium lg:text-[13px]">
                Menghubungkan ke server SIMRS & memuat data antrean...
              </p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex flex-col gap-2 lg:p-[16px] lg:rounded-[10px] lg:gap-[8px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{errorMessage}</span>
                <button
                  type="button"
                  onClick={fetchQueue}
                  className="px-2.5 py-1 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition-colors lg:px-[10px] lg:py-[4px]"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Queue List */}
          {!isLoading && !errorMessage && queue.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500 lg:py-[48px] lg:text-[13px]">
              Tidak ada data antrean pasien yang tersedia saat ini.
            </div>
          )}

          {!isLoading && !errorMessage && queue.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="group p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:p-[16px] lg:rounded-[12px] lg:gap-[16px]"
            >
              {/* Kolom Kiri: Nomor Antrean & Info Pasien */}
              <div className="flex items-start sm:items-center gap-3 lg:gap-[14px]">
                <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-blue-100/80 text-blue-800 font-mono font-bold text-xs sm:text-sm text-center border border-blue-200/80 shrink-0 lg:px-[12px] lg:py-[8px] lg:text-[14px] lg:rounded-[8px]">
                  {patient.queueNumber}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap lg:gap-[8px]">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors lg:text-[15px] lg:leading-[20px]">
                      {patient.patientName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium lg:text-[12px]">
                      ({patient.patientAge} th, {patient.gender})
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 lg:text-[11px] lg:px-[8px] lg:py-[2px]">
                      {patient.clinicService}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-1 lg:text-[12px] lg:leading-[16px] lg:mt-[4px]">
                    <span className="font-medium text-slate-700">Keluhan: </span>
                    {patient.chiefComplaint}
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: Status & Tombol Aksi */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 lg:gap-[10px]">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60 lg:text-[11px] lg:px-[8px] lg:py-[4px] lg:rounded-[6px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse lg:w-[6px] lg:h-[6px]" />
                  {patient.status}
                </span>

                <button
                  type="button"
                  className="group relative inline-block cursor-pointer focus:outline-hidden"
                >
                  <span className="absolute inset-0 w-full h-full rounded-lg bg-blue-800 translate-y-0.5 transition-transform group-hover:translate-y-1 group-active:translate-y-0 lg:rounded-[6px]" />
                  <span className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 group-hover:bg-blue-500 text-white font-bold text-xs border-t border-blue-400/40 shadow-xs transition-transform transform -translate-y-0.5 group-hover:-translate-y-0.5 group-active:translate-y-0.5 lg:px-[12px] lg:py-[6px] lg:text-[12px] lg:rounded-[6px] lg:gap-[6px]">
                    <span>Pilih Pasien</span>
                    <svg className="w-3.5 h-3.5 lg:w-[14px] lg:h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Modal */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 lg:p-[16px] lg:text-[12px]">
          <span>Total {queue.length} antrean aktif terdaftar</span>
          <button
            type="button"
            onClick={fetchQueue}
            disabled={isLoading}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer disabled:opacity-50 lg:gap-[4px]"
          >
            <svg className={`w-3.5 h-3.5 lg:w-[14px] lg:h-[14px] ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Segarkan Antrean</span>
          </button>
        </div>
      </div>
    </div>
  );
}

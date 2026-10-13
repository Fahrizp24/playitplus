"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface SimrsIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasSoapData: boolean;
  diagnosis?: string;
}

export function SimrsIntegrationModal({
  isOpen,
  onClose,
  hasSoapData,
  diagnosis,
}: SimrsIntegrationModalProps) {
  const [txCode, setTxCode] = useState<string>("");
  const isExported = Boolean(txCode);

  const handleExportClick = () => {
    setTxCode(`TX-FHIR-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden lg:max-w-[520px] lg:rounded-[16px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200 lg:px-[20px] lg:py-[16px]">
          <h3 className="text-sm font-bold text-slate-900 lg:text-[15px]">
            Integrasi Rekam Medis (EMR)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
          >
            <svg className="w-5 h-5 lg:w-[18px] lg:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3.5 text-xs text-slate-700 lg:p-[20px] lg:gap-[14px] lg:text-[13px]">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700 lg:p-[14px]">
            <p className="font-semibold text-slate-900 mb-1 lg:mb-[4px]">Status Format Interoperabilitas</p>
            <p className="text-slate-600">• Standar: HL7 FHIR R4</p>
            <p className="text-slate-600">• Diagnosis: {diagnosis ? diagnosis : "Belum diekstrak"}</p>
            <p className="text-slate-600">• Kesiapan: {hasSoapData ? "Siap diekspor" : "Menunggu data SOAP"}</p>
          </div>

          {isExported && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs lg:p-[12px] lg:text-[12px]">
              Kirim berhasil: <span className="font-mono font-bold">{txCode}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200 lg:px-[20px] lg:py-[12px]">
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!hasSoapData || isExported}
            onClick={handleExportClick}
          >
            {isExported ? "Terkirim" : "Kirim ke EMR"}
          </Button>
        </div>
      </div>
    </div>
  );
}

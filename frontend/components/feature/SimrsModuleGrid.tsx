"use client";

import React, { useRef } from "react";

interface SimrsModuleGridProps {
  onOpenRecord: () => void;
  onUploadFile: (file: File) => Promise<void>;
  onOpenIntegrationModal: () => void;
  isProcessing: boolean;
}

export function SimrsModuleGrid({
  onOpenRecord,
  onUploadFile,
  onOpenIntegrationModal,
  isProcessing,
}: SimrsModuleGridProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleModuleClick = (id: string) => {
    switch (id) {
      case "record":
        onOpenRecord();
        break;
      case "upload":
        fileInputRef.current?.click();
        break;
      case "integration":
        onOpenIntegrationModal();
        break;
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadFile(file);
      e.target.value = "";
    }
  };

  const modules = [
    {
      id: "record",
      title: "Rekam Suara",
      desc: "Anamnesis langsung via mikrofon",
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-[32px] lg:h-[32px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      ),
    },
    {
      id: "upload",
      title: "Unggah Audio",
      desc: "Berkas rekaman MP3, WAV, WebM",
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-[32px] lg:h-[32px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      id: "integration",
      title: "Integrasi EMR",
      desc: "Format standar elektronik FHIR",
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-[32px] lg:h-[32px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
        className="hidden"
      />

      {/* Action Hub Grid: 1 col on mobile, 3 cols on sm and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-[18px]">
        {modules.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleModuleClick(m.id)}
            disabled={isProcessing}
            className="group flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed lg:p-[24px] lg:rounded-[14px]"
          >
            {/* Emblem: Clean uniform blue styling */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-2 sm:mb-3 bg-blue-50 text-blue-600 border border-blue-100 shadow-xs group-hover:scale-105 transition-transform lg:w-[64px] lg:h-[64px] lg:mb-[14px]">
              {m.icon}
            </div>

            {/* Title */}
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors lg:text-[15px] lg:leading-[18px]">
              {m.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 lg:text-[12px] lg:leading-[16px] lg:mt-[4px]">
              {m.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

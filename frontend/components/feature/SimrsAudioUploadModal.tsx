"use client";

import React, { useState, useRef } from "react";
import type { AudioPresetItem } from "@/lib/types";

interface SimrsAudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadFile: (file: File) => Promise<void>;
  onSelectPreset: (presetId: string) => Promise<void>;
  presets: AudioPresetItem[];
  isProcessing: boolean;
}

export function SimrsAudioUploadModal({
  isOpen,
  onClose,
  onUploadFile,
  onSelectPreset,
  presets,
  isProcessing,
}: SimrsAudioUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onClose();
      await onUploadFile(file);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onClose();
      await onUploadFile(file);
      e.target.value = "";
    }
  };

  const handlePresetClick = async (presetId: string) => {
    onClose();
    await onSelectPreset(presetId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto lg:max-w-[560px] lg:rounded-[16px]">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 lg:p-[20px]">
          <div className="flex items-center gap-3 lg:gap-[12px]">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs lg:w-[42px] lg:h-[42px] lg:rounded-[10px]">
              <svg className="w-5 h-5 lg:w-[22px] lg:h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 lg:text-[17px] lg:leading-[22px]">
                Unggah Audio Konsultasi
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 lg:text-[12px] lg:leading-[16px] lg:mt-[2px]">
                Tarik & lepas berkas audio rekaman atau gunakan preset suara dummy
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

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
          className="hidden"
        />

        {/* Modal Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-4 lg:p-[20px] lg:gap-[16px]">
          {/* 1. Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer lg:p-[28px] lg:rounded-[14px] lg:gap-[12px] ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/70 scale-[0.99]"
                : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 hover:border-indigo-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform lg:w-[48px] lg:h-[48px] lg:rounded-[12px] ${
                isDragging
                  ? "bg-indigo-600 text-white scale-110"
                  : "bg-indigo-50 text-indigo-600 border border-indigo-100"
              }`}
            >
              <svg className="w-6 h-6 lg:w-[24px] lg:h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm font-bold text-slate-800 lg:text-[14px]">
                {isDragging ? "Lepaskan berkas di sini..." : "Tarik & Lepas Berkas Audio ke Sini"}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 lg:text-[12px] lg:mt-[4px]">
                atau <span className="text-indigo-600 font-semibold underline">Pilih berkas dari komputer</span>
              </p>
              <span className="text-[10px] text-slate-400 mt-2 px-2.5 py-0.5 rounded-full bg-slate-200/60 font-medium lg:text-[11px] lg:mt-[8px] lg:px-[10px] lg:py-[2px]">
                Mendukung: MP3, WAV, WebM, M4A, OGG
              </span>
            </div>
          </div>

          {/* 2. Divider Bersih */}
          <div className="relative flex items-center justify-center my-0.5 lg:my-[2px]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider lg:px-[12px] lg:text-[11px]">
              Atau Pilih Audio Simulasi Dummy
            </span>
          </div>

          {/* 3. 2 Menu Audio Dummy (Simulasi 1 & Simulasi 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-[12px]">
            {/* Audio Simulasi 1 */}
            <button
              type="button"
              onClick={() => handlePresetClick("preset-1")}
              disabled={isProcessing}
              className="group p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer text-left flex flex-col justify-between gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed lg:p-[14px] lg:rounded-[12px] lg:gap-[10px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform lg:w-[32px] lg:h-[32px] lg:rounded-[8px]">
                  <svg className="w-4 h-4 lg:w-[16px] lg:h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200 lg:text-[10px] lg:px-[8px] lg:py-[2px]">
                  Preset 1
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors lg:text-[13px] lg:leading-[17px]">
                  {presets[0]?.title || "Audio Simulasi 1"}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed lg:text-[11px] lg:leading-[15px] lg:mt-[2px]">
                  {presets[0]?.description || "Kasus Hipertensi & Diabetes Melitus (Ny. Siti Rahma)"}
                </p>
              </div>
            </button>

            {/* Audio Simulasi 2 */}
            <button
              type="button"
              onClick={() => handlePresetClick("preset-2")}
              disabled={isProcessing}
              className="group p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/60 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer text-left flex flex-col justify-between gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed lg:p-[14px] lg:rounded-[12px] lg:gap-[10px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform lg:w-[32px] lg:h-[32px] lg:rounded-[8px]">
                  <svg className="w-4 h-4 lg:w-[16px] lg:h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200 lg:text-[10px] lg:px-[8px] lg:py-[2px]">
                  Preset 2
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors lg:text-[13px] lg:leading-[17px]">
                  {presets[1]?.title || "Audio Simulasi 2"}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed lg:text-[11px] lg:leading-[15px] lg:mt-[2px]">
                  {presets[1]?.description || "Kasus GERD & Asam Lambung (Tn. Budi Santoso)"}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 lg:p-[16px] lg:text-[12px]">
          <span>Format didukung: Audio 16kHz - 48kHz</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors cursor-pointer lg:px-[12px] lg:py-[6px] lg:text-[12px] lg:rounded-[6px]"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

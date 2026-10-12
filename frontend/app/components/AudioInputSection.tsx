"use client";

import React, { useState, useRef, useEffect } from "react";

interface AudioInputSectionProps {
  onProcessAudio: (audioBlob: Blob, filename?: string) => Promise<void>;
  onUseSampleText: () => Promise<void>;
  isProcessing: boolean;
}

export function AudioInputSection({
  onProcessAudio,
  onUseSampleText,
  isProcessing,
}: AudioInputSectionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Timer rekaman
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      setMicError(null);
      setSelectedFile(null);
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Hentikan seluruh stream tracks
        stream.getTracks().forEach((track) => track.stop());

        // Langsung trigger pemrosesan pipeline
        await onProcessAudio(audioBlob, "rekaman-konsultasi.webm");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (err) {
      console.error("Gagal mengakses mikrofon:", err);
      setMicError(
        "Izin mikrofon tidak diberikan atau perangkat tidak ditemukan. Anda dapat mengunggah file audio atau mencoba rekaman simulasi."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setMicError(null);
      await onProcessAudio(file, file.name);
    }
  };

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800 lg:p-[28px] lg:rounded-[16px]">
      <div className="flex flex-col gap-4 lg:gap-[20px]">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-[12px]">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 lg:text-[18px] lg:leading-[22px]">
              Tahap 1: Input Audio Konsultasi Dokter - Pasien
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 lg:text-[13px] lg:leading-[18px]">
              Rekam percakapan langsung via mikrofon, unggah berkas audio (MP3/WAV/WebM), atau gunakan preset simulasi.
            </p>
          </div>

          <button
            type="button"
            onClick={onUseSampleText}
            disabled={isProcessing || isRecording}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/40 lg:px-[16px] lg:py-[10px] lg:text-[13px] lg:rounded-[10px] lg:gap-[8px]"
          >
            <svg
              className="w-4 h-4 lg:w-[16px] lg:h-[16px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Uji Coba Cepat (Sample Klinik)
          </button>
        </div>

        {/* Microphone Error Alert */}
        {micError && (
          <div className="p-3 text-xs rounded-xl bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 lg:p-[12px] lg:text-[13px] lg:rounded-[10px]">
            {micError}
          </div>
        )}

        {/* Main Action Grid: Mic vs File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-[20px]">
          {/* Method A: Microphone Live Record */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 lg:p-[28px] lg:rounded-[14px]">
            {!isRecording ? (
              <div className="flex flex-col items-center text-center gap-3 lg:gap-[14px]">
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isProcessing}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 lg:w-[68px] lg:h-[68px] lg:rounded-[9999px]"
                  title="Mulai Rekam Konsultasi"
                >
                  <svg
                    className="w-7 h-7 lg:w-[28px] lg:h-[28px]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </button>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:text-[15px]">
                    Rekam Percakapan Langsung
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 lg:text-[12px]">
                    Klik tombol untuk merekam anamnesis dokter-pasien
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-3 lg:gap-[14px]">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 font-mono text-sm font-bold animate-pulse dark:bg-red-950/60 dark:text-red-400 lg:px-[14px] lg:py-[6px] lg:text-[15px] lg:rounded-[9999px] lg:gap-[8px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 lg:w-[10px] lg:h-[10px]" />
                  Merekam: {formatTimer(recordingSeconds)}
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors dark:bg-white dark:text-zinc-900 lg:px-[22px] lg:py-[10px] lg:text-[13px] lg:rounded-[10px]"
                >
                  Selesai & Proses Flow
                </button>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 lg:text-[12px]">
                  Klik untuk menyelesaikan rekaman dan memulai transkripsi
                </p>
              </div>
            )}
          </div>

          {/* Method B: Upload File */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 lg:p-[28px] lg:rounded-[14px]">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
              className="hidden"
            />
            <div className="flex flex-col items-center text-center gap-3 lg:gap-[14px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing || isRecording}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200 transition-colors disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 lg:w-[68px] lg:h-[68px] lg:rounded-[9999px]"
              >
                <svg
                  className="w-7 h-7 lg:w-[28px] lg:h-[28px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </button>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:text-[15px]">
                  Unggah Berkas Audio
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 lg:text-[12px]">
                  Pilih file audio MP3, WAV, WebM, atau M4A
                </p>
              </div>
              {selectedFile && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-xs lg:text-[13px]">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Audio Player Preview */}
        {audioUrl && (
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800 lg:p-[12px] lg:rounded-[10px] lg:gap-[12px]">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 shrink-0 lg:text-[12px]">
              Audio Player:
            </span>
            <audio src={audioUrl} controls className="w-full h-8 lg:h-[36px]" />
          </div>
        )}
      </div>
    </div>
  );
}

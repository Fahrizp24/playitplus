"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface SimrsRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecording: (audioBlob: Blob, filename: string) => Promise<void>;
  isProcessing: boolean;
}

export function SimrsRecordingModal({
  isOpen,
  onClose,
  onSaveRecording,
  isProcessing,
}: SimrsRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = async () => {
    try {
      setMicError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        onClose();
        await onSaveRecording(audioBlob, "anamnesis-konsultasi.webm");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSeconds(0);
    } catch (err) {
      console.error("Gagal mikrofon:", err);
      setMicError("Izin mikrofon tidak diberikan atau perangkat audio tidak terdeteksi.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setSeconds(0);
    setMicError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden lg:max-w-[460px] lg:rounded-[18px]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200 lg:px-[24px] lg:py-[18px]">
          <div className="flex items-center gap-2.5 lg:gap-[10px]">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 font-bold lg:w-[36px] lg:h-[36px] lg:rounded-[8px]">
              <svg className="w-4 h-4 lg:w-[18px] lg:h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 lg:text-[16px] lg:leading-[20px]">
                Rekam Anamnesis Suara
              </h3>
              <p className="text-xs text-slate-500 lg:text-[12px]">
                Konsultasi Dokter & Pasien
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
          >
            <svg className="w-5 h-5 lg:w-[20px] lg:h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center gap-4 lg:p-[28px] lg:gap-[18px]">
          {micError && (
            <div className="w-full p-3 text-xs rounded-xl bg-red-50 text-red-800 border border-red-200 lg:p-[12px] lg:text-[12px]">
              {micError}
            </div>
          )}

          {/* Big Record Button */}
          <div className="relative my-2 lg:my-[8px]">
            <button
              type="button"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
              className={`relative flex items-center justify-center w-20 h-20 rounded-full text-white transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed lg:w-[88px] lg:h-[88px] ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <svg className="w-9 h-9 lg:w-[38px] lg:h-[38px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
          </div>

          {/* Status & Timer */}
          <div>
            <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider lg:text-[28px] lg:leading-[32px]">
              {formatTimer(seconds)}
            </p>
            <p className="text-xs text-slate-500 mt-1 lg:text-[13px]">
              {isRecording
                ? "Sedang merekam percakapan... Klik tombol untuk selesai."
                : "Klik tombol mikrofon di atas untuk mulai merekam percakapan."}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-t border-slate-200 lg:px-[24px] lg:py-[16px]">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          {isRecording ? (
            <Button type="button" variant="primary" onClick={handleStopRecording}>
              Selesai & Ekstraksi Draf
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={handleStartRecording}>
              Mulai Merekam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

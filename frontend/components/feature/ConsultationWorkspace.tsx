"use client";

import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PatientQueueSidebar } from "@/components/feature/PatientQueueSidebar";
import { SimrsRecordingModal } from "@/components/feature/SimrsRecordingModal";
import { SimrsIntegrationModal } from "@/components/feature/SimrsIntegrationModal";
import { TranscriptAndPrivacyPanel } from "@/components/feature/TranscriptAndPrivacyPanel";
import { SoapWorkspacePanel } from "@/components/feature/SoapWorkspacePanel";
import {
  getConsultationQueue,
  getAudioPresets,
  processAudioPreset,
  transcribeConsultationAudio,
  autofillConsultationSoap,
} from "@/lib/api";
import type {
  AudioPresetItem,
  ConsultationQueueItem,
  DeidentificationResult,
  SOAPData,
} from "@/lib/types";

interface ConsultationWorkspaceProps {
  initialSamples?: unknown;
}

export function ConsultationWorkspace({}: ConsultationWorkspaceProps = {}) {
  // 1. Antrean Pasien & Pasien Aktif
  const [queue, setQueue] = useState<ConsultationQueueItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<ConsultationQueueItem | null>(null);
  const [isLoadingQueue, setIsLoadingQueue] = useState<boolean>(true);
  const [isOpenMobileQueue, setIsOpenMobileQueue] = useState<boolean>(false);

  // 2. Preset Suara Simulasi
  const [presets, setPresets] = useState<AudioPresetItem[]>([]);
  const [processingPresetId, setProcessingPresetId] = useState<string | null>(null);

  // 3. State Hasil Pemrosesan Konsultasi
  const [transcript, setTranscript] = useState<string>("");
  const [deidentification, setDeidentification] = useState<DeidentificationResult | null>(null);
  const [soapData, setSoapData] = useState<SOAPData | null>(null);
  const [highlightQuote, setHighlightQuote] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 4. Progressive Loading State
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);

  // 5. Tab & Modal State
  const [activeSoapTab, setActiveSoapTab] = useState<"soap" | "patientSummary">("soap");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  // Memuat antrean pasien dari BE pada awal render
  useEffect(() => {
    let ignore = false;
    getConsultationQueue()
      .then((data) => {
        if (!ignore) {
          setQueue(data.queue);
          setIsLoadingQueue(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error("Gagal memuat antrean awal:", err);
          setIsLoadingQueue(false);
        }
      });

    getAudioPresets()
      .then((data) => {
        if (!ignore) {
          setPresets(data.presets);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.warn("Gagal memuat preset audio dari BE:", err);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefreshQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const data = await getConsultationQueue();
      setQueue(data.queue);
    } catch (err: unknown) {
      console.error("Gagal menyegarkan antrean:", err);
      const msg = err instanceof Error ? err.message : "Gagal menyegarkan antrean.";
      setErrorMessage(msg);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  const scrollToWorkspace = () => {
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Memilih Pasien dari Antrean
  const handleSelectPatient = (patient: ConsultationQueueItem) => {
    setSelectedPatient(patient);
    setErrorMessage(null);
    setIsTranscribing(false);
    setIsGeneratingSoap(false);
    setHighlightQuote(null);
    setTranscript(patient.transcript || "");
    setDeidentification(patient.deidentification || null);
    setSoapData(patient.soap || null);

    if (patient.transcript || patient.soap) {
      scrollToWorkspace();
    }
  };

  // Melepas / Mengganti Pasien Aktif
  const handleDeselectPatient = () => {
    setSelectedPatient(null);
    setTranscript("");
    setDeidentification(null);
    setSoapData(null);
    setHighlightQuote(null);
    setErrorMessage(null);
    setIsTranscribing(false);
    setIsGeneratingSoap(false);
  };

  // Alur 1: Proses Preset Suara Simulasi (1 atau 2)
  const handleProcessPreset = async (presetId: string) => {
    if (!selectedPatient) return;

    setErrorMessage(null);
    setSoapData(null);
    setHighlightQuote(null);
    setIsTranscribing(true);
    setIsGeneratingSoap(false);
    setProcessingPresetId(presetId);

    try {
      // Tahap 1: Panggil backend preset process
      const result = await processAudioPreset(presetId);

      setTranscript(result.stt.transcript);
      if (result.deidentification) {
        setDeidentification(result.deidentification);
      }
      setIsTranscribing(false);
      scrollToWorkspace();

      // Tahap 2: Simulasi ekstraksi SOAP AI bertahap
      setIsGeneratingSoap(true);
      await new Promise((r) => setTimeout(r, 600));
      setSoapData(result.soap);

      // Simpan ke pasien aktif dan update daftar antrean lokal
      const updatedPatient: ConsultationQueueItem = {
        ...selectedPatient,
        status: "Selesai Anamnesis",
        transcript: result.stt.transcript,
        deidentification: result.deidentification,
        soap: result.soap,
      };
      setSelectedPatient(updatedPatient);
      setQueue((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      );
    } catch (err: unknown) {
      console.error("Gagal memproses simulasi suara:", err);
      const msg = err instanceof Error ? err.message : "Gagal memproses audio preset simulasi.";
      setErrorMessage(msg);
    } finally {
      setIsTranscribing(false);
      setIsGeneratingSoap(false);
      setProcessingPresetId(null);
    }
  };

  // Alur 2: Proses Audio Asli (Mikrofon atau Berkas Upload)
  const handleProcessAudio = async (audioBlob: Blob, filename: string) => {
    if (!selectedPatient) return;

    setIsRecordModalOpen(false);
    setErrorMessage(null);
    setSoapData(null);
    setHighlightQuote(null);
    setIsTranscribing(true);
    setIsGeneratingSoap(false);

    try {
      // TAHAP 1: Transkripsi Audio & Diarization Pembicara via STT
      const sttResult = await transcribeConsultationAudio(audioBlob, filename);
      setTranscript(sttResult.text);
      if (sttResult.deidentification) {
        setDeidentification(sttResult.deidentification);
      }
      setIsTranscribing(false);
      scrollToWorkspace();

      // TAHAP 2: Ekstraksi Catatan Medis SOAP
      setIsGeneratingSoap(true);
      const textToExtract = sttResult.deidentification?.deidentifiedText || sttResult.text;
      const soapResult = await autofillConsultationSoap(textToExtract);
      setSoapData(soapResult.soap);

      // Simpan ke pasien aktif dan update daftar antrean lokal
      const updatedPatient: ConsultationQueueItem = {
        ...selectedPatient,
        status: "Selesai Anamnesis",
        transcript: sttResult.text,
        deidentification: sttResult.deidentification,
        soap: soapResult.soap,
      };
      setSelectedPatient(updatedPatient);
      setQueue((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      );
    } catch (err: unknown) {
      console.error("Gagal memproses alur konsultasi:", err);
      const msg = err instanceof Error ? err.message : "Gagal memproses berkas audio.";
      setErrorMessage(msg);
    } finally {
      setIsTranscribing(false);
      setIsGeneratingSoap(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleProcessAudio(file, file.name);
      e.target.value = "";
    }
  };

  const isProcessing = isTranscribing || isGeneratingSoap;
  const processingStatusText = isTranscribing
    ? "Tahap 1/2: Mentranskripsikan audio & mengenali pembicara (Dokter & Pasien)..."
    : isGeneratingSoap
    ? "Tahap 2/2: AI Copilot sedang mengekstrak catatan SOAP medis & rekomendasi resep..."
    : "";

  const handleSelectQuote = (quote: string) => {
    setHighlightQuote((prev) => (prev === quote ? null : quote));
  };

  const hasConsultationData = Boolean(transcript || isTranscribing || isGeneratingSoap || soapData);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased">
      {/* 1. Header Utama SIMRS */}
      <Header clinicName="Poliklinik Rawat Jalan" />

      {/* 2. Mobile Queue Quick-Bar (Hanya di layar kecil) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpenMobileQueue(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Daftar Antrean ({queue.length})</span>
        </button>

        {selectedPatient ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {selectedPatient.queueNumber}
            </span>
            <span className="font-bold text-slate-800 truncate max-w-[140px]">
              {selectedPatient.patientName}
            </span>
          </div>
        ) : (
          <span className="text-xs text-amber-600 font-medium">Pilih pasien di antrean</span>
        )}
      </div>

      {/* Hidden File Input untuk Unggah Berkas Audio */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
        className="hidden"
      />

      {/* 3. Main Layout: Sidebar Kiri (Antrean) + Area Kerja Kanan */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row items-start gap-4 lg:px-[32px] lg:py-[20px] lg:gap-[20px]">
        {/* Sidebar Antrean Pasien */}
        <PatientQueueSidebar
          queue={queue}
          selectedPatientId={selectedPatient?.id || null}
          onSelectPatient={handleSelectPatient}
          isLoading={isLoadingQueue}
          onRefresh={handleRefreshQueue}
          isOpenMobile={isOpenMobileQueue}
          onCloseMobile={() => setIsOpenMobileQueue(false)}
        />

        {/* Area Kerja Utama */}
        <main className="flex-1 w-full min-w-0 flex flex-col gap-4 lg:gap-[16px]">
          {/* Error Notification */}
          {errorMessage && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs shadow-xs lg:p-[14px] lg:text-[13px] lg:rounded-[10px]">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="font-bold underline ml-2 cursor-pointer lg:ml-[8px]"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Processing Notification */}
          {isProcessing && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs shadow-xs animate-pulse lg:p-[14px] lg:text-[13px] lg:rounded-[10px] lg:gap-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping lg:w-[8px] lg:h-[8px]" />
              <span className="font-semibold">{processingStatusText || "Memproses..."}</span>
            </div>
          )}

          {/* KONDISI 1: Belum Ada Pasien yang Dipilih */}
          {!selectedPatient && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xs lg:p-[48px] lg:rounded-[16px] lg:gap-[16px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs lg:w-[64px] lg:h-[64px] lg:rounded-[14px]">
                <svg className="w-8 h-8 lg:w-[32px] lg:h-[32px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <div className="max-w-md">
                <h3 className="text-base font-bold text-slate-900 lg:text-[18px] lg:leading-[22px]">
                  Pilih Pasien dari Antrean
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed lg:text-[13px] lg:leading-[18px] lg:mt-[6px]">
                  Silakan pilih salah satu pasien dari daftar antrean SIMRS di sidebar sebelah kiri
                  untuk membuka modul rekam suara, unggah rekaman, dan simulasi anamnesis.
                </p>
              </div>

              {queue.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleSelectPatient(queue[0])}
                  className="mt-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2 lg:px-[16px] lg:py-[10px] lg:text-[13px] lg:rounded-[10px] lg:gap-[8px]"
                >
                  <span>Mulai Konsultasi Pasien Pertama ({queue[0].queueNumber})</span>
                  <svg className="w-4 h-4 lg:w-[16px] lg:h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* KONDISI 2: Pasien Telah Dipilih */}
          {selectedPatient && (
            <>
              {/* Banner Identitas Pasien Aktif */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:p-[18px] lg:rounded-[14px] lg:gap-[16px]">
                <div className="flex items-start sm:items-center gap-3.5 lg:gap-[14px]">
                  <div className="px-3 py-2 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm tracking-wider shadow-xs text-center shrink-0 lg:px-[14px] lg:py-[10px] lg:text-[15px] lg:rounded-[10px]">
                    {selectedPatient.queueNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap lg:gap-[8px]">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 lg:text-[17px] lg:leading-[22px]">
                        {selectedPatient.patientName}
                      </h2>
                      <span className="text-xs text-slate-500 font-medium lg:text-[13px]">
                        ({selectedPatient.patientAge} th, {selectedPatient.gender})
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 lg:text-[11px] lg:px-[8px] lg:py-[2px]">
                        {selectedPatient.clinicService}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 lg:text-[12px] lg:leading-[16px] lg:mt-[4px]">
                      <span className="font-semibold text-slate-700">Keluhan Awal: </span>
                      {selectedPatient.chiefComplaint}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 lg:gap-[8px]">
                  {selectedPatient.soap ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 lg:text-[12px] lg:px-[10px] lg:py-[5px] lg:rounded-[6px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 lg:w-[6px] lg:h-[6px]" />
                      Selesai Anamnesis
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 lg:text-[12px] lg:px-[10px] lg:py-[5px] lg:rounded-[6px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse lg:w-[6px] lg:h-[6px]" />
                      Sesi Konsultasi Aktif
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleDeselectPatient}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors cursor-pointer lg:px-[12px] lg:py-[6px] lg:text-[12px] lg:rounded-[6px]"
                  >
                    Ganti Pasien
                  </button>
                </div>
              </div>

              {/* 4 Pilihan Tindakan Anamnesis (HANYA MUNCUL SETELAH MEMILIH PASIEN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-[12px]">
                {/* 1. Rekam Suara (Mikrofon) */}
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(true)}
                  disabled={isProcessing}
                  className="group p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-pointer text-left flex flex-col justify-between disabled:opacity-60 disabled:cursor-not-allowed lg:p-[16px] lg:rounded-[12px]"
                >
                  <div className="flex items-center justify-between mb-3 lg:mb-[12px]">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform lg:w-[40px] lg:h-[40px] lg:rounded-[10px]">
                      <svg className="w-5 h-5 lg:w-[20px] lg:h-[20px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 lg:text-[11px] lg:px-[8px] lg:py-[2px]">
                      Mikrofon
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors lg:text-[14px] lg:leading-[18px]">
                      Rekam Suara
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 lg:text-[11px] lg:leading-[15px] lg:mt-[4px]">
                      Anamnesis live via mikrofon dokter & pasien
                    </p>
                  </div>
                </button>

                {/* 2. Unggah Audio (Berkas) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="group p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-pointer text-left flex flex-col justify-between disabled:opacity-60 disabled:cursor-not-allowed lg:p-[16px] lg:rounded-[12px]"
                >
                  <div className="flex items-center justify-between mb-3 lg:mb-[12px]">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform lg:w-[40px] lg:h-[40px] lg:rounded-[10px]">
                      <svg className="w-5 h-5 lg:w-[20px] lg:h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 lg:text-[11px] lg:px-[8px] lg:py-[2px]">
                      Berkas
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors lg:text-[14px] lg:leading-[18px]">
                      Unggah Audio
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 lg:text-[11px] lg:leading-[15px] lg:mt-[4px]">
                      Upload berkas rekaman MP3, WAV, atau WebM
                    </p>
                  </div>
                </button>

                {/* 3. Audio Simulasi 1 (Hipertensi & DM) */}
                <button
                  type="button"
                  onClick={() => handleProcessPreset("preset-1")}
                  disabled={isProcessing}
                  className="group p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all cursor-pointer text-left flex flex-col justify-between disabled:opacity-60 disabled:cursor-not-allowed lg:p-[16px] lg:rounded-[12px]"
                >
                  <div className="flex items-center justify-between mb-3 lg:mb-[12px]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform lg:w-[40px] lg:h-[40px] lg:rounded-[10px]">
                      <svg className="w-5 h-5 lg:w-[20px] lg:h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 lg:text-[11px] lg:px-[8px] lg:py-[2px]">
                      {processingPresetId === "preset-1" && (
                        <span className="w-2 h-2 rounded-full border border-emerald-600 border-t-transparent animate-spin lg:w-[8px] lg:h-[8px]" />
                      )}
                      Simulasi 1
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors lg:text-[14px] lg:leading-[18px]">
                      {presets[0]?.title || "Audio Simulasi 1"}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 lg:text-[11px] lg:leading-[15px] lg:mt-[4px]">
                      {presets[0]?.description || "Kasus Hipertensi & Diabetes Melitus"}
                    </p>
                  </div>
                </button>

                {/* 4. Audio Simulasi 2 (GERD & Asam Lambung) */}
                <button
                  type="button"
                  onClick={() => handleProcessPreset("preset-2")}
                  disabled={isProcessing}
                  className="group p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 hover:-translate-y-0.5 transition-all cursor-pointer text-left flex flex-col justify-between disabled:opacity-60 disabled:cursor-not-allowed lg:p-[16px] lg:rounded-[12px]"
                >
                  <div className="flex items-center justify-between mb-3 lg:mb-[12px]">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform lg:w-[40px] lg:h-[40px] lg:rounded-[10px]">
                      <svg className="w-5 h-5 lg:w-[20px] lg:h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1 lg:text-[11px] lg:px-[8px] lg:py-[2px]">
                      {processingPresetId === "preset-2" && (
                        <span className="w-2 h-2 rounded-full border border-amber-600 border-t-transparent animate-spin lg:w-[8px] lg:h-[8px]" />
                      )}
                      Simulasi 2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors lg:text-[14px] lg:leading-[18px]">
                      {presets[1]?.title || "Audio Simulasi 2"}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 lg:text-[11px] lg:leading-[15px] lg:mt-[4px]">
                      {presets[1]?.description || "Kasus GERD & Asam Lambung"}
                    </p>
                  </div>
                </button>
              </div>

              {/* Lembar Kerja Konsultasi (Tampil saat transkrip atau SOAP diproses / ada) */}
              {hasConsultationData && (
                <div ref={workspaceRef} className="flex flex-col gap-4 mt-2 lg:gap-[16px] lg:mt-[8px]">
                  {/* Action Bar Lembar Kerja */}
                  <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs lg:p-[14px] lg:rounded-[10px]">
                    <div className="flex items-center gap-2 lg:gap-[8px]">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 lg:text-[15px] lg:leading-[18px]">
                        Dokumentasi Konsultasi Aktif
                      </h3>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono lg:text-[11px] lg:px-[8px] lg:py-[2px]">
                        {selectedPatient.queueNumber} - {selectedPatient.patientName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-[8px]">
                      <button
                        type="button"
                        onClick={() => setIsIntegrationModalOpen(true)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 lg:px-[12px] lg:py-[6px] lg:text-[12px] lg:rounded-[6px] lg:gap-[6px]"
                      >
                        <svg className="w-3.5 h-3.5 lg:w-[14px] lg:h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        <span>Integrasi EMR</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeselectPatient}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shadow-xs lg:px-[10px] lg:py-[6px] lg:text-[12px] lg:rounded-[6px]"
                      >
                        Tutup Sesi
                      </button>
                    </div>
                  </div>

                  {/* Panel Hasil: Kiri Transkrip & Sensor, Kanan SOAP & Ringkasan */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-[20px]">
                    <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-[16px]">
                      <TranscriptAndPrivacyPanel
                        transcript={transcript}
                        deidentification={deidentification}
                        highlightQuote={highlightQuote}
                      />
                    </div>

                    <div className="lg:col-span-7 flex flex-col gap-4 lg:gap-[16px]">
                      <SoapWorkspacePanel
                        soapData={soapData}
                        isLoading={isGeneratingSoap}
                        onSelectQuote={handleSelectQuote}
                        activeQuote={highlightQuote}
                        activeTab={activeSoapTab}
                        onTabChange={setActiveSoapTab}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />

      {/* Modals */}
      <SimrsRecordingModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSaveRecording={handleProcessAudio}
        isProcessing={isProcessing}
      />

      <SimrsIntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
        hasSoapData={Boolean(soapData)}
        diagnosis={soapData ? soapData.assessment.primaryDiagnosis : undefined}
      />
    </div>
  );
}

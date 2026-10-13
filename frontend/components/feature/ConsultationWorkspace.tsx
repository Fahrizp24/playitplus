"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SimrsModuleGrid } from "@/components/feature/SimrsModuleGrid";
import { SimrsRecordingModal } from "@/components/feature/SimrsRecordingModal";
import { SimrsIntegrationModal } from "@/components/feature/SimrsIntegrationModal";
import { TranscriptAndPrivacyPanel } from "@/components/feature/TranscriptAndPrivacyPanel";
import { SoapWorkspacePanel } from "@/components/feature/SoapWorkspacePanel";
import {
  getConsultationSamples,
  transcribeConsultationAudio,
  autofillConsultationSoap,
  deidentifyText,
} from "@/lib/api";
import type {
  ConsultationSamplesResponse,
  DeidentificationResult,
  SOAPData,
} from "@/lib/types";

interface ConsultationWorkspaceProps {
  initialSamples: ConsultationSamplesResponse | null;
}

export function ConsultationWorkspace({
  initialSamples,
}: ConsultationWorkspaceProps) {
  // TanStack Query: Fetch samples dengan initialData dari Server Component
  const { data: samplesData } = useQuery({
    queryKey: ["consultation", "samples"],
    queryFn: getConsultationSamples,
    initialData: initialSamples ?? undefined,
  });

  // State hasil pemrosesan konsultasi
  const [transcript, setTranscript] = useState<string>("");
  const [deidentification, setDeidentification] = useState<DeidentificationResult | null>(null);
  const [soapData, setSoapData] = useState<SOAPData | null>(null);
  const [highlightQuote, setHighlightQuote] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Progressive Loading State
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);

  // Tab & Modal State
  const [activeSoapTab, setActiveSoapTab] = useState<"soap" | "patientSummary">("soap");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const scrollToWorkspace = () => {
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // 1. Alur Audio Bertahap: Transkrip -> Muncul Dulu -> Ekstraksi SOAP Muncul Belakangan
  const handleProcessAudio = async (audioBlob: Blob, filename: string) => {
    setIsRecordModalOpen(false);
    setErrorMessage(null);
    setSoapData(null);
    setHighlightQuote(null);
    setIsTranscribing(true);
    setIsGeneratingSoap(false);

    try {
      // TAHAP 1: Transkripsi Audio & Pengenalan Giliran Bicara (Dokter & Pasien)
      const sttResult = await transcribeConsultationAudio(audioBlob, filename);
      setTranscript(sttResult.text);
      if (sttResult.deidentification) {
        setDeidentification(sttResult.deidentification);
      }
      setIsTranscribing(false);

      // Transkrip langsung tampil! Lembar kerja dibuka dan digulirkan
      scrollToWorkspace();

      // TAHAP 2: Ekstraksi Catatan Medis SOAP (Komponen SOAP menampilkan draf memuat)
      setIsGeneratingSoap(true);
      const textToExtract = sttResult.deidentification?.deidentifiedText || sttResult.text;
      const soapResult = await autofillConsultationSoap(textToExtract);
      setSoapData(soapResult.soap);
    } catch (err: unknown) {
      console.error("Gagal memproses alur konsultasi:", err);
      const msg = err instanceof Error ? err.message : "Gagal memproses berkas audio.";
      setErrorMessage(msg);
    } finally {
      setIsTranscribing(false);
      setIsGeneratingSoap(false);
    }
  };

  // 2. Alur Teks Simulasi Kasus
  const handleRunSample = async () => {
    const sampleText = samplesData?.samples?.[0]?.text;
    if (!sampleText) {
      setErrorMessage(
        "Data sampel telah dinonaktifkan di server. Silakan gunakan Rekam Suara atau Unggah Audio untuk menguji model AI secara langsung."
      );
      return;
    }

    setErrorMessage(null);
    setSoapData(null);
    setHighlightQuote(null);
    setIsTranscribing(false);

    // TAHAP 1: Transkrip teks sampel langsung tampil
    setTranscript(sampleText);
    scrollToWorkspace();

    try {
      // Deidentifikasi teks
      const deid = await deidentifyText(sampleText);
      setDeidentification(deid);

      // TAHAP 2: Ekstraksi Catatan SOAP
      setIsGeneratingSoap(true);
      const soapResult = await autofillConsultationSoap(deid.deidentifiedText || sampleText);
      setSoapData(soapResult.soap);
    } catch (err: unknown) {
      console.error("Gagal memproses simulasi sampel:", err);
      const msg = err instanceof Error ? err.message : "Gagal memproses simulasi kasus.";
      setErrorMessage(msg);
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const isProcessing = isTranscribing || isGeneratingSoap;
  const processingStatusText = isTranscribing
    ? "Tahap 1/2: Mentranskripsikan audio & mengenali pembicara..."
    : isGeneratingSoap
    ? "Tahap 2/2: AI Copilot sedang mengekstrak catatan SOAP medis & resep..."
    : "";

  const handleSelectQuote = (quote: string) => {
    setHighlightQuote((prev) => (prev === quote ? null : quote));
  };

  const handleResetConsultation = () => {
    setTranscript("");
    setDeidentification(null);
    setSoapData(null);
    setHighlightQuote(null);
    setErrorMessage(null);
    setIsTranscribing(false);
    setIsGeneratingSoap(false);
  };

  const hasConsultationData = Boolean(transcript || isTranscribing || isGeneratingSoap || soapData);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased">
      {/* 1. Header SIMRS Clean */}
      <Header clinicName="Poliklinik Rawat Jalan" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5 lg:px-[32px] lg:py-[20px] lg:gap-[20px]">
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

        {/* 2. Menu Modul Utama SIMRS (4 Action Cards: Rekam, Unggah, Simulasi, Integrasi) */}
        <SimrsModuleGrid
          onOpenRecord={() => setIsRecordModalOpen(true)}
          onUploadFile={async (file) => handleProcessAudio(file, file.name)}
          onRunSample={handleRunSample}
          onOpenIntegrationModal={() => setIsIntegrationModalOpen(true)}
          isProcessing={isProcessing}
        />

        {/* 3. Lembar Kerja Konsultasi (Tampil saat data ada atau diproses) */}
        {hasConsultationData && (
          <div ref={workspaceRef} className="flex flex-col gap-4 mt-2 lg:gap-[16px] lg:mt-[8px]">
            {/* Header Tindakan */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs lg:p-[14px] lg:rounded-[10px]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 lg:text-[15px] lg:leading-[18px]">
                  Dokumentasi Konsultasi Aktif
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetConsultation}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer shadow-xs lg:px-[10px] lg:py-[5px] lg:text-[12px] lg:rounded-[6px]"
              >
                Tutup / Sesi Baru
              </button>
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
      </main>

      <Footer />

      {/* 4. Modals */}
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

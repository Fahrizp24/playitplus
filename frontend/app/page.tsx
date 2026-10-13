"use client";

import React, { useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SimrsModuleGrid } from "@/components/feature/SimrsModuleGrid";
import { SimrsRecordingModal } from "@/components/feature/SimrsRecordingModal";
import { SimrsIntegrationModal } from "@/components/feature/SimrsIntegrationModal";
import { TranscriptAndPrivacyPanel } from "@/components/feature/TranscriptAndPrivacyPanel";
import { SoapWorkspacePanel } from "@/components/feature/SoapWorkspacePanel";
import { getConsultationRepository } from "@/lib/repositories";
import type { DeidentificationResult, SOAPData } from "@/lib/types";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState<string>("");

  // Data Konsultasi (Kosong saat awal, tanpa data dummy)
  const [transcript, setTranscript] = useState<string>("");
  const [deidentification, setDeidentification] = useState<DeidentificationResult | null>(null);
  const [soapData, setSoapData] = useState<SOAPData | null>(null);
  const [highlightQuote, setHighlightQuote] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab & Modal State
  const [activeSoapTab, setActiveSoapTab] = useState<"soap" | "patientSummary">("soap");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const consultationRepo = getConsultationRepository();

  const scrollToWorkspace = () => {
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleProcessAudio = async (audioBlob: Blob, filename: string) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setProcessingStatusText("Mentranskripsikan audio & mengekstrak catatan medis...");

      const result = await consultationRepo.processAudio(audioBlob, filename);

      setTranscript(result.stt.transcript);
      setDeidentification(result.deidentification);
      setSoapData(result.soap);
      scrollToWorkspace();
    } catch (err) {
      console.error("Gagal memproses audio:", err);
      const msg = err instanceof Error ? err.message : "Gagal memproses audio.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatusText("");
    }
  };

  const handleUseSampleText = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setProcessingStatusText("Mengekstrak catatan medis dari kasus sampel...");

      const samplesRes = await consultationRepo.getSamples();
      const sampleText = samplesRes.samples[0]?.text;
      if (!sampleText) {
        throw new Error("Contoh percakapan tidak ditemukan pada server.");
      }

      const result = await consultationRepo.processText(sampleText);

      setTranscript(result.stt.transcript);
      setDeidentification(result.deidentification);
      setSoapData(result.soap);
      scrollToWorkspace();
    } catch (err) {
      console.error("Gagal memproses sample:", err);
      const msg = err instanceof Error ? err.message : "Gagal memproses sampel konsultasi.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatusText("");
    }
  };

  const handleSelectQuote = (quote: string) => {
    if (highlightQuote === quote) {
      setHighlightQuote(null);
    } else {
      setHighlightQuote(quote);
    }
  };

  const handleResetConsultation = () => {
    setTranscript("");
    setDeidentification(null);
    setSoapData(null);
    setHighlightQuote(null);
    setErrorMessage(null);
  };

  const hasConsultationData = Boolean(soapData || transcript);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased">
      {/* 1. Header SIMRS (Tanpa data dummy dokter) */}
      <Header
        clinicName="Poliklinik Rawat Jalan"
      />

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
            <span className="font-semibold">{processingStatusText ? processingStatusText : "Memproses..."}</span>
          </div>
        )}

        {/* 2. Menu Modul Utama SIMRS (Item Besar Bersih & Seragam: Rekam, Unggah, Simulasi, Integrasi) */}
        <SimrsModuleGrid
          onOpenRecord={() => setIsRecordModalOpen(true)}
          onUploadFile={async (file) => handleProcessAudio(file, file.name)}
          onRunSample={handleUseSampleText}
          onOpenIntegrationModal={() => setIsIntegrationModalOpen(true)}
          isProcessing={isProcessing}
        />

        {/* 3. Lembar Kerja Konsultasi (HANYA tampil jika data konsultasi ada atau sedang diproses) */}
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
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer lg:px-[10px] lg:py-[5px] lg:text-[12px] lg:rounded-[6px]"
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

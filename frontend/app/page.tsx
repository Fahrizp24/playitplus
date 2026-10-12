"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PipelineStepTracker, type PipelineStep } from "@/components/feature/PipelineStepTracker";
import { AudioInputSection } from "@/components/feature/AudioInputSection";
import { TranscriptAndPrivacyPanel } from "@/components/feature/TranscriptAndPrivacyPanel";
import { SoapWorkspacePanel } from "@/components/feature/SoapWorkspacePanel";
import {
  getProviderStatus,
  getConsultationSamples,
  processConsultationAudio,
  processConsultationText,
} from "@/lib/api";
import type { DeidentificationResult, ProviderStatus, SOAPData } from "@/lib/types";

export default function Home() {
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<PipelineStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<PipelineStep[]>([]);

  const [transcript, setTranscript] = useState<string>("");
  const [deidentification, setDeidentification] = useState<DeidentificationResult | null>(null);
  const [soapData, setSoapData] = useState<SOAPData | null>(null);
  const [highlightQuote, setHighlightQuote] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ambil status provider saat aplikasi dimuat
  useEffect(() => {
    getProviderStatus()
      .then((status) => setProviderStatus(status))
      .catch((err) => {
        console.warn("Backend belum menyala atau offline:", err);
      });
  }, []);

  const handleProcessAudio = async (audioBlob: Blob, filename?: string) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setCompletedSteps(["audio"]);
      setCurrentStep("stt");

      // Panggil backend full-pipeline
      const result = await processConsultationAudio(audioBlob, filename);

      setCurrentStep("deidentify");
      setCompletedSteps(["audio", "stt"]);

      setCurrentStep("autofill");
      setCompletedSteps(["audio", "stt", "deidentify"]);

      // Simpan seluruh data state
      setTranscript(result.stt.transcript);
      setDeidentification(result.deidentification);
      setSoapData(result.soap);

      setCompletedSteps(["audio", "stt", "deidentify", "autofill"]);
      setCurrentStep(null);
    } catch (err) {
      console.error("Gagal memproses audio:", err);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses audio.";
      setErrorMessage(msg);
      setCurrentStep(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseSampleText = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setCurrentStep("stt");
      setCompletedSteps(["audio"]);

      const samplesRes = await getConsultationSamples().catch(() => null);
      const sampleText = samplesRes?.samples?.[0]?.text || "";

      const result = await processConsultationText(sampleText);

      setCurrentStep("deidentify");
      setCompletedSteps(["audio", "stt"]);

      setCurrentStep("autofill");
      setCompletedSteps(["audio", "stt", "deidentify"]);

      setTranscript(result.stt.transcript);
      setDeidentification(result.deidentification);
      setSoapData(result.soap);

      setCompletedSteps(["audio", "stt", "deidentify", "autofill"]);
      setCurrentStep(null);
    } catch (err) {
      console.error("Gagal memproses sample:", err);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses sample klinis.";
      setErrorMessage(msg);
      setCurrentStep(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectQuote = (quote: string) => {
    if (highlightQuote === quote) {
      setHighlightQuote(null);
    } else {
      setHighlightQuote(quote);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100/70 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 flex flex-col">
      <Header providerStatus={providerStatus} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5 lg:px-[32px] lg:py-[24px] lg:gap-[24px]">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs dark:bg-red-950/50 dark:text-red-200 dark:border-red-900 lg:p-[16px] lg:text-[13px] lg:rounded-[12px]">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="font-bold underline ml-2 lg:ml-[8px]"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 1. Pipeline Step Tracker */}
        <PipelineStepTracker
          currentStep={currentStep}
          isProcessing={isProcessing}
          completedSteps={completedSteps}
        />

        {/* 2. Audio Input Section */}
        <AudioInputSection
          onProcessAudio={handleProcessAudio}
          onUseSampleText={handleUseSampleText}
          isProcessing={isProcessing}
        />

        {/* 3. Side-by-side or stacked panels: Transcript & Privacy + SOAP Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-[24px]">
          {/* Left Column: STT & Deidentifikasi */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:gap-[24px]">
            <TranscriptAndPrivacyPanel
              transcript={transcript}
              deidentification={deidentification}
              highlightQuote={highlightQuote}
            />
          </div>

          {/* Right Column: SOAP Clinical & Patient Summary Workspace */}
          <div className="lg:col-span-7 flex flex-col gap-5 lg:gap-[24px]">
            <SoapWorkspacePanel
              soapData={soapData}
              onSelectQuote={handleSelectQuote}
              activeQuote={highlightQuote}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

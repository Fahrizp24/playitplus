"use client";

import React, { useState } from "react";
import type { Medication, SOAPData, TraceableQuote } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface SoapWorkspacePanelProps {
  soapData: SOAPData | null;
  onSelectQuote: (quote: string) => void;
  activeQuote: string | null;
  activeTab?: "soap" | "patientSummary";
  onTabChange?: (tab: "soap" | "patientSummary") => void;
}

function formatDisplayDate(val: unknown): string {
  if (!val) return "-";
  if (val instanceof Date) {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(val);
    } catch {
      return val.toISOString().split("T")[0];
    }
  }
  return String(val);
}

export function SoapWorkspacePanel({
  soapData,
  onSelectQuote,
  activeQuote,
  activeTab: controlledTab,
  onTabChange,
}: SoapWorkspacePanelProps) {
  const [internalTab, setInternalTab] = useState<"soap" | "patientSummary">("soap");
  const activeTab = controlledTab ?? internalTab;

  const handleTabChange = (tab: "soap" | "patientSummary") => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);

  if (!soapData) {
    return null;
  }

  const { subjective, objective, assessment, plan, patientSummary, uncertainties } = soapData;

  const handleCopyWhatsApp = () => {
    const facilityPrefix = patientSummary.facilityName ? `*${patientSummary.facilityName}*\n` : "";
    const doctorPrefix = patientSummary.doctorName ? `Dokter: ${patientSummary.doctorName}\n` : "";
    const formattedDate = formatDisplayDate(patientSummary.date);

    const text = `${facilityPrefix}Ringkasan Konsultasi Medis
Tanggal: ${formattedDate}
${doctorPrefix}
*1. Kesimpulan:*
${patientSummary.simpleConclusion}

*2. Instruksi Obat:*
${patientSummary.medicationInstructions.map((m: string) => `• ${m}`).join("\n")}

*3. Anjuran:*
${patientSummary.lifestyleAdvice.map((a: string) => `• ${a}`).join("\n")}

*4. Hal yang Perlu Dihindari:*
${patientSummary.thingsToAvoid.map((t: string) => `• ${t}`).join("\n")}

*5. Rencana Kontrol:*
${patientSummary.controlSchedule}

*6. Tanda Bahaya:*
${patientSummary.emergencySigns.map((s: string) => `• ${s}`).join("\n")}

_Pesan ini merupakan ringkasan informasi konsultasi._`;

    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  const renderEvidenceChips = (evidences: TraceableQuote[]) => {
    if (!evidences || evidences.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2 lg:mt-[8px] lg:gap-[6px]">
        {evidences.map((ev, idx) => {
          const isSelected = activeQuote === ev.quote;
          const speakerLabel = ev.sourceSpeaker ? ` (${ev.sourceSpeaker})` : "";
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuote(ev.quote)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all cursor-pointer lg:px-[8px] lg:py-[2px] lg:text-[11px] lg:rounded-[6px] ${
                isSelected
                  ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
              title="Sorot kutipan pada transkrip"
            >
              <span>Bukti #{idx + 1}{speakerLabel}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="p-5 lg:p-[20px]">
      <div className="flex flex-col gap-4 lg:gap-[16px]">
        {/* Workspace Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 lg:pb-[12px] lg:gap-[12px]">
          {/* Status Indikator Minimalis (Bukan Pill Menumpuk) */}
          <div className="flex items-center gap-2 lg:gap-[8px]">
            <span
              className={`w-2.5 h-2.5 rounded-full lg:w-[10px] lg:h-[10px] ${
                isSignedOff ? "bg-emerald-600" : "bg-amber-500"
              }`}
            />
            <span className="text-xs font-semibold text-slate-800 lg:text-[13px]">
              {isSignedOff ? "Disahkan Dokter" : "Draf Medis AI"}
            </span>
          </div>

          <div className="flex items-center gap-2 lg:gap-[8px]">
            {/* Tab switch */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 lg:p-[3px] lg:rounded-[8px]">
              <button
                type="button"
                onClick={() => handleTabChange("soap")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer lg:px-[12px] lg:py-[5px] lg:text-[12px] lg:rounded-[6px] ${
                  activeTab === "soap"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Catatan SOAP
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("patientSummary")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer lg:px-[12px] lg:py-[5px] lg:text-[12px] lg:rounded-[6px] ${
                  activeTab === "patientSummary"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Ringkasan Pasien
              </button>
            </div>

            <Button
              type="button"
              variant={isSignedOff ? "secondary" : "primary"}
              size="sm"
              onClick={() => setIsSignedOff(!isSignedOff)}
            >
              {isSignedOff ? "Batal Sah" : "Sahkan Catatan"}
            </Button>
          </div>
        </div>

        {/* Tab Content 1: SOAP Form */}
        {activeTab === "soap" && (
          <div className="flex flex-col gap-3.5 text-xs text-slate-800 lg:gap-[14px] lg:text-[13px]">
            {/* S (Subjective) */}
            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl lg:p-[16px] lg:rounded-[12px]">
              <h4 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200 lg:text-[14px] lg:mb-[8px]">
                S - Subjective
              </h4>
              <div className="space-y-2 lg:space-y-[8px]">
                <p><strong>Keluhan Utama:</strong> {subjective.chiefComplaint}</p>
                <p><strong>Riwayat Penyakit:</strong> {subjective.historyOfPresentIllness}</p>
                {subjective.allergies && (
                  <p><strong>Alergi:</strong> {subjective.allergies.status} {subjective.allergies.details ? `(${subjective.allergies.details})` : ""}</p>
                )}
                {renderEvidenceChips(subjective.evidence)}
              </div>
            </div>

            {/* O (Objective) */}
            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl lg:p-[16px] lg:rounded-[12px]">
              <h4 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200 lg:text-[14px] lg:mb-[8px]">
                O - Objective
              </h4>
              <div className="space-y-2 lg:space-y-[8px]">
                {objective.vitalSigns && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-[8px]">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-center lg:p-[6px]">
                      <span className="text-[10px] text-slate-500 block lg:text-[10px]">Tekanan Darah</span>
                      <strong className="text-slate-900">{objective.vitalSigns.bloodPressure ? objective.vitalSigns.bloodPressure : "-"}</strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-center lg:p-[6px]">
                      <span className="text-[10px] text-slate-500 block lg:text-[10px]">Nadi</span>
                      <strong className="text-slate-900">{objective.vitalSigns.heartRate ? objective.vitalSigns.heartRate : "-"}</strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-center lg:p-[6px]">
                      <span className="text-[10px] text-slate-500 block lg:text-[10px]">Suhu</span>
                      <strong className="text-slate-900">{objective.vitalSigns.temperature ? objective.vitalSigns.temperature : "-"}</strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-center lg:p-[6px]">
                      <span className="text-[10px] text-slate-500 block lg:text-[10px]">Napas</span>
                      <strong className="text-slate-900">{objective.vitalSigns.respiratoryRate ? objective.vitalSigns.respiratoryRate : "-"}</strong>
                    </div>
                  </div>
                )}
                <p><strong>Pemeriksaan Fisik:</strong> {objective.physicalExamFindings}</p>
                {renderEvidenceChips(objective.evidence)}
              </div>
            </div>

            {/* A (Assessment) */}
            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl lg:p-[16px] lg:rounded-[12px]">
              <h4 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200 lg:text-[14px] lg:mb-[8px]">
                A - Assessment
              </h4>
              <div className="space-y-2 lg:space-y-[8px]">
                <p><strong>Diagnosis Utama:</strong> {assessment.primaryDiagnosis}</p>
                <p><strong>Kepastian Klinis:</strong> {assessment.clinicalCertainty}</p>
                {renderEvidenceChips(assessment.evidence)}
              </div>
            </div>

            {/* P (Plan) */}
            <div className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-xl lg:p-[16px] lg:rounded-[12px]">
              <h4 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200 lg:text-[14px] lg:mb-[8px]">
                P - Plan
              </h4>
              <div className="space-y-2 lg:space-y-[8px]">
                {plan.medications && plan.medications.length > 0 && (
                  <div>
                    <strong>Instruksi Obat:</strong>
                    <ul className="list-disc list-inside mt-1 lg:mt-[4px]">
                      {plan.medications.map((m: Medication, idx: number) => (
                        <li key={idx}>
                          {m.name} - {m.dosage} ({m.frequency}, {m.duration})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {plan.followUpPlan && <p><strong>Rencana Kontrol:</strong> {plan.followUpPlan}</p>}
                {plan.emergencyRedFlags && plan.emergencyRedFlags.length > 0 && (
                  <p><strong>Tanda Bahaya:</strong> {plan.emergencyRedFlags.join(", ")}</p>
                )}
                {renderEvidenceChips(plan.evidence)}
              </div>
            </div>

            {/* Uncertainties */}
            {uncertainties && uncertainties.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 lg:p-[12px] lg:rounded-[10px]">
                <strong className="block mb-1 lg:mb-[4px]">Perlu Konfirmasi Dokter:</strong>
                {uncertainties.map((u, i: number) => (
                  <p key={i}>• {u.issue} ({u.reason}): {u.suggestedAction}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Patient Summary */}
        {activeTab === "patientSummary" && (
          <div className="flex flex-col gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 lg:p-[16px] lg:rounded-[12px] lg:gap-[14px] lg:text-[13px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm lg:text-[14px]">Format Pesan Pasien</span>
              <Button type="button" variant="primary" size="sm" onClick={handleCopyWhatsApp}>
                {copiedWA ? "Tersalin!" : "Salin Pesan WhatsApp"}
              </Button>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 lg:p-[14px] lg:space-y-[8px]">
              {patientSummary.facilityName && (
                <p><strong>Fasilitas:</strong> {patientSummary.facilityName}</p>
              )}
              <p><strong>Tanggal:</strong> {formatDisplayDate(patientSummary.date)}</p>
              {patientSummary.doctorName && (
                <p><strong>Dokter:</strong> {patientSummary.doctorName}</p>
              )}
              <p><strong>Kesimpulan:</strong> {patientSummary.simpleConclusion}</p>
              <div>
                <strong>Petunjuk Obat:</strong>
                <ul className="list-disc list-inside mt-0.5 lg:mt-[2px]">
                  {patientSummary.medicationInstructions.map((m: string, idx: number) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Anjuran:</strong>
                <ul className="list-disc list-inside mt-0.5 lg:mt-[2px]">
                  {patientSummary.lifestyleAdvice.map((a: string, idx: number) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Jadwal Kontrol:</strong> {patientSummary.controlSchedule}</p>
              <div>
                <strong>Tanda Bahaya:</strong>
                <ul className="list-disc list-inside mt-0.5 lg:mt-[2px]">
                  {patientSummary.emergencySigns.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

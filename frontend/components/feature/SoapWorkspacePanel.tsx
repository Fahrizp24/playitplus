"use client";

import React, { useState } from "react";
import type { SOAPData, TraceableQuote } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SoapWorkspacePanelProps {
  soapData: SOAPData | null;
  onSelectQuote: (quote: string) => void;
  activeQuote: string | null;
}

export function SoapWorkspacePanel({
  soapData,
  onSelectQuote,
  activeQuote,
}: SoapWorkspacePanelProps) {
  const [activeTab, setActiveTab] = useState<"soap" | "patientSummary">("soap");
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);

  if (!soapData) {
    return (
      <Card className="p-6 text-center text-zinc-400 lg:p-[32px]">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-zinc-300 dark:text-zinc-700 lg:w-[48px] lg:h-[48px] lg:mb-[8px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm font-medium lg:text-[14px]">Belum ada data SOAP yang diekstrak.</p>
        <p className="text-xs text-zinc-500 lg:text-[12px]">
          Hasil ekstraksi otomatis format rekam medis klinis & ringkasan pasien akan tampil di sini.
        </p>
      </Card>
    );
  }

  const { subjective, objective, assessment, plan, patientSummary, uncertainties } = soapData;

  const handleCopyWhatsApp = () => {
    const text = `*Ringkasan Konsultasi Medis - ${patientSummary.facilityName || "Klinik"}*
Tanggal: ${patientSummary.date}
Dokter: ${patientSummary.doctorName || "Dokter Pemeriksa"}

*1. Kesimpulan Dokter:*
${patientSummary.simpleConclusion}

*2. Petunjuk Minum Obat:*
${patientSummary.medicationInstructions.map((m) => `• ${m}`).join("\n")}

*3. Anjuran Gaya Hidup:*
${patientSummary.lifestyleAdvice.map((a) => `• ${a}`).join("\n")}

*4. Hal yang Perlu Dihindari:*
${patientSummary.thingsToAvoid.map((t) => `• ${t}`).join("\n")}

*5. Rencana Kontrol:*
${patientSummary.controlSchedule}

*6. Tanda Bahaya (Segera ke IGD):*
${patientSummary.emergencySigns.map((s) => `• ${s}`).join("\n")}

_Pesan ini merupakan ringkasan informasi konsultasi, bukan pengganti resep atau konsultasi langsung._`;

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
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuote(ev.quote)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all lg:px-[8px] lg:py-[2px] lg:text-[11px] lg:rounded-[6px] ${
                isSelected
                  ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold shadow-sm dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700"
                  : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700"
              }`}
              title="Klik untuk menyorot kalimat ini pada transkrip"
            >
              <svg
                className="w-3 h-3 text-amber-600 dark:text-amber-400 lg:w-[12px] lg:h-[12px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                />
              </svg>
              <span>Bukti #{idx + 1} ({ev.sourceSpeaker || "Transkrip"})</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="p-5 lg:p-[28px]">
      <div className="flex flex-col gap-4 lg:gap-[20px]">
        {/* Top Header & Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800 lg:gap-[16px] lg:pb-[14px]">
          <div>
            <div className="flex items-center gap-2 lg:gap-[8px]">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 lg:text-[18px]">
                Tahap 4: Auto-Fill Rekam Medis (SOAP) & Ringkasan Pasien
              </h3>
              {isSignedOff ? (
                <Badge variant="success" size="md">
                  ✓ Disahkan Dokter
                </Badge>
              ) : (
                <Badge variant="warning" size="md">
                  Draf AI (Menunggu Pengesahan)
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 lg:text-[13px]">
              Setiap poin dilengkapi penelusuran bukti kutipan langsung (Traceability).
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-[10px]">
            {/* Tab switch */}
            <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 lg:p-[4px] lg:rounded-[10px]">
              <button
                type="button"
                onClick={() => setActiveTab("soap")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all lg:px-[14px] lg:py-[6px] lg:text-[12px] lg:rounded-[8px] ${
                  activeTab === "soap"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                Catatan Klinis SOAP
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("patientSummary")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all lg:px-[14px] lg:py-[6px] lg:text-[12px] lg:rounded-[8px] ${
                  activeTab === "patientSummary"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                Ringkasan Pasien (WhatsApp)
              </button>
            </div>

            {/* Doctor Sign-off button */}
            <Button
              type="button"
              variant={isSignedOff ? "outline" : "secondary"}
              size="sm"
              onClick={() => setIsSignedOff(!isSignedOff)}
            >
              {isSignedOff ? "Batalkan Pengesahan" : "Sahkan Catatan"}
            </Button>
          </div>
        </div>

        {/* Uncertainties Alert (if any) */}
        {uncertainties && uncertainties.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800 lg:p-[14px] lg:rounded-[12px] lg:text-[12px]">
            <div className="flex items-center gap-1.5 font-bold mb-1 lg:gap-[6px] lg:mb-[4px]">
              <svg className="w-4 h-4 lg:w-[16px] lg:h-[16px]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Perhatian: Terdapat Poin Ambigu yang Perlu Konfirmasi Dokter</span>
            </div>
            {uncertainties.map((unc, i) => (
              <p key={i} className="ml-5 lg:ml-[22px]">
                • <strong>{unc.issue}:</strong> {unc.suggestedAction} ({unc.reason})
              </p>
            ))}
          </div>
        )}

        {/* Tab Content 1: SOAP Form */}
        {activeTab === "soap" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-[18px]">
            {/* S (Subjective) */}
            <div className="flex flex-col p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-900/40 dark:border-zinc-800 lg:p-[18px] lg:rounded-[14px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800 lg:pb-[10px] lg:mb-[10px]">
                <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 dark:text-zinc-100 lg:text-[15px]">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs lg:w-[24px] lg:h-[24px]">
                    S
                  </span>
                  Subjective (Anamnesis)
                </h4>
                <Badge
                  variant={subjective.allergies.status === "DISANGKAL" ? "neutral" : "danger"}
                  size="sm"
                >
                  Alergi: {subjective.allergies.status}
                </Badge>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 lg:space-y-[12px] lg:text-[13px] lg:leading-[20px]">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Keluhan Utama:</strong>
                  <p>{subjective.chiefComplaint}</p>
                </div>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Riwayat Penyakit Sekarang:</strong>
                  <p>{subjective.historyOfPresentIllness}</p>
                </div>
                {subjective.pastMedicalHistory && (
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Riwayat Penyakit Dahulu:</strong>
                    <p>{subjective.pastMedicalHistory}</p>
                  </div>
                )}
                {subjective.familyMedicalHistory && (
                  <div className="p-2 rounded bg-amber-50/70 border border-amber-200/60 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800/60 lg:p-[8px]">
                    <strong>Riwayat Keluarga (Dipisah):</strong> {subjective.familyMedicalHistory}
                  </div>
                )}
                {subjective.allergies.details && (
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Rincian Alergi:</strong>
                    <p>{subjective.allergies.details}</p>
                  </div>
                )}
                {renderEvidenceChips(subjective.evidence)}
              </div>
            </div>

            {/* O (Objective) */}
            <div className="flex flex-col p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-900/40 dark:border-zinc-800 lg:p-[18px] lg:rounded-[14px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800 lg:pb-[10px] lg:mb-[10px]">
                <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 dark:text-zinc-100 lg:text-[15px]">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs lg:w-[24px] lg:h-[24px]">
                    O
                  </span>
                  Objective (Pemeriksaan Fisik)
                </h4>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 lg:space-y-[12px] lg:text-[13px] lg:leading-[20px]">
                {objective.vitalSigns && (
                  <div className="grid grid-cols-2 gap-2 lg:gap-[8px]">
                    <div className="p-2 bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800/60 dark:border-zinc-700 lg:p-[8px]">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block lg:text-[11px]">Tekanan Darah</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 text-xs lg:text-[13px]">
                        {objective.vitalSigns.bloodPressure || "-"}
                      </strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800/60 dark:border-zinc-700 lg:p-[8px]">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block lg:text-[11px]">Denyut Nadi</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 text-xs lg:text-[13px]">
                        {objective.vitalSigns.heartRate || "-"}
                      </strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800/60 dark:border-zinc-700 lg:p-[8px]">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block lg:text-[11px]">Suhu Tubuh</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 text-xs lg:text-[13px]">
                        {objective.vitalSigns.temperature || "-"}
                      </strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800/60 dark:border-zinc-700 lg:p-[8px]">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block lg:text-[11px]">Laju Pernapasan</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 text-xs lg:text-[13px]">
                        {objective.vitalSigns.respiratoryRate || "-"}
                      </strong>
                    </div>
                  </div>
                )}
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Temuan Fisik:</strong>
                  <p>{objective.physicalExamFindings}</p>
                </div>
                {renderEvidenceChips(objective.evidence)}
              </div>
            </div>

            {/* A (Assessment) */}
            <div className="flex flex-col p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-900/40 dark:border-zinc-800 lg:p-[18px] lg:rounded-[14px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800 lg:pb-[10px] lg:mb-[10px]">
                <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 dark:text-zinc-100 lg:text-[15px]">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs lg:w-[24px] lg:h-[24px]">
                    A
                  </span>
                  Assessment (Diagnosis Klinis)
                </h4>
                <Badge variant="primary" size="sm">
                  {assessment.clinicalCertainty}
                </Badge>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 lg:space-y-[12px] lg:text-[13px] lg:leading-[20px]">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Diagnosis Utama:</strong>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{assessment.primaryDiagnosis}</p>
                </div>
                {assessment.differentialDiagnosis && assessment.differentialDiagnosis.length > 0 && (
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Diagnosis Banding:</strong>
                    <ul className="list-disc list-inside">
                      {assessment.differentialDiagnosis.map((ddx, i) => (
                        <li key={i}>{ddx}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {renderEvidenceChips(assessment.evidence)}
              </div>
            </div>

            {/* P (Plan) */}
            <div className="flex flex-col p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-900/40 dark:border-zinc-800 lg:p-[18px] lg:rounded-[14px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800 lg:pb-[10px] lg:mb-[10px]">
                <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5 dark:text-zinc-100 lg:text-[15px]">
                  <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs lg:w-[24px] lg:h-[24px]">
                    P
                  </span>
                  Plan (Terapi & Rencana Tindak Lanjut)
                </h4>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 lg:space-y-[12px] lg:text-[13px] lg:leading-[20px]">
                {/* Resep Obat */}
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Resep Obat:</strong>
                  <div className="mt-1 space-y-1.5 lg:mt-[6px] lg:space-y-[6px]">
                    {plan.medications.map((med, i) => (
                      <div
                        key={i}
                        className="p-2 bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800/60 dark:border-zinc-700 lg:p-[8px]"
                      >
                        <div className="flex justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                          <span>{med.name} {med.dosage}</span>
                          <span>{med.frequency}</span>
                        </div>
                        {med.instructions && (
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 lg:text-[11px]">
                            {med.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kontrol & Red Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-[8px]">
                  <div className="p-2 bg-blue-50/60 rounded-lg border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 lg:p-[8px]">
                    <strong className="text-blue-900 dark:text-blue-300 block text-[11px] lg:text-[11px]">Jadwal Kontrol:</strong>
                    <span className="text-blue-800 dark:text-blue-200 text-xs lg:text-[12px]">{plan.followUpPlan}</span>
                  </div>
                  <div className="p-2 bg-red-50/60 rounded-lg border border-red-100 dark:bg-red-950/20 dark:border-red-900/40 lg:p-[8px]">
                    <strong className="text-red-900 dark:text-red-300 block text-[11px] lg:text-[11px]">Tanda Bahaya (IGD):</strong>
                    <span className="text-red-800 dark:text-red-200 text-xs lg:text-[12px]">
                      {plan.emergencyRedFlags?.[0] || "Bila keluhan memburuk"}
                    </span>
                  </div>
                </div>

                {renderEvidenceChips(plan.evidence)}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Patient Summary (WhatsApp Ready) */}
        {activeTab === "patientSummary" && (
          <div className="flex flex-col gap-4 p-5 bg-emerald-50/30 border border-emerald-200/60 rounded-xl dark:bg-emerald-950/10 dark:border-emerald-900/40 lg:p-[20px] lg:rounded-[14px] lg:gap-[16px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-[12px]">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 lg:text-[16px]">
                  Format Pesan Ringkasan Pasien (WhatsApp)
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 lg:text-[13px]">
                  Disusun menggunakan bahasa awam yang mudah dipahami pasien & keluarga.
                </p>
              </div>

              <Button
                type="button"
                variant="success"
                onClick={handleCopyWhatsApp}
                className="gap-1.5 lg:gap-[6px]"
              >
                <svg className="w-4 h-4 lg:w-[16px] lg:h-[16px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                {copiedWA ? "Tersalin ke Clipboard!" : "Salin Pesan WhatsApp"}
              </Button>
            </div>

            {/* WhatsApp Message Preview Box */}
            <div className="p-4 bg-white border border-zinc-200 rounded-xl font-sans text-xs leading-relaxed text-zinc-800 space-y-3 dark:bg-zinc-900/60 dark:border-zinc-800 dark:text-zinc-200 lg:p-[18px] lg:text-[13px] lg:leading-[20px] lg:space-y-[12px] lg:rounded-[12px]">
              <div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">Ringkasan Konsultasi Medis</span>
                <p className="text-zinc-500 text-[11px] dark:text-zinc-400 lg:text-[11px]">
                  Fasilitas: {patientSummary.facilityName || "Klinik Pratama"} | Tanggal: {patientSummary.date}
                </p>
              </div>

              <div>
                <strong>Kesimpulan Dokter:</strong>
                <p className="mt-0.5 lg:mt-[2px]">{patientSummary.simpleConclusion}</p>
              </div>

              <div>
                <strong>Petunjuk Minum Obat:</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 lg:mt-[2px] lg:space-y-[2px]">
                  {patientSummary.medicationInstructions.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Anjuran Gaya Hidup:</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 lg:mt-[2px] lg:space-y-[2px]">
                  {patientSummary.lifestyleAdvice.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Hal yang Perlu Dihindari:</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 lg:mt-[2px] lg:space-y-[2px]">
                  {patientSummary.thingsToAvoid.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-200 lg:p-[10px]">
                <strong>Rencana Kontrol Kembali:</strong> {patientSummary.controlSchedule}
              </div>

              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-200 lg:p-[10px]">
                <strong>Tanda Bahaya (Segera ke IGD):</strong>
                <ul className="list-disc list-inside mt-0.5 lg:mt-[2px]">
                  {patientSummary.emergencySigns.map((s, idx) => (
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

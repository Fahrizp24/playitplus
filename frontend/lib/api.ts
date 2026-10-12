import type { ConsultationProcessResult, ProviderStatus } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getProviderStatus(): Promise<ProviderStatus> {
  const res = await fetch(`${API_BASE}/api/consultation/status`);
  if (!res.ok) {
    throw new Error("Gagal mengambil status provider AI.");
  }
  return res.json();
}

export async function getConsultationSamples(): Promise<{ samples: Array<{ title: string; text: string }> }> {
  const res = await fetch(`${API_BASE}/api/consultation/samples`);
  if (!res.ok) {
    throw new Error("Gagal mengambil contoh percakapan klinis.");
  }
  return res.json();
}

export async function processConsultationAudio(
  audioBlob: Blob,
  filename: string = "recording.webm"
): Promise<ConsultationProcessResult> {
  const formData = new FormData();
  formData.append("audio", audioBlob, filename);

  const res = await fetch(`${API_BASE}/api/consultation/process`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal memproses audio (${res.status})`);
  }

  return res.json();
}

export async function processConsultationText(text: string): Promise<ConsultationProcessResult> {
  const res = await fetch(`${API_BASE}/api/consultation/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal memproses teks (${res.status})`);
  }

  return res.json();
}

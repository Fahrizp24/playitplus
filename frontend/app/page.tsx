import { Suspense } from "react";
import { getConsultationSamples } from "@/lib/api";
import { ConsultationWorkspace } from "@/components/feature/ConsultationWorkspace";

/**
 * Server Component yang melakukan fetch langsung di server.
 */
async function ConsultationServerSection() {
  let initialSamples = null;

  try {
    initialSamples = await getConsultationSamples();
  } catch (err) {
    console.warn("[Server Component] getConsultationSamples info:", err);
  }

  return <ConsultationWorkspace initialSamples={initialSamples} />;
}

/**
 * Root Page dengan Suspense boundary untuk kepatuhan Next.js 16 App Router streaming.
 */
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-semibold text-slate-500">
          Memuat sistem dokumentasi klinis...
        </div>
      }
    >
      <ConsultationServerSection />
    </Suspense>
  );
}

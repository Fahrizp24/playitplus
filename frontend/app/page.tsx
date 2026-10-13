import { Suspense } from "react";
import { ConsultationWorkspace } from "@/components/feature/ConsultationWorkspace";

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
      <ConsultationWorkspace />
    </Suspense>
  );
}

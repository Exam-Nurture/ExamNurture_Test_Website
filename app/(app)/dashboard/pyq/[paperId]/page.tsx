"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function PYQRedirectInner() {
  const { paperId } = useParams<{ paperId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!paperId) return;
    const attemptId = searchParams.get("attemptId");
    const dest = attemptId ? `/pyq/${paperId}?attemptId=${attemptId}` : `/pyq/${paperId}`;
    router.replace(dest);
  }, [paperId, searchParams, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mx-auto" />
    </div>
  );
}

export default function PYQRedirect() {
  return (
    <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--bg)" }} />}>
      <PYQRedirectInner />
    </Suspense>
  );
}

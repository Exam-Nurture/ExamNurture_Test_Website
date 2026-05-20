"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Backward-compat redirect: /tests/:id → /exam/:id
export default function TestRedirect() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (testId) router.replace(`/exam/${testId}`);
  }, [testId, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="w-10 h-10 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin mx-auto" />
    </div>
  );
}

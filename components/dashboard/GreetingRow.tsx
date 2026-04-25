"use client";

import { AlertTriangle } from "lucide-react";

export default function GreetingRow() {
  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1
          className="text-[22px] md:text-[24px] font-bold tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
        >
          {greet}, Rahul <span className="wave">👋</span>
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: "var(--ink-3)" }}>
          Here&apos;s your study snapshot for today.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Exam countdown pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium"
          style={{ background: "white", border: "1px solid var(--line-soft)", boxShadow: "var(--shadow-xs)", color: "var(--ink-2)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--blue)", boxShadow: "0 0 0 3px rgba(37,99,235,.15)" }}
          />
          JEE Main 2025
          <span style={{ color: "var(--ink-4)" }}>·</span>
          <span><strong style={{ color: "var(--blue)" }}>87</strong> days left</span>
        </div>

        {/* Registration alert — subtle */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]"
          style={{ background: "var(--amber-soft)", color: "#92400E" }}
        >
          <AlertTriangle size={12} style={{ color: "var(--amber)" }} />
          <span>Registration closes in <strong>12 days</strong></span>
          <a
            href="#"
            className="font-semibold pl-1.5 border-l transition-colors hover:underline"
            style={{ color: "#B45309", borderColor: "#FDE68A" }}
          >
            Register →
          </a>
        </div>
      </div>
    </div>
  );
}

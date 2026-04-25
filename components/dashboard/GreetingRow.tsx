"use client";

import { AlertTriangle, Dot } from "lucide-react";

export default function GreetingRow() {
  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1
          className="text-2xl md:text-[26px] font-bold tracking-tight leading-tight"
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
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium"
          style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", color: "var(--ink-1)" }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--blue)", boxShadow: "0 0 0 3px rgba(37,99,235,.18)" }}
          />
          JEE Main 2025
          <span style={{ color: "var(--ink-4)" }}>·</span>
          <span><strong style={{ color: "var(--blue)" }}>87</strong> days left</span>
        </div>

        {/* Registration alert pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px]"
          style={{ background: "var(--amber-soft)", border: "1px solid #FDE68A", color: "#92400E" }}
        >
          <AlertTriangle size={14} style={{ color: "var(--amber)" }} />
          <span><strong>Registration closes</strong> in 12 days</span>
          <a
            href="#"
            className="font-semibold pl-2 border-l transition-colors"
            style={{ color: "#B45309", borderColor: "#FDE68A" }}
          >
            Register →
          </a>
        </div>
      </div>
    </div>
  );
}

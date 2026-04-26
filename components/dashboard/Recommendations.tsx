"use client";

import Link from "next/link";
import { BookOpen, Clock, Sparkles, Target, CircleDot } from "lucide-react";

export default function Recommendations() {
  return (
    <div className="card p-6">
      <div className="mb-5">
        <div className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>Recommended for You</div>
        <div className="text-xs mt-1" style={{ color: "var(--ink-4)" }}>Picked by AI based on your weak areas</div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Chapter test — weak area */}
        <div
          className="rounded-xl p-4 transition-all hover:shadow-md"
          style={{ border: "1px solid var(--line-soft)", background: "var(--card)" }}
        >
          <span
            className="text-[10px] font-bold tracking-wider px-2 py-1 rounded inline-block mb-3"
            style={{ background: "var(--blue-soft)", color: "var(--blue)" }}
          >
            CHAPTER TEST
          </span>
          <div className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
            Data Interpretation — Targeted Drill
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-4)" }}>
              <BookOpen size={12} /> 30 Qs
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-4)" }}>
              <Clock size={12} /> 40 min
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-4)" }}>
              <CircleDot size={10} style={{ color: "var(--amber)" }} /> Medium
            </span>
          </div>
          <div
            className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: "1px dashed var(--line-soft)" }}
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--ink-3)" }}>
              <Sparkles size={12} style={{ color: "var(--amber)" }} />
              44% → 65% accuracy goal
            </div>
            <Link
              href="/exam/di-drill"
              className="text-xs font-semibold px-4 py-2 rounded-lg text-white transition-all hover:brightness-105"
              style={{ background: "var(--blue)" }}
            >
              Start →
            </Link>
          </div>
        </div>

        {/* Full mock */}
        <div
          className="rounded-xl p-4 transition-all hover:shadow-md"
          style={{ border: "1px solid var(--line-soft)", background: "var(--card)" }}
        >
          <span
            className="text-[10px] font-bold tracking-wider px-2 py-1 rounded inline-block mb-3"
            style={{ background: "var(--violet-soft)", color: "var(--violet)" }}
          >
            FULL MOCK
          </span>
          <div className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
            JPSC Prelims Full Mock #05
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-4)" }}>
              <BookOpen size={12} /> 100 Qs
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-4)" }}>
              <Clock size={12} /> 2 hrs
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-4)" }}>
              <CircleDot size={10} style={{ color: "var(--red)" }} /> Hard
            </span>
          </div>
          <div
            className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: "1px dashed var(--line-soft)" }}
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--ink-3)" }}>
              <Target size={12} style={{ color: "var(--amber)" }} />
              Matches 2023 pattern
            </div>
            <Link
              href="/exam/jpsc-mock-05"
              className="text-xs font-semibold px-4 py-2 rounded-lg text-white transition-all hover:brightness-105"
              style={{ background: "var(--violet)" }}
            >
              Start →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

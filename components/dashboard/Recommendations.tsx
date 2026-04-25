"use client";

import Link from "next/link";
import { BookOpen, Clock, Sparkles, Target, CircleDot } from "lucide-react";

export default function Recommendations() {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <div className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>Recommended for You</div>
        <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>Picked by AI based on your weak areas</div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Chapter test */}
        <div className="rounded-[10px] p-3.5 transition-all hover:shadow-md"
          style={{ border: "1px solid var(--line-soft)", background: "white" }}>
          <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-[4px] inline-block mb-2"
            style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>CHAPTER TEST</span>
          <div className="text-[12px] font-semibold" style={{ color: "var(--ink-1)" }}>
            Coordinate Geometry — Targeted Drill
          </div>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
              <BookOpen size={10} /> 25 Qs
            </span>
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
              <Clock size={10} /> 45 min
            </span>
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
              <CircleDot size={9} style={{ color: "#F59E0B" }} /> Medium
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px dashed var(--line-soft)" }}>
            <div className="inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--ink-3)" }}>
              <Sparkles size={10} style={{ color: "var(--amber)" }} />
              42% → 65% accuracy
            </div>
            <Link href="/exam/coord-geo-drill"
              className="text-[10px] font-semibold px-2.5 py-1 rounded-[6px] text-white transition-all hover:brightness-105"
              style={{ background: "var(--blue)" }}>Start →</Link>
          </div>
        </div>

        {/* Full mock */}
        <div className="rounded-[10px] p-3.5 transition-all hover:shadow-md"
          style={{ border: "1px solid var(--line-soft)", background: "white" }}>
          <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-[4px] inline-block mb-2"
            style={{ background: "var(--cyan-soft)", color: "var(--cyan-ink)" }}>FULL MOCK</span>
          <div className="text-[12px] font-semibold" style={{ color: "var(--ink-1)" }}>
            JEE Main Full Mock #14
          </div>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
              <BookOpen size={10} /> 90 Qs
            </span>
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
              <Clock size={10} /> 3 hrs
            </span>
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
              <CircleDot size={9} style={{ color: "#EF4444" }} /> Hard
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px dashed var(--line-soft)" }}>
            <div className="inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--ink-3)" }}>
              <Target size={10} style={{ color: "var(--amber)" }} />
              Matches 2024 pattern
            </div>
            <Link href="/exam/jee-main-mock-14"
              className="text-[10px] font-semibold px-2.5 py-1 rounded-[6px] text-white transition-all hover:brightness-105"
              style={{ background: "var(--cyan)" }}>Start →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

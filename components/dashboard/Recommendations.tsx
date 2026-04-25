"use client";

import Link from "next/link";
import { BookOpen, Clock, Sparkles, Target, CircleDot } from "lucide-react";

export default function Recommendations() {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
      <div className="mb-4">
        <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Recommended for You</div>
        <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>Picked by AI based on your weak areas</div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Chapter test */}
        <div
          className="rounded-[12px] p-4 border transition-all hover:border-blue-300 hover:shadow-md"
          style={{
            border: "1px solid var(--line)",
            background: "linear-gradient(180deg, #fff 0%, #FBFCFE 100%)",
          }}
        >
          <span
            className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[5px] inline-block mb-2"
            style={{ background: "var(--blue-soft)", color: "var(--blue)" }}
          >CHAPTER TEST</span>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>
            Coordinate Geometry — Targeted Drill
          </div>
          <div className="flex flex-wrap gap-3 mt-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              <BookOpen size={12} /> 25 Qs
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              <Clock size={12} /> 45 min
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              <CircleDot size={10} style={{ color: "#F59E0B" }} /> Medium
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px dashed var(--line)" }}>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--ink-2)" }}>
              <Sparkles size={12} style={{ color: "var(--amber)" }} />
              Boost accuracy from 42% → 65%
            </div>
            <Link
              href="/exam/coord-geo-drill"
              className="text-[12px] font-semibold px-3 py-1.5 rounded-[8px] text-white transition-all hover:brightness-105"
              style={{ background: "var(--blue)" }}
            >
              Start →
            </Link>
          </div>
        </div>

        {/* Full mock */}
        <div
          className="rounded-[12px] p-4 border transition-all"
          style={{
            border: "1px solid var(--line)",
            background: "linear-gradient(180deg, #fff 0%, #FBFCFE 100%)",
          }}
        >
          <span
            className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[5px] inline-block mb-2"
            style={{ background: "var(--cyan-soft)", color: "var(--cyan-ink)" }}
          >FULL MOCK</span>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>
            JEE Main Full Mock #14
          </div>
          <div className="flex flex-wrap gap-3 mt-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              <BookOpen size={12} /> 90 Qs
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              <Clock size={12} /> 3 hrs
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
              <CircleDot size={10} style={{ color: "#EF4444" }} /> Hard
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px dashed var(--line)" }}>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--ink-2)" }}>
              <Target size={12} style={{ color: "var(--amber)" }} />
              Matches 2024 paper pattern
            </div>
            <Link
              href="/exam/jee-main-mock-14"
              className="text-[12px] font-semibold px-3 py-1.5 rounded-[8px] text-white transition-all hover:brightness-105"
              style={{ background: "var(--cyan)" }}
            >
              Start →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

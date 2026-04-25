"use client";

import Link from "next/link";
import { Play, BookOpen, ArrowRight } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <div className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>Quick Actions</div>
        <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>Pick up where you left off</div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Resume last test — hero CTA */}
        <Link
          href="/exam/physics-mock-07"
          className="flex items-center gap-3.5 px-4 py-3.5 rounded-[12px] transition-all hover:-translate-y-0.5 hover:shadow-lg group"
          style={{ background: "var(--blue)", boxShadow: "0 4px 14px -4px rgba(37,99,235,.45)" }}
        >
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-white/20 text-white">
            <Play size={13} fill="white" stroke="none" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white">Resume Last Test</div>
            <div className="text-[10px] text-white/65 mt-0.5 truncate">JEE Main — Physics Mock 07 · Q 14 / 30</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[14px] font-bold text-white font-mono">18:42</div>
            <div className="text-[9px] text-white/50 uppercase tracking-wider">remaining</div>
          </div>
        </Link>

        {/* Latest PYQ — demoted to bordered style */}
        <Link
          href="/pyq"
          className="flex items-center gap-3.5 px-4 py-3 rounded-[12px] transition-all hover:-translate-y-0.5 hover:shadow-md group"
          style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-xs)" }}
        >
          <div
            className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--cyan-soft)", color: "var(--cyan-ink)" }}
          >
            <BookOpen size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold" style={{ color: "var(--ink-1)" }}>Latest JEE PYQ</div>
            <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>JEE Main 2024 · Shift 2 · Full Paper</div>
          </div>
          <span
            className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-[5px] flex-shrink-0"
            style={{ background: "var(--cyan-soft)", color: "var(--cyan-ink)" }}
          >
            NEW
          </span>
        </Link>
      </div>
    </div>
  );
}

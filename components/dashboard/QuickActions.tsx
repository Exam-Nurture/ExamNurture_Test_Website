"use client";

import Link from "next/link";
import { Play, BookOpen, ArrowRight } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
      <div className="mb-4">
        <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Quick Actions</div>
        <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>Pick up where you left off</div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Resume last test */}
        <Link
          href="/exam/physics-mock-07"
          className="flex items-center gap-3.5 px-4 py-3.5 rounded-[12px] transition-all hover:-translate-y-0.5 group"
          style={{ background: "var(--blue)", boxShadow: "0 8px 20px -8px rgba(37,99,235,.55)" }}
        >
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-white/20 text-white">
            <Play size={14} fill="white" stroke="none" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white">Resume Last Test</div>
            <div className="text-[11px] text-white/75 mt-0.5 truncate">JEE Main — Physics Mock 07 · Q 14 / 30</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[15px] font-bold text-white font-mono">18:42</div>
            <div className="text-[9px] text-white/60 uppercase tracking-wider">remaining</div>
          </div>
        </Link>

        {/* Latest PYQ */}
        <Link
          href="/pyq"
          className="flex items-center gap-3.5 px-4 py-3.5 rounded-[12px] transition-all hover:-translate-y-0.5"
          style={{ background: "var(--cyan)", boxShadow: "0 8px 20px -8px rgba(6,182,212,.5)" }}
        >
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-white/20 text-white">
            <BookOpen size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white">Latest JEE PYQ</div>
            <div className="text-[11px] text-white/75 mt-0.5">JEE Main 2024 · Shift 2 · Full Paper</div>
          </div>
          <span className="text-[9px] font-bold tracking-wider px-2 py-1 rounded-[5px] bg-white flex-shrink-0" style={{ color: "var(--cyan-ink)" }}>
            NEW
          </span>
        </Link>
      </div>
    </div>
  );
}

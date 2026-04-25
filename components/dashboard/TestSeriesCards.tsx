"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

interface SeriesProps {
  title: string;
  subtitle: string;
  done: number;
  total: number;
  daysLeft: number;
  tint: string;
  nextTest: string;
  href: string;
}

function SeriesCard({ title, subtitle, done, total, daysLeft, tint, nextTest, href }: SeriesProps) {
  const pct = Math.round((done / total) * 100);
  return (
    <div
      className="relative rounded-[14px] p-4 border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ background: "white", borderColor: "var(--line)" }}
    >
      {/* Top color stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: tint }} />

      <div className="flex items-center justify-between mt-1 mb-2.5">
        <span
          className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[5px]"
          style={{ background: tint + "18", color: tint }}
        >SERIES</span>
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
          <Clock size={11} /> {daysLeft} days left
        </span>
      </div>

      <div className="text-[14px] font-semibold leading-snug" style={{ color: "var(--ink-1)", fontFamily: "var(--font-sora)" }}>
        {title}
      </div>
      <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>{subtitle}</div>

      {/* Progress */}
      <div className="mt-4 mb-3">
        <div className="flex justify-between text-[12px] mb-1.5">
          <span style={{ color: "var(--ink-3)" }}>Progress</span>
          <span>
            <strong style={{ color: "var(--ink-1)" }}>{done}</strong>
            <span style={{ color: "var(--ink-3)" }}> / {total} · {pct}%</span>
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tint }} />
        </div>
      </div>

      {/* Next up */}
      <div className="rounded-[9px] px-3 py-2.5 mb-3" style={{ background: "var(--bg)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--ink-4)" }}>Next up</div>
        <div className="text-[12px] font-medium" style={{ color: "var(--ink-1)" }}>{nextTest}</div>
      </div>

      <div className="flex gap-2">
        <Link
          href={href}
          className="flex-1 py-2 text-center text-[13px] font-semibold rounded-[9px] text-white transition-all hover:brightness-105 hover:-translate-y-0.5"
          style={{ background: tint }}
        >
          Continue Series →
        </Link>
        <button
          className="px-3.5 py-2 text-[13px] font-medium rounded-[9px] transition-all hover:bg-[var(--bg)]"
          style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default function TestSeriesCards() {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>My Test Series</div>
          <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>2 active series · enrolled</div>
        </div>
        <Link href="/tests" className="text-[12px] font-semibold" style={{ color: "var(--blue)" }}>Browse all →</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SeriesCard
          title="JEE Main 2026 — Grand Series"
          subtitle="30 full mocks + 60 chapter tests"
          done={14} total={30} daysLeft={87}
          tint="#2563EB"
          nextTest="Mock #15 — All India Rank Test"
          href="/tests"
        />
        <SeriesCard
          title="Physics Mastery Pack"
          subtitle="Chapter-wise drill + previous year subset"
          done={22} total={40} daysLeft={45}
          tint="#06B6D4"
          nextTest="Thermodynamics — Level 3"
          href="/tests"
        />
      </div>
    </div>
  );
}

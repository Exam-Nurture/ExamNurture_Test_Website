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
    <div className="card card-lift p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: tint }} />
          <span className="text-[9px] font-bold tracking-wider"
            style={{ color: tint }}>SERIES</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
          <Clock size={10} /> {daysLeft} days left
        </span>
      </div>

      <div className="text-[13px] font-semibold leading-snug" style={{ color: "var(--ink-1)", fontFamily: "var(--font-sora)" }}>
        {title}
      </div>
      <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>{subtitle}</div>

      {/* Progress */}
      <div className="mt-4 mb-3">
        <div className="flex justify-between text-[11px] mb-1.5">
          <span style={{ color: "var(--ink-4)" }}>Progress</span>
          <span>
            <strong style={{ color: "var(--ink-1)" }}>{done}</strong>
            <span style={{ color: "var(--ink-4)" }}> / {total} · {pct}%</span>
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,.04)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tint, opacity: 0.85 }} />
        </div>
      </div>

      {/* Next up */}
      <div className="rounded-[8px] px-3 py-2 mb-3" style={{ background: "var(--bg)" }}>
        <div className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--ink-4)" }}>Next up</div>
        <div className="text-[11px] font-medium" style={{ color: "var(--ink-1)" }}>{nextTest}</div>
      </div>

      <div className="flex gap-2">
        <Link href={href}
          className="flex-1 py-2 text-center text-[12px] font-semibold rounded-[8px] text-white transition-all hover:brightness-105"
          style={{ background: tint }}>Continue Series →</Link>
        <button className="px-3 py-2 text-[12px] font-medium rounded-[8px] transition-all hover:bg-[var(--bg)]"
          style={{ border: "1px solid var(--line)", color: "var(--ink-3)" }}>Details</button>
      </div>
    </div>
  );
}

export default function TestSeriesCards() {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>My Test Series</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>2 active series · enrolled</div>
        </div>
        <Link href="/tests" className="text-[11px] font-semibold hover:underline" style={{ color: "var(--blue)" }}>Browse all →</Link>
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

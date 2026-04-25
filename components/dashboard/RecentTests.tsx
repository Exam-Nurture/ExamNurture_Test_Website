"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

const ROWS = [
  { name: "JEE Main Full Mock #13", subj: "All subjects",    date: "24 Apr 2026", score: "248/300", pct: 82, percentile: 94.2, grade: "good" as const },
  { name: "Physics — Rotational Motion", subj: "Chapter Test",  date: "23 Apr 2026", score: "21/30",   pct: 70, percentile: 78.5, grade: "mid"  as const },
  { name: "Chemistry — Organic Full", subj: "Section Test",  date: "21 Apr 2026", score: "17/30",   pct: 57, percentile: 61.0, grade: "low"  as const },
];

const GRADE = {
  good: { bg: "rgba(16,185,129,.12)",  fg: "#059669" },
  mid:  { bg: "rgba(245,158,11,.14)",  fg: "#B45309" },
  low:  { bg: "rgba(239,68,68,.12)",   fg: "#DC2626" },
};

export default function RecentTests() {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Recent Tests</div>
          <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>Your last 3 attempts</div>
        </div>
        <a href="/tests" className="text-[12px] font-semibold" style={{ color: "var(--blue)" }}>See all →</a>
      </div>

      {/* Table header — hidden on mobile */}
      <div
        className="hidden md:grid grid-cols-[2.5fr_1fr_1.2fr_1fr_1.1fr] gap-4 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--ink-4)", borderBottom: "1px solid var(--line-soft)" }}
      >
        <div>Test</div><div>Date</div><div>Score</div><div>Percentile</div><div />
      </div>

      {ROWS.map((r) => {
        const g = GRADE[r.grade];
        return (
          <div
            key={r.name}
            className="flex flex-col md:grid md:grid-cols-[2.5fr_1fr_1.2fr_1fr_1.1fr] gap-3 md:gap-4 items-start md:items-center px-3 py-3.5 rounded-[8px] transition-all hover:bg-[var(--bg)] -mx-2"
            style={{ borderBottom: "1px solid var(--line-soft)" }}
          >
            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
                style={{ background: g.bg, color: g.fg }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <path d="M14 2v6h6M9 13h6M9 17h4"/>
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>{r.name}</div>
                <div className="text-[11px]" style={{ color: "var(--ink-3)" }}>{r.subj}</div>
              </div>
            </div>

            {/* Date */}
            <div className="text-[12px]" style={{ color: "var(--ink-2)" }}>{r.date}</div>

            {/* Score */}
            <div>
              <div className="text-[13px] font-semibold font-mono" style={{ color: "var(--ink-1)" }}>{r.score}</div>
              <div className="h-1 mt-1.5 rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
                <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: g.fg }} />
              </div>
            </div>

            {/* Percentile */}
            <div>
              <span
                className="text-[12px] font-bold px-2.5 py-1 rounded-[6px] font-mono"
                style={{ background: g.bg, color: g.fg }}
              >
                {r.percentile} %ile
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <button className="w-8 h-8 rounded-[7px] flex items-center justify-center transition-all hover:bg-[var(--blue-soft)]"
                style={{ color: "var(--ink-3)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--blue)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--ink-3)"}
              >
                <Eye size={15} />
              </button>
              <Link
                href={`/results/mock-13`}
                className="text-[12px] font-semibold px-2.5 py-1.5 rounded-[7px] transition-all hover:bg-[var(--blue-soft)]"
                style={{ color: "var(--blue)" }}
              >
                Review →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

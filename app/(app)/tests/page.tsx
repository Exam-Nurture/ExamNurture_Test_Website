"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, Users, Star, ChevronRight, Filter } from "lucide-react";

const CATEGORIES = ["All", "Full Mock", "Chapter Test", "Section Test", "PYQ Based", "Crash Course"];

const SERIES = [
  {
    id: "jee-grand-2026",
    title: "JEE Main 2026 — Grand Series",
    subtitle: "30 full mocks + 60 chapter tests · NTA pattern",
    category: "Full Mock",
    tint: "#2563EB",
    tests: 90, duration: "3 hrs each", students: "42K",
    rating: 4.9, done: 14, total: 30,
    tag: "BESTSELLER", tagColor: "#2563EB",
    nextTest: "Mock #15 — All India Rank Test",
    enrolled: true,
  },
  {
    id: "physics-mastery",
    title: "Physics Mastery Pack",
    subtitle: "Chapter-wise drill + previous year subset",
    category: "Chapter Test",
    tint: "#06B6D4",
    tests: 40, duration: "45 min each", students: "18K",
    rating: 4.8, done: 22, total: 40,
    tag: "ENROLLED", tagColor: "#06B6D4",
    nextTest: "Thermodynamics — Level 3",
    enrolled: true,
  },
  {
    id: "jee-adv-2026",
    title: "JEE Advanced 2026 — Elite Series",
    subtitle: "20 paper-pattern mocks · IIT level",
    category: "Full Mock",
    tint: "#8B5CF6",
    tests: 20, duration: "3 hrs each", students: "9K",
    rating: 4.9, done: 0, total: 20,
    tag: "PRO", tagColor: "#8B5CF6",
    nextTest: null,
    enrolled: false,
  },
  {
    id: "chemistry-crash",
    title: "Chemistry Crash Course",
    subtitle: "Organic + Inorganic + Physical · 30 tests",
    category: "Crash Course",
    tint: "#10B981",
    tests: 30, duration: "60 min each", students: "22K",
    rating: 4.7, done: 0, total: 30,
    tag: "NEW", tagColor: "#10B981",
    nextTest: null,
    enrolled: false,
  },
  {
    id: "maths-chapter",
    title: "Mathematics — Chapter Test Series",
    subtitle: "Topic-wise tests for all JEE chapters",
    category: "Chapter Test",
    tint: "#F59E0B",
    tests: 45, duration: "30 min each", students: "31K",
    rating: 4.6, done: 0, total: 45,
    tag: null, tagColor: "",
    nextTest: null,
    enrolled: false,
  },
  {
    id: "pyq-jee-2015-24",
    title: "JEE PYQ Series 2015–2024",
    subtitle: "Actual papers, year-wise + analysis",
    category: "PYQ Based",
    tint: "#EF4444",
    tests: 28, duration: "3 hrs each", students: "55K",
    rating: 5.0, done: 0, total: 28,
    tag: "TOP RATED", tagColor: "#EF4444",
    nextTest: null,
    enrolled: false,
  },
];

export default function TestSeriesPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? SERIES : SERIES.filter((s) => s.category === active);

  return (
    <div className="flex flex-col gap-6 fade-up">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-[22px] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
          >
            Test Series
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--ink-3)" }}>
            Browse and manage your mock test series
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-medium transition-all hover:bg-[var(--bg)]"
          style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
        >
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-all flex-shrink-0"
            style={active === cat
              ? { background: "var(--blue)", color: "white", boxShadow: "0 4px 10px -3px rgba(37,99,235,.4)" }
              : { background: "white", border: "1px solid var(--line)", color: "var(--ink-2)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Enrolled section */}
      {active === "All" && (
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ink-4)" }}>
            My Enrolled Series
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERIES.filter((s) => s.enrolled).map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        </div>
      )}

      {/* All series */}
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ink-4)" }}>
          {active === "All" ? "Explore Series" : active}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(active === "All" ? SERIES.filter((s) => !s.enrolled) : filtered).map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SeriesCard({ series: s }: { series: typeof SERIES[0] }) {
  const pct = s.done ? Math.round((s.done / s.total) * 100) : 0;

  return (
    <div
      className="relative rounded-[14px] p-4 border transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col"
      style={{ background: "white", borderColor: "var(--line)" }}
    >
      {/* Top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: s.tint }} />

      <div className="flex items-start justify-between mt-1 mb-3">
        <div className="flex gap-2 flex-wrap">
          {s.tag && (
            <span
              className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-[4px]"
              style={{ background: s.tagColor + "15", color: s.tagColor }}
            >
              {s.tag}
            </span>
          )}
          <span
            className="text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-[4px]"
            style={{ background: "var(--line-soft)", color: "var(--ink-3)" }}
          >
            {s.category.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#B45309" }}>
          <Star size={11} fill="#F59E0B" stroke="none" />
          {s.rating}
        </div>
      </div>

      <div className="text-[14px] font-semibold leading-snug flex-1" style={{ color: "var(--ink-1)", fontFamily: "var(--font-sora)" }}>
        {s.title}
      </div>
      <div className="text-[12px] mt-1" style={{ color: "var(--ink-3)" }}>{s.subtitle}</div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 mt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
          <BookOpen size={12} /> {s.tests} tests
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
          <Clock size={12} /> {s.duration}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
          <Users size={12} /> {s.students} students
        </span>
      </div>

      {/* Progress (enrolled only) */}
      {s.enrolled && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "var(--ink-3)" }}>Progress</span>
            <span>
              <strong style={{ color: "var(--ink-1)" }}>{s.done}</strong>
              <span style={{ color: "var(--ink-3)" }}> / {s.total} · {pct}%</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.tint }} />
          </div>
          {s.nextTest && (
            <div className="mt-2.5 rounded-[8px] px-2.5 py-2" style={{ background: "var(--bg)" }}>
              <div className="text-[9px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: "var(--ink-4)" }}>Next up</div>
              <div className="text-[12px] font-medium" style={{ color: "var(--ink-1)" }}>{s.nextTest}</div>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-2 mt-4">
        <Link
          href={s.enrolled ? `/exam/${s.id}` : "#"}
          className="flex-1 py-2 text-center text-[13px] font-semibold rounded-[9px] text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
          style={{ background: s.tint }}
        >
          {s.enrolled ? "Continue →" : "Enroll Now"}
        </Link>
        {!s.enrolled && (
          <button
            className="px-3 py-2 text-[12px] font-medium rounded-[9px] transition-all hover:bg-[var(--bg)]"
            style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
          >
            Preview
          </button>
        )}
      </div>
    </div>
  );
}

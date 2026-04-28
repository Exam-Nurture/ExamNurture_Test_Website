"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, FileText, Users, Star, Lock, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   Mock data — replace with API call later
───────────────────────────────────────────── */
const CATEGORIES = ["All", "SSC", "Banking", "Railways", "State PSC", "Defence", "Teaching"];

const SERIES_LIST = [
  {
    id: "ssc-cgl-complete",
    title: "SSC CGL Complete Series 2025",
    category: "SSC",
    tests: 40,
    pyqs: 10,
    duration: "120 min / test",
    students: "61K",
    rating: 4.8,
    tint: "#2563EB",
    colorSoft: "#EFF6FF",
    free: false,
    badge: "Bestseller",
    badgeColor: "#F59E0B",
    badgeSoft: "#FEF3C7",
    enrolled: true,
    progress: { done: 12, total: 40 },
    tags: ["GK", "Reasoning", "English", "Quant"],
  },
  {
    id: "ibps-po-complete",
    title: "IBPS PO Complete Series 2025",
    category: "Banking",
    tests: 25,
    pyqs: 8,
    duration: "60 min / test",
    students: "34K",
    rating: 4.7,
    tint: "#7C3AED",
    colorSoft: "#F5F3FF",
    free: false,
    badge: "Popular",
    badgeColor: "#7C3AED",
    badgeSoft: "#F5F3FF",
    enrolled: true,
    progress: { done: 8, total: 25 },
    tags: ["Reasoning", "English", "Quant", "GA"],
  },
  {
    id: "jpsc-prelims-series",
    title: "JPSC Prelims Mock Series 2025",
    category: "State PSC",
    tests: 20,
    pyqs: 5,
    duration: "120 min / test",
    students: "18K",
    rating: 4.6,
    tint: "#059669",
    colorSoft: "#ECFDF5",
    free: false,
    badge: "Jharkhand",
    badgeColor: "#059669",
    badgeSoft: "#ECFDF5",
    enrolled: true,
    progress: { done: 4, total: 20 },
    tags: ["GS", "CSAT", "Jharkhand GK"],
  },
  {
    id: "ssc-chsl-series",
    title: "SSC CHSL Full Length Series",
    category: "SSC",
    tests: 30,
    pyqs: 7,
    duration: "60 min / test",
    students: "28K",
    rating: 4.5,
    tint: "#2563EB",
    colorSoft: "#EFF6FF",
    free: true,
    badge: "Free",
    badgeColor: "#16A34A",
    badgeSoft: "#DCFCE7",
    enrolled: false,
    progress: null,
    tags: ["English", "Quant", "GK", "Reasoning"],
  },
  {
    id: "rrc-group-d",
    title: "RRC Group D Practice Series",
    category: "Railways",
    tests: 15,
    pyqs: 5,
    duration: "90 min / test",
    students: "42K",
    rating: 4.4,
    tint: "#DC2626",
    colorSoft: "#FEF2F2",
    free: true,
    badge: "Free",
    badgeColor: "#16A34A",
    badgeSoft: "#DCFCE7",
    enrolled: false,
    progress: null,
    tags: ["Maths", "Reasoning", "GS", "Science"],
  },
  {
    id: "sbi-clerk-series",
    title: "SBI Clerk Prelims + Mains",
    category: "Banking",
    tests: 22,
    pyqs: 6,
    duration: "60 min / test",
    students: "25K",
    rating: 4.6,
    tint: "#0891B2",
    colorSoft: "#ECFEFF",
    free: false,
    badge: "New",
    badgeColor: "#0891B2",
    badgeSoft: "#ECFEFF",
    enrolled: false,
    progress: null,
    tags: ["English", "Reasoning", "Quant", "GA"],
  },
  {
    id: "up-tgt-series",
    title: "UP TGT / PGT Complete Series",
    category: "Teaching",
    tests: 18,
    pyqs: 4,
    duration: "120 min / test",
    students: "9K",
    rating: 4.3,
    tint: "#D97706",
    colorSoft: "#FFFBEB",
    free: false,
    badge: null,
    badgeColor: "",
    badgeSoft: "",
    enrolled: false,
    progress: null,
    tags: ["Subject", "Hindi", "Pedagogy"],
  },
  {
    id: "agneepath-series",
    title: "Agniveer Agneepath Series",
    category: "Defence",
    tests: 20,
    pyqs: 5,
    duration: "60 min / test",
    students: "31K",
    rating: 4.5,
    tint: "#15803D",
    colorSoft: "#F0FDF4",
    free: true,
    badge: "Free",
    badgeColor: "#16A34A",
    badgeSoft: "#DCFCE7",
    enrolled: false,
    progress: null,
    tags: ["Maths", "Physics", "GK", "Reasoning"],
  },
];

export default function SeriesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const isFreeFilter = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("filter") === "free";
  const [freeOnly, setFreeOnly] = useState(isFreeFilter);

  const filtered = SERIES_LIST.filter((s) => {
    const catOk = activeTab === "All" || s.category === activeTab;
    const freeOk = !freeOnly || s.free;
    return catOk && freeOk;
  });

  const enrolled = filtered.filter(s => s.enrolled);
  const browse   = filtered.filter(s => !s.enrolled);

  return (
    <div className="flex flex-col gap-8 fade-up">

      {/* Header */}
      <div className="pt-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2"
              style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
              Test Series
            </h1>
            <p className="text-base max-w-xl" style={{ color: "var(--ink-4)", lineHeight: "1.6" }}>
              Structured mock test packages for every competitive exam.{" "}
              <span style={{ color: "var(--blue)" }}>{SERIES_LIST.length} series</span> available —{" "}
              <span style={{ color: "var(--green)" }}>{SERIES_LIST.filter(s => s.free).length} completely free</span>.
            </p>
          </div>

          {/* Free toggle */}
          <button
            onClick={() => setFreeOnly(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              freeOnly
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                : "text-[var(--ink-3)] border-[var(--line-soft)] hover:bg-[var(--bg)]"
            }`}
          >
            <Zap size={14} className={freeOnly ? "text-emerald-600" : "text-[var(--ink-4)]"} />
            Free Only
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="flex gap-0.5 p-1 rounded-[10px] overflow-x-auto"
        style={{ background: "var(--bg)", border: "1px solid var(--line)", scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className="whitespace-nowrap px-3 py-1.5 rounded-[7px] text-[12px] font-medium transition-all flex-shrink-0"
            style={{
              background: activeTab === cat ? "var(--card)" : "transparent",
              color: activeTab === cat ? "var(--ink-1)" : "var(--ink-4)",
              boxShadow: activeTab === cat ? "var(--shadow-xs)" : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Enrolled */}
      {enrolled.length > 0 && (
        <section>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: "var(--ink-4)" }}>
            <CheckCircle2 size={13} className="text-green-500" /> My Enrolled Series
          </div>
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {enrolled.map(s => (
              <motion.div key={s.id} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
                <SeriesCard series={s} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Browse */}
      {browse.length > 0 && (
        <section>
          {enrolled.length > 0 && (
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--ink-4)" }}>
              Browse All
            </div>
          )}
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {browse.map(s => (
              <motion.div key={s.id} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
                <SeriesCard series={s} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20" style={{ color: "var(--ink-4)" }}>
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm font-medium">No series found for this filter.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Series Card ─── */
type Series = typeof SERIES_LIST[number];

function SeriesCard({ series: s }: { series: Series }) {
  const pct = s.progress ? Math.round((s.progress.done / s.progress.total) * 100) : 0;

  return (
    <div className="card card-lift flex flex-col" style={{ padding: "20px 22px 18px" }}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: s.tint }} />

      {/* Badges row */}
      <div className="flex items-center gap-1.5 mt-1 mb-3 flex-wrap">
        <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded"
          style={{ background: s.colorSoft, color: s.tint }}>
          {s.category.toUpperCase()}
        </span>
        {s.badge && (
          <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded"
            style={{ background: s.badgeSoft, color: s.badgeColor }}>
            {s.badge}
          </span>
        )}
        {s.enrolled && (
          <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            ENROLLED
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold leading-snug mb-1.5"
        style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
        {s.title}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {s.tags.map(tag => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ background: "var(--line-soft)", color: "var(--ink-4)" }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-[11px] mb-3" style={{ color: "var(--ink-3)" }}>
        <span className="inline-flex items-center gap-1">
          <FileText size={11} /> {s.tests} tests
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={11} /> {s.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={11} /> {s.students}
        </span>
        <span className="inline-flex items-center gap-1 ml-auto">
          <Star size={11} className="fill-amber-400 text-amber-400" /> {s.rating}
        </span>
      </div>

      {/* Progress bar (enrolled) */}
      {s.enrolled && s.progress && (
        <div className="mb-3">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "var(--ink-3)" }}>Progress</span>
            <span>
              <strong style={{ color: "var(--ink-1)" }}>{s.progress.done}</strong>
              <span style={{ color: "var(--ink-3)" }}> / {s.progress.total} · {pct}%</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.tint }} />
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* CTA */}
      <Link
        href={`/series/${s.id}`}
        className="mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
        style={{ background: s.tint }}
      >
        {s.enrolled ? "Continue" : s.free ? "Start Free" : "Enroll Now"} →
      </Link>
    </div>
  );
}

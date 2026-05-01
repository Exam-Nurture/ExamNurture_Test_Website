import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, BarChart3, CheckCircle2, Clock, FileText, Lock, Play, Star, Users, Zap } from "lucide-react";

const SERIES = [
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
    free: false,
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
    free: false,
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
    free: false,
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
    free: true,
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
    free: true,
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
    free: false,
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
    free: false,
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
    free: true,
    enrolled: false,
    progress: null,
    tags: ["Maths", "Physics", "GK", "Reasoning"],
  },
];

const TESTS = [
  { id: "demo", title: "Full Mock Test 01", questions: 100, duration: "120 min", status: "available" },
  { id: "jpsc-mock-04", title: "Sectional Drill: Reasoning", questions: 35, duration: "40 min", status: "available" },
  { id: "di-drill", title: "Data Interpretation Sprint", questions: 30, duration: "35 min", status: "available" },
  { id: "jpsc-mock-05", title: "Full Mock Test 02", questions: 100, duration: "120 min", status: "locked" },
];

export function generateStaticParams() {
  return SERIES.map((series) => ({ id: series.id }));
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const series = SERIES.find((item) => item.id === id);
  if (!series) notFound();

  const progress = series.progress ? Math.round((series.progress.done / series.progress.total) * 100) : 0;

  return (
    <div className="fade-up flex flex-col gap-6">
      <Link href="/series" className="inline-flex items-center gap-2 text-sm font-semibold w-fit" style={{ color: "var(--ink-3)" }}>
        <ArrowLeft size={16} /> Back to series
      </Link>

      <section className="card overflow-hidden">
        <div className="h-1.5" style={{ background: series.tint }} />
        <div className="p-6 md:p-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded" style={{ background: `${series.tint}18`, color: series.tint }}>
                {series.category.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--amber)" }}>
                <Star size={12} className="fill-current" /> {series.rating}
              </span>
              {series.free && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--green)" }}>
                  <Zap size={12} /> Free access
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
              {series.title}
            </h1>
            <p className="text-sm md:text-base max-w-2xl" style={{ color: "var(--ink-3)", lineHeight: 1.7 }}>
              Continue a structured practice path with full mocks, PYQ-style drills, timed review, and topic coverage matched to the exam pattern.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {series.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "var(--bg)", color: "var(--ink-3)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric icon={<FileText size={15} />} label="Tests" value={String(series.tests)} />
              <Metric icon={<Clock size={15} />} label="Duration" value={series.duration} />
              <Metric icon={<Users size={15} />} label="Students" value={series.students} />
              <Metric icon={<BarChart3 size={15} />} label="PYQs" value={String(series.pyqs)} />
            </div>

            {series.progress && (
              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span style={{ color: "var(--ink-3)" }}>Progress</span>
                  <strong style={{ color: "var(--ink-1)" }}>{progress}%</strong>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: series.tint }} />
                </div>
              </div>
            )}

            <Link href="/exam/demo" className="mt-5 h-11 rounded-[10px] inline-flex items-center justify-center gap-2 w-full text-white text-sm font-semibold" style={{ background: series.tint }}>
              <Play size={14} fill="white" stroke="none" />
              {series.enrolled ? "Continue Practice" : series.free ? "Start Free" : "Enroll Now"}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--ink-1)" }}>Available tests</h2>
            <p className="text-xs mt-1" style={{ color: "var(--ink-4)" }}>Start with the first unlocked test and review after submission.</p>
          </div>
        </div>

        <div className="grid gap-3">
          {TESTS.map((test, index) => {
            const locked = test.status === "locked" && !series.enrolled && !series.free;
            return (
              <div key={test.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: `${series.tint}14`, color: series.tint }}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold" style={{ color: "var(--ink-1)" }}>{test.title}</div>
                  <div className="text-xs mt-1 flex flex-wrap gap-3" style={{ color: "var(--ink-4)" }}>
                    <span>{test.questions} questions</span>
                    <span>{test.duration}</span>
                    <span>Detailed solutions</span>
                  </div>
                </div>
                {locked ? (
                  <button className="h-10 px-4 rounded-[10px] inline-flex items-center justify-center gap-2 text-sm font-semibold" style={{ background: "var(--line-soft)", color: "var(--ink-4)" }}>
                    <Lock size={14} /> Locked
                  </button>
                ) : (
                  <Link href={`/exam/${test.id}`} className="h-10 px-4 rounded-[10px] inline-flex items-center justify-center gap-2 text-sm font-semibold text-white" style={{ background: series.tint }}>
                    <CheckCircle2 size={14} /> Start
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--card)", border: "1px solid var(--line-soft)" }}>
      <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-4)" }}>
        {icon} {label}
      </div>
      <div className="text-sm font-bold mt-1" style={{ color: "var(--ink-1)" }}>{value}</div>
    </div>
  );
}

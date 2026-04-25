"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Clock, BookOpen, Download, Play, ChevronDown } from "lucide-react";

const EXAMS   = ["All", "JEE Main", "JEE Advanced", "NEET", "BITSAT"];
const YEARS   = ["All Years", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
const SUBJECTS_F = ["All Subjects", "Physics", "Chemistry", "Mathematics", "Biology"];

const PAPERS = [
  { id: "jee-main-2024-s1", exam: "JEE Main", year: "2024", shift: "Shift 1", date: "Jan 27, 2024", qs: 90, duration: "3 hrs", subjects: ["Physics", "Chemistry", "Mathematics"], attempted: true, score: "248/300", difficulty: "Medium" },
  { id: "jee-main-2024-s2", exam: "JEE Main", year: "2024", shift: "Shift 2", date: "Jan 27, 2024", qs: 90, duration: "3 hrs", subjects: ["Physics", "Chemistry", "Mathematics"], attempted: false, score: null, difficulty: "Hard", isNew: true },
  { id: "jee-main-2024-s3", exam: "JEE Main", year: "2024", shift: "Shift 3", date: "Jan 29, 2024", qs: 90, duration: "3 hrs", subjects: ["Physics", "Chemistry", "Mathematics"], attempted: false, score: null, difficulty: "Medium" },
  { id: "jee-adv-2024-p1",  exam: "JEE Advanced", year: "2024", shift: "Paper 1", date: "May 26, 2024", qs: 54, duration: "3 hrs", subjects: ["Physics", "Chemistry", "Mathematics"], attempted: false, score: null, difficulty: "Hard" },
  { id: "jee-adv-2024-p2",  exam: "JEE Advanced", year: "2024", shift: "Paper 2", date: "May 26, 2024", qs: 54, duration: "3 hrs", subjects: ["Physics", "Chemistry", "Mathematics"], attempted: false, score: null, difficulty: "Hard" },
  { id: "jee-main-2023-s1", exam: "JEE Main", year: "2023", shift: "Shift 1", date: "Jan 24, 2023", qs: 90, duration: "3 hrs", subjects: ["Physics", "Chemistry", "Mathematics"], attempted: true, score: "220/300", difficulty: "Medium" },
  { id: "jee-main-2023-s2", exam: "JEE Main", year: "2023", shift: "Shift 2", date: "Jan 24, 2023", qs: 90, duration: "3 hrs", subjects: ["Physics", "Chemistry", "Mathematics"], attempted: false, score: null, difficulty: "Easy" },
  { id: "neet-2024",        exam: "NEET",     year: "2024", shift: "Paper",   date: "May 5, 2024",  qs: 200, duration: "3h 20m", subjects: ["Physics", "Chemistry", "Biology"], attempted: false, score: null, difficulty: "Medium" },
];

const DIFF_STYLE: Record<string, { bg: string; fg: string }> = {
  Easy:   { bg: "#ECFDF5", fg: "#059669" },
  Medium: { bg: "#FFFBEB", fg: "#B45309" },
  Hard:   { bg: "#FEF2F2", fg: "#DC2626" },
};

export default function PYQPage() {
  const [exam, setExam]    = useState("All");
  const [year, setYear]    = useState("All Years");
  const [subj, setSubj]    = useState("All Subjects");

  const filtered = PAPERS.filter((p) =>
    (exam === "All" || p.exam === exam) &&
    (year === "All Years" || p.year === year) &&
    (subj === "All Subjects" || p.subjects.includes(subj))
  );

  return (
    <div className="flex flex-col gap-6 fade-up">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
          PYQ Papers
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--ink-3)" }}>
          Previous year question papers with detailed solutions
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Papers", value: "180+", color: "var(--blue)" },
          { label: "Exams Covered", value: "6", color: "var(--cyan)" },
          { label: "Years (2015–2024)", value: "10", color: "var(--green)" },
          { label: "With Solutions", value: "100%", color: "var(--amber)" },
        ].map((s) => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
            <div className="text-[22px] font-bold" style={{ color: s.color, fontFamily: "var(--font-sora)" }}>{s.value}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select label="Exam" options={EXAMS} value={exam} onChange={setExam} />
        <Select label="Year" options={YEARS} value={year} onChange={setYear} />
        <Select label="Subject" options={SUBJECTS_F} value={subj} onChange={setSubj} />
        <div className="ml-auto text-[12px]" style={{ color: "var(--ink-3)" }}>
          {filtered.length} papers found
        </div>
      </div>

      {/* Paper grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const d = DIFF_STYLE[p.difficulty];
          return (
            <div
              key={p.id}
              className="rounded-[14px] p-4 border flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: "white", borderColor: "var(--line)" }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[4px]"
                    style={{ background: "var(--blue-soft)", color: "var(--blue)" }}
                  >
                    {p.exam.toUpperCase()}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
                    style={{ background: d.bg, color: d.fg }}
                  >
                    {p.difficulty}
                  </span>
                  {p.isNew && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[4px]" style={{ background: "#ECFDF5", color: "#059669" }}>NEW</span>
                  )}
                </div>
                {p.attempted && (
                  <span className="text-[10px] font-semibold" style={{ color: "var(--green)" }}>✓ Done</span>
                )}
              </div>

              {/* Title */}
              <div className="text-[15px] font-semibold leading-snug" style={{ color: "var(--ink-1)", fontFamily: "var(--font-sora)" }}>
                {p.year} — {p.shift}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>{p.date}</div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 mt-3 pb-3" style={{ borderBottom: "1px dashed var(--line)" }}>
                <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
                  <BookOpen size={12} /> {p.qs} Questions
                </span>
                <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--ink-3)" }}>
                  <Clock size={12} /> {p.duration}
                </span>
              </div>

              {/* Score if attempted */}
              {p.attempted && p.score && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: "var(--ink-3)" }}>Your score</span>
                  <span className="text-[13px] font-bold font-mono" style={{ color: "var(--green)" }}>{p.score}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/exam/${p.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold rounded-[9px] text-white transition-all hover:brightness-105"
                  style={{ background: "var(--blue)" }}
                >
                  <Play size={12} fill="white" stroke="none" />
                  {p.attempted ? "Reattempt" : "Attempt"}
                </Link>
                <button
                  className="px-3 py-2 rounded-[9px] transition-all hover:bg-[var(--bg)]"
                  style={{ border: "1px solid var(--line)", color: "var(--ink-3)" }}
                  title="Download PDF"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Select({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-[10px] text-[13px] font-medium transition-all outline-none cursor-pointer"
        style={{
          background: "white",
          border: "1px solid var(--line)",
          color: "var(--ink-1)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ink-3)" }} />
    </div>
  );
}

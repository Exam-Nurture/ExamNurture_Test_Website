"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, Download, Play, CheckCircle2, ChevronDown, Zap } from "lucide-react";
import { EXAM_BOARDS, type ExamBoard, type Exam } from "@/lib/data/examData";

/* ─────────────────────────────────────────────
   Filter boards that have PYQ papers
───────────────────────────────────────────── */
const PYQ_BOARDS = EXAM_BOARDS.filter((b) => b.exams.some((e) => e.hasPYQ));
const BOARD_TABS = ["All", ...PYQ_BOARDS.map((b) => b.shortName)];
const YEARS     = ["All Years", "2024", "2023", "2022", "2021", "2020", "2019"];
const SUBJECTS  = ["All Subjects", "General Knowledge", "Reasoning", "Quantitative Aptitude", "English", "Hindi", "Computer"];

/* ─────────────────────────────────────────────
   Mock PYQ Papers — will come from API
   Each paper is tagged with boardId + examId
───────────────────────────────────────────── */
type Paper = {
  id: string;
  boardId: string;
  examId: string;
  examName: string;
  boardShortName: string;
  year: string;
  paper: string;
  date: string;
  qs: number;
  duration: string;
  subjects: string[];
  attempted: boolean;
  score: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  isNew?: boolean;
};

const PAPERS: Paper[] = [
  { id: "jpsc-pre-2023", boardId: "state-psc", examId: "jpsc-prelims-2025", examName: "JPSC Prelims", boardShortName: "State PSC", year: "2023", paper: "Paper I", date: "Oct 15, 2023", qs: 100, duration: "2 hrs", subjects: ["General Knowledge", "Reasoning"], attempted: true, score: "71/100", difficulty: "Medium" },
  { id: "jpsc-pre-2022", boardId: "state-psc", examId: "jpsc-prelims-2025", examName: "JPSC Prelims", boardShortName: "State PSC", year: "2022", paper: "Paper I", date: "Sep 18, 2022", qs: 100, duration: "2 hrs", subjects: ["General Knowledge", "Reasoning"], attempted: false, score: null, difficulty: "Medium", isNew: true },
  { id: "sbi-po-2024", boardId: "banking-po", examId: "sbi-po-2025", examName: "SBI PO Prelims", boardShortName: "Banking PO", year: "2024", paper: "Shift 1", date: "Mar 2, 2024", qs: 100, duration: "1 hr", subjects: ["Reasoning", "Quantitative Aptitude", "English"], attempted: true, score: "67/100", difficulty: "Hard" },
  { id: "ibps-po-2023", boardId: "banking-po", examId: "ibps-po-2025", examName: "IBPS PO Prelims", boardShortName: "Banking PO", year: "2023", paper: "Shift 2", date: "Oct 7, 2023", qs: 100, duration: "1 hr", subjects: ["Reasoning", "Quantitative Aptitude", "English"], attempted: false, score: null, difficulty: "Hard" },
  { id: "ssc-cgl-2023", boardId: "ssc-upper", examId: "ssc-cgl-2025", examName: "SSC CGL Tier I", boardShortName: "SSC Upper", year: "2023", paper: "Shift 1", date: "Jul 14, 2023", qs: 100, duration: "1 hr", subjects: ["General Knowledge", "Reasoning", "Quantitative Aptitude", "English"], attempted: false, score: null, difficulty: "Medium" },
  { id: "rrb-ntpc-2022", boardId: "railway-ntpc", examId: "rrb-ntpc-grad-2025", examName: "RRB NTPC CBT 1", boardShortName: "Railway NTPC", year: "2022", paper: "Shift 1", date: "Jan 16, 2022", qs: 100, duration: "1.5 hrs", subjects: ["General Knowledge", "Reasoning", "Quantitative Aptitude"], attempted: false, score: null, difficulty: "Easy" },
  { id: "up-si-2023", boardId: "police-si", examId: "up-si-2025", examName: "UP SI / Daroga", boardShortName: "Police SI", year: "2023", paper: "Paper 1", date: "Dec 17, 2023", qs: 160, duration: "2 hrs", subjects: ["General Knowledge", "Reasoning", "Hindi"], attempted: false, score: null, difficulty: "Medium", isNew: true },
  { id: "rrb-grp-d-2022", boardId: "railway-group-d", examId: "rrb-group-d-2025", examName: "RRB Group D", boardShortName: "Railway Gr D", year: "2022", paper: "Shift 1", date: "Aug 18, 2022", qs: 100, duration: "1.5 hrs", subjects: ["General Science", "Maths", "General Intelligence"], attempted: false, score: null, difficulty: "Easy" },
  { id: "ssc-mts-2023", boardId: "ssc-lower", examId: "ssc-mts-2025", examName: "SSC MTS", boardShortName: "SSC MTS", year: "2023", paper: "Shift 1", date: "May 7, 2023", qs: 90, duration: "1.5 hrs", subjects: ["Reasoning", "Quantitative Aptitude", "General English", "General Awareness"], attempted: false, score: null, difficulty: "Easy" },
  { id: "jpsc-pre-2021", boardId: "state-psc", examId: "jpsc-prelims-2025", examName: "JPSC Prelims", boardShortName: "State PSC", year: "2021", paper: "Paper I", date: "Apr 19, 2021", qs: 100, duration: "2 hrs", subjects: ["General Knowledge", "Reasoning"], attempted: true, score: "63/100", difficulty: "Easy" },
  { id: "ibps-clerk-2023", boardId: "banking-clerk", examId: "ibps-clerk-2025", examName: "IBPS Clerk Pre", boardShortName: "Bank Clerk", year: "2023", paper: "Shift 1", date: "Aug 26, 2023", qs: 100, duration: "1 hr", subjects: ["Reasoning", "Quantitative Aptitude", "English"], attempted: false, score: null, difficulty: "Easy" },
  { id: "bpsc-pre-2023", boardId: "state-psc", examId: "bpsc-prelims-2025", examName: "BPSC Prelims", boardShortName: "State PSC", year: "2023", paper: "Paper I", date: "Sep 28, 2023", qs: 150, duration: "2 hrs", subjects: ["General Studies", "Current Affairs"], attempted: false, score: null, difficulty: "Medium" },
];

const DIFF: Record<string, string> = {
  Easy: "var(--green)", Medium: "var(--ink-4)", Hard: "var(--red)",
};

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function PYQPage() {
  const [tab, setTab] = useState("All");
  const [year, setYear] = useState("All Years");
  const [subj, setSubj] = useState("All Subjects");

  const filtered = PAPERS.filter(
    (p) =>
      (tab === "All" || p.boardShortName === tab) &&
      (year === "All Years" || p.year === year) &&
      (subj === "All Subjects" || p.subjects.includes(subj)),
  );

  return (
    <div className="fade-up" style={{ maxWidth: 1200 }}>

      {/* Page header */}
      <div className="mb-7">
        <h1
          className="text-3xl font-bold tracking-tight leading-none"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
        >
          PYQ Papers
        </h1>
        <p className="text-[12px] mt-2" style={{ color: "var(--ink-4)", letterSpacing: "0.01em" }}>
          {PAPERS.length}+ papers · {PYQ_BOARDS.map((b) => b.shortName).join(" · ")} · 2019–2024 · 100% with solutions
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-7"
        style={{ borderBottom: "1px solid var(--line-soft)" }}
      >
        {/* Board tabs */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-[10px] overflow-x-auto"
          style={{ background: "var(--bg)", border: "1px solid var(--line)", scrollbarWidth: "none" }}
        >
          {BOARD_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="whitespace-nowrap px-3 py-1.5 rounded-[7px] text-[12px] font-medium transition-all duration-150 flex-shrink-0"
              style={{
                background: tab === t ? "var(--card)" : "transparent",
                color: tab === t ? "var(--ink-1)" : "var(--ink-4)",
                boxShadow: tab === t ? "var(--shadow-xs)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Dropdowns + count */}
        <div className="flex items-center gap-2">
          <Dropdown options={YEARS} value={year} onChange={setYear} />
          <Dropdown options={SUBJECTS} value={subj} onChange={setSubj} />
          <span
            className="text-[12px] pl-3"
            style={{ color: "var(--ink-4)", borderLeft: "1px solid var(--line)" }}
          >
            {filtered.length} {filtered.length === 1 ? "paper" : "papers"}
          </span>
        </div>
      </div>

      {/* Paper grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[14px]" style={{ color: "var(--ink-4)" }}>
          No papers match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
          {filtered.map((p) => <PaperCard key={p.id} paper={p} />)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Paper Card
───────────────────────────────────────────── */
function PaperCard({ paper: p }: { paper: Paper }) {
  const cta = p.attempted ? "Reattempt" : "Attempt";

  return (
    <div
      className="card card-lift flex flex-col"
      style={{ padding: "22px 24px 20px", borderRadius: 16 }}
    >
      {/* Row 1: exam label + status */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--ink-4)" }}
        >
          {p.examName}
        </span>

        {p.attempted ? (
          <div className="flex flex-col items-end">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium leading-none"
              style={{ color: "var(--green)" }}
            >
              <CheckCircle2 size={11} strokeWidth={2.5} />
              Done
            </span>
            {p.score && (
              <span
                className="text-[12px] font-bold mt-1.5 leading-none"
                style={{ fontFamily: "var(--font-mono)", color: "var(--green)" }}
              >
                {p.score}
              </span>
            )}
          </div>
        ) : p.isNew ? (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "var(--blue-soft)", color: "var(--blue)" }}
          >
            <Zap size={9} strokeWidth={2.5} />
            New
          </span>
        ) : null}
      </div>

      {/* Row 2: title */}
      <div
        className="text-[17px] font-semibold leading-tight"
        style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
      >
        {p.year} — {p.paper}
      </div>

      {/* Row 3: date */}
      <div className="text-[12px] mt-1" style={{ color: "var(--ink-4)" }}>{p.date}</div>

      {/* Row 4: meta */}
      <div className="flex items-center gap-0 mt-4">
        <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ink-3)" }}>
          <BookOpen size={12} strokeWidth={1.75} />
          {p.qs} Questions
        </span>
        <span className="mx-2.5 text-[11px]" style={{ color: "var(--line)" }}>·</span>
        <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ink-3)" }}>
          <Clock size={12} strokeWidth={1.75} />
          {p.duration}
        </span>
        <span
          className="ml-auto text-[11px] font-semibold"
          style={{ color: DIFF[p.difficulty] }}
        >
          {p.difficulty}
        </span>
      </div>

      {/* Empty space for alignment */}
      <div className="mt-4" />

      {/* Separator */}
      <div className="mt-5 mb-4" style={{ borderTop: "1px solid var(--line-soft)" }} />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/exam/${p.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] text-[13px] font-semibold text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
          style={{ background: "var(--blue)", height: 38 }}
        >
          <Play size={11} fill="white" stroke="none" />
          {cta}
        </Link>
        <button
          className="inline-flex items-center justify-center rounded-[10px] transition-all duration-150 hover:bg-[var(--bg)] active:scale-[0.96]"
          style={{ width: 38, height: 38, border: "1px solid var(--line)", color: "var(--ink-4)" }}
          title="Download paper PDF"
        >
          <Download size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Dropdown
───────────────────────────────────────────── */
function Dropdown({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  const isDefault = value === options[0];
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none cursor-pointer outline-none rounded-[8px] text-[12px] font-medium transition-all duration-150"
        style={{
          paddingLeft: 12, paddingRight: 28, paddingTop: 7, paddingBottom: 7,
          background: "var(--card)",
          border: "1px solid var(--line)",
          color: isDefault ? "var(--ink-3)" : "var(--ink-1)",
        }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown
        size={12}
        strokeWidth={2}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--ink-4)" }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, Users, ChevronRight, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { EXAM_BOARDS, TIERS, type ExamBoard, type Exam } from "@/lib/data/examData";

/* ─────────────────────────────────────────────
   Mock enrolled state — will come from API later
───────────────────────────────────────────── */
const ENROLLED_EXAM_IDS = new Set(["jpsc-prelims-2025", "ibps-po-2025", "ssc-cgl-2025"]);
const MOCK_PROGRESS: Record<string, { done: number; total: number }> = {
  "jpsc-prelims-2025": { done: 4, total: 20 },
  "ibps-po-2025": { done: 8, total: 25 },
  "ssc-cgl-2025": { done: 2, total: 40 },
};
const MOCK_STUDENTS: Record<string, string> = {
  "jpsc-prelims-2025": "18K",
  "ibps-po-2025": "34K",
  "ssc-cgl-2025": "61K",
};

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function TestSeriesPage() {
  const allBoards = EXAM_BOARDS;
  const boardTabs = ["All", ...allBoards.map((b) => b.shortName)];
  const [activeTab, setActiveTab] = useState("All");

  const filteredBoards = activeTab === "All"
    ? allBoards
    : allBoards.filter((b) => b.shortName === activeTab);

  // Separate enrolled exams
  const enrolledExams = allBoards
    .flatMap((b) => b.exams.map((e) => ({ ...e, board: b })))
    .filter((e) => ENROLLED_EXAM_IDS.has(e.id));

  return (
    <div className="flex flex-col gap-7 fade-up">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
        >
          Test Series
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "var(--ink-4)" }}>
          {allBoards.length} exam boards · {allBoards.reduce((s, b) => s + b.exams.length, 0)} exams — mock tests for every competitive exam
        </p>
      </div>

      {/* Board Tabs */}
      <div
        className="flex gap-0.5 p-1 rounded-[10px] overflow-x-auto"
        style={{ background: "var(--bg)", border: "1px solid var(--line)", scrollbarWidth: "none" }}
      >
        {boardTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="whitespace-nowrap px-3 py-1.5 rounded-[7px] text-[12px] font-medium transition-all duration-150 flex-shrink-0"
            style={{
              background: activeTab === tab ? "var(--card)" : "transparent",
              color: activeTab === tab ? "var(--ink-1)" : "var(--ink-4)",
              boxShadow: activeTab === tab ? "var(--shadow-xs)" : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* My Enrolled */}
      {activeTab === "All" && enrolledExams.length > 0 && (
        <section>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
            My Enrolled Exams
          </div>
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {enrolledExams.map((exam) => (
              <motion.div key={exam.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                <ExamCard exam={exam} board={exam.board} enrolled />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Browse by Board */}
      <div className="flex flex-col gap-8">
        {filteredBoards.map((board) => {
          const unenrolledExams = board.exams.filter((e) => !ENROLLED_EXAM_IDS.has(e.id));
          if (activeTab !== "All" && unenrolledExams.length === 0 && board.exams.every(e => ENROLLED_EXAM_IDS.has(e.id))) {
            // Show enrolled ones too when filtering by specific board
            return (
              <BoardSection key={board.id} board={board} exams={board.exams} />
            );
          }
          const examsToShow = activeTab === "All" ? unenrolledExams : board.exams;
          if (examsToShow.length === 0) return null;
          return (
            <BoardSection key={board.id} board={board} exams={examsToShow} />
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Board Section
───────────────────────────────────────────── */
function BoardSection({ board, exams }: { board: ExamBoard; exams: Exam[] }) {
  const tierLabel = TIERS.find((t) => t.id === board.minTier);

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: board.tint }}
        />
        <h2 className="text-[15px] font-bold" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
          {board.name}
        </h2>
        {tierLabel && (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: tierLabel.colorSoft, color: tierLabel.color }}
          >
            {tierLabel.badge}
          </span>
        )}
        <span className="text-[11px] text-[var(--ink-4)]">{board.description}</span>
      </div>
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {exams.map((exam) => (
          <motion.div key={exam.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
            <ExamCard exam={exam} board={board} enrolled={ENROLLED_EXAM_IDS.has(exam.id)} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Exam Card
───────────────────────────────────────────── */
function ExamCard({ exam, board, enrolled }: { exam: Exam; board: ExamBoard; enrolled?: boolean }) {
  const progress = MOCK_PROGRESS[exam.id];
  const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0;
  const students = MOCK_STUDENTS[exam.id] ?? "—";

  return (
    <div
      className="card card-lift flex flex-col"
      style={{ padding: "20px 22px 18px" }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]" style={{ background: board.tint }} />

      {/* Header row */}
      <div className="flex items-start justify-between mb-3 mt-1">
        <div className="flex flex-wrap gap-1.5">
          <span
            className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded"
            style={{ background: board.colorSoft, color: board.tint }}
          >
            {board.shortName}
          </span>
          <span
            className="text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded"
            style={{ background: "var(--line-soft)", color: "var(--ink-3)" }}
          >
            {exam.eligibility.toUpperCase()}
          </span>
        </div>
        {exam.upcomingDate && (
          <span className="text-[10px] font-medium" style={{ color: "var(--ink-4)" }}>
            {exam.upcomingDate}
            {exam.daysLeft && <span style={{ color: board.tint }}> · {exam.daysLeft}d</span>}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-[14px] font-semibold leading-snug"
        style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
      >
        {exam.name}
      </h3>

      {/* Pattern & subjects */}
      <div className="text-[11px] mt-1.5 mb-3" style={{ color: "var(--ink-3)" }}>
        {exam.pattern}
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {exam.subjects.slice(0, 4).map((s) => (
          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "var(--line-soft)", color: "var(--ink-4)" }}>
            {s}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--ink-3)" }}>
        {exam.hasTests && <span className="inline-flex items-center gap-1"><BookOpen size={11} /> Tests</span>}
        {exam.hasPYQ && <span className="inline-flex items-center gap-1"><Clock size={11} /> PYQ</span>}
        <span className="inline-flex items-center gap-1"><Users size={11} /> {students}</span>
      </div>

      {/* Progress (enrolled) */}
      {enrolled && progress && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span style={{ color: "var(--ink-3)" }}>Progress</span>
            <span>
              <strong style={{ color: "var(--ink-1)" }}>{progress.done}</strong>
              <span style={{ color: "var(--ink-3)" }}> / {progress.total} · {pct}%</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: board.tint }} />
          </div>
        </div>
      )}

      {/* Spacer + CTA */}
      <div className="flex-1" />
      <div className="flex gap-2 mt-4">
        <Link
          href="/exam/demo"
          className="flex-1 py-2.5 text-center text-[13px] font-semibold rounded-[10px] text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
          style={{ background: board.tint }}
        >
          {enrolled ? "Continue →" : "Start →"}
        </Link>
      </div>
    </div>
  );
}

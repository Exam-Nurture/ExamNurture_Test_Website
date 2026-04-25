"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, TrendingUp, Target, Clock, CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp, RotateCcw, LayoutDashboard } from "lucide-react";

const SUBJECTS = [
  { name: "Physics",     color: "#10B981", correct: 20, wrong: 3, skipped: 2, total: 25, marks: 77 },
  { name: "Chemistry",   color: "#EF4444", correct: 14, wrong: 7, skipped: 4, total: 25, marks: 49 },
  { name: "Mathematics", color: "#F59E0B", correct: 16, wrong: 5, skipped: 4, total: 25, marks: 59 },
];

const Q_REVIEW = [
  { q: "A particle moves in a circle of radius R…", opts: ["v", "2v", "√2·v", "Zero"], correct: 1, answered: 1, subject: "Physics" },
  { q: "The dimensional formula for Planck's constant…", opts: ["Energy", "Angular momentum", "Power", "Linear momentum"], correct: 1, answered: 2, subject: "Physics" },
  { q: "The IUPAC name of CH₃–CH(OH)–CH₃ is:", opts: ["Propan-1-ol", "Propan-2-ol", "2-methylpropanol", "Isopropane"], correct: 1, answered: 1, subject: "Chemistry" },
  { q: "The value of lim(x→0) (sin x / x) is:", opts: ["0", "1", "∞", "Undefined"], correct: 1, answered: 1, subject: "Mathematics" },
  { q: "The derivative of ln(x) with respect to x is:", opts: ["1/x", "x", "ln(x)/x", "eˣ"], correct: 0, answered: null, subject: "Mathematics" },
];

const totalCorrect = SUBJECTS.reduce((a, s) => a + s.correct, 0);
const totalWrong   = SUBJECTS.reduce((a, s) => a + s.wrong, 0);
const totalSkipped = SUBJECTS.reduce((a, s) => a + s.skipped, 0);
const totalMarks   = SUBJECTS.reduce((a, s) => a + s.marks, 0);
const maxMarks     = 300;

export default function ResultsPage({ resultId }: { resultId: string }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const pct = Math.round((totalMarks / maxMarks) * 100);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", fontFamily: "var(--font-inter)" }}>
      {/* Top nav */}
      <header
        className="h-14 flex items-center justify-between px-6 border-b"
        style={{ background: "white", borderColor: "var(--line)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--blue), var(--cyan))" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="font-bold text-[15px]" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
            Exam<span style={{ color: "var(--cyan)" }}>Nurture</span>
          </span>
          <span className="text-[12px] px-2.5 py-0.5 rounded-full" style={{ background: "var(--green-soft)", color: "#047857", border: "1px solid #A7F3D0" }}>
            Result
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/exam/jee-main-mock-14"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[12px] font-medium transition-all hover:bg-[var(--bg)]"
            style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
          >
            <RotateCcw size={13} /> Reattempt
          </Link>
          <Link href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[12px] font-semibold text-white transition-all hover:brightness-105"
            style={{ background: "var(--blue)" }}
          >
            <LayoutDashboard size={13} /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 py-8 flex flex-col gap-6 fade-up">
        {/* ── Score hero ─────────────────────────────── */}
        <div
          className="rounded-[18px] p-6 md:p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--ink-1) 0%, #1E293B 100%)" }}
        >
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle at 80% 20%, rgba(37,99,235,.35), transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 80%, rgba(6,182,212,.25), transparent 60%)" }} />

          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={18} style={{ color: "#FBBF24" }} />
                <span className="text-[12px] font-semibold text-white/70">JEE Main Full Mock #14 · Apr 25, 2026</span>
              </div>
              <div
                className="text-[52px] font-bold tracking-tight text-white leading-none"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {totalMarks}
                <span className="text-[24px] font-medium text-white/50">/{maxMarks}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Chip icon={<TrendingUp size={14} />} label="Percentile" val="94.2" color="#10B981" />
                <Chip icon={<Target size={14} />}     label="AIR"        val="~1,240" color="#06B6D4" />
                <Chip icon={<Clock size={14} />}      label="Time taken"  val="2h 47m" color="#F59E0B" />
              </div>
            </div>

            {/* Donut-like progress */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#10B981 0% ${pct}%, rgba(255,255,255,.1) ${pct}% 100%)`,
                  boxShadow: "0 0 0 6px rgba(255,255,255,.06)",
                }}
              >
                <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                  style={{ background: "#1E293B" }}
                >
                  <span className="text-[18px] font-bold text-white font-mono">{pct}%</span>
                </div>
              </div>
              <span className="text-[11px] text-white/60 mt-1">Score %</span>
            </div>
          </div>
        </div>

        {/* ── Q Summary ─────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Correct",  val: totalCorrect, icon: <CheckCircle  size={18} />, color: "#059669", bg: "#ECFDF5" },
            { label: "Wrong",    val: totalWrong,   icon: <XCircle      size={18} />, color: "#DC2626", bg: "#FEF2F2" },
            { label: "Skipped",  val: totalSkipped, icon: <MinusCircle  size={18} />, color: "#64748B", bg: "#F1F5F9" },
          ].map((s) => (
            <div key={s.label}
              className="rounded-[14px] p-4 flex items-center gap-3"
              style={{ background: s.bg, border: `1px solid ${s.color}22` }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + "22", color: s.color }}
              >
                {s.icon}
              </div>
              <div>
                <div className="text-[24px] font-bold" style={{ color: s.color, fontFamily: "var(--font-sora)" }}>{s.val}</div>
                <div className="text-[12px]" style={{ color: s.color }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Subject breakdown ─────────────────���───── */}
        <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
          <div className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink-1)" }}>Subject-wise Analysis</div>
          <div className="flex flex-col gap-4">
            {SUBJECTS.map((s) => {
              const pctS = Math.round((s.marks / (s.total * 4)) * 100);
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>{s.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[12px]">
                      <span style={{ color: "#059669" }}>✓ {s.correct}</span>
                      <span style={{ color: "#DC2626" }}>✗ {s.wrong}</span>
                      <span style={{ color: "var(--ink-4)" }}>— {s.skipped}</span>
                      <span className="font-bold font-mono" style={{ color: s.color }}>{s.marks} pts</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pctS}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Question review ─────────────────��─────── */}
        <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Question Review</div>
            <span className="text-[12px]" style={{ color: "var(--ink-3)" }}>Showing {Q_REVIEW.length} questions</span>
          </div>
          <div className="flex flex-col gap-3">
            {Q_REVIEW.map((item, i) => {
              const isCorrect  = item.answered === item.correct;
              const isSkipped  = item.answered === null;
              const isWrong    = !isCorrect && !isSkipped;
              const isOpen     = expanded === i;
              return (
                <div
                  key={i}
                  className="rounded-[12px] overflow-hidden border"
                  style={{ borderColor: isCorrect ? "#A7F3D0" : isWrong ? "#FECACA" : "var(--line)" }}
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-all hover:bg-[var(--bg)]"
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
                        style={{ background: isCorrect ? "#10B981" : isWrong ? "#EF4444" : "#94A3B8" }}
                      >
                        {isCorrect ? "✓" : isWrong ? "✗" : "—"}
                      </div>
                      <span className="text-[13px] font-medium line-clamp-1" style={{ color: "var(--ink-1)" }}>
                        Q{i + 1}. {item.q}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
                        style={{ background: "var(--line-soft)", color: "var(--ink-3)" }}
                      >{item.subject}</span>
                      {isOpen ? <ChevronUp size={14} style={{ color: "var(--ink-3)" }} /> : <ChevronDown size={14} style={{ color: "var(--ink-3)" }} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 flex flex-col gap-2" style={{ borderTop: "1px solid var(--line-soft)" }}>
                      <p className="text-[13px] pt-3" style={{ color: "var(--ink-1)" }}>{item.q}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {item.opts.map((opt, oi) => {
                          const isAns  = oi === item.answered;
                          const isCorr = oi === item.correct;
                          return (
                            <div
                              key={oi}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[13px]"
                              style={
                                isCorr
                                  ? { background: "#ECFDF5", border: "1.5px solid #6EE7B7" }
                                  : isAns && !isCorr
                                  ? { background: "#FEF2F2", border: "1.5px solid #FECACA" }
                                  : { background: "var(--bg)", border: "1.5px solid var(--line)" }
                              }
                            >
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                                style={
                                  isCorr
                                    ? { background: "#10B981", color: "white" }
                                    : isAns && !isCorr
                                    ? { background: "#EF4444", color: "white" }
                                    : { background: "var(--line)", color: "var(--ink-3)" }
                                }
                              >
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span style={{ color: isCorr ? "#065F46" : isAns && !isCorr ? "#991B1B" : "var(--ink-1)" }}>
                                {opt}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label, val, color }: { icon: React.ReactNode; label: string; val: string; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,.1)" }}>
      <span style={{ color }}>{icon}</span>
      <span className="text-[11px] text-white/60">{label}</span>
      <span className="text-[13px] font-bold text-white">{val}</span>
    </div>
  );
}

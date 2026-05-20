"use client";

/**
 * TestPortal — Full-screen exam shell
 * Wraps QuestionViewer with:
 *   - Countdown timer (auto-submit on timeout)
 *   - Question palette (grid: Unattempted / Answered / Marked)
 *   - Collapsible side panel
 *   - Submit confirmation modal
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Clock, ChevronLeft, ChevronRight, Grid3X3, X,
  AlertTriangle, CheckCircle2, Flag, Send,
} from "lucide-react";
import QuestionViewer, { Question } from "./QuestionViewer";

/* ─── Types ─────────────────────────────────── */
export type QuestionStatus = "unattempted" | "answered" | "marked" | "answered-marked";

export interface TestPortalProps {
  testId: string;
  title: string;
  durationSec: number;
  questions: Question[];
  onSubmit: (answers: Record<string, number>, timeTakenSec: number) => Promise<void>;
}

/* ─── Timer ─────────────────────────────────── */
function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Palette colours ───────────────────────── */
const PALETTE_CLASSES: Record<QuestionStatus, string> = {
  unattempted:     "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200",
  answered:        "bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-500",
  marked:          "bg-amber-400 text-white hover:bg-amber-500 border border-amber-400",
  "answered-marked":"bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
};

/* ─── Component ──────────────────────────────── */
export default function TestPortal({ testId, title, durationSec, questions, onSubmit }: TestPortalProps) {
  const [currentIdx, setCurrentIdx]     = useState(0);
  const [answers, setAnswers]           = useState<Record<string, number>>({});
  const [statuses, setStatuses]         = useState<Record<string, QuestionStatus>>({});
  const [timeLeft, setTimeLeft]         = useState(durationSec);
  const [showPanel, setShowPanel]       = useState(true);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const startedAt = useRef(Date.now());

  // Build sections from question subjects
  const sections = useMemo(() => {
    const map = new Map<string, number[]>();
    questions.forEach((q, idx) => {
      const sec = q.subject?.trim() || "General";
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec)!.push(idx);
    });
    return Array.from(map.entries()).map(([name, indices]) => ({ name, indices }));
  }, [questions]);

  const hasMultipleSections = sections.length > 1;
  const activeSection = sections[activeSectionIdx] ?? sections[0];
  const visibleIndices = activeSection?.indices ?? questions.map((_, i) => i);

  /* Timer */
  useEffect(() => {
    if (timeLeft <= 0) { handleSubmit(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const question = questions[currentIdx];

  const handleSelect = useCallback((optionIndex: number) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: optionIndex }));
    setStatuses(prev => ({
      ...prev,
      [q.id]: prev[q.id] === "marked" || prev[q.id] === "answered-marked"
        ? "answered-marked"
        : "answered",
    }));
  }, [questions, currentIdx]);

  const handleMark = useCallback(() => {
    const q = questions[currentIdx];
    if (!q) return;
    setStatuses(prev => {
      const cur = prev[q.id] ?? "unattempted";
      let next: QuestionStatus;
      if (cur === "unattempted") next = "marked";
      else if (cur === "answered") next = "answered-marked";
      else if (cur === "marked") next = "unattempted";
      else next = "answered";
      return { ...prev, [q.id]: next };
    });
  }, [questions, currentIdx]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const timeTakenSec = Math.round((Date.now() - startedAt.current) / 1000);
    await onSubmit(answers, timeTakenSec);
    setSubmitting(false);
  };

  const answered   = Object.values(statuses).filter(s => s === "answered" || s === "answered-marked").length;
  const marked     = Object.values(statuses).filter(s => s === "marked" || s === "answered-marked").length;
  const unattempted = questions.length - answered;
  const isWarning  = timeLeft <= 300;  // 5 min

  if (!question) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--card)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--ink-3)" }}>No questions available for this test.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--card)" }}>

      {/* ── Top Bar ── */}
      <header
        className="flex items-center justify-between px-4 md:px-6 h-14 shrink-0"
        style={{ borderBottom: "1px solid var(--line-soft)", background: "var(--card)" }}
      >
        {/* Title */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[14px] font-bold truncate" style={{ color: "var(--ink-1)" }}>
            {title}
          </span>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-[15px] transition-colors ${
          isWarning
            ? "bg-red-50 text-red-600 border border-red-200 animate-pulse"
            : "bg-[var(--bg)] text-[var(--ink-1)] border border-[var(--line-soft)]"
        }`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowPanel(v => !v)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-[var(--bg)]"
            style={{ color: "var(--ink-2)", border: "1px solid var(--line-soft)" }}
          >
            <Grid3X3 className="w-4 h-4" /> Palette
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
            style={{ background: "var(--blue)" }}
          >
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Question area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <QuestionViewer
              question={question}
              questionNumber={currentIdx + 1}
              totalQuestions={questions.length}
              selectedIndex={answers[question.id] ?? null}
              revealed={false}
              onSelect={handleSelect}
              onPrev={currentIdx > 0 ? () => setCurrentIdx(i => i - 1) : undefined}
              onNext={currentIdx < questions.length - 1 ? () => setCurrentIdx(i => i + 1) : undefined}
            />
            {/* Mark for review */}
            <button
              onClick={handleMark}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                statuses[question.id] === "marked" || statuses[question.id] === "answered-marked"
                  ? "bg-amber-50 border-amber-300 text-amber-600"
                  : "border-[var(--line)] text-[var(--ink-3)] hover:bg-[var(--bg)]"
              }`}
            >
              <Flag className="w-4 h-4" />
              {statuses[question.id] === "marked" || statuses[question.id] === "answered-marked"
                ? "Marked for Review"
                : "Mark for Review"}
            </button>
          </div>
        </main>

        {/* Question Palette sidebar */}
        {showPanel && (
          <aside
            className="hidden md:flex flex-col w-72 shrink-0 overflow-y-auto"
            style={{ borderLeft: "1px solid var(--line-soft)" }}
          >
            {/* Section tabs header */}
            {hasMultipleSections && (
              <div
                className="shrink-0 px-3 pt-3 pb-2 space-y-1.5"
                style={{ borderBottom: "1px solid var(--line-soft)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: "var(--ink-4)" }}>
                  Sections
                </p>
                {sections.map((sec, i) => {
                  const secAnswered = sec.indices.filter(idx => {
                    const s = statuses[questions[idx]?.id] ?? "unattempted";
                    return s === "answered" || s === "answered-marked";
                  }).length;
                  const secTotal   = sec.indices.length;
                  const pct        = secTotal ? Math.round((secAnswered / secTotal) * 100) : 0;
                  const isActive   = i === activeSectionIdx;

                  return (
                    <button
                      key={sec.name}
                      onClick={() => setActiveSectionIdx(i)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all"
                      style={{
                        background: isActive ? "var(--blue)" : "var(--bg)",
                        color: isActive ? "#fff" : "var(--ink-2)",
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold truncate leading-none mb-1">
                          {sec.name}
                        </p>
                        {/* mini progress bar */}
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: isActive ? "rgba(255,255,255,0.25)" : "var(--line-soft)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: isActive ? "#fff" : "#22c55e",
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-[11px] font-bold ml-3 shrink-0 tabular-nums"
                        style={{ color: isActive ? "rgba(255,255,255,0.85)" : "var(--ink-4)" }}
                      >
                        {secAnswered}/{secTotal}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Legend + Grid */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {[
                  { color: "bg-emerald-500", label: "Answered", count: answered },
                  { color: "bg-amber-400",   label: "Marked",   count: marked },
                  { color: "bg-blue-600",    label: "Ans+Marked", count: null },
                  { color: "bg-gray-200 dark:bg-gray-700", label: "Unattempted", count: unattempted },
                ].map(({ color, label, count }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
                    <span className={`w-3 h-3 rounded-sm shrink-0 ${color}`} />
                    <span className="truncate">{label}{count !== null ? ` (${count})` : ""}</span>
                  </div>
                ))}
              </div>

              {/* Section stat strip */}
              {hasMultipleSections && (() => {
                const secAnswered = visibleIndices.filter(idx => {
                  const s = statuses[questions[idx]?.id] ?? "unattempted";
                  return s === "answered" || s === "answered-marked";
                }).length;
                return (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}>
                    <span style={{ color: "var(--ink-3)" }}>{activeSection?.name}</span>
                    <span style={{ color: "var(--ink-1)" }}>{secAnswered} / {visibleIndices.length} done</span>
                  </div>
                );
              })()}

              {/* Question grid — filtered to active section */}
              <div className="grid grid-cols-5 gap-1.5">
                {visibleIndices.map(idx => {
                  const q      = questions[idx];
                  const status = statuses[q.id] ?? "unattempted";
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-full aspect-square rounded-lg text-[11px] font-bold transition-all ${PALETTE_CLASSES[status]} ${
                        idx === currentIdx ? "ring-2 ring-offset-1 ring-blue-400" : ""
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Submit Confirmation Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            style={{ background: "var(--card)", border: "1px solid var(--line-soft)" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-[15px]" style={{ color: "var(--ink-1)" }}>Submit Test?</p>
                  <p className="text-[12px]" style={{ color: "var(--ink-4)" }}>This action cannot be undone</p>
                </div>
              </div>
              <button onClick={() => setShowConfirm(false)} style={{ color: "var(--ink-4)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Answered",    value: answered,               color: "text-emerald-600" },
                { label: "Marked",      value: marked,                 color: "text-amber-600"   },
                { label: "Unattempted", value: unattempted,            color: "text-red-500"     },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-3 rounded-xl" style={{ background: "var(--bg)" }}>
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-[10px] font-medium mt-0.5" style={{ color: "var(--ink-4)" }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all"
                style={{ color: "var(--ink-1)", borderColor: "var(--line)" }}
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-70"
                style={{ background: "var(--blue)" }}
              >
                {submitting ? "Submitting…" : "Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bookmark, ChevronLeft, ChevronRight, AlertTriangle, X } from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

// ─── Types ────────────────────────────────────────────────────────────
type QStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

interface Question  { q: string; opts: string[] }
interface QState    { status: QStatus; answer: number | null }

// ─── Data ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { id: "physics",     label: "Physics",     color: "var(--green)" },
  { id: "chemistry",   label: "Chemistry",   color: "var(--red)" },
  { id: "mathematics", label: "Mathematics", color: "var(--amber)" },
];

const BASE_QS: Record<string, Question[]> = {
  physics: [
    { q: "A particle moves in a circle of radius R with uniform speed v. The magnitude of change in velocity when it covers half the circle is:", opts: ["v", "2v", "√2 · v", "Zero"] },
    { q: "The dimensional formula for Planck's constant is the same as that of:", opts: ["Energy", "Angular momentum", "Power", "Linear momentum"] },
    { q: "A body of mass 2 kg moves with velocity 5 m/s. Its kinetic energy is:", opts: ["10 J", "25 J", "50 J", "5 J"] },
    { q: "Two resistors of 6 Ω and 3 Ω connected in parallel. The equivalent resistance is:", opts: ["9 Ω", "2 Ω", "4.5 Ω", "18 Ω"] },
    { q: "The focal length of a concave mirror of radius of curvature 20 cm is:", opts: ["20 cm", "10 cm", "40 cm", "5 cm"] },
  ],
  chemistry: [
    { q: "The IUPAC name of CH₃–CH(OH)–CH₃ is:", opts: ["Propan-1-ol", "Propan-2-ol", "2-methylpropanol", "Isopropane"] },
    { q: "Which of the following has the highest electronegativity?", opts: ["Oxygen", "Nitrogen", "Fluorine", "Chlorine"] },
    { q: "The hybridization of carbon in CH₄ is:", opts: ["sp", "sp²", "sp³", "sp³d"] },
    { q: "Which is the oxidising agent in Fe + CuSO₄ → FeSO₄ + Cu?", opts: ["Fe", "CuSO₄", "FeSO₄", "Cu"] },
    { q: "The pH of a neutral aqueous solution at 25°C is:", opts: ["0", "7", "14", "Depends on temperature"] },
  ],
  mathematics: [
    { q: "The value of lim(x → 0) (sin x / x) is:", opts: ["0", "1", "∞", "Undefined"] },
    { q: "The derivative of ln(x) with respect to x is:", opts: ["1/x", "x", "ln(x)/x", "eˣ"] },
    { q: "The number of permutations of the letters of the word 'MATH' is:", opts: ["12", "24", "16", "6"] },
    { q: "The sum of the series 1 + 1/2 + 1/4 + 1/8 + … to infinity equals:", opts: ["1", "2", "3", "∞"] },
    { q: "∫ eˣ dx is equal to:", opts: ["eˣ + C", "xeˣ + C", "eˣ/x + C", "xeˣ − eˣ + C"] },
  ],
};

// Pad every subject to 25 questions by cycling
const QUESTIONS: Record<string, Question[]> = {};
Object.keys(BASE_QS).forEach((k) => {
  const b = BASE_QS[k];
  QUESTIONS[k] = Array.from({ length: 25 }, (_, i) => b[i % b.length]);
});

// ─── Status colours (minimal, meaning-driven) ─────────────────────────
const S: Record<QStatus, { bg: string; fg: string; ring?: string }> = {
  "not-visited":     { bg: "var(--bg)", fg: "var(--ink-4)", ring: "var(--line)" },
  "not-answered":    { bg: "var(--red-soft)", fg: "var(--red)" },
  "answered":        { bg: "var(--green-soft)", fg: "var(--green)" },
  "marked":          { bg: "var(--amber-soft)", fg: "var(--amber)" },
  "answered-marked": { bg: "var(--blue-soft)", fg: "var(--blue)" },
};

const LEGEND: { key: QStatus; label: string }[] = [
  { key: "not-visited",     label: "Not visited"      },
  { key: "not-answered",    label: "Not answered"     },
  { key: "answered",        label: "Answered"         },
  { key: "marked",          label: "Marked for review" },
  { key: "answered-marked", label: "Answered & marked" },
];

function fmtTime(s: number) {
  const h  = String(Math.floor(s / 3600)).padStart(2, "0");
  const m  = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sc = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sc}`;
}

function initState(): Record<string, QState[]> {
  const r: Record<string, QState[]> = {};
  SUBJECTS.forEach((s) => {
    r[s.id] = Array.from({ length: 25 }, () => ({ status: "not-visited", answer: null }));
  });
  return r;
}

// ─── Component ────────────────────────────────────────────────────────
export default function ExamInterface({ examId }: { examId: string }) {
  const [si, setSi]               = useState(0);
  const [qi, setQi]               = useState(0);
  const [qs, setQs]               = useState(initState);
  const [timeLeft, setTimeLeft]   = useState(3 * 60 * 60);
  const [showModal, setShowModal] = useState(false);
  const [animKey, setAnimKey]     = useState(0);

  const sub      = SUBJECTS[si];
  const questions = QUESTIONS[sub.id];
  const cur       = qs[sub.id][qi];

  // ── Timer ──
  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Mark as not-answered on first visit ──
  useEffect(() => {
    setQs((prev) => {
      if (prev[sub.id][qi].status !== "not-visited") return prev;
      const arr = [...prev[sub.id]];
      arr[qi] = { ...arr[qi], status: "not-answered" };
      return { ...prev, [sub.id]: arr };
    });
    setAnimKey((k) => k + 1);
  }, [sub.id, qi]);

  const patch = useCallback((p: Partial<QState>) => {
    setQs((prev) => {
      const arr = [...prev[sub.id]];
      arr[qi] = { ...arr[qi], ...p };
      return { ...prev, [sub.id]: arr };
    });
  }, [sub.id, qi]);

  const selectAnswer = (oi: number) => {
    const wasMarked = cur.status === "marked" || cur.status === "answered-marked";
    patch({ answer: oi, status: wasMarked ? "answered-marked" : "answered" });
  };

  const clearResponse = () => patch({ answer: null, status: "not-answered" });

  const markAndNext = () => {
    patch({ status: cur.answer !== null ? "answered-marked" : "marked" });
    advance();
  };

  const saveAndNext = () => {
    if (cur.answer !== null) patch({ status: "answered" });
    advance();
  };

  const advance = () => {
    if (qi < questions.length - 1) { setQi((q) => q + 1); return; }
    if (si < SUBJECTS.length - 1)  { setSi((s) => s + 1); setQi(0); }
  };

  const retreat = () => {
    if (qi > 0) { setQi((q) => q - 1); return; }
    if (si > 0) { setSi((s) => s - 1); setQi(QUESTIONS[SUBJECTS[si - 1].id].length - 1); }
  };

  // ── Counts ──
  const counts = (sid: string) => {
    const arr = qs[sid];
    return {
      answered: arr.filter((q) => q.status === "answered" || q.status === "answered-marked").length,
      marked:   arr.filter((q) => q.status === "marked"   || q.status === "answered-marked").length,
    };
  };
  const allCounts     = SUBJECTS.map((s) => counts(s.id));
  const totalAnswered = allCounts.reduce((a, c) => a + c.answered, 0);
  const totalMarked   = allCounts.reduce((a, c) => a + c.marked,   0);
  const isLow         = timeLeft < 600;

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen select-none"
      style={{ background: "var(--bg)", fontFamily: "var(--font-inter)", color: "var(--ink-1)" }}
    >

      {/* ══════════════════ TOP BAR ══════════════════════════════════════ */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5 h-[48px] z-50"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--line-soft)" }}
      >
        {/* Left — Exit + test title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-[var(--ink-2)] flex-shrink-0"
            style={{ color: "var(--ink-4)" }}
          >
            <ChevronLeft size={13} />
            Exit
          </Link>

          <div className="w-px h-3.5 flex-shrink-0" style={{ background: "var(--line)" }} />

          <span className="text-[12px] font-semibold truncate" style={{ color: "var(--ink-2)" }}>
            JEE Main — Full Mock #14
          </span>
        </div>

        {/* Centre — Subject tabs (underline style) */}
        <nav className="hidden md:flex items-end gap-0 h-full">
          {SUBJECTS.map((s, idx) => {
            const c      = allCounts[idx];
            const active = si === idx;
            return (
              <button
                key={s.id}
                onClick={() => { setSi(idx); setQi(0); }}
                className="relative flex flex-col items-center justify-center px-5 h-full text-[12px] font-medium transition-colors"
                style={{ color: active ? "var(--ink-1)" : "var(--ink-4)" }}
              >
                <span>{s.label}</span>
                <span className="text-[10px] mt-0.5 tabular-nums" style={{ color: active ? s.color : "var(--ink-3)" }}>
                  {c.answered}/25
                </span>
                {active && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                    style={{ background: "var(--blue)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right — ThemeToggle + Marks + Timer */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
            <span className="font-semibold" style={{ color: "var(--green)" }}>+4</span>
            <span>/</span>
            <span className="font-semibold" style={{ color: "var(--red)" }}>−1</span>
          </div>

          <div
            className="font-mono text-[14px] font-bold px-3 py-1 rounded-[8px] tabular-nums tracking-wide transition-all"
            style={{
              background:  isLow ? "var(--red-soft)"  : "var(--bg)",
              color:       isLow ? "var(--red)"  : "var(--ink-1)",
              border:      isLow ? "1px solid var(--red)" : "1px solid var(--line)",
            }}
          >
            {fmtTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* ══════════════════ BODY ═════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── Question area ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col items-center py-10 px-4">
          {/* Centred container */}
          <div key={animKey} className="w-full max-w-[760px] flex flex-col gap-8 slide-up">

            {/* Question meta row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ background: sub.color + "10", color: sub.color }}
                >
                  {sub.label}
                </span>
                <span className="text-[11px] font-medium" style={{ color: "var(--ink-4)" }}>
                  Question {qi + 1}
                  <span style={{ color: "var(--ink-3)" }}> / {questions.length}</span>
                </span>
              </div>

              {/* Mini progress dots */}
              <div className="hidden sm:flex items-center gap-[3px]">
                {questions.map((_, i) => {
                  const st = qs[sub.id][i].status;
                  return (
                    <button
                      key={i}
                      onClick={() => setQi(i)}
                      className="w-[5px] h-[5px] rounded-full transition-all"
                      style={{
                        background: i === qi ? "var(--blue)"
                          : st === "answered"        ? "var(--green)"
                          : st === "answered-marked" ? "var(--blue-ink)"
                          : st === "marked"          ? "var(--amber)"
                          : st === "not-answered"    ? "var(--red)"
                          : "var(--line)",
                        transform: i === qi ? "scale(1.6)" : "scale(1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Question text */}
            <div>
              <p
                className="text-[16px] leading-[1.8] font-medium"
                style={{ color: "var(--ink-1)" }}
              >
                {curQ(questions, qi).q}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {curQ(questions, qi).opts.map((opt, oi) => {
                const selected = cur.answer === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(oi)}
                    className="group flex items-center gap-4 px-5 py-[18px] rounded-[12px] text-left w-full transition-all duration-150 hover:shadow-md"
                    style={
                      selected
                        ? {
                            background:  "var(--blue-soft)",
                            border:      "1.5px solid var(--blue)",
                            boxShadow:   "0 0 0 3px rgba(37,99,235,.06)",
                          }
                        : {
                            background:  "var(--card)",
                            border:      "1.5px solid var(--line-soft)",
                            boxShadow:   "var(--shadow-xs)",
                          }
                    }
                  >
                    {/* Letter badge */}
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 transition-all"
                      style={
                        selected
                          ? { background: "var(--blue)", color: "white" }
                          : { background: "var(--bg)", color: "var(--ink-4)", border: "1.5px solid var(--line)" }
                      }
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>

                    {/* Option text */}
                    <span
                      className="text-[14px] leading-relaxed transition-colors"
                      style={{ color: selected ? "var(--blue)" : "var(--ink-2)", fontWeight: selected ? 500 : 400 }}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--line-soft)" }}>
              {/* Secondary left */}
              <div className="flex items-center gap-2">
                <button
                  onClick={markAndNext}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[11px] font-medium transition-all hover:brightness-90"
                  style={{ background: "var(--amber-soft)", color: "var(--amber)" }}
                >
                  <Bookmark size={11} strokeWidth={2} />
                  Mark &amp; Next
                </button>

                <button
                  onClick={clearResponse}
                  className="px-3 py-2 rounded-[8px] text-[11px] font-medium transition-all hover:bg-[var(--line-soft)]"
                  style={{ color: "var(--ink-4)" }}
                >
                  Clear
                </button>
              </div>

              {/* Navigation right */}
              <div className="flex items-center gap-2">
                <button
                  onClick={retreat}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-[8px] text-[11px] font-medium transition-all hover:bg-[var(--line-soft)]"
                  style={{ color: "var(--ink-3)" }}
                >
                  <ChevronLeft size={13} />
                  Prev
                </button>

                <button
                  onClick={saveAndNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-105"
                  style={{ background: "var(--blue)", boxShadow: "0 2px 8px -2px rgba(37,99,235,.35)" }}
                >
                  Save &amp; Next
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

          </div>{/* /max-w container */}
        </main>

        {/* ─── Question Palette ───────────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col w-[240px] flex-shrink-0 overflow-y-auto"
          style={{ background: "var(--card)", borderLeft: "1px solid var(--line-soft)" }}
        >
          {/* Status legend */}
          <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--bg)" }}>
            <p className="text-[9px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--ink-4)" }}>
              Status Key
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {LEGEND.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-[3px] flex-shrink-0"
                    style={{ background: S[key].bg, border: S[key].ring ? `1px solid ${S[key].ring}` : "none" }}
                  />
                  <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject sections */}
          <div className="flex-1 overflow-y-auto">
            {SUBJECTS.map((s, idx) => {
              const c = allCounts[idx];
              return (
                <div key={s.id} className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--bg)" }}>
                  {/* Section header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-[11px] font-semibold" style={{ color: "var(--ink-2)" }}>{s.label}</span>
                    </div>
                    <span className="text-[10px] font-semibold tabular-nums" style={{ color: s.color }}>
                      {c.answered}/25
                    </span>
                  </div>

                  {/* 7-column grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {QUESTIONS[s.id].map((_, n) => {
                      const st        = qs[s.id][n];
                      const sc        = S[st.status];
                      const isCurrent = idx === si && n === qi;
                      return (
                        <button
                          key={n}
                          onClick={() => { setSi(idx); setQi(n); }}
                          className="w-7 h-7 rounded-[5px] text-[10px] font-semibold transition-all hover:opacity-80"
                          style={{
                            background: isCurrent ? "var(--blue)" : sc.bg,
                            color:      isCurrent ? "#fff"    : sc.fg,
                            boxShadow:  isCurrent ? "0 0 0 2px rgba(37,99,235,.25)" : "none",
                            border:     sc.ring && !isCurrent ? `1px solid ${sc.ring}` : "none",
                          }}
                        >
                          {n + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary + Submit */}
          <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--line-soft)" }}>
            <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
              {[
                { label: "Answered", val: totalAnswered, bg: "var(--green-soft)", fg: "var(--green)" },
                { label: "Marked",   val: totalMarked,   bg: "var(--amber-soft)", fg: "var(--amber)" },
                { label: "Pending",  val: 75 - totalAnswered - totalMarked, bg: "var(--red-soft)", fg: "var(--red)" },
              ].map((r) => (
                <div key={r.label} className="rounded-[8px] py-2" style={{ background: r.bg }}>
                  <div className="text-[15px] font-bold tabular-nums" style={{ color: r.fg }}>{r.val}</div>
                  <div className="text-[8px] font-medium mt-0.5" style={{ color: r.fg, opacity: 0.6 }}>{r.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2.5 rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-105"
              style={{ background: "var(--blue)" }}
            >
              Submit Test
            </button>
          </div>
        </aside>
      </div>

      {/* ══════════════════ SUBMIT MODAL ═════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
          style={{ background: "rgba(15,23,42,.4)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="w-full max-w-[340px] rounded-[14px] p-6 slide-up"
            style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--amber-soft)" }}>
                  <AlertTriangle size={16} style={{ color: "var(--amber)" }} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Submit test?</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>This action cannot be undone.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-[6px] transition-colors hover:bg-[var(--line-soft)]"
                style={{ color: "var(--ink-4)" }}>
                <X size={15} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1.5 mb-5">
              {[
                { label: "Answered", val: totalAnswered,                bg: "var(--green-soft)", fg: "var(--green)" },
                { label: "Marked",   val: totalMarked,                  bg: "var(--amber-soft)", fg: "var(--amber)" },
                { label: "Pending",  val: 75 - totalAnswered - totalMarked, bg: "var(--red-soft)", fg: "var(--red)" },
              ].map((r) => (
                <div key={r.label} className="rounded-[10px] py-3 text-center" style={{ background: r.bg }}>
                  <div className="text-[20px] font-bold tabular-nums" style={{ color: r.fg }}>{r.val}</div>
                  <div className="text-[9px] font-medium mt-0.5" style={{ color: r.fg, opacity: 0.6 }}>{r.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-[8px] text-[12px] font-medium transition-all hover:bg-[var(--line-soft)]"
                style={{ border: "1.5px solid var(--line)", color: "var(--ink-3)" }}
              >
                Cancel
              </button>
              <Link
                href="/results/demo"
                className="flex-1 py-2.5 rounded-[8px] text-[12px] font-semibold text-white text-center transition-all hover:brightness-105"
                style={{ background: "var(--blue)" }}
              >
                Submit →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// helper to avoid inline expression complexity
function curQ(questions: Question[], idx: number) { return questions[idx]; }

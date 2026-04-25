"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bookmark, ChevronLeft, ChevronRight, AlertTriangle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
type QStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

interface Question  { q: string; opts: string[] }
interface QState    { status: QStatus; answer: number | null }

// ─── Data ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { id: "physics",     label: "Physics",     color: "#059669" },
  { id: "chemistry",   label: "Chemistry",   color: "#DC2626" },
  { id: "mathematics", label: "Mathematics", color: "#D97706" },
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
  "not-visited":     { bg: "#F3F4F6", fg: "#9CA3AF", ring: "#E5E7EB" },
  "not-answered":    { bg: "#FEE2E2", fg: "#DC2626" },
  "answered":        { bg: "#D1FAE5", fg: "#065F46" },
  "marked":          { bg: "#EDE9FE", fg: "#5B21B6" },
  "answered-marked": { bg: "#DBEAFE", fg: "#1D4ED8" },
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
  const [si, setSi]               = useState(0);        // subject index
  const [qi, setQi]               = useState(0);        // question index within subject
  const [qs, setQs]               = useState(initState);
  const [timeLeft, setTimeLeft]   = useState(3 * 60 * 60);
  const [showModal, setShowModal] = useState(false);

  const sub      = SUBJECTS[si];
  const questions = QUESTIONS[sub.id];
  const cur       = qs[sub.id][qi];

  // ── Timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Mark as not-answered on first visit ────────────────────────────
  useEffect(() => {
    setQs((prev) => {
      if (prev[sub.id][qi].status !== "not-visited") return prev;
      const arr = [...prev[sub.id]];
      arr[qi] = { ...arr[qi], status: "not-answered" };
      return { ...prev, [sub.id]: arr };
    });
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

  // ── Counts ─────────────────────────────────────────────────────────
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
      style={{ background: "#F9FAFB", fontFamily: "var(--font-inter)", color: "#111827" }}
    >

      {/* ══════════════════ TOP BAR ══════════════════════════════════════ */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 h-[52px] z-50"
        style={{ background: "#fff", borderBottom: "1px solid #F0F0F0" }}
      >
        {/* Left — Exit + test title */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-[12px] font-medium transition-colors flex-shrink-0"
            style={{ color: "#6B7280" }}
          >
            <ChevronLeft size={14} />
            Exit
          </Link>

          <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

          <span className="text-[13px] font-semibold truncate" style={{ color: "#374151" }}>
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
                className="relative flex flex-col items-center justify-center px-6 h-full text-[13px] font-medium transition-colors"
                style={{ color: active ? "#111827" : "#9CA3AF" }}
              >
                <span>{s.label}</span>
                <span className="text-[10px] mt-0.5" style={{ color: active ? s.color : "#D1D5DB" }}>
                  {c.answered}/25
                </span>
                {active && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                    style={{ background: "#2563EB" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right — Marks + Timer */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-[11px]" style={{ color: "#9CA3AF" }}>
            <span className="font-semibold" style={{ color: "#16A34A" }}>+4</span>
            <span>/</span>
            <span className="font-semibold" style={{ color: "#DC2626" }}>−1</span>
          </div>

          <div
            className="font-mono text-[15px] font-bold px-3 py-1 rounded-[8px] tabular-nums tracking-wide transition-all"
            style={{
              background:  isLow ? "#FEF2F2"  : "#F3F4F6",
              color:       isLow ? "#DC2626"  : "#111827",
              border:      isLow ? "1px solid #FECACA" : "1px solid #E5E7EB",
            }}
          >
            {fmtTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* ══════════════════ BODY ═════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── Question area ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col items-center py-8 px-4">
          {/* Centred container — max 760px for reading comfort */}
          <div className="w-full max-w-[760px] flex flex-col gap-6">

            {/* Question meta row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: sub.color + "14", color: sub.color }}
                >
                  {sub.label}
                </span>
                <span className="text-[12px]" style={{ color: "#9CA3AF" }}>
                  Question {qi + 1}
                  <span style={{ color: "#D1D5DB" }}> / {questions.length}</span>
                </span>
              </div>

              {/* Mini progress dots */}
              <div className="hidden sm:flex items-center gap-1">
                {questions.map((_, i) => {
                  const st = qs[sub.id][i].status;
                  return (
                    <button
                      key={i}
                      onClick={() => setQi(i)}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        background: i === qi ? "#2563EB"
                          : st === "answered"        ? "#10B981"
                          : st === "answered-marked" ? "#60A5FA"
                          : st === "marked"          ? "#7C3AED"
                          : st === "not-answered"    ? "#FCA5A5"
                          : "#E5E7EB",
                        transform: i === qi ? "scale(1.5)" : "scale(1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Question text */}
            <div>
              <p
                className="text-[17px] leading-[1.75] font-medium"
                style={{ color: "#111827" }}
              >
                {curQ(questions, qi).q}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {curQ(questions, qi).opts.map((opt, oi) => {
                const selected = cur.answer === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(oi)}
                    className="group flex items-center gap-4 px-5 py-4 rounded-[12px] text-left w-full transition-all duration-150"
                    style={
                      selected
                        ? {
                            background:  "#EFF6FF",
                            border:      "1.5px solid #2563EB",
                            boxShadow:   "0 0 0 3px rgba(37,99,235,.08)",
                          }
                        : {
                            background:  "#fff",
                            border:      "1.5px solid #F3F4F6",
                            boxShadow:   "0 1px 2px rgba(0,0,0,.04)",
                          }
                    }
                  >
                    {/* Letter badge */}
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 transition-all"
                      style={
                        selected
                          ? { background: "#2563EB", color: "#fff" }
                          : { background: "#F9FAFB", color: "#9CA3AF", border: "1.5px solid #E5E7EB" }
                      }
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>

                    {/* Option text */}
                    <span
                      className="text-[15px] leading-relaxed transition-colors"
                      style={{ color: selected ? "#1D4ED8" : "#374151", fontWeight: selected ? 500 : 400 }}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
              {/* Secondary left */}
              <div className="flex items-center gap-2">
                <button
                  onClick={markAndNext}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-[12px] font-medium transition-all"
                  style={{ background: "#F5F3FF", color: "#6D28D9", border: "1px solid #DDD6FE" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#EDE9FE"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F5F3FF"; }}
                >
                  <Bookmark size={12} strokeWidth={2} />
                  Mark &amp; Next
                </button>

                <button
                  onClick={clearResponse}
                  className="px-3.5 py-2 rounded-[8px] text-[12px] font-medium transition-all"
                  style={{ color: "#9CA3AF" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#6B7280"; (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  Clear
                </button>
              </div>

              {/* Navigation right */}
              <div className="flex items-center gap-2">
                <button
                  onClick={retreat}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-[8px] text-[12px] font-medium transition-all"
                  style={{ background: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                <button
                  onClick={saveAndNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] text-[13px] font-semibold text-white transition-all"
                  style={{ background: "#2563EB", boxShadow: "0 1px 3px rgba(37,99,235,.35)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1D4ED8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#2563EB"; }}
                >
                  Save &amp; Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>{/* /max-w container */}
        </main>

        {/* ─── Question Palette ───────────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col w-[264px] flex-shrink-0 overflow-y-auto"
          style={{ background: "#fff", borderLeft: "1px solid #F0F0F0" }}
        >
          {/* Status legend */}
          <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>
              Status Key
            </p>
            <div className="flex flex-col gap-1.5">
              {LEGEND.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-[3px] flex-shrink-0"
                    style={{ background: S[key].bg, border: S[key].ring ? `1px solid ${S[key].ring}` : "none" }}
                  />
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject sections */}
          <div className="flex-1 overflow-y-auto">
            {SUBJECTS.map((s, idx) => {
              const c = allCounts[idx];
              return (
                <div key={s.id} className="px-4 py-4" style={{ borderBottom: "1px solid #F5F5F5" }}>
                  {/* Section header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-[12px] font-semibold" style={{ color: "#374151" }}>{s.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: s.color }}>
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
                          className="w-8 h-8 rounded-[6px] text-[11px] font-semibold transition-all hover:opacity-80"
                          style={{
                            background: isCurrent ? "#2563EB" : sc.bg,
                            color:      isCurrent ? "#fff"    : sc.fg,
                            boxShadow:  isCurrent ? "0 0 0 2px rgba(37,99,235,.3)" : "none",
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
          <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid #F0F0F0" }}>
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              {[
                { label: "Answered", val: totalAnswered, bg: "#F0FDF4", fg: "#16A34A" },
                { label: "Marked",   val: totalMarked,   bg: "#F5F3FF", fg: "#7C3AED" },
                { label: "Pending",  val: 75 - totalAnswered - totalMarked, bg: "#FEF2F2", fg: "#DC2626" },
              ].map((r) => (
                <div key={r.label} className="rounded-[8px] py-2" style={{ background: r.bg }}>
                  <div className="text-[16px] font-bold tabular-nums" style={{ color: r.fg }}>{r.val}</div>
                  <div className="text-[9px] font-medium mt-0.5" style={{ color: r.fg + "99" }}>{r.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2.5 rounded-[9px] text-[13px] font-semibold text-white transition-all"
              style={{ background: "#2563EB" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1D4ED8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#2563EB"; }}
            >
              Submit Test
            </button>
          </div>
        </aside>
      </div>

      {/* ══════════════════ SUBMIT MODAL ═════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.35)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="w-full max-w-[360px] rounded-[16px] p-6 shadow-xl"
            style={{ background: "#fff" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFBEB" }}>
                  <AlertTriangle size={17} style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: "#111827" }}>Submit test?</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "#9CA3AF" }}>This action cannot be undone.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-[6px] transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: "Answered", val: totalAnswered,                bg: "#F0FDF4", fg: "#16A34A" },
                { label: "Marked",   val: totalMarked,                  bg: "#F5F3FF", fg: "#7C3AED" },
                { label: "Pending",  val: 75 - totalAnswered - totalMarked, bg: "#FEF2F2", fg: "#DC2626" },
              ].map((r) => (
                <div key={r.label} className="rounded-[10px] py-3 text-center" style={{ background: r.bg }}>
                  <div className="text-[22px] font-bold tabular-nums" style={{ color: r.fg }}>{r.val}</div>
                  <div className="text-[10px] font-medium mt-0.5" style={{ color: r.fg + "99" }}>{r.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-[9px] text-[13px] font-medium transition-all"
                style={{ border: "1.5px solid #E5E7EB", color: "#6B7280" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                Cancel
              </button>
              <Link
                href="/results/mock-14"
                className="flex-1 py-2.5 rounded-[9px] text-[13px] font-semibold text-white text-center transition-all"
                style={{ background: "#2563EB" }}
                onMouseEnter={undefined}
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

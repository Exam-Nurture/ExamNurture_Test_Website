"use client";

import { useState } from "react";
import { Clock, Users, Trophy, Zap, CheckCircle2, Lock, ChevronRight, Flame } from "lucide-react";

/* ─── Types ─── */
type ContestStatus = "live" | "upcoming" | "ended";

type Contest = {
  id: string;
  title: string;
  subtitle: string;
  exam: string;
  status: ContestStatus;
  startsIn?: string;
  endsIn?: string;
  date: string;
  duration: string;
  questions: number;
  registered: number;
  prize?: string;
  tint: string;
  tag?: string;
  rank?: number;
  score?: string;
  enrolled: boolean;
};

const CONTESTS: Contest[] = [
  {
    id: "all-india-jpsc-may",
    title: "All India JPSC Mock — May 2026",
    subtitle: "Full-length prelims mock · Official pattern · State rank on result",
    exam: "JPSC",
    status: "live",
    endsIn: "1h 22m",
    date: "Today, 3:00 PM",
    duration: "2 hrs",
    questions: 100,
    registered: 4182,
    prize: "State Rank Certificate",
    tint: "#8B5CF6",
    tag: "🔴 LIVE NOW",
    enrolled: true,
  },
  {
    id: "weekly-reasoning-drill",
    title: "Weekly Reasoning Challenge #14",
    subtitle: "Verbal + Non-Verbal · 45 min · All competitive exams",
    exam: "All Exams",
    status: "upcoming",
    startsIn: "2h 40m",
    date: "Today, 6:00 PM",
    duration: "45 min",
    questions: 40,
    registered: 1830,
    tint: "#F59E0B",
    tag: "Starts in 2h 40m",
    enrolled: false,
  },
  {
    id: "banking-grand-mock",
    title: "Banking Grand Mock — IBPS PO Special",
    subtitle: "Pre + Reasoning + Quant · Sectional cutoff analysis",
    exam: "Banking",
    status: "upcoming",
    startsIn: "2d 4h",
    date: "Mon, Apr 28 · 10:00 AM",
    duration: "1 hr",
    questions: 100,
    registered: 6210,
    prize: "All India Rank",
    tint: "#2563EB",
    tag: "POPULAR",
    enrolled: false,
  },
  {
    id: "ssc-cgl-tier1-mock",
    title: "SSC CGL Tier I — Full Mock Contest",
    subtitle: "GK + Reasoning + Quant + English · Official pattern",
    exam: "SSC",
    status: "upcoming",
    startsIn: "4d 11h",
    date: "Thu, May 1 · 9:00 AM",
    duration: "1 hr",
    questions: 100,
    registered: 9040,
    prize: "All India Rank + Certificate",
    tint: "#10B981",
    tag: undefined,
    enrolled: false,
  },
  {
    id: "rrb-ntpc-gk-blitz",
    title: "RRB NTPC GK Blitz",
    subtitle: "100 GK questions · Railway focus · 30 min speed test",
    exam: "Railway",
    status: "upcoming",
    startsIn: "5d 8h",
    date: "Fri, May 2 · 11:00 AM",
    duration: "30 min",
    questions: 100,
    registered: 3712,
    tint: "#F59E0B",
    tag: undefined,
    enrolled: false,
  },
  {
    id: "all-india-jpsc-apr",
    title: "All India JPSC Mock — Apr 2026",
    subtitle: "Full-length prelims mock · State rank awarded",
    exam: "JPSC",
    status: "ended",
    date: "Apr 20, 2026",
    duration: "2 hrs",
    questions: 100,
    registered: 5280,
    prize: "State Rank Certificate",
    tint: "#8B5CF6",
    tag: undefined,
    rank: 214,
    score: "72/100",
    enrolled: true,
  },
  {
    id: "daroga-si-mock-apr",
    title: "UP Daroga / SI Special Mock",
    subtitle: "UP Police pattern · Hindi + GK + Reasoning",
    exam: "Police / SI",
    status: "ended",
    date: "Apr 15, 2026",
    duration: "2 hrs",
    questions: 160,
    registered: 2900,
    tint: "#EF4444",
    tag: undefined,
    rank: 88,
    score: "101/160",
    enrolled: true,
  },
];

const TABS = ["All", "Upcoming", "Live", "Ended"];
const EXAMS = ["All Exams", "JPSC", "Banking", "SSC", "Railway", "Police / SI"];

/* ─── Leaderboard mock data ─── */
const LEADERBOARD = [
  { rank: 1,   name: "Rohit K.",       score: "94/100", state: "Jharkhand" },
  { rank: 2,   name: "Priya S.",        score: "92/100", state: "Bihar" },
  { rank: 3,   name: "Amit J.",         score: "91/100", state: "Jharkhand" },
  { rank: 214, name: "You (Rahul S.)",  score: "72/100", state: "Jharkhand", isMe: true },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function ContestsPage() {
  const [tab, setTab]   = useState("All");
  const [exam, setExam] = useState("All Exams");
  const [showLB, setShowLB] = useState(false);

  const filtered = CONTESTS.filter((c) => {
    const tabMatch  = tab === "All" || c.status === tab.toLowerCase();
    const examMatch = exam === "All Exams" || c.exam === exam;
    return tabMatch && examMatch;
  });

  const liveContest = CONTESTS.find((c) => c.status === "live");

  return (
    <div className="flex flex-col gap-7 fade-up" style={{ maxWidth: 1100 }}>

      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Flame size={18} style={{ color: "#EF4444" }} />
          <h1
            className="text-[22px] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
          >
            Contests
          </h1>
        </div>
        <p className="text-[12px]" style={{ color: "var(--ink-4)" }}>
          All India mock tests · Compete with lakhs of students · Get your state rank &amp; All India percentile
        </p>
      </div>

      {/* Live banner */}
      {liveContest && (
        <div
          className="relative rounded-[16px] p-5 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)",
          }}
        >
          {/* Glow accent */}
          <div
            className="absolute -right-12 -top-12 w-52 h-52 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,.07), transparent 65%)" }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: "#EF4444", color: "white" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE NOW
                </span>
                <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,.65)" }}>
                  Ends in {liveContest.endsIn}
                </span>
              </div>
              <div
                className="text-[18px] font-bold text-white leading-snug"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {liveContest.title}
              </div>
              <div className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,.6)" }}>
                {liveContest.questions} Questions · {liveContest.duration} · {liveContest.registered.toLocaleString()} registered
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold bg-white transition-all duration-150 hover:brightness-95 active:scale-[0.98]"
                style={{ color: "#6D28D9" }}
              >
                Continue Attempt →
              </button>
              <button
                onClick={() => setShowLB(!showLB)}
                className="px-4 py-2.5 rounded-[10px] text-[12px] font-medium transition-all duration-150 hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,.25)", color: "rgba(255,255,255,.8)" }}
              >
                Leaderboard
              </button>
            </div>
          </div>

          {/* Inline leaderboard */}
          {showLB && (
            <div
              className="mt-4 rounded-[12px] overflow-hidden"
              style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)" }}
            >
              <div className="px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,.1)" }}>
                <span className="text-[11px] font-semibold tracking-wider" style={{ color: "rgba(255,255,255,.6)" }}>
                  LIVE LEADERBOARD — TOP PARTICIPANTS
                </span>
              </div>
              {LEADERBOARD.map((row) => (
                <div
                  key={row.rank}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                    background: (row as any).isMe ? "rgba(255,255,255,.08)" : "transparent",
                  }}
                >
                  <span
                    className="w-6 text-center text-[12px] font-bold flex-shrink-0"
                    style={{ color: row.rank <= 3 ? "#F59E0B" : "rgba(255,255,255,.5)" }}
                  >
                    {row.rank <= 3 ? ["🥇","🥈","🥉"][row.rank - 1] : `#${row.rank}`}
                  </span>
                  <span className="flex-1 text-[13px] font-medium text-white">{row.name}</span>
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,.55)" }}>{row.state}</span>
                  <span
                    className="text-[12px] font-bold ml-3"
                    style={{ fontFamily: "var(--font-mono)", color: (row as any).isMe ? "#A78BFA" : "rgba(255,255,255,.8)" }}
                  >
                    {row.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tabs */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-[10px]"
          style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-[7px] text-[12px] font-medium transition-all duration-150"
              style={{
                background: tab === t ? "white" : "transparent",
                color:      tab === t ? "var(--ink-1)" : "var(--ink-4)",
                boxShadow:  tab === t ? "0 1px 3px rgba(15,23,42,.08)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Exam filter */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {EXAMS.map((e) => (
              <button
                key={e}
                onClick={() => setExam(e)}
                className="px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-150"
                style={
                  exam === e
                    ? { background: "var(--blue)", color: "white" }
                    : { background: "white", border: "1px solid var(--line)", color: "var(--ink-3)" }
                }
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contest grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[14px]" style={{ color: "var(--ink-4)" }}>
          No contests match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
          {filtered.map((c) => <ContestCard key={c.id} contest={c} />)}
        </div>
      )}
    </div>
  );
}

/* ─── Contest Card ─── */
function ContestCard({ contest: c }: { contest: Contest }) {
  const statusStyles: Record<ContestStatus, { bg: string; text: string; label: string }> = {
    live:     { bg: "#FEF2F2", text: "#EF4444", label: "🔴 Live" },
    upcoming: { bg: "var(--blue-soft)", text: "var(--blue)", label: "Upcoming" },
    ended:    { bg: "var(--bg)", text: "var(--ink-3)", label: "Ended" },
  };
  const st = statusStyles[c.status];

  return (
    <div
      className="card card-lift flex flex-col relative overflow-hidden"
      style={{ padding: "20px 22px 18px" }}
    >
      {/* Top tint stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.tint }} />

      {/* Row 1: exam + status */}
      <div className="flex items-center justify-between mt-1 mb-3">
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: "var(--ink-4)" }}
        >
          {c.exam}
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: st.bg, color: st.text }}
        >
          {c.tag ?? st.label}
        </span>
      </div>

      {/* Title */}
      <div
        className="text-[14px] font-semibold leading-snug"
        style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
      >
        {c.title}
      </div>
      <div className="text-[12px] mt-1" style={{ color: "var(--ink-3)" }}>{c.subtitle}</div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
          <Clock size={12} /> {c.duration}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
          <Users size={12} /> {c.registered.toLocaleString()}
        </span>
        {c.prize && (
          <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
            <Trophy size={12} /> {c.prize}
          </span>
        )}
      </div>

      {/* Date / countdown */}
      <div
        className="mt-3 px-3 py-2 rounded-[8px] text-[11px]"
        style={{ background: "var(--bg)", color: "var(--ink-3)" }}
      >
        {c.status === "upcoming" && c.startsIn ? (
          <span>Starts in <strong style={{ color: "var(--ink-1)" }}>{c.startsIn}</strong> · {c.date}</span>
        ) : c.status === "live" && c.endsIn ? (
          <span>Ends in <strong style={{ color: "#EF4444" }}>{c.endsIn}</strong> · {c.date}</span>
        ) : (
          <span>{c.date}</span>
        )}
      </div>

      {/* Score (ended + enrolled) */}
      {c.status === "ended" && c.enrolled && c.rank && c.score && (
        <div
          className="flex items-center justify-between mt-3 px-3 py-2 rounded-[8px]"
          style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}
        >
          <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>Your result</span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold" style={{ color: c.tint }}>
              Rank #{c.rank}
            </span>
            <span
              className="text-[12px] font-bold"
              style={{ fontFamily: "var(--font-mono)", color: "var(--green)" }}
            >
              {c.score}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* CTA */}
      <div className="mt-4 flex gap-2">
        {c.status === "live" && c.enrolled ? (
          <button
            className="flex-1 py-2.5 text-[13px] font-semibold rounded-[10px] text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: c.tint }}
          >
            Continue Attempt →
          </button>
        ) : c.status === "upcoming" && c.enrolled ? (
          <button
            className="flex-1 py-2.5 text-[13px] font-semibold rounded-[10px] flex items-center justify-center gap-1.5 transition-all hover:bg-[var(--bg)]"
            style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
          >
            <CheckCircle2 size={13} style={{ color: "var(--green)" }} />
            Registered
          </button>
        ) : c.status === "upcoming" ? (
          <button
            className="flex-1 py-2.5 text-[13px] font-semibold rounded-[10px] text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: c.tint }}
          >
            Register Free
          </button>
        ) : c.status === "ended" && c.enrolled ? (
          <button
            className="flex-1 py-2.5 text-[13px] font-semibold rounded-[10px] flex items-center justify-center gap-1.5 hover:bg-[var(--bg)] transition-all"
            style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
          >
            View Analysis <ChevronRight size={13} />
          </button>
        ) : (
          <button
            className="flex-1 py-2.5 text-[13px] font-semibold rounded-[10px] flex items-center justify-center gap-1 transition-all hover:bg-[var(--bg)]"
            style={{ border: "1px solid var(--line)", color: "var(--ink-4)" }}
          >
            <Lock size={12} /> Ended
          </button>
        )}
      </div>
    </div>
  );
}

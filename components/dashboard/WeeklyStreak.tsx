"use client";

import { CheckIcon } from "lucide-react";

const DAYS = [
  { label: "M", full: "Mon",  state: "done",     time: "42 min"  },
  { label: "T", full: "Tue",  state: "done",     time: "1h 05m" },
  { label: "W", full: "Wed",  state: "done",     time: "38 min"  },
  { label: "T", full: "Thu",  state: "done",     time: "52 min"  },
  { label: "F", full: "Fri",  state: "today",    time: "In progress" },
  { label: "S", full: "Sat",  state: "upcoming", time: "—"       },
  { label: "S", full: "Sun",  state: "upcoming", time: "—"       },
];

export default function WeeklyStreak() {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Weekly Streak</div>
          <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>5 days active this week · keep it going</div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
          style={{ background: "var(--amber-soft)", border: "1px solid #FDE68A", color: "#92400E" }}
        >
          <span className="flicker">🔥</span>
          <strong>12</strong> day streak
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold" style={{ color: "var(--ink-3)" }}>{day.label}</span>
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all"
              style={
                day.state === "done"
                  ? { background: "var(--green)", border: "1.5px solid var(--green)", boxShadow: "0 3px 8px -2px rgba(16,185,129,.4)" }
                  : day.state === "today"
                  ? { background: "var(--blue)", border: "1.5px solid var(--blue)", boxShadow: "0 3px 8px -2px rgba(37,99,235,.45)" }
                  : { background: "var(--bg)", border: "1.5px dashed var(--line)" }
              }
            >
              {day.state === "done" && <CheckIcon size={14} stroke="white" strokeWidth={3} />}
              {day.state === "today" && <span className="w-2.5 h-2.5 rounded-full bg-white pulse-ring" />}
            </div>
            <span
              className="text-[10px] font-medium text-center leading-tight"
              style={{ color: day.state === "today" ? "var(--blue)" : day.state === "done" ? "var(--ink-2)" : "var(--ink-4)" }}
            >
              {day.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

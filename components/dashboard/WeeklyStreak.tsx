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
    <div className="card p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>Weekly Streak</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>5 days active this week</div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium"
          style={{ background: "var(--amber-soft)", color: "#92400E" }}
        >
          <span className="flicker">🔥</span>
          <strong>12</strong> day streak
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-medium" style={{ color: "var(--ink-4)" }}>{day.label}</span>
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-all"
              style={
                day.state === "done"
                  ? { background: "var(--green)", boxShadow: "0 2px 6px -1px rgba(16,185,129,.3)" }
                  : day.state === "today"
                  ? { background: "var(--blue)", boxShadow: "0 2px 6px -1px rgba(37,99,235,.3)" }
                  : { background: "var(--bg)", border: "1.5px dashed var(--line)" }
              }
            >
              {day.state === "done" && <CheckIcon size={13} stroke="white" strokeWidth={2.5} />}
              {day.state === "today" && <span className="w-2 h-2 rounded-full bg-white pulse-ring" />}
            </div>
            <span
              className="text-[9px] font-medium text-center leading-tight"
              style={{ color: day.state === "today" ? "var(--blue)" : day.state === "done" ? "var(--ink-3)" : "var(--ink-4)" }}
            >
              {day.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

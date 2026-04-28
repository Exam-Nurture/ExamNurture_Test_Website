"use client";

const STATS = [
  {
    key: "pyq",
    label: "PYQs Attended",
    value: 48,
    total: 60,
    unit: "papers",
    emoji: "📄",
    barColor: "var(--blue)",
    bgColor: "var(--blue-soft)",
    textColor: "var(--blue)",
    note: "+6 this week",
    noteUp: true,
  },
  {
    key: "series",
    label: "Test Series Attended",
    value: 14,
    total: 20,
    unit: "tests",
    emoji: "📋",
    barColor: "var(--violet)",
    bgColor: "var(--violet-soft)",
    textColor: "var(--violet)",
    note: "+2 this week",
    noteUp: true,
  },
  {
    key: "streak",
    label: "Daily Max Streak",
    value: 12,
    total: null,           // no denominator — just raw count
    unit: "days",
    emoji: "🔥",
    barColor: "var(--amber)",
    bgColor: "var(--amber-soft)",
    textColor: "var(--amber)",
    note: "Personal best!",
    noteUp: true,
  },
];

export default function ExamReadiness() {
  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Subtle glow */}
      <div
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, var(--blue-soft) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative">
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
            Your Progress
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--ink-4)" }}>
            Lifetime activity across all modules
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "var(--green-soft)", color: "var(--green)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--green)" }}
          />
          Active
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-5 relative">
        {STATS.map((s) => {
          const pct = s.total ? Math.round((s.value / s.total) * 100) : null;
          return (
            <div key={s.key}>
              {/* Row: emoji + label + value */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background: s.bgColor }}
                  >
                    {s.emoji}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold leading-none" style={{ color: "var(--ink-1)" }}>
                      {s.label}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>
                      <span style={{ color: "var(--green)", fontWeight: 600 }}>▲</span> {s.note}
                    </div>
                  </div>
                </div>

                {/* Big number */}
                <div className="text-right">
                  <span
                    className="text-2xl font-bold tabular-nums leading-none"
                    style={{ fontFamily: "var(--font-sora)", color: s.textColor }}
                  >
                    {s.value}
                  </span>
                  {s.total && (
                    <span className="text-xs font-medium ml-1" style={{ color: "var(--ink-4)" }}>
                      / {s.total}
                    </span>
                  )}
                  <div className="text-[10px] font-medium mt-0.5" style={{ color: "var(--ink-4)" }}>
                    {s.unit}
                  </div>
                </div>
              </div>

              {/* Progress bar (only when there's a total) */}
              {pct !== null ? (
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: s.barColor }}
                  />
                </div>
              ) : (
                /* Streak — dot trail instead of bar */
                <div className="flex items-center gap-1.5 flex-wrap">
                  {Array.from({ length: s.value }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: i >= s.value - 3 ? s.barColor : "var(--line)",
                        opacity: 0.4 + (i / s.value) * 0.6,
                      }}
                    />
                  ))}
                  <span className="text-[10px] font-bold ml-1" style={{ color: s.textColor }}>
                    🔥 streak
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

const SUBJECTS = [
  { name: "Physics",     pct: 82, color: "#10B981" },
  { name: "Chemistry",   pct: 61, color: "#EF4444" },
  { name: "Mathematics", pct: 64, color: "#F59E0B" },
];

export default function ExamReadiness() {
  return (
    <div
      className="rounded-[14px] p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FAFCFF 0%, #F0F6FF 100%)",
        border: "1px solid rgba(37,99,235,.08)",
        boxShadow: "var(--shadow-sm), 0 0 0 1px rgba(37,99,235,.04)",
      }}
    >
      {/* Subtle accent glow */}
      <div
        className="absolute -right-20 -top-20 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,.04) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative">
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Exam Readiness</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>Based on last 30 days · mock scores &amp; topic mastery</div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: "var(--green-soft)", color: "#047857" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)", boxShadow: "0 0 0 3px rgba(16,185,129,.18)" }} />
          On Track
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start relative">
        {/* Overall gauge */}
        <div>
          <div className="flex items-end gap-3 mb-5">
            <div
              className="text-[44px] font-bold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
            >
              73<span className="text-[20px] font-medium" style={{ color: "var(--ink-4)" }}>%</span>
            </div>
            <div className="pb-1">
              <div className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>Overall Readiness</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                <span style={{ color: "var(--green)", fontWeight: 600 }}>▲ 12%</span> vs last month
              </div>
            </div>
          </div>

          {/* Progress bar — clean, flat */}
          <div className="relative h-3 rounded-full overflow-visible" style={{ background: "rgba(0,0,0,.04)" }}>
            {/* Target marker at 85% */}
            <div className="absolute top-[-4px] bottom-[-4px] w-px z-10" style={{ left: "85%", background: "var(--ink-3)" }}>
              <div
                className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium px-1.5 py-0.5 rounded-[4px]"
                style={{ background: "var(--ink-2)", color: "white" }}
              >
                Target 85%
              </div>
            </div>
            {/* Fill — flat blue */}
            <div
              className="h-full rounded-full"
              style={{
                width: "73%",
                background: "var(--blue)",
                boxShadow: "0 1px 4px -1px rgba(37,99,235,.25)",
              }}
            />
          </div>
        </div>

        {/* Subject bars */}
        <div className="flex flex-col gap-5">
          {SUBJECTS.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] font-semibold" style={{ color: "var(--ink-1)" }}>{s.name}</span>
                <span className="text-[12px] font-bold font-mono tabular-nums" style={{ color: s.color }}>{s.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,.04)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${s.pct}%`, background: s.color, opacity: 0.85 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

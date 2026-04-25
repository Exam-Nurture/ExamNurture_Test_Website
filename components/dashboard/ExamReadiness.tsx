"use client";

const SUBJECTS = [
  { name: "Physics",     pct: 82, color: "#10B981" },
  { name: "Chemistry",   pct: 61, color: "#EF4444" },
  { name: "Mathematics", pct: 64, color: "#F59E0B" },
];

export default function ExamReadiness() {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Exam Readiness</div>
          <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>Based on last 30 days · mock scores &amp; topic mastery</div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
          style={{ background: "var(--green-soft)", border: "1px solid #A7F3D0", color: "#047857" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)", boxShadow: "0 0 0 3px rgba(16,185,129,.22)" }} />
          On Track
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        {/* Overall gauge */}
        <div>
          <div className="flex items-end gap-3 mb-4">
            <div
              className="text-[48px] font-bold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
            >
              73<span className="text-[22px] font-medium" style={{ color: "var(--ink-3)" }}>%</span>
            </div>
            <div className="pb-1">
              <div className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>Overall Readiness</div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                <span style={{ color: "var(--green)", fontWeight: 600 }}>▲ 12%</span> vs last month
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3.5 rounded-full overflow-visible" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
            {/* Target marker at 85% */}
            <div className="absolute top-[-5px] bottom-[-5px] w-0.5 z-10" style={{ left: "85%", background: "var(--ink-1)" }}>
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-[4px]"
                style={{ background: "var(--ink-1)" }}
              >
                Target 85%
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 inline-block" style={{ background: "var(--ink-1)" }} />
              </div>
            </div>
            {/* Fill */}
            <div
              className="h-full rounded-full relative flex items-center justify-end pr-2"
              style={{
                width: "73%",
                background: "linear-gradient(90deg, var(--blue) 0%, var(--cyan) 100%)",
                boxShadow: "0 2px 6px -1px rgba(37,99,235,.35)",
              }}
            >
              <span className="text-[10px] font-bold text-white">73%</span>
            </div>
          </div>
          <div
            className="flex justify-between text-[10px] mt-2 font-mono"
            style={{ color: "var(--ink-4)" }}
          >
            {["0", "25", "50", "75", "100"].map((v) => <span key={v}>{v}</span>)}
          </div>
        </div>

        {/* Subject bars */}
        <div className="flex flex-col gap-4">
          {SUBJECTS.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>{s.name}</span>
                <span className="text-[13px] font-bold font-mono" style={{ color: s.color }}>{s.pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${s.pct}%`, background: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

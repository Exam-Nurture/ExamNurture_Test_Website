"use client";

/* Subjects relevant to competitive exams */
const SUBJECTS = [
  { name: "General Knowledge",     pct: 71, color: "var(--violet)" },
  { name: "Reasoning",             pct: 64, color: "var(--blue)" },
  { name: "Quantitative Aptitude", pct: 58, color: "var(--red)" },
  { name: "English Language",      pct: 80, color: "var(--green)" },
];

export default function ExamReadiness() {
  const overall = Math.round(SUBJECTS.reduce((a, s) => a + s.pct, 0) / SUBJECTS.length);

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Subtle glow — glassmorphism highlight only */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none opacity-50"
        style={{ background: "radial-gradient(circle, var(--violet-soft) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative">
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
            Exam Readiness
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--ink-4)" }}>
            Based on last 30 days · mock scores &amp; topic mastery
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "var(--green-soft)", color: "var(--green)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--green)", boxShadow: "0 0 0 3px var(--green-soft)" }}
          />
          On Track
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start relative">
        {/* Overall gauge */}
        <div>
          <div className="flex items-end gap-3 mb-6">
            <div
              className="text-4xl font-bold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
            >
              {overall}
              <span className="text-lg font-medium ml-1" style={{ color: "var(--ink-4)" }}>%</span>
            </div>
            <div className="pb-1">
              <div className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
                Overall Readiness
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-3)" }}>
                <span style={{ color: "var(--green)", fontWeight: 600 }}>▲ 9%</span> vs last month
              </div>
            </div>
          </div>

          {/* Progress bar with target marker */}
          <div className="relative h-3 rounded-full overflow-visible mt-6" style={{ background: "var(--line-soft)" }}>
            <div
              className="absolute top-[-6px] bottom-[-6px] w-px z-10"
              style={{ left: "80%", background: "var(--ink-3)" }}
            >
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium px-2 py-0.5 rounded"
                style={{ background: "var(--ink-2)", color: "var(--card)" }}
              >
                Target 80%
              </div>
            </div>
            <div
              className="h-full rounded-full"
              style={{
                width: `${overall}%`,
                background: "var(--blue)",
                boxShadow: "0 1px 4px -1px var(--blue-soft)",
              }}
            />
          </div>
          
          <div className="mt-8 p-3 rounded-lg flex items-start gap-3" style={{ background: "var(--amber-soft)" }}>
            <span className="text-lg">💡</span>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>Quant needs focus</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>Take a 10-min Quantitative Aptitude drill to bump your score above 60%.</div>
            </div>
          </div>
        </div>

        {/* Subject bars */}
        <div className="flex flex-col gap-4 mt-2 lg:mt-0">
          {SUBJECTS.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "var(--ink-2)" }}>
                  {s.name}
                </span>
                <span
                  className="text-xs font-bold font-mono tabular-nums"
                  style={{ color: s.color }}
                >
                  {s.pct}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
                <div
                  className="h-full rounded-full"
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

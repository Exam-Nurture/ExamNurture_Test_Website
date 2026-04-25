"use client";

const WEAK = [
  { topic: "Coordinate Geometry", subj: "Maths",     subjColor: "#F59E0B", acc: 42, tests: 7  },
  { topic: "Organic Chemistry",   subj: "Chemistry", subjColor: "#EF4444", acc: 58, tests: 11 },
  { topic: "Electrostatics",      subj: "Physics",   subjColor: "#10B981", acc: 61, tests: 9  },
];

function accColor(acc: number) {
  if (acc < 50) return "#EF4444";
  if (acc < 65) return "#F59E0B";
  return "#10B981";
}

export default function WeakAreas() {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Weak Areas</div>
          <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>Topics dragging your score down</div>
        </div>
        <a href="#" className="text-[12px] font-semibold transition-colors" style={{ color: "var(--blue)" }}>View all →</a>
      </div>

      <div className="flex flex-col divide-y" style={{ borderColor: "var(--line-soft)" }}>
        {WEAK.map((item) => (
          <div
            key={item.topic}
            className="flex flex-col sm:grid sm:grid-cols-[1.4fr_1fr_auto] gap-3 items-start sm:items-center py-3 transition-all hover:bg-[var(--bg)] rounded-[8px] px-2 -mx-2"
          >
            {/* Topic info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>{item.topic}</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px]"
                  style={{ color: item.subjColor, background: item.subjColor + "18" }}
                >
                  {item.subj}
                </span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>
                🎯 {item.tests} tests attempted
              </div>
            </div>

            {/* Accuracy bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>Accuracy</span>
                <span className="text-[11px] font-bold font-mono" style={{ color: accColor(item.acc) }}>{item.acc}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${item.acc}%`, background: accColor(item.acc) }} />
              </div>
            </div>

            {/* CTA */}
            <button
              className="text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-all hover:text-white"
              style={{ background: "var(--blue-soft)", color: "var(--blue)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--blue)";
                (e.currentTarget as HTMLElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--blue-soft)";
                (e.currentTarget as HTMLElement).style.color = "var(--blue)";
              }}
            >
              Practice →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

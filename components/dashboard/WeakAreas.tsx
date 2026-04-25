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
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "var(--ink-1)" }}>Weak Areas</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>Topics dragging your score down</div>
        </div>
        <a href="#" className="text-[11px] font-semibold transition-colors hover:underline" style={{ color: "var(--blue)" }}>View all →</a>
      </div>

      <div className="flex flex-col gap-3">
        {WEAK.map((item) => (
          <div
            key={item.topic}
            className="rounded-[10px] p-3 transition-all hover:bg-[var(--bg)]"
            style={{ border: "1px solid var(--line-soft)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-semibold" style={{ color: "var(--ink-1)" }}>{item.topic}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[4px]"
                style={{ color: item.subjColor, background: item.subjColor + "14" }}>{item.subj}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--line-soft)" }}>
                  <div className="h-full rounded-full" style={{ width: `${item.acc}%`, background: accColor(item.acc) }} />
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono tabular-nums" style={{ color: accColor(item.acc) }}>{item.acc}%</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px]" style={{ color: "var(--ink-4)" }}>{item.tests} tests attempted</span>
              <button className="text-[10px] font-semibold px-2.5 py-1 rounded-[6px] transition-all hover:bg-[var(--blue)] hover:text-white"
                style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>Practice →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

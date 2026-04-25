import { CalendarDays } from "lucide-react";

export const metadata = { title: "Schedule — ExamNurture" };

const UPCOMING = [
  { title: "JEE Main Mock #15",        date: "Apr 26, 2026", time: "10:00 AM", type: "Full Mock",    color: "#2563EB" },
  { title: "Physics — Thermodynamics", date: "Apr 27, 2026", time: "08:00 PM", type: "Chapter Test", color: "#10B981" },
  { title: "Chemistry Chapter Test",   date: "Apr 28, 2026", time: "07:00 PM", type: "Chapter Test", color: "#EF4444" },
  { title: "JEE Main 2024 PYQ",        date: "Apr 30, 2026", time: "09:00 AM", type: "PYQ Paper",    color: "#F59E0B" },
];

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6 fade-up">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
          Schedule
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--ink-3)" }}>Your upcoming tests and study sessions</p>
      </div>

      <div className="flex flex-col gap-3">
        {UPCOMING.map((item, i) => (
          <div key={i}
            className="flex items-center gap-4 px-5 py-4 rounded-[14px] border transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: "white", borderColor: "var(--line)" }}
          >
            <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>{item.title}</div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>{item.date} · {item.time}</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[5px] flex-shrink-0"
              style={{ background: item.color + "18", color: item.color }}
            >{item.type.toUpperCase()}</span>
            <button
              className="text-[12px] font-semibold px-3 py-1.5 rounded-[9px] text-white transition-all hover:brightness-105 flex-shrink-0"
              style={{ background: item.color }}
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

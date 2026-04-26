import { Video, Calendar, Users, ChevronRight } from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "JPSC Prelims 2025 — GK Strategy by Topper",
    host: "Ananya Singh, JPSC 2023 Rank 14",
    time: "Today, 7:00 PM",
    attendees: 1240,
    isLive: false,
    tint: "var(--violet)",
    tag: "Free",
  },
  {
    id: 2,
    title: "Banking Maths Shortcuts — DI Mastery",
    host: "Rahul Mishra, Ex-SBI PO",
    time: "Tomorrow, 6:00 PM",
    attendees: 860,
    isLive: false,
    tint: "var(--blue)",
    tag: "Free",
  },
  {
    id: 3,
    title: "LIVE Q&A — SSC CGL Tier I Tips",
    host: "Priya Kumari, SSC CGL Topper",
    time: "Live now",
    attendees: 430,
    isLive: true,
    tint: "var(--green)",
    tag: "Live",
  },
];

export default function LiveEvents() {
  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Video size={16} style={{ color: "var(--blue)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
              Live Classes
            </span>
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--ink-4)" }}>
            Free webinars by toppers &amp; experts
          </div>
        </div>
        <button
          className="text-xs font-medium flex items-center gap-0.5 transition-colors hover:opacity-70"
          style={{ color: "var(--blue)" }}
        >
          All events <ChevronRight size={14} />
        </button>
      </div>

      {/* Events list */}
      <div className="flex flex-col gap-4">
        {EVENTS.map((ev) => (
          <div
            key={ev.id}
            className="flex gap-4 p-3.5 rounded-xl transition-all duration-150 hover:bg-[var(--bg)] cursor-pointer"
            style={{ border: "1px solid var(--line-soft)" }}
          >
            {/* Color dot / live indicator */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: ev.tint, opacity: 0.15 }}
            />
            {/* Using absolute positioning to overlap the icon on the opaque background, or just use css var for tint instead of direct hex for background */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 -ml-14" style={{ zIndex: 1 }}>
              {ev.isLive ? (
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              ) : (
                <Calendar size={18} style={{ color: ev.tint }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-semibold leading-snug"
                style={{ color: "var(--ink-1)" }}
              >
                {ev.title}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-4)" }}>
                {ev.host}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: ev.isLive ? "var(--red)" : "var(--ink-3)" }}
                >
                  {ev.time}
                </span>
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--ink-4)" }}>
                  <Users size={12} /> {ev.attendees.toLocaleString()}
                </span>
              </div>
            </div>

            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full self-start flex-shrink-0"
              style={{
                background: ev.isLive ? "var(--red-soft)" : `color-mix(in srgb, ${ev.tint} 15%, transparent)`,
                color: ev.isLive ? "var(--red)" : ev.tint,
              }}
            >
              {ev.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

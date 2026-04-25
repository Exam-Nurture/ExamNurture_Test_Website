import { BarChart2, TrendingUp, Target, Clock } from "lucide-react";

export const metadata = { title: "Analytics — ExamNurture" };

export default function AnalyticsPage() {
  const stats = [
    { label: "Overall Accuracy",    val: "73%",    delta: "+5%",   color: "#2563EB" },
    { label: "Tests This Month",    val: "18",     delta: "+6",    color: "#10B981" },
    { label: "Study Time Today",    val: "2h 14m", delta: "+32m",  color: "#F59E0B" },
    { label: "AIR (Latest Mock)",   val: "~1,240", delta: "↑ 380", color: "#8B5CF6" },
  ];

  return (
    <div className="flex flex-col gap-6 fade-up">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
          Analytics
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--ink-3)" }}>Performance insights and trends</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ink-4)" }}>{s.label}</div>
            <div className="text-[28px] font-bold" style={{ color: s.color, fontFamily: "var(--font-sora)" }}>{s.val}</div>
            <div className="text-[12px] font-semibold mt-1" style={{ color: "var(--green)" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[14px] p-8 flex flex-col items-center justify-center gap-3 text-center"
        style={{ background: "white", border: "2px dashed var(--line)", minHeight: 320 }}
      >
        <BarChart2 size={40} style={{ color: "var(--line)" }} />
        <p className="text-[15px] font-semibold" style={{ color: "var(--ink-3)" }}>Detailed charts coming soon</p>
        <p className="text-[13px]" style={{ color: "var(--ink-4)" }}>Score trends, rank history, topic accuracy heatmaps</p>
      </div>
    </div>
  );
}

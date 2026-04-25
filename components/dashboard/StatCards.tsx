"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

type Sparkline = { points: number[]; color: string };

function Spark({ points, color }: Sparkline) {
  const w = 100, h = 28;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={coords} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points={`${coords} ${w},${h} 0,${h}`} fill={color} opacity="0.08" stroke="none" />
    </svg>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: React.ReactNode;
  trend: string;
  trendUp?: boolean;
  spark: Sparkline;
  accent?: string;
}

function StatCard({ label, value, sub, trend, trendUp = true, spark, accent }: StatCardProps) {
  return (
    <div
      className="rounded-[14px] p-5 transition-all hover:-translate-y-0.5 cursor-default"
      style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ink-3)" }}>
            {label}
          </div>
          <div
            className="text-[30px] font-bold tracking-tight leading-none mt-1.5 flex items-baseline gap-1"
            style={{ color: accent ?? "var(--ink-1)", fontFamily: "var(--font-sora)" }}
          >
            {value}
            {sub && <span className="text-[16px] font-medium" style={{ color: "var(--ink-3)" }}>{sub}</span>}
          </div>
        </div>
        <Spark {...spark} />
      </div>
      <div
        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold"
        style={{ color: trendUp ? "var(--green)" : "var(--red)" }}
      >
        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
  );
}

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Tests Completed"
        value="42"
        sub="/ 120"
        trend="+6 this week"
        trendUp
        spark={{ points: [0.3, 0.5, 0.4, 0.7, 0.6, 0.85, 0.9], color: "#2563EB" }}
      />
      <StatCard
        label="Average Score"
        value="73"
        sub="%"
        trend="+8% vs last month"
        trendUp
        spark={{ points: [0.4, 0.35, 0.55, 0.5, 0.65, 0.7, 0.78], color: "#10B981" }}
      />
      <StatCard
        label="Current Streak"
        value="12"
        sub={<span className="flicker">🔥</span>}
        trend="Best: 18 days"
        trendUp
        accent="#F59E0B"
        spark={{ points: [0.2, 0.3, 0.5, 0.45, 0.6, 0.75, 0.85], color: "#F59E0B" }}
      />
    </div>
  );
}

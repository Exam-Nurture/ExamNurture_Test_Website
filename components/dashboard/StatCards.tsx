"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

type Sparkline = { points: number[]; color: string };

function Spark({ points, color }: Sparkline) {
  const w = 80, h = 24;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={coords} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
      <polyline points={`${coords} ${w},${h} 0,${h}`} fill={color} opacity="0.05" stroke="none" />
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
    <div className="card card-lift p-6">
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ink-4)" }}>
            {label}
          </div>
          <div
            className="text-3xl font-bold tracking-tight leading-none mt-2 flex items-baseline gap-1"
            style={{ color: accent ?? "var(--ink-1)", fontFamily: "var(--font-sora)" }}
          >
            {value}
            {sub && <span className="text-base font-medium" style={{ color: "var(--ink-4)" }}>{sub}</span>}
          </div>
        </div>
        <Spark {...spark} />
      </div>
      <div
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium"
        style={{ color: trendUp ? "var(--green)" : "var(--red)" }}
      >
        {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function StatCards() {
  const { user } = useAuth();
  const attempts = user?.stats?.attempts ?? 0;
  const streak = user?.stats?.streakCurrent ?? 0;
  const longest = user?.stats?.streakLongest ?? 0;
  const testSeries = user?.stats?.attendedTestSeries ?? 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.div variants={item}>
        <StatCard
          label="Tests Completed"
          value={attempts}
          trend={attempts > 0 ? `${testSeries} test series` : "Start your first test"}
          trendUp={attempts > 0}
          spark={{ points: [0.1, 0.2, 0.3, 0.4, 0.5, 0.7, Math.min(1, attempts / 50)], color: "var(--blue)" }}
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          label="Test Series Attended"
          value={testSeries}
          trend={testSeries > 0 ? `${attempts} total attempts` : "Explore test series"}
          trendUp={testSeries > 0}
          spark={{ points: [0.1, 0.2, 0.3, 0.4, 0.5, 0.65, Math.min(1, testSeries / 10)], color: "var(--green)" }}
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          label="Current Streak"
          value={streak}
          sub={<span className="flicker">🔥</span>}
          trend={`Best: ${longest} days`}
          trendUp={streak > 0}
          accent="var(--amber)"
          spark={{ points: [0.1, 0.2, 0.35, 0.4, 0.5, 0.65, Math.min(1, streak / 30)], color: "var(--amber)" }}
        />
      </motion.div>
    </motion.div>
  );
}

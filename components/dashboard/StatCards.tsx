"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: React.ReactNode;
  trend: string;
  trendUp?: boolean;
  accent?: string;
}

function StatCard({ label, value, sub, trend, trendUp = true, accent }: StatCardProps) {
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
          trend={attempts > 0 ? `${attempts} total papers` : "Start your first test"}
          trendUp={attempts > 0}
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          label="Test Series Attended"
          value={testSeries}
          trend={testSeries > 0 ? `${testSeries} active series` : "Explore test series"}
          trendUp={testSeries > 0}
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
        />
      </motion.div>
    </motion.div>
  );
}

import GreetingRow from "@/components/dashboard/GreetingRow";
import StatCards from "@/components/dashboard/StatCards";
import WeeklyStreak from "@/components/dashboard/WeeklyStreak";
import QuickActions from "@/components/dashboard/QuickActions";
import ExamReadiness from "@/components/dashboard/ExamReadiness";
import RecentTests from "@/components/dashboard/RecentTests";
import TestSeriesCards from "@/components/dashboard/TestSeriesCards";

export const metadata = { title: "Dashboard — ExamNurture" };

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 fade-up">
      {/* Greeting — full width */}
      <GreetingRow />

      {/* 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ── Left column: primary content ── */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Stat cards */}
          <StatCards />

          {/* Your Progress */}
          <ExamReadiness />

          {/* Recent Tests */}
          <RecentTests />

          {/* Test Series */}
          <TestSeriesCards />
        </div>

        {/* ── Right column: secondary / quick access ── */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Weekly Streak */}
          <WeeklyStreak />
        </div>
      </div>
    </div>
  );
}

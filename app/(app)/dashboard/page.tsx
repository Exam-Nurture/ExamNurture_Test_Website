import GreetingRow from "@/components/dashboard/GreetingRow";
import StatCards from "@/components/dashboard/StatCards";
import WeeklyStreak from "@/components/dashboard/WeeklyStreak";
import QuickActions from "@/components/dashboard/QuickActions";
import ExamReadiness from "@/components/dashboard/ExamReadiness";
import WeakAreas from "@/components/dashboard/WeakAreas";
import Recommendations from "@/components/dashboard/Recommendations";
import RecentTests from "@/components/dashboard/RecentTests";
import TestSeriesCards from "@/components/dashboard/TestSeriesCards";

export const metadata = { title: "Dashboard — ExamNurture" };

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 fade-up">
      {/* Greeting */}
      <GreetingRow />

      {/* Stat cards */}
      <StatCards />

      {/* Streak + Quick Actions — 2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyStreak />
        <QuickActions />
      </div>

      {/* Exam Readiness */}
      <ExamReadiness />

      {/* Weak Areas + Recommendations — 2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeakAreas />
        <Recommendations />
      </div>

      {/* Recent Tests */}
      <RecentTests />

      {/* Test Series */}
      <TestSeriesCards />
    </div>
  );
}

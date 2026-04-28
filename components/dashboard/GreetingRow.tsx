"use client";

import { motion } from "framer-motion";
import { EXAM_BOARDS } from "@/lib/data/examData";
import { useAuth } from "@/lib/auth-context";

export default function GreetingRow() {
  const { user } = useAuth();
  const hours = new Date().getHours();
  const greet =
    hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = user?.name?.split(" ")[0] ?? "Student";

  // Pull exams with upcoming dates / days left from the central data
  const upcomingExams = EXAM_BOARDS
    .flatMap((b) => b.exams.map((e) => ({ ...e, board: b })))
    .filter((e) => e.daysLeft && e.daysLeft > 0)
    .sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999))
    .slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-2xl mesh-gradient text-[var(--ink-1)] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
    >
      <div>
        <h1
          className="text-3xl font-bold tracking-tight leading-tight font-[var(--font-sora)]"
        >
          {greet}, {firstName} <span className="wave inline-block origin-[70%_70%]">👋</span>
        </h1>
        <p className="mt-2 text-[var(--ink-3)] text-sm">
          Here&apos;s your study snapshot for today. Let&apos;s hit your goals!
        </p>
      </div>

      {/* Exam countdown pills — from examData.ts */}
      {upcomingExams.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {upcomingExams.map((exam) => (
            <div
              key={exam.id}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: "var(--card)",
                border: "1px solid var(--line-soft)",
                color: "var(--ink-1)",
                boxShadow: "var(--shadow-xs)"
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: exam.board.tint, boxShadow: `0 0 0 3px ${exam.board.tint}33` }}
              />
              {exam.shortName}
              <span className="text-[var(--ink-4)]">·</span>
              <span>
                <strong style={{ color: exam.board.tint }}>{exam.daysLeft}</strong> days left
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

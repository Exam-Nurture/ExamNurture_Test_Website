"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function GreetingRow() {
  const { user } = useAuth();
  const hours = new Date().getHours();
  const greet =
    hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = user?.name?.split(" ")[0] ?? "Student";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-2xl mesh-gradient text-[var(--ink-1)] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight leading-tight font-[var(--font-sora)]">
          {greet}, {firstName}{" "}
          <span className="wave inline-block origin-[70%_70%]">👋</span>
        </h1>
        <p className="mt-2 text-[var(--ink-3)] text-sm">
          Here&apos;s your study snapshot for today. Let&apos;s hit your goals!
        </p>
      </div>
    </motion.div>
  );
}

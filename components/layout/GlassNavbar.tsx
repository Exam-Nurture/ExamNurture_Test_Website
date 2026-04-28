"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, FileText, Search, User, Library, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Tests", href: "/tests" },
  { icon: Library, label: "Learn", href: "/library" },
  { icon: Search, label: "Search", href: "#search", action: "search" },
  { icon: Zap, label: "Quiz", href: "/daily-quiz" },
  { icon: User, label: "Profile", href: "/dashboard" },
];

export default function GlassNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // Hide on certain paths if needed (e.g., during an actual test)
  const isTestActive = pathname.startsWith("/exam/");
  if (isTestActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[95vw]">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative flex items-center gap-1 p-1.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-black/5"
      >
        {/* Glow effect background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 pointer-events-none" />

        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          const href = (item.label === "Profile" && !user) ? "/login" : item.href;

          return (
            <Link
              key={item.label}
              href={item.action === "search" ? "#" : href}
              onClick={(e) => {
                if (item.action === "search") {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("open-search"));
                }
              }}
              onMouseEnter={() => setHoveredPath(item.href)}
              onMouseLeave={() => setHoveredPath(null)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 group ${
                isActive ? "text-white" : "text-gray-500 dark:text-white/60 hover:text-blue-600 dark:hover:text-white"
              }`}
            >
              {/* Active Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Hover Background (Subtle) */}
              <AnimatePresence>
                {hoveredPath === item.href && !isActive && (
                  <motion.div
                    layoutId="hover-pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <Icon className={`relative w-[22px] h-[22px] z-10 transition-transform duration-300 ${
                isActive ? "scale-110" : "group-hover:scale-110"
              }`} />

              {/* Label (Tooltip) */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900/90 text-white text-[11px] font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-white/10 translate-y-2 group-hover:translate-y-0">
                {item.label}
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45" />
              </div>

              {/* Active Dot (Next Level Enhancement) */}
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}

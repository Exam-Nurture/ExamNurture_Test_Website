"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Topbar() {
  const pathname = usePathname();
  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 bg-[var(--card)] z-50 flex items-center justify-between px-5"
      style={{ borderBottom: "1px solid var(--line-soft)" }}
    >
      {/* Left — Logo + Nav */}
      <div className="flex items-center gap-7">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%)",
              boxShadow: "0 2px 8px -2px rgba(37,99,235,.35)",
            }}
          >
            {/* Checkmark-in-shield icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            <span style={{ color: "var(--ink-1)" }}>Exam</span>
            <span style={{ color: "var(--cyan)" }}>Nurture</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/tests",     label: "Tests" },
            { href: "/pyq",       label: "PYQ" },
            { href: "/library",   label: "Library" },
            { href: "/guides",    label: "Guides" },
            { href: "/contests",  label: "Contests", hot: true },
            { href: "/plans",     label: "Plans" },
          ].map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-all ${
                  isActive 
                    ? "bg-[var(--blue-soft)] text-[var(--blue)]" 
                    : "text-[var(--ink-3)] hover:bg-[var(--bg)] hover:text-[var(--ink-1)]"
                }`}
              >
                {item.label}
                {item.hot && (
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    LIVE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right — Search + Bell + Avatar */}
      <div className="flex items-center gap-2.5">
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-[10px] w-56 transition-all"
          style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}
        >
          <Search size={13} style={{ color: "var(--ink-4)" }} />
          <input
            placeholder="Search exams, topics, PYQs…"
            className="flex-1 border-none outline-none bg-transparent text-[12px]"
            style={{ color: "var(--ink-1)" }}
          />
          <kbd
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px]"
            style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--ink-4)" }}
          >⌘K</kbd>
        </div>

        <ThemeToggle />

        <button
          className="relative w-8 h-8 rounded-[8px] flex items-center justify-center transition-all hover:bg-[var(--bg)]"
          style={{ color: "var(--ink-3)" }}
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.8} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--red)", boxShadow: "0 0 0 2px var(--card)" }}
          />
        </button>

        <Link
          href="/profile"
          className="flex items-center gap-2 py-1 pl-0.5 pr-2.5 rounded-[10px] transition-all hover:bg-[var(--bg)]"
          style={{ border: "1px solid var(--line-soft)" }}
        >
          <span
            className="w-7 h-7 rounded-[7px] flex items-center justify-center text-white text-[11px] font-bold"
            style={{ background: "linear-gradient(135deg, var(--blue), var(--cyan))" }}
          >R</span>
          <div className="text-left hidden sm:block">
            <div className="text-[12px] font-semibold leading-tight" style={{ color: "var(--ink-1)" }}>Rahul S.</div>
            <div className="text-[10px] leading-tight" style={{ color: "var(--ink-4)" }}>Free Plan</div>
          </div>
        </Link>
      </div>
    </header>
  );
}

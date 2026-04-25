"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, FileText, BarChart2,
  CalendarDays, User, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { id: "tests",     href: "/tests",     label: "Test Series",  icon: ClipboardList   },
  { id: "pyq",       href: "/pyq",       label: "PYQ Papers",   icon: FileText        },
  { id: "analytics", href: "/analytics", label: "Analytics",    icon: BarChart2       },
  { id: "schedule",  href: "/schedule",  label: "Schedule",     icon: CalendarDays    },
  { id: "profile",   href: "/profile",   label: "Profile",      icon: User            },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-16 bottom-0 left-0 w-[248px] flex flex-col pt-5 pb-5 px-3.5 z-40 overflow-y-auto"
      style={{ background: "white", borderRight: "1px solid var(--line)" }}
    >
      <nav className="flex flex-col gap-0.5 flex-1">
        <span
          className="text-[11px] font-semibold tracking-widest px-3 pb-3"
          style={{ color: "var(--ink-4)" }}
        >MAIN MENU</span>

        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-[14px] font-medium transition-all",
                active
                  ? "text-white"
                  : "hover:bg-[var(--bg)]"
              )}
              style={active
                ? {
                    background: "var(--blue)",
                    boxShadow: "0 4px 10px -3px rgba(37,99,235,.45)",
                    color: "white",
                  }
                : { color: "var(--ink-2)" }
              }
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span>{item.label}</span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro upgrade banner */}
      <div
        className="mt-4 rounded-[14px] p-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)" }}
      >
        <div
          className="absolute -right-8 -top-8 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at center, rgba(6,182,212,.45), transparent 65%)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2 py-0.5 w-fit mb-2">
            <Sparkles size={10} className="text-sky-200" />
            <span className="text-[10px] font-bold tracking-wider text-sky-100">PRO</span>
          </div>
          <div className="text-[14px] font-bold text-white leading-snug">Upgrade to Pro</div>
          <div className="text-[11px] text-white/75 mt-1 leading-snug">
            Unlock all mock tests, PYQs & detailed analytics.
          </div>
          <button className="mt-3 w-full py-2 rounded-[8px] bg-white text-[13px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ color: "var(--blue)" }}
          >
            Upgrade Plan →
          </button>
        </div>
      </div>
    </aside>
  );
}

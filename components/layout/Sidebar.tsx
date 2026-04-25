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
      className="fixed top-14 bottom-0 left-0 w-[224px] hidden md:flex flex-col pt-5 pb-5 px-3 z-40 overflow-y-auto"
      style={{ background: "white", borderRight: "1px solid var(--line-soft)" }}
    >
      <nav className="flex flex-col gap-0.5 flex-1">
        <span
          className="text-[10px] font-semibold tracking-widest px-3 pb-3"
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
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all",
                active
                  ? ""
                  : "hover:bg-[var(--bg)]"
              )}
              style={active
                ? {
                    background: "var(--blue-soft)",
                    color: "var(--blue)",
                  }
                : { color: "var(--ink-3)" }
              }
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.7} />
              <span>{item.label}</span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--blue)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro upgrade banner */}
      <div
        className="mt-4 rounded-[12px] p-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" }}
      >
        <div
          className="absolute -right-6 -top-6 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at center, rgba(255,255,255,.12), transparent 65%)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-2 py-0.5 w-fit mb-2">
            <Sparkles size={9} className="text-blue-200" />
            <span className="text-[9px] font-bold tracking-wider text-blue-100">PRO</span>
          </div>
          <div className="text-[13px] font-semibold text-white leading-snug">Upgrade to Pro</div>
          <div className="text-[11px] text-white/65 mt-1 leading-snug">
            Unlock all mock tests, PYQs & detailed analytics.
          </div>
          <button className="mt-3 w-full py-2 rounded-[8px] bg-white text-[12px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ color: "var(--blue)" }}
          >
            Upgrade Plan →
          </button>
        </div>
      </div>
    </aside>
  );
}

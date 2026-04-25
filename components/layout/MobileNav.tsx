"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, FileText, BarChart2, User } from "lucide-react";

const ITEMS = [
  { href: "/dashboard", label: "Home",      icon: Home         },
  { href: "/tests",     label: "Tests",     icon: ClipboardList },
  { href: "/pyq",       label: "PYQ",       icon: FileText     },
  { href: "/analytics", label: "Analytics", icon: BarChart2    },
  { href: "/profile",   label: "Profile",   icon: User         },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex md:hidden z-50 border-t"
      style={{
        background: "white",
        borderColor: "var(--line-soft)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-all"
            style={{ color: active ? "var(--blue)" : "var(--ink-4)" }}
          >
            <Icon size={18} strokeWidth={active ? 2 : 1.6} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

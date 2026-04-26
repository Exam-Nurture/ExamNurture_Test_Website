"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Home, ClipboardList, FileText, Flame, User } from "lucide-react";

const ITEMS = [
  { href: "/dashboard", label: "Home",     icon: Home         },
  { href: "/tests",     label: "Tests",    icon: ClipboardList },
  { href: "/pyq",       label: "PYQ",      icon: FileText     },
  { href: "/contests",  label: "Contests", icon: Flame, hot: true },
  { href: "/profile",   label: "Profile",  icon: User         },
];

export default function MobileNav() {
  const pathname  = usePathname();
  const [visible, setVisible] = useState(true);
  const lastY     = useRef(0);

  /* Hide on scroll-down, reveal on scroll-up */
  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY;
      const dir = y - lastY.current;
      if (Math.abs(dir) > 4) setVisible(dir < 0 || y < 60);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex md:hidden z-50 border-t"
      style={{
        background:    "var(--card)",
        borderColor:   "var(--line-soft)",
        paddingBottom: "env(safe-area-inset-bottom)",
        transform:     visible ? "translateY(0)" : "translateY(100%)",
        transition:    "transform 200ms ease",
      }}
    >
      {ITEMS.map(({ href, label, icon: Icon, hot }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-150 relative"
            style={{ color: active ? "var(--blue)" : hot && !active ? "#EF4444" : "var(--ink-4)" }}
          >
            {hot && !active && (
              <span
                className="absolute top-2 right-[calc(50%-12px)] w-1.5 h-1.5 rounded-full"
                style={{ background: "#EF4444" }}
              />
            )}
            <Icon size={18} strokeWidth={active ? 2 : 1.6} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

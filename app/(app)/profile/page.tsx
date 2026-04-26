"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, BookOpen, Award, Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { TIERS, EXAM_BOARDS } from "@/lib/data/examData";

/* ─── Derive exam display list from examData ─── */
function getExclusiveExamNames(tierLevel: 1 | 2 | 3): string[] {
  return EXAM_BOARDS
    .filter((b) => TIERS.find((t) => t.id === tierLevel)!.exclusiveBoardIds.includes(b.id))
    .flatMap((b) => b.exams.map((e) => e.name));
}

const TARGET_EXAMS = [
  { name: "JPSC Prelims 2025", daysLeft: 63,  color: "var(--violet)" },
  { name: "IBPS PO 2025",      daysLeft: 118, color: "var(--blue)"   },
];

export default function ProfilePage() {
  const [openTier, setOpenTier] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-5 fade-up" style={{ maxWidth: 760 }}>
      {/* Header */}
      <div>
        <h1
          className="text-[22px] font-bold tracking-tight"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
        >
          Profile
        </h1>
        <p className="text-[12px] mt-1.5" style={{ color: "var(--ink-4)" }}>
          Your account and subscription
        </p>
      </div>

      {/* Avatar + info */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-[16px] flex items-center justify-center text-white text-[24px] font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--violet), var(--blue))" }}
          >
            R
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-bold" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
              Rahul Sharma
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[13px]" style={{ color: "var(--ink-3)" }}>Free Plan</span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: "var(--line-soft)", color: "var(--ink-4)" }}
              >
                Member since Jan 2026
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ink-3)" }}>
                <Mail size={13} /> dilip8002312965@gmail.com
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ink-3)" }}>
                <Phone size={13} /> +91 98765 43210
              </span>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all hover:bg-[var(--bg)] flex-shrink-0"
            style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Target exams */}
      <div className="card p-5">
        <div className="mb-4">
          <div className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Target Exams</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>
            Based on your active subscription · exams unlock automatically by tier
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {TARGET_EXAMS.map((exam) => (
            <div
              key={exam.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]"
              style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: exam.color }} />
              <div className="flex-1 text-[13px] font-medium" style={{ color: "var(--ink-1)" }}>{exam.name}</div>
              <span className="text-[11px] font-semibold" style={{ color: exam.color }}>
                {exam.daysLeft}d left
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tests Done",  val: "26", icon: <BookOpen size={17} />, color: "var(--blue)"   },
          { label: "Day Streak",  val: "12", icon: <span className="text-base">🔥</span>, color: "var(--amber)" },
          { label: "Certificates",val: "2",  icon: <Award   size={17} />, color: "var(--green)"  },
        ].map((s) => (
          <div
            key={s.label}
            className="card p-4 text-center"
          >
            <div className="flex justify-center mb-1.5" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-[22px] font-bold" style={{ color: s.color, fontFamily: "var(--font-sora)" }}>
              {s.val}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Subscription plans — powered by examData.ts ── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[16px] font-bold" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
              Subscription Plans
            </div>
            <div className="text-[12px] mt-1" style={{ color: "var(--ink-4)" }}>
              Based on qualification level · Tiers are cumulative · All exams unlock automatically
            </div>
          </div>
          <Link
            href="/plans"
            className="flex items-center gap-1 text-[12px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--blue)" }}
          >
            Compare plans <ExternalLink size={12} />
          </Link>
        </div>

        {/* Tier accordion — data from examData.ts */}
        <div className="flex flex-col gap-3">
          {TIERS.map((tier) => {
            const isOpen = openTier === tier.id;
            const exclusiveExams = getExclusiveExamNames(tier.id);

            return (
              <div
                key={tier.id}
                className="rounded-[12px] overflow-hidden transition-all duration-200"
                style={{
                  border: tier.highlight
                    ? `1.5px solid ${tier.color}`
                    : "1px solid var(--line-soft)",
                  boxShadow: tier.highlight ? `0 0 0 3px ${tier.color}12` : "none",
                }}
              >
                {/* Header row */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all duration-150 hover:bg-[var(--bg)]"
                  onClick={() => setOpenTier(isOpen ? null : tier.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: tier.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>
                          {tier.name}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: tier.colorSoft, color: tier.color }}
                        >
                          {tier.badge}
                        </span>
                        {tier.highlight && (
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: tier.color }}
                          >
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>
                        {tier.qualification}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <div className="text-right">
                      <span
                        className="text-[16px] font-bold"
                        style={{ color: tier.color, fontFamily: "var(--font-sora)" }}
                      >
                        ₹{tier.monthlyPrice}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--ink-4)" }}>/mo</span>
                    </div>
                    {isOpen
                      ? <ChevronUp  size={15} style={{ color: "var(--ink-4)" }} />
                      : <ChevronDown size={15} style={{ color: "var(--ink-4)" }} />
                    }
                  </div>
                </button>

                {/* Expanded detail */}
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: isOpen ? 600 : 0 }}
                >
                  <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--line-soft)" }}>
                    {/* Exams exclusive to this tier */}
                    <div className="flex flex-col gap-1.5 mt-3 mb-4">
                      <div className="text-[10px] font-semibold tracking-wider mb-2" style={{ color: "var(--ink-4)" }}>
                        EXAMS UNLOCKED IN THIS TIER
                      </div>
                      {exclusiveExams.map((ex) => (
                        <div key={ex} className="flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-2)" }}>
                          <Check size={13} style={{ color: tier.color, flexShrink: 0 }} />
                          {ex}
                        </div>
                      ))}
                      {/* Cumulative note */}
                      {tier.id > 1 && (
                        <div className="flex items-center gap-2 text-[11px] mt-1" style={{ color: "var(--ink-4)" }}>
                          <Check size={11} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
                          + all {tier.id === 2 ? "Tier 1" : "Tier 1 & Tier 2"} exams included
                        </div>
                      )}
                    </div>

                    {/* Yearly note + CTA */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--line-soft)" }}>
                      <span className="text-[11px]" style={{ color: "var(--ink-4)" }}>
                        ₹{tier.yearlyPrice.toLocaleString()}/year ·{" "}
                        <span style={{ color: tier.color, fontWeight: 600 }}>
                          Save {Math.round((1 - tier.yearlyPrice / (tier.monthlyPrice * 12)) * 100)}%
                        </span>
                      </span>
                      <button
                        className="px-5 py-2 rounded-[9px] text-[13px] font-semibold text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
                        style={{ background: tier.color }}
                      >
                        Subscribe →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] mt-4 text-center" style={{ color: "var(--ink-4)" }}>
          Cancel anytime · Secure payment · No hidden charges
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, Star, ChevronDown, ChevronRight, BookOpen, FileText, Flame, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TIERS, EXAM_BOARDS, getBoardsForTier, type Tier, type ExamBoard } from "@/lib/data/examData";
import { apiCheckout, type CheckoutResponse } from "@/lib/api";

declare const Razorpay: new (opts: object) => { open(): void };

async function launchCheckout(tier: Tier, isYearly: boolean) {
  const billingCycle = isYearly ? "YEARLY" : "MONTHLY";
  const data: CheckoutResponse = await apiCheckout(tier.id, billingCycle);

  return new Promise<void>((resolve, reject) => {
    const rz = new Razorpay({
      key: data.keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: "ExamNurture",
      description: `${tier.name} — ${billingCycle.toLowerCase()}`,
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          const { apiVerifyPayment } = await import("@/lib/api");
          await apiVerifyPayment({
            razorpayOrderId: resp.razorpay_order_id,
            razorpayPaymentId: resp.razorpay_payment_id,
            razorpaySignature: resp.razorpay_signature,
            tierLevel: data.tierLevel,
            billingCycle,
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
    });
    rz.open();
  });
}

/* ─────────────────────────────────────────────
   Plans Page — Powered by examData.ts
───────────────────────────────────────────── */
export default function PlansPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="flex flex-col gap-10 fade-up pb-10" style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <h1
          className="text-4xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
        >
          Choose your plan
        </h1>
        <p className="text-[var(--ink-3)] text-lg mb-8 leading-relaxed">
          Pick the tier that matches your qualification and goals.
          <br />
          Every tier unlocks all exams below it — no hidden fees, cancel anytime.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <span className={!isYearly ? "text-[var(--ink-1)]" : "text-[var(--ink-4)]"}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 rounded-full relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
            style={{ background: "var(--line-soft)" }}
            aria-label="Toggle Billing"
          >
            <motion.div
              className="absolute top-1 bottom-1 w-5 rounded-full shadow-sm"
              style={{ background: "var(--blue)" }}
              animate={{ left: isYearly ? "calc(100% - 1.5rem)" : "0.25rem" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={isYearly ? "text-[var(--ink-1)]" : "text-[var(--ink-4)]"}>Yearly</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wider">
              Save 40%+
            </span>
          </div>
        </div>
      </div>

      {/* ── Tier Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <TierCard tier={tier} isYearly={isYearly} />
          </motion.div>
        ))}
      </div>

      {/* ── Detailed Board/Exam Breakdown ── */}
      <div className="mt-4">
        <h2
          className="text-2xl font-bold tracking-tight mb-2 text-center"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
        >
          What&apos;s included in each tier?
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--ink-4)" }}>
          Tap any tier to see every board and exam you unlock
        </p>

        <div className="flex flex-col gap-4">
          {TIERS.map((tier) => (
            <TierBreakdown key={tier.id} tier={tier} />
          ))}
        </div>
      </div>

      {/* ── Enterprise CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 max-w-3xl mx-auto w-full glass rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <h4 className="text-lg font-bold font-[var(--font-sora)] text-[var(--ink-1)]">
            Need a custom solution for your coaching institute?
          </h4>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            We offer white-labeled portals and bulk student discounts.
          </p>
        </div>
        <Button variant="secondary" className="flex-shrink-0">
          Contact Sales
        </Button>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tier Card
───────────────────────────────────────────── */
function TierCard({ tier, isYearly }: { tier: Tier; isYearly: boolean }) {
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  const boards = getBoardsForTier(tier.id);
  const totalExams = boards.reduce((sum, b) => sum + b.exams.length, 0);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const handleGetStarted = async () => {
    setPaying(true);
    setPayError("");
    try {
      await launchCheckout(tier, isYearly);
      window.location.reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg !== "Payment cancelled") setPayError(msg);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div
      className={`relative rounded-3xl p-7 flex flex-col h-full bg-[var(--card)] ${
        tier.highlight
          ? "border-2 shadow-2xl z-10"
          : "border border-[var(--line-soft)] shadow-md hover:shadow-lg transition-shadow"
      }`}
      style={tier.highlight ? { borderColor: tier.color } : undefined}
    >
      {tier.highlight && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <div
            className="text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider"
            style={{ background: tier.color }}
          >
            <Star size={12} fill="white" /> Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold font-[var(--font-sora)] text-[var(--ink-1)]">
            {tier.name}
          </h3>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: tier.colorSoft, color: tier.color }}
          >
            {tier.badge}
          </span>
        </div>
        <p className="text-sm font-medium" style={{ color: tier.color }}>{tier.tagline}</p>
        <p className="text-xs mt-2 leading-relaxed text-[var(--ink-3)]">{tier.description}</p>
      </div>

      {/* Price */}
      <div className="mb-5 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold font-[var(--font-sora)] text-[var(--ink-1)]">
          ₹{price.toLocaleString("en-IN")}
        </span>
        <span className="text-sm text-[var(--ink-4)] font-medium">
          /{isYearly ? "year" : "month"}
        </span>
      </div>

      {/* Quick stats */}
      <div className="flex gap-4 mb-5 text-[11px] font-medium" style={{ color: "var(--ink-3)" }}>
        <span className="inline-flex items-center gap-1">
          <BookOpen size={12} /> {boards.length} boards
        </span>
        <span className="inline-flex items-center gap-1">
          <FileText size={12} /> {totalExams} exams
        </span>
      </div>

      {payError && (
        <p className="text-xs text-red-500 mb-2 text-center">{payError}</p>
      )}
      <Button
        variant={tier.highlight ? "default" : "outline"}
        size="lg"
        onClick={handleGetStarted}
        disabled={paying}
        className={`w-full mb-6 rounded-xl ${tier.highlight ? "shadow-md" : ""}`}
        style={tier.highlight ? { background: tier.color } : undefined}
      >
        {paying ? <Loader2 size={16} className="animate-spin" /> : "Get Started"}
      </Button>

      {/* Perks */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-4)]">
          Highlights
        </div>
        {tier.perks.slice(0, 6).map((perk, idx) => (
          <div key={idx} className="flex gap-2.5">
            <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
            <span className="text-[13px] text-[var(--ink-2)] leading-snug">{perk}</span>
          </div>
        ))}
        {tier.perks.length > 6 && (
          <span className="text-[11px] font-medium" style={{ color: tier.color }}>
            +{tier.perks.length - 6} more benefits
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tier Breakdown — Expandable board → exam list
───────────────────────────────────────────── */
function TierBreakdown({ tier }: { tier: Tier }) {
  const [open, setOpen] = useState(false);
  const boards = getBoardsForTier(tier.id);

  // Group boards by their tier level for display
  const exclusiveBoards = EXAM_BOARDS.filter((b) => tier.exclusiveBoardIds.includes(b.id));
  const inheritedBoards = boards.filter((b) => !tier.exclusiveBoardIds.includes(b.id));

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow"
      style={{
        background: "var(--card)",
        border: `1px solid ${open ? tier.color : "var(--line-soft)"}`,
        boxShadow: open ? "var(--shadow-md)" : "var(--shadow-xs)",
      }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-[var(--bg)]"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: tier.colorSoft }}
        >
          <Flame size={18} style={{ color: tier.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold font-[var(--font-sora)] text-[var(--ink-1)]">
              {tier.name}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: tier.colorSoft, color: tier.color }}
            >
              {tier.badge}
            </span>
          </div>
          <p className="text-xs text-[var(--ink-3)] mt-0.5">
            {boards.length} boards · {boards.reduce((s, b) => s + b.exams.length, 0)} exams · {tier.qualification}
          </p>
        </div>
        <ChevronDown
          size={18}
          className="transition-transform flex-shrink-0"
          style={{
            color: "var(--ink-4)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 flex flex-col gap-5">

              {/* Exclusive boards for this tier */}
              {exclusiveBoards.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: tier.color }}>
                    {tier.id === 1 ? "Included Boards" : `New in ${tier.name}`}
                  </div>
                  <div className="flex flex-col gap-3">
                    {exclusiveBoards.map((board) => (
                      <BoardRow key={board.id} board={board} accentColor={tier.color} />
                    ))}
                  </div>
                </div>
              )}

              {/* Inherited from lower tiers */}
              {inheritedBoards.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-[var(--ink-4)]">
                    Also includes (from lower tiers)
                  </div>
                  <div className="flex flex-col gap-3">
                    {inheritedBoards.map((board) => (
                      <BoardRow key={board.id} board={board} accentColor="var(--ink-4)" muted />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Board Row — shows board + its exams
───────────────────────────────────────────── */
function BoardRow({ board, accentColor, muted }: { board: ExamBoard; accentColor: string; muted?: boolean }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
          style={{ background: muted ? "var(--ink-4)" : board.tint }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[var(--ink-1)]">{board.name}</div>
          <div className="text-[11px] text-[var(--ink-4)] mt-0.5">{board.description}</div>

          {/* Exam list */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
            {board.exams.map((exam) => (
              <div key={exam.id} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-3)" }}>
                <ChevronRight size={10} style={{ color: accentColor }} />
                <span className="font-medium">{exam.shortName}</span>
                {exam.upcomingDate && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--line-soft)", color: "var(--ink-4)" }}>
                    {exam.upcomingDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

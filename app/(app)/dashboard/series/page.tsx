"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Star, Zap, ArrowRight, ShoppingCart } from "lucide-react";
import { apiGetTestSeries } from "@/lib/api";

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiGetTestSeries({ limit: 100 })
      .then((data: any) => setSeriesList(data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = seriesList.filter((s) => {
    const catOk = activeTab === "All" || s.exam?.name.includes(activeTab) || s.exam?.shortName === activeTab;
    const freeOk = !freeOnly || !s.isPaid;
    return catOk && freeOk;
  });

  const categories = ["All", ...new Set(seriesList.map(s => s.exam?.shortName || "Other"))].slice(0, 8);

  return (
    <div className="flex flex-col gap-8 fade-up">

      {/* Header */}
      <div className="pt-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[28px] leading-none text-black mb-2"
                style={{ fontWeight: 300, letterSpacing: "-0.96px", color: "var(--ink-1)" }}>
              Test Series
            </h1>
            <p className="text-[14px] max-w-xl" style={{ color: "var(--ink-4)", lineHeight: "1.5" }}>
              Practice with full-length mock tests for your target exams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/series/all"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-[#e6e6e6] hover:border-black transition-colors"
              style={{ color: "var(--ink-2)" }}
            >
              Browse All Series <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setFreeOnly(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                freeOnly
                  ? "bg-black text-white border-black"
                  : "border-[#e6e6e6] text-[var(--ink-3)] hover:border-black"
              }`}
            >
              <Zap size={14} />
              Free Only
            </button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="flex gap-0.5 p-1 rounded-[10px] overflow-x-auto"
        style={{ background: "var(--bg)", border: "1px solid var(--line)", scrollbarWidth: "none" }}
      >
        {categories.map((cat: any) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className="whitespace-nowrap px-3 py-1.5 rounded-[7px] text-[12px] font-medium transition-all flex-shrink-0"
            style={{
              background: activeTab === cat ? "var(--card)" : "transparent",
              color: activeTab === cat ? "var(--ink-1)" : "var(--ink-4)",
              boxShadow: activeTab === cat ? "var(--shadow-xs)" : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-[12px] bg-[#f7f7f5] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--ink-4)" }}>
          <p className="text-sm">No series found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function SeriesCard({ series: s }: { series: any }) {
  return (
    <div className="card flex flex-col rounded-[12px] border border-[#e6e6e6] bg-white hover:border-black transition-colors duration-200" style={{ padding: "18px 20px 16px" }}>
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-full bg-[#f7f7f5] border border-[#e6e6e6] text-[#6b7280] uppercase">
          {s.exam?.shortName?.toUpperCase() || "EXAM"}
        </span>
        {s.isFeatured && (
          <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-full bg-black text-white uppercase">
            Featured
          </span>
        )}
        {!s.isPaid && (
          <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-full bg-[#f7f7f5] border border-[#e6e6e6] text-[#6b7280] uppercase">
            Free
          </span>
        )}
      </div>

      <h3 className="text-[14px] font-semibold leading-snug mb-3 min-h-[40px]"
          style={{ color: "var(--ink-1)" }}>
        {s.title}
      </h3>

      <div className="flex items-center gap-3 text-[11px] mb-4 text-[#6b7280]">
        <span className="inline-flex items-center gap-1">
          <FileText size={11} /> {s.totalTests} tests
        </span>
        <span className="inline-flex items-center gap-1 ml-auto">
          <Star size={11} className="fill-[#6b7280] text-[#6b7280]" /> 4.8
        </span>
      </div>

      <div className="flex-1" />

      <div className="mt-2 flex flex-col gap-2">
        <Link
          href={`/dashboard/series/${s.id}`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[13px] font-medium text-white bg-black hover:bg-[#1a1a1a] transition-colors"
          style={{ fontWeight: 480 }}
        >
          View Tests →
        </Link>
        {s.isPaid && (
          <Link
            href={`/dashboard/checkout/${encodeURIComponent(`TEST_SERIES:${s.id}`)}`}
            className="flex items-center justify-center gap-1.5 py-2 rounded-full text-[12px] font-medium border border-[#e6e6e6] text-[#6b7280] hover:border-black hover:text-black transition-colors"
          >
            <ShoppingCart size={12} /> Buy to Unlock
          </Link>
        )}
      </div>
    </div>
  );
}

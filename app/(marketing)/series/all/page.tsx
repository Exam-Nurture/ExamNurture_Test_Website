"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, BookOpen, Zap, ArrowRight, FileText, GraduationCap } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface TestSeries {
  id: string;
  title: string;
  description?: string;
  totalTests: number;
  tierRequired: number;
  isPaid: boolean;
  isFeatured: boolean;
  bannerUrl?: string;
  price: number;
  discountedPrice?: number;
  exam: { id: string; name: string; shortName: string; tier: number };
}

export default function AllTestSeriesPage() {
  const [series, setSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/test-series?limit=100`)
      .then(r => r.json())
      .then(d => setSeries(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = series.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.exam.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">

      {/* Header */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-5">
          <BookOpen className="w-3 h-3" /> Test Series
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          All Test Series
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Practice with full-length mock tests across all major government exams.
          Start free, unlock more with a subscription.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm mb-8 max-w-xl">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by exam or series name…"
          className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No test series found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Banner */}
              <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />

              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {s.title}
                  </h3>
                  {s.isFeatured && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded-full border border-amber-200 whitespace-nowrap">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                  <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full">{s.exam.shortName}</span>
                  <span>{s.totalTests} Tests</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                  <div>
                    {s.isPaid ? (
                      <div>
                        <div className="text-xs text-gray-400 line-through">₹{s.price}</div>
                        <div className="text-lg font-black text-gray-900">₹{s.discountedPrice ?? s.price}</div>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
                        Free
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/series/${s.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all"
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

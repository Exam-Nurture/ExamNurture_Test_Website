"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, FileText, ArrowRight, Filter, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
const YEARS = ["All Years", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

interface PYQPaper {
  id: string;
  title: string;
  year: number;
  totalQuestions: number;
  durationSec?: number;
  isActive: boolean;
  exam: { id: string; name: string };
}

export default function AllPYQPage() {
  const [papers, setPapers] = useState<PYQPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("All Years");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "100" });
    if (year !== "All Years") params.set("year", year);
    fetch(`${API_URL}/pyq?${params}`)
      .then(r => r.json())
      .then(d => setPapers(d.items || []))
      .finally(() => setLoading(false));
  }, [year]);

  const filtered = papers.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.exam?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">

      {/* Header */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-600 text-xs font-bold uppercase tracking-widest mb-5">
          <FileText className="w-3 h-3" /> Previous Year Papers
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          All PYQ Papers
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Solve authentic previous year exam papers with full explanations.
          The fastest way to understand the real exam pattern.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by exam or paper name…"
            className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="text-sm outline-none bg-transparent text-gray-700 font-medium"
          >
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No PYQ papers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((paper, idx) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                    {paper.title}
                  </h3>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full border border-amber-100 whitespace-nowrap shrink-0">
                    {paper.year}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                  <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full">{paper.exam?.name}</span>
                  <span>{paper.totalQuestions} Questions</span>
                  {paper.durationSec && <span>{Math.round(paper.durationSec / 60)} min</span>}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-50">
                  <Link
                    href={`/pyq/${paper.id}`}
                    className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all"
                  >
                    Attempt Paper <ArrowRight className="w-3.5 h-3.5" />
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

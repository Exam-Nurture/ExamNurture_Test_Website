"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, X, ChevronRight, Flame, Layers, 
  Map, Building2, GraduationCap, ArrowRight,
  TrendingUp, Globe, Star, BookOpen, FileText
} from "lucide-react";
import {
  STATES, BOARDS, getAllExams,
  type CatalogueBoard, type CatalogueExam, type CatalogueState
} from "@/lib/data/examCatalogue";

/* ── popular exam card ── */
function PopularExamCard({ exam, state, board }: { exam: CatalogueExam; state?: CatalogueState; board?: CatalogueBoard }) {
  return (
    <Link href={`/exams/${exam.id}`} className="group relative flex flex-col p-4 rounded-2xl transition-all border border-transparent hover:border-blue-200/50 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--line-soft)" }}>
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all duration-500 rounded-full" />
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-black"
          style={{ background: board?.colorSoft, color: board?.color }}>
          {board?.name.slice(0, 2)}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-600">
          <Flame size={10} /> Popular
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-[15px] font-bold text-[var(--ink-1)] group-hover:text-blue-600 transition-colors leading-tight mb-1">
          {exam.shortName}
        </h3>
        <p className="text-[11px] text-[var(--ink-4)] mb-3">
          {board?.name} · {state?.name}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--line-soft)]">
          <span className="text-[11px] font-semibold text-[var(--ink-3)]">
            {exam.testCount} Tests
          </span>
          <ChevronRight size={14} className="text-[var(--ink-4)] group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/* ── board item (drill-down style) ── */
function BoardItem({ board, onSelect }: { board: CatalogueBoard; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="group w-full flex items-center gap-4 p-4 rounded-2xl transition-all border border-transparent hover:border-blue-100 hover:bg-blue-50/30 text-left"
      style={{ background: "var(--card)", border: "1px solid var(--line-soft)" }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[16px] font-black shrink-0 transition-transform group-hover:scale-110 duration-300"
        style={{ background: board.colorSoft, color: board.color }}>
        {board.name.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-[var(--ink-1)] group-hover:text-blue-600 transition-colors">
          {board.name}
        </h3>
        <p className="text-[11px] text-[var(--ink-4)] truncate mt-0.5">
          {board.fullName}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--ink-3)] group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
          {board.exams.length} Exams
        </span>
        <ChevronRight size={16} className="text-[var(--ink-4)] group-hover:text-blue-500 transition-all" />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   Main Page
   Flow: Division (Central/State) -> Boards -> Exams
═══════════════════════════════════════════════ */
export default function ExamsPage() {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<"central" | "state">("central");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<CatalogueBoard | null>(null);

  const allExams = useMemo(() => getAllExams(), []);
  const popularExams = useMemo(() => allExams.filter(e => e.popular).slice(0, 4), [allExams]);

  /* Search results */
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allExams.filter((e) =>
      e.name.toLowerCase().includes(q) ||
      e.shortName.toLowerCase().includes(q) ||
      e.subjects.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [query, allExams]);

  /* Filter states */
  const states = useMemo(() => STATES.filter(s => s.id !== "central"), []);

  /* Reset drill-down when division changes */
  const handleDivisionChange = (div: "central" | "state") => {
    setDivision(div);
    setSelectedState(div === "state" ? states[0].id : null);
    setSelectedBoard(null);
  };

  /* Navigation path helpers */
  const boards = useMemo(() => {
    if (division === "central") return BOARDS.filter(b => b.stateId === "central");
    return BOARDS.filter(b => b.stateId === selectedState);
  }, [division, selectedState]);

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 fade-up">
      
      {/* ── HEADER ── */}
      <div className="mb-12 text-center">
        <h1 className="text-[32px] sm:text-[42px] font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
          Browse <span className="text-blue-600">Exams</span>
        </h1>
        <p className="text-[15px] text-[var(--ink-3)] max-w-xl mx-auto">
          Explore a wide range of central and state level competitive exams with comprehensive study materials and mock tests.
        </p>

        {/* ── SEARCH BAR ── */}
        <div className="relative mt-8 max-w-[640px] mx-auto group">
          <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-3 px-5 py-4 rounded-2xl transition-all shadow-sm group-focus-within:shadow-xl group-focus-within:shadow-blue-500/10"
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--line-soft)",
            }}>
            <Search className="text-blue-500" size={20} />
            <input
              type="text"
              placeholder="Search JPSC, SSC CGL, RRB, Banking..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium"
              style={{ color: "var(--ink-1)" }}
            />
            {query && (
              <button onClick={() => setQuery("")} className="p-1.5 rounded-full hover:bg-[var(--bg)]">
                <X size={14} className="text-[var(--ink-4)]" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {query && (
            <div className="absolute top-full left-0 right-0 mt-3 rounded-2xl overflow-hidden z-30 shadow-2xl shadow-black/10 animate-in slide-in-from-top-2 duration-200"
              style={{ background: "var(--card)", border: "1px solid var(--line-soft)" }}>
              {searchResults.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.map((exam) => {
                    const board = BOARDS.find(b => b.id === exam.boardId);
                    return (
                      <Link key={exam.id} href={`/exams/${exam.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50/50 transition-colors border-b border-[var(--line-soft)] last:border-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0"
                          style={{ background: board?.colorSoft, color: board?.color }}>
                          {board?.name.slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-[var(--ink-1)]">{exam.shortName}</p>
                          <p className="text-[11px] text-[var(--ink-4)]">{board?.name} · {exam.eligibility}</p>
                        </div>
                        <ChevronRight size={16} className="text-[var(--ink-4)]" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center text-[var(--ink-3)] text-[14px]">No exams found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {!query && (
        <div className="space-y-12">
          
          {/* ── POPULAR EXAMS ── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                <TrendingUp size={18} />
              </div>
              <h2 className="text-[18px] font-bold text-[var(--ink-1)]">Popular Exams</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularExams.map(exam => (
                <PopularExamCard 
                  key={exam.id} 
                  exam={exam} 
                  board={BOARDS.find(b => b.id === exam.boardId)}
                  state={STATES.find(s => s.id === exam.stateId)}
                />
              ))}
            </div>
          </section>

          {/* ── DRILL DOWN FLOW ── */}
          <section className="bg-[var(--card)] rounded-3xl p-6 sm:p-8 border border-[var(--line-soft)] shadow-sm">
            
            {/* 1. Division Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-[20px] font-bold text-[var(--ink-1)]">All Exams</h2>
                <p className="text-[13px] text-[var(--ink-3)] mt-1">Browse by government division</p>
              </div>
              
              <div className="inline-flex p-1 rounded-xl bg-[var(--bg)] border border-[var(--line-soft)]">
                <button
                  onClick={() => handleDivisionChange("central")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all ${division === "central" ? "bg-white text-blue-600 shadow-sm" : "text-[var(--ink-3)] hover:text-[var(--ink-1)]"}`}
                >
                  <Building2 size={16} /> Central Govt
                </button>
                <button
                  onClick={() => handleDivisionChange("state")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all ${division === "state" ? "bg-white text-blue-600 shadow-sm" : "text-[var(--ink-3)] hover:text-[var(--ink-1)]"}`}
                >
                  <Globe size={16} /> State Govt
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: State Selection (if division is state) */}
              {division === "state" && (
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2">Select State</p>
                  {states.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => { setSelectedState(state.id); setSelectedBoard(null); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-bold transition-all text-left ${selectedState === state.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-[var(--bg)] text-[var(--ink-3)]"}`}
                    >
                      <span className="text-[16px]">{state.emoji}</span>
                      {state.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Right Column: Boards & Exams */}
              <div className={division === "state" ? "lg:col-span-9" : "lg:col-span-12"}>
                {!selectedBoard ? (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)]">Examination Boards</p>
                      <span className="text-[11px] font-medium text-[var(--ink-4)]">{boards.length} available</span>
                    </div>
                    <div className={`grid grid-cols-1 ${division === "central" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
                      {boards.map(board => (
                        <BoardItem key={board.id} board={board} onSelect={() => setSelectedBoard(board)} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    {/* Breadcrumb / Back button */}
                    <button 
                      onClick={() => setSelectedBoard(null)}
                      className="flex items-center gap-2 text-[12px] font-bold text-blue-600 mb-6 hover:translate-x-[-4px] transition-transform"
                    >
                      ← Back to Boards
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[20px] font-black"
                        style={{ background: selectedBoard.colorSoft, color: selectedBoard.color }}>
                        {selectedBoard.name.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-[20px] font-bold text-[var(--ink-1)]">{selectedBoard.name}</h3>
                        <p className="text-[13px] text-[var(--ink-3)]">{selectedBoard.fullName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedBoard.exams.map(exam => (
                        <Link key={exam.id} href={`/exams/${exam.id}`} 
                          className="group flex flex-col p-5 rounded-2xl border border-[var(--line-soft)] bg-[var(--bg)] hover:bg-white hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-500/5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[16px] font-bold text-[var(--ink-1)] group-hover:text-blue-600 transition-colors">{exam.shortName}</h4>
                            {exam.popular && <Flame size={14} className="text-amber-500" />}
                          </div>
                          <p className="text-[12px] text-[var(--ink-4)] mb-4 line-clamp-1">{exam.name}</p>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex gap-4">
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ink-3)]">
                                <BookOpen size={12} /> {exam.testCount} Tests
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ink-3)]">
                                <FileText size={12} /> {exam.pyqCount} PYQs
                              </div>
                            </div>
                            <div className="p-1.5 rounded-full bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight size={14} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="h-20" />
    </div>
  );
}

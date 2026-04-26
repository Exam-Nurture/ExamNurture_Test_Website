"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search, Clock, Bookmark, BookmarkCheck, X,
  BookOpen, Filter, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ARTICLES, BOARD_OPTIONS, SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS, TYPE_OPTIONS,
  type Article,
} from "./data";
import { EXAM_BOARDS } from "@/lib/data/examData";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const TABS = ["All", "By Exam", "By Subject", "By Topic"] as const;
type Tab = (typeof TABS)[number];

const DIFF_DOT: Record<string, string> = {
  Easy: "var(--green)", Medium: "var(--amber)", Hard: "var(--red)",
};

const TYPE_LABEL: Record<string, string> = {
  Concept: "CONCEPT", Formula: "FORMULA", Revision: "REVISION", Strategy: "STRATEGY",
};

const PAGE_SIZE = 8;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const saved = localStorage.getItem("library-bookmarks");
      if (saved) setBookmarks(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);
  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("library-bookmarks", JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Toggle helper
  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const hasAnyFilter = selectedBoards.length + selectedSubjects.length + selectedDifficulty.length + selectedType.length > 0;
  const clearAll = () => {
    setSelectedBoards([]); setSelectedSubjects([]); setSelectedDifficulty([]); setSelectedType([]);
  };

  // Filtering
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ARTICLES.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q) && !a.topic_tags.some((t) => t.toLowerCase().includes(q))) return false;
      if (selectedBoards.length > 0 && !a.boardIds.some((b) => selectedBoards.includes(b))) return false;
      if (selectedSubjects.length > 0 && !a.subject_tags.some((s) => selectedSubjects.includes(s))) return false;
      if (selectedDifficulty.length > 0 && !selectedDifficulty.includes(a.difficulty)) return false;
      if (selectedType.length > 0 && !selectedType.includes(a.type)) return false;
      return true;
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [query, selectedBoards, selectedSubjects, selectedDifficulty, selectedType]);

  // Continue reading
  const continueReading = ARTICLES.filter((a) => a.progress && a.progress > 0 && a.progress < 100);

  // Grouped views
  const groupBy = (key: "boardIds" | "subject_tags" | "topic_tags") => {
    const groups: Record<string, Article[]> = {};
    filtered.forEach((a) => {
      const tags = a[key];
      tags.forEach((t) => {
        const label = key === "boardIds" ? (EXAM_BOARDS.find((b) => b.id === t)?.shortName ?? t) : t;
        (groups[label] ??= []).push(a);
      });
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-0 fade-up" style={{ maxWidth: 720, margin: "0 auto" }}>

      {/* ── Hero ── */}
      <div className="pt-2 pb-8" style={{ borderBottom: "1px solid var(--line-soft)" }}>
        <h1
          className="text-4xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
        >
          Library
        </h1>
        <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--ink-3)" }}>
          Curated articles, formulas, strategies & revision notes to sharpen your preparation.
        </p>
      </div>

      {/* ── Search ── */}
      <div className="py-5" style={{ borderBottom: "1px solid var(--line-soft)" }}>
        <div className="flex items-center gap-3">
          <Search size={16} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="flex-1 bg-transparent border-none outline-none text-base"
            style={{ color: "var(--ink-1)" }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-[var(--line-soft)]">
              <X size={14} style={{ color: "var(--ink-4)" }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs + Filter Toggle ── */}
      <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid var(--line-soft)" }}>
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setVisibleCount(PAGE_SIZE); }}
              className="px-3 py-1.5 rounded-md text-[13px] font-medium transition-all"
              style={{
                color: tab === t ? "var(--ink-1)" : "var(--ink-4)",
                background: tab === t ? "var(--line-soft)" : "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 text-[13px] font-medium transition-all px-3 py-1.5 rounded-md"
          style={{
            color: showFilters || hasAnyFilter ? "var(--blue)" : "var(--ink-4)",
            background: showFilters || hasAnyFilter ? "var(--blue-soft)" : "transparent",
          }}
        >
          <Filter size={13} />
          Filters
          {hasAnyFilter && (
            <span
              className="ml-0.5 w-[18px] h-[18px] rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ background: "var(--blue)" }}
            >
              {selectedBoards.length + selectedSubjects.length + selectedDifficulty.length + selectedType.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Filter Panel ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-5 flex flex-col gap-5" style={{ borderBottom: "1px solid var(--line-soft)" }}>
              <PillGroup label="Exam Board" options={BOARD_OPTIONS.map((b) => b.label)} selected={selectedBoards.map((id) => BOARD_OPTIONS.find((b) => b.id === id)?.label ?? id)} onToggle={(label) => { const opt = BOARD_OPTIONS.find((b) => b.label === label); if (opt) toggle(selectedBoards, opt.id, setSelectedBoards); }} />
              <PillGroup label="Subject" options={SUBJECT_OPTIONS} selected={selectedSubjects} onToggle={(v) => toggle(selectedSubjects, v, setSelectedSubjects)} />
              <PillGroup label="Difficulty" options={DIFFICULTY_OPTIONS} selected={selectedDifficulty} onToggle={(v) => toggle(selectedDifficulty, v, setSelectedDifficulty)} />
              <PillGroup label="Type" options={TYPE_OPTIONS} selected={selectedType} onToggle={(v) => toggle(selectedType, v, setSelectedType)} />
              {hasAnyFilter && (
                <button onClick={clearAll} className="self-start text-[12px] font-medium" style={{ color: "var(--red)" }}>
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Applied chips (when panel closed) ── */}
      {hasAnyFilter && !showFilters && (
        <div className="flex flex-wrap gap-2 items-center py-4" style={{ borderBottom: "1px solid var(--line-soft)" }}>
          {[...selectedBoards.map((id) => BOARD_OPTIONS.find((b) => b.id === id)?.label ?? id), ...selectedSubjects, ...selectedDifficulty, ...selectedType].map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-70"
              style={{ background: "var(--line-soft)", color: "var(--ink-2)" }}
              onClick={() => {
                const boardOpt = BOARD_OPTIONS.find((b) => b.label === chip);
                if (boardOpt && selectedBoards.includes(boardOpt.id)) toggle(selectedBoards, boardOpt.id, setSelectedBoards);
                else if (selectedSubjects.includes(chip)) toggle(selectedSubjects, chip, setSelectedSubjects);
                else if (selectedDifficulty.includes(chip)) toggle(selectedDifficulty, chip, setSelectedDifficulty);
                else if (selectedType.includes(chip)) toggle(selectedType, chip, setSelectedType);
              }}
            >
              {chip} <X size={10} />
            </span>
          ))}
          <button onClick={clearAll} className="text-[11px] ml-1" style={{ color: "var(--ink-4)" }}>Clear</button>
        </div>
      )}

      {/* ── Continue Reading ── */}
      {tab === "All" && !query && !hasAnyFilter && continueReading.length > 0 && (
        <div className="py-6" style={{ borderBottom: "1px solid var(--line-soft)" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--ink-4)" }}>
            Continue reading
          </h2>
          <div className="flex flex-col gap-0">
            {continueReading.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <ArticleRow article={a} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} showProgress />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Result count ── */}
      <div className="pt-6 pb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
          {tab === "All" ? (query || hasAnyFilter ? "Results" : "All articles") : tab.replace("By ", "")}
          {" "}
          <span className="font-normal">— {filtered.length}</span>
        </span>
      </div>

      {/* ── Content ── */}
      {tab === "All" ? (
        filtered.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            <motion.div
              initial="hidden" animate="show"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
              className="flex flex-col"
            >
              {visible.map((a) => (
                <motion.div key={a.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}>
                  <ArticleRow article={a} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />
                </motion.div>
              ))}
            </motion.div>
            {hasMore && (
              <div className="py-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="text-[13px] font-medium transition-all hover:underline"
                  style={{ color: "var(--blue)" }}
                >
                  Show more articles ↓
                </button>
              </div>
            )}
          </>
        )
      ) : (
        <GroupedView
          entries={groupBy(tab === "By Exam" ? "boardIds" : tab === "By Subject" ? "subject_tags" : "topic_tags")}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
        />
      )}

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Pill Group (filter row)
───────────────────────────────────────────── */
function PillGroup({ label, options, selected, onToggle }: {
  label: string; options: string[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--ink-4)" }}>{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
              style={{
                background: on ? "var(--ink-1)" : "transparent",
                color: on ? "var(--card)" : "var(--ink-3)",
                border: `1px solid ${on ? "var(--ink-1)" : "var(--line)"}`,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Article Row — Medium-style
───────────────────────────────────────────── */
function ArticleRow({ article: a, bookmarks, onToggleBookmark, showProgress }: {
  article: Article; bookmarks: Set<string>; onToggleBookmark: (id: string) => void; showProgress?: boolean;
}) {
  const isMarked = bookmarks.has(a.id);

  return (
    <article
      className="group flex flex-col gap-2 py-6 cursor-pointer transition-colors"
      style={{ borderBottom: "1px solid var(--line-soft)" }}
    >
      {/* Meta line */}
      <div className="flex items-center gap-2 text-[11px] font-medium" style={{ color: "var(--ink-4)" }}>
        <span className="uppercase tracking-wider font-semibold" style={{ color: "var(--ink-3)" }}>
          {a.subject_tags[0]}
        </span>
        <span>·</span>
        <span>{TYPE_LABEL[a.type]}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: DIFF_DOT[a.difficulty] }} />
          {a.difficulty}
        </span>
        <span>·</span>
        <span>{formatDate(a.publishedAt)}</span>
      </div>

      {/* Title */}
      <h3
        className="text-[18px] font-bold leading-snug group-hover:text-[var(--blue)] transition-colors"
        style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}
      >
        {a.title}
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-relaxed line-clamp-2" style={{ color: "var(--ink-3)" }}>
        {a.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-1">
        {/* Tags */}
        <div className="flex items-center gap-1.5">
          {a.boardIds.slice(0, 3).map((bid) => {
            const board = EXAM_BOARDS.find((b) => b.id === bid);
            return (
              <span
                key={bid}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: "var(--line-soft)", color: "var(--ink-3)" }}
              >
                {board?.shortName ?? bid}
              </span>
            );
          })}
        </div>

        <span className="text-[12px] inline-flex items-center gap-1" style={{ color: "var(--ink-4)" }}>
          <Clock size={12} /> {a.readTime}
        </span>

        {/* Progress */}
        {showProgress && a.progress !== undefined && a.progress > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 rounded-full" style={{ background: "var(--line-soft)" }}>
              <div className="h-full rounded-full" style={{ width: `${a.progress}%`, background: "var(--blue)" }} />
            </div>
            <span className="text-[10px] font-semibold tabular-nums" style={{ color: "var(--blue)" }}>{a.progress}%</span>
          </div>
        )}

        {/* Spacer + Bookmark */}
        <div className="flex-1" />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(a.id); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all hover:bg-[var(--line-soft)]"
          title={isMarked ? "Remove bookmark" : "Save for later"}
        >
          {isMarked ? (
            <BookmarkCheck size={16} style={{ color: "var(--blue)" }} />
          ) : (
            <Bookmark size={16} style={{ color: "var(--ink-4)" }} />
          )}
        </button>

        <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "var(--ink-4)" }} />
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   Grouped View
───────────────────────────────────────────── */
function GroupedView({ entries, bookmarks, onToggleBookmark }: {
  entries: [string, Article[]][]; bookmarks: Set<string>; onToggleBookmark: (id: string) => void;
}) {
  if (entries.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col">
      {entries.map(([group, articles]) => (
        <div key={group}>
          <div className="flex items-center gap-3 pt-8 pb-2" style={{ borderBottom: "1px solid var(--line)" }}>
            <h2 className="text-[15px] font-bold" style={{ color: "var(--ink-1)", fontFamily: "var(--font-sora)" }}>{group}</h2>
            <span className="text-[11px] font-medium" style={{ color: "var(--ink-4)" }}>{articles.length}</span>
          </div>
          {articles.map((a) => (
            <ArticleRow key={a.id} article={a} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
function EmptyState({ query }: { query?: string }) {
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center">
      <BookOpen size={32} style={{ color: "var(--ink-4)" }} />
      <p className="text-[15px] font-medium" style={{ color: "var(--ink-3)" }}>
        {query ? `No articles matching "${query}"` : "No articles found"}
      </p>
      <p className="text-[13px] max-w-sm" style={{ color: "var(--ink-4)" }}>
        Try adjusting your search or filters.
      </p>
    </div>
  );
}

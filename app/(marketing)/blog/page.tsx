"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Clock, Eye, Calendar, ArrowRight, Rss, BookOpen,
  TrendingUp, Sparkles, Filter, ChevronLeft, ChevronRight,
} from "lucide-react";
import { apiGetBlogs, type PublicBlogPost } from "@/lib/api";

/* ── Category config ── */
const CATEGORIES = [
  { key: "All",            label: "All Posts",       color: "#3B82F6" },
  { key: "General",        label: "General",          color: "#64748B" },
  { key: "Current Affairs",label: "Current Affairs",  color: "#10B981" },
  { key: "Strategy",       label: "Strategy",         color: "#8B5CF6" },
  { key: "Concept",        label: "Concepts",         color: "#0891B2" },
  { key: "Formula",        label: "Formulas",         color: "#EC4899" },
  { key: "Revision",       label: "Revision",         color: "#F59E0B" },
  { key: "News",           label: "News",             color: "#F97316" },
  { key: "Announcement",   label: "Announcements",    color: "#EF4444" },
];

const CAT_GRADIENTS: Record<string, string> = {
  "General":         "linear-gradient(135deg,#3B82F6,#6366F1)",
  "Current Affairs": "linear-gradient(135deg,#10B981,#059669)",
  "Strategy":        "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  "Concept":         "linear-gradient(135deg,#0891B2,#1E40AF)",
  "Formula":         "linear-gradient(135deg,#EC4899,#8B5CF6)",
  "Revision":        "linear-gradient(135deg,#F59E0B,#F97316)",
  "News":            "linear-gradient(135deg,#F97316,#EF4444)",
  "Announcement":    "linear-gradient(135deg,#EF4444,#BE185D)",
};

function getCatColor(cat: string) {
  return CATEGORIES.find((c) => c.key === cat)?.color ?? "#64748B";
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function parseTags(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

/* ── Blog Card ── */
function BlogCard({ post }: { post: PublicBlogPost }) {
  const gradient = CAT_GRADIENTS[post.category] ?? CAT_GRADIENTS["General"];
  const tags = parseTags(post.tags).slice(0, 2);
  const catColor = getCatColor(post.category);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      {/* Cover */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: gradient }}>
            <BookOpen size={48} className="text-white/30" strokeWidth={1} />
          </div>
        )}
        {/* Category badge overlay */}
        <span
          className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white backdrop-blur-sm"
          style={{ background: `${catColor}cc` }}
        >
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-base font-bold leading-snug line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: gradient }}>
              {post.author[0]?.toUpperCase() ?? "E"}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">{post.author}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readTimeMin} min
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
          Read more <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

/* ── Featured Card (large) ── */
function FeaturedCard({ post }: { post: PublicBlogPost }) {
  const gradient = CAT_GRADIENTS[post.category] ?? CAT_GRADIENTS["General"];
  const catColor = getCatColor(post.category);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col md:flex-row bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200"
    >
      <div className="relative md:w-2/5 h-56 md:h-auto shrink-0 overflow-hidden">
        {post.coverUrl ? (
          <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: gradient }}>
            <Sparkles size={64} className="text-white/25" strokeWidth={1} />
          </div>
        )}
        <span className="absolute top-4 left-4 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: `${catColor}dd` }}>
          {post.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-6 md:p-8 gap-4">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          <TrendingUp size={12} /> Featured
        </div>
        <h2 className="text-xl md:text-2xl font-bold leading-snug text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: gradient }}>
              {post.author[0]?.toUpperCase()}
            </div>
            {post.author}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(post.publishedAt)}</span>
          )}
          <span className="flex items-center gap-1"><Clock size={11} />{post.readTimeMin} min read</span>
          <span className="flex items-center gap-1"><Eye size={11} />{post.viewCount.toLocaleString()}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all">
          Read full article <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

/* ── Main Page ── */
const LIMIT = 12;

export default function BlogPage() {
  const [posts, setPosts] = useState<PublicBlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number, cat: string) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: LIMIT };
      if (cat !== "All") params.category = cat;
      const res = await apiGetBlogs(params);
      setPosts(res.items);
      setTotal(res.total);
    } catch {
      setPosts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, category); }, [page, category, load]);

  function handleCategory(cat: string) {
    setCategory(cat);
    setPage(1);
  }

  const totalPages = Math.ceil(total / LIMIT);
  const filtered = query.trim()
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.excerpt ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: "var(--line)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(59,130,246,0.08) 0%,transparent 70%)"
        }} />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center relative">
          <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border"
            style={{ background: "rgba(59,130,246,0.06)", color: "var(--blue)", borderColor: "rgba(59,130,246,0.15)" }}>
            <Rss size={13} /> ExamNurture Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: "var(--ink-1)" }}>
            Insights, Strategies &{" "}
            <span style={{ color: "var(--blue)" }}>Exam Updates</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "var(--ink-3)" }}>
            Expert articles, current affairs, exam strategies, and study tips for government competitive exams across India.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-3)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--ink-1)" }}
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
          <Filter size={14} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
          {CATEGORIES.map((c) => {
            const active = c.key === category;
            return (
              <button
                key={c.key}
                onClick={() => handleCategory(c.key)}
                className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: active ? c.color : "var(--card)",
                  color: active ? "#fff" : "var(--ink-2)",
                  border: active ? `1.5px solid ${c.color}` : "1.5px solid var(--line)",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border animate-pulse" style={{ borderColor: "var(--line)" }}>
                <div className="h-44 w-full" style={{ background: "var(--line)" }} />
                <div className="p-5 space-y-3">
                  <div className="h-4 rounded w-3/4" style={{ background: "var(--line)" }} />
                  <div className="h-3 rounded w-full" style={{ background: "var(--line)" }} />
                  <div className="h-3 rounded w-5/6" style={{ background: "var(--line)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <BookOpen size={48} strokeWidth={1} style={{ color: "var(--ink-3)" }} />
            <p className="text-lg font-semibold" style={{ color: "var(--ink-2)" }}>No articles found</p>
            <p className="text-sm" style={{ color: "var(--ink-3)" }}>
              {query ? "Try a different search term." : "Check back soon — new articles are on their way!"}
            </p>
            {(query || category !== "All") && (
              <button
                onClick={() => { setQuery(""); setCategory("All"); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white mt-2"
                style={{ background: "var(--blue)" }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && !query && page === 1 && category === "All" && (
              <div className="mb-8">
                <FeaturedCard post={featured} />
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(query || page > 1 || category !== "All" ? filtered : rest).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between mt-6 text-xs" style={{ color: "var(--ink-3)" }}>
              <span>
                Showing {filtered.length} of {total} article{total !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> Page {page} of {totalPages || 1}
              </span>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 transition-all"
                  style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
                >
                  <ChevronLeft size={15} /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="w-8 h-8 rounded-lg text-sm font-semibold transition-all"
                        style={{
                          background: p === page ? "var(--blue)" : "var(--card)",
                          color: p === page ? "#fff" : "var(--ink-2)",
                          border: "1px solid var(--line)",
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 transition-all"
                  style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

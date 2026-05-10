"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  apiAdminGetBlogs, apiAdminCreateBlog, apiAdminUpdateBlog, apiAdminDeleteBlog,
  AdminBlogPost, AdminBlogPayload,
} from "@/lib/api";
import { AdminTable, Pagination, Modal, Field, Toggle } from "@/components/admin/AdminTable";

const CATEGORIES = ["General", "Current Affairs", "Strategy", "Concept", "Formula", "Revision", "News", "Announcement"];

const CAT_COLORS: Record<string, string> = {
  "General": "#3B82F6", "Current Affairs": "#10B981", "Strategy": "#8B5CF6",
  "Concept": "#0891B2", "Formula": "#EC4899", "Revision": "#F59E0B",
  "News": "#F97316", "Announcement": "#EF4444",
};

const emptyPayload = (): Partial<AdminBlogPayload> => ({
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverUrl: "",
  author: "ExamNurture Team",
  category: "General",
  tags: [],
  isPublished: false,
  readTimeMin: 5,
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--line)" }}>
      <span className="text-2xl font-extrabold" style={{ color: accent }}>{value}</span>
      <span className="text-xs font-medium" style={{ color: "var(--ink-3)" }}>{label}</span>
    </div>
  );
}

export default function AdminBlogsPage() {
  const [data, setData] = useState<{ items: AdminBlogPost[]; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<AdminBlogPayload>>(emptyPayload());
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  async function load(p = page) {
    setLoading(true);
    try {
      const res = await apiAdminGetBlogs({ page: p, limit: 25 });
      setData(res);
      /* Derive stats from current page items */
      const published = res.items.filter((b) => b.isPublished).length;
      const drafts = res.items.filter((b) => !b.isPublished).length;
      if (p === 1) { setPublishedCount(published); setDraftCount(drafts); }
    }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { load(); }, [page]);

  function set<K extends keyof AdminBlogPayload>(key: K, val: AdminBlogPayload[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function openCreate() {
    setForm(emptyPayload());
    setTagsInput("");
    setEditId(null);
    setModal("create");
  }

  function openEdit(post: AdminBlogPost) {
    let parsedTags: string[] = [];
    try { parsedTags = JSON.parse(post.tags); } catch { parsedTags = []; }
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverUrl: post.coverUrl ?? "",
      author: post.author,
      category: post.category,
      tags: parsedTags,
      isPublished: post.isPublished,
      readTimeMin: post.readTimeMin,
    });
    setTagsInput(parsedTags.join(", "));
    setEditId(post.id);
    setModal("edit");
  }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, tags, readTimeMin: Number(form.readTimeMin) };
      if (modal === "create") await apiAdminCreateBlog(payload as AdminBlogPayload);
      else await apiAdminUpdateBlog(editId!, payload);
      setModal(null);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(post: AdminBlogPost) {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await apiAdminDeleteBlog(post.id);
    load();
  }

  const total = data?.total ?? 0;

  const cols = [
    {
      key: "title", label: "Title",
      render: (p: AdminBlogPost) => (
        <div className="max-w-xs">
          <p className="font-semibold text-sm truncate" style={{ color: "var(--ink-1)" }}>{p.title}</p>
          <p className="text-[11px] font-mono truncate mt-0.5" style={{ color: "var(--ink-3)" }}>/blog/{p.slug}</p>
        </div>
      ),
    },
    {
      key: "category", label: "Category",
      render: (p: AdminBlogPost) => (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: CAT_COLORS[p.category] ?? "var(--blue)" }}>
          {p.category}
        </span>
      ),
    },
    { key: "author", label: "Author" },
    {
      key: "isPublished", label: "Status",
      render: (p: AdminBlogPost) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
          style={{
            background: p.isPublished ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
            color: p.isPublished ? "var(--green)" : "var(--amber)",
          }}>
          {p.isPublished ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "publishedAt", label: "Published",
      render: (p: AdminBlogPost) => p.publishedAt
        ? new Date(p.publishedAt).toLocaleDateString()
        : <span style={{ color: "var(--ink-3)" }}>—</span>,
    },
    {
      key: "viewCount", label: "Views",
      render: (p: AdminBlogPost) => (
        <span style={{ color: "var(--ink-2)" }}>{p.viewCount.toLocaleString()}</span>
      ),
    },
    {
      key: "preview", label: "",
      render: (p: AdminBlogPost) => p.isPublished ? (
        <Link
          href={`/blog/${p.slug}`}
          target="_blank"
          className="text-[11px] underline"
          style={{ color: "var(--blue)" }}
        >
          Preview ↗
        </Link>
      ) : null,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats header */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Posts" value={total} accent="var(--blue)" />
        <StatCard label="Published" value={publishedCount} accent="var(--green)" />
        <StatCard label="Drafts" value={draftCount} accent="var(--amber)" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base" style={{ color: "var(--ink-1)" }}>Blog Posts</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>
            Manage editorial articles, announcements, and exam updates
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "var(--blue)" }}
        >
          + New Post
        </button>
      </div>

      <AdminTable columns={cols} data={data?.items ?? []} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <Pagination page={page} total={total} limit={25} onChange={setPage} />

      {modal && (
        <Modal
          title={modal === "create" ? "New Blog Post" : `Edit — ${form.title}`}
          onClose={() => setModal(null)}
          wide
        >
          <form onSubmit={handleSave} className="space-y-3">
            <Field
              label="Title"
              name="title"
              value={form.title ?? ""}
              onChange={(v) => {
                set("title", v);
                if (modal === "create") set("slug", slugify(v));
              }}
              required
            />
            <Field
              label="Slug (auto-filled from title, URL-safe)"
              name="slug"
              value={form.slug ?? ""}
              onChange={(v) => set("slug", slugify(v))}
              required
              placeholder="e.g. jpsc-prelims-strategy-2025"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Category</label>
                <select
                  value={form.category ?? "General"}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Author" name="author" value={form.author ?? ""} onChange={(v) => set("author", v)} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Excerpt <span style={{ color: "var(--ink-3)" }}>(shown in listings)</span></label>
              <textarea
                value={form.excerpt ?? ""}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={2}
                placeholder="Brief summary shown on the blog listing page..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>
                Content <span style={{ color: "var(--red)" }}>*</span>
                <span className="ml-1 font-normal" style={{ color: "var(--ink-3)" }}>(HTML supported)</span>
              </label>
              <textarea
                value={form.content ?? ""}
                onChange={(e) => set("content", e.target.value)}
                rows={12}
                required
                placeholder="Write your blog content here. HTML tags like <p>, <h2>, <ul>, <strong>, <a> are supported..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono resize-y"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Cover Image URL" name="coverUrl" value={form.coverUrl ?? ""} onChange={(v) => set("coverUrl", v)} placeholder="https://..." />
              <Field
                label="Read Time (minutes)"
                name="readTimeMin"
                type="number"
                value={form.readTimeMin ?? 5}
                onChange={(v) => set("readTimeMin", parseInt(v) as unknown as AdminBlogPayload["readTimeMin"])}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Tags <span className="font-normal" style={{ color: "var(--ink-3)" }}>(comma-separated)</span></label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="JPSC, Current Affairs, Strategy, 2025"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }}
              />
            </div>

            <Toggle
              label="Publish immediately (will be visible on public blog)"
              checked={form.isPublished ?? false}
              onChange={(v) => set("isPublished", v)}
            />

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "var(--blue)" }}
              >
                {saving ? "Saving…" : modal === "create" ? "Create Post" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

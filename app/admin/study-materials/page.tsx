"use client";

import { useEffect, useState } from "react";
import {
  apiAdminGetStudyMaterials, apiAdminCreateStudyMaterial, apiAdminUpdateStudyMaterial, apiAdminDeleteStudyMaterial,
  apiAdminGetExams, AdminStudyMaterial, AdminExam,
} from "@/lib/api";
import { AdminTable, Pagination, Modal, Field, SelectField, Toggle } from "@/components/admin/AdminTable";

const empty = (): Partial<AdminStudyMaterial> => ({
  examId: "", subject: "", title: "", description: "", buyLink: "",
  language: "ENGLISH", pageCount: 0, coverUrl: "", tierRequired: 0, isActive: true, isFeatured: false,
});

export default function AdminStudyMaterialsPage() {
  const [data, setData] = useState<{ items: AdminStudyMaterial[]; total: number } | null>(null);
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<AdminStudyMaterial>>(empty());
  const [saving, setSaving] = useState(false);

  async function load(p = page) {
    setLoading(true);
    try { setData(await apiAdminGetStudyMaterials({ page: p })); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    apiAdminGetExams({ page: 1, limit: 200 }).then((r) => setExams(r.items));
    load();
  }, []);

  useEffect(() => { load(); }, [page]);

  function set(key: keyof AdminStudyMaterial, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, tierRequired: Number(form.tierRequired), pageCount: Number(form.pageCount) };
      if (modal === "create") await apiAdminCreateStudyMaterial(payload);
      else await apiAdminUpdateStudyMaterial(form.id!, payload);
      setModal(null);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(m: AdminStudyMaterial) {
    if (!confirm(`Delete "${m.title}"?`)) return;
    await apiAdminDeleteStudyMaterial(m.id);
    load();
  }

  const cols = [
    { key: "title", label: "Title" },
    { key: "subject", label: "Subject" },
    { key: "language", label: "Language" },
    { key: "tierRequired", label: "Tier", render: (m: AdminStudyMaterial) => `Tier ${m.tierRequired}` },
    {
      key: "isActive", label: "Active",
      render: (m: AdminStudyMaterial) => <span style={{ color: m.isActive ? "var(--green)" : "var(--red)" }}>{m.isActive ? "Yes" : "No"}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setForm(empty()); setModal("create"); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--blue)" }}>
          + Add Material
        </button>
      </div>

      <AdminTable columns={cols} data={data?.items ?? []} loading={loading}
        onEdit={(m) => { setForm({ ...m }); setModal("edit"); }}
        onDelete={handleDelete}
      />
      <Pagination page={page} total={data?.total ?? 0} limit={20} onChange={setPage} />

      {modal && (
        <Modal title={modal === "create" ? "Add Study Material" : `Edit — ${form.title}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <SelectField label="Exam" name="examId" value={form.examId ?? ""} onChange={(v) => set("examId", v)}
              options={exams.map((e) => ({ value: e.id, label: e.name }))} required />
            <Field label="Subject" name="subject" value={form.subject ?? ""} onChange={(v) => set("subject", v)} required />
            <Field label="Title" name="title" value={form.title ?? ""} onChange={(v) => set("title", v)} required />
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Description</label>
              <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }} />
            </div>
            <SelectField label="Language" name="language" value={form.language ?? "ENGLISH"}
              onChange={(v) => set("language", v)}
              options={["ENGLISH", "HINDI", "BILINGUAL"].map((l) => ({ value: l, label: l }))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Page Count" name="pageCount" type="number" value={form.pageCount ?? 0} onChange={(v) => set("pageCount", parseInt(v))} />
              <SelectField label="Tier Required" name="tierRequired" value={String(form.tierRequired ?? 0)}
                onChange={(v) => set("tierRequired", parseInt(v))}
                options={[0, 1, 2, 3].map((n) => ({ value: n, label: n === 0 ? "Free" : `Tier ${n}` }))} />
            </div>
            <Field label="Cover URL" name="coverUrl" value={form.coverUrl ?? ""} onChange={(v) => set("coverUrl", v)} />
            <Field label="Buy Link" name="buyLink" value={form.buyLink ?? ""} onChange={(v) => set("buyLink", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Toggle label="Featured" checked={form.isFeatured ?? false} onChange={(v) => set("isFeatured", v)} />
              <Toggle label="Active" checked={form.isActive ?? true} onChange={(v) => set("isActive", v)} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: "var(--blue)" }}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg text-sm" style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

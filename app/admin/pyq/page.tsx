"use client";

import { useEffect, useState } from "react";
import {
  apiAdminGetPYQ, apiAdminCreatePYQ, apiAdminUpdatePYQ, apiAdminDeletePYQ,
  apiAdminGetExams, AdminPYQPaper, AdminExam,
} from "@/lib/api";
import { AdminTable, Pagination, Modal, Field, SelectField, Toggle } from "@/components/admin/AdminTable";

const empty = (): Partial<AdminPYQPaper> => ({
  examId: "", title: "", year: new Date().getFullYear(), shift: "",
  totalQs: 0, durationMin: 0, pdfUrl: "", type: "OBJECTIVE",
  hasSolutions: false, tierRequired: 0, isActive: true,
});

export default function AdminPYQPage() {
  const [data, setData] = useState<{ items: AdminPYQPaper[]; total: number } | null>(null);
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<AdminPYQPaper>>(empty());
  const [saving, setSaving] = useState(false);

  async function load(p = page) {
    setLoading(true);
    try { setData(await apiAdminGetPYQ({ page: p })); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    apiAdminGetExams({ page: 1, limit: 200 }).then((r) => setExams(r.items));
    load();
  }, []);

  useEffect(() => { load(); }, [page]);

  function set(key: keyof AdminPYQPaper, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, year: Number(form.year), totalQs: Number(form.totalQs), durationMin: Number(form.durationMin), tierRequired: Number(form.tierRequired) };
      if (modal === "create") await apiAdminCreatePYQ(payload);
      else await apiAdminUpdatePYQ(form.id!, payload);
      setModal(null);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(p: AdminPYQPaper) {
    if (!confirm(`Delete PYQ paper "${p.title}"?`)) return;
    await apiAdminDeletePYQ(p.id);
    load();
  }

  const cols = [
    { key: "title", label: "Title" },
    { key: "year", label: "Year" },
    { key: "examId", label: "Exam", width: "100px" },
    { key: "totalQs", label: "Questions" },
    { key: "type", label: "Type" },
    { key: "tierRequired", label: "Tier", render: (p: AdminPYQPaper) => `Tier ${p.tierRequired}` },
    {
      key: "isActive", label: "Active",
      render: (p: AdminPYQPaper) => <span style={{ color: p.isActive ? "var(--green)" : "var(--red)" }}>{p.isActive ? "Yes" : "No"}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setForm(empty()); setModal("create"); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--blue)" }}>
          + Add PYQ Paper
        </button>
      </div>

      <AdminTable columns={cols} data={data?.items ?? []} loading={loading}
        onEdit={(p) => { setForm({ ...p }); setModal("edit"); }}
        onDelete={handleDelete}
      />
      <Pagination page={page} total={data?.total ?? 0} limit={20} onChange={setPage} />

      {modal && (
        <Modal title={modal === "create" ? "Add PYQ Paper" : `Edit — ${form.title}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <SelectField label="Exam" name="examId" value={form.examId ?? ""} onChange={(v) => set("examId", v)}
              options={exams.map((e) => ({ value: e.id, label: e.name }))} required />
            <Field label="Title" name="title" value={form.title ?? ""} onChange={(v) => set("title", v)} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Year" name="year" type="number" value={form.year ?? ""} onChange={(v) => set("year", parseInt(v))} required />
              <Field label="Shift" name="shift" value={form.shift ?? ""} onChange={(v) => set("shift", v)} placeholder="Morning / Evening" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Total Questions" name="totalQs" type="number" value={form.totalQs ?? 0} onChange={(v) => set("totalQs", parseInt(v))} />
              <Field label="Duration (min)" name="durationMin" type="number" value={form.durationMin ?? 0} onChange={(v) => set("durationMin", parseInt(v))} />
            </div>
            <SelectField label="Type" name="type" value={form.type ?? "OBJECTIVE"}
              onChange={(v) => set("type", v)}
              options={["OBJECTIVE", "SUBJECTIVE", "MIXED"].map((t) => ({ value: t, label: t }))} />
            <SelectField label="Tier Required" name="tierRequired" value={String(form.tierRequired ?? 0)}
              onChange={(v) => set("tierRequired", parseInt(v))}
              options={[0, 1, 2, 3].map((n) => ({ value: n, label: n === 0 ? "Free" : `Tier ${n}` }))} />
            <Field label="PDF URL" name="pdfUrl" value={form.pdfUrl ?? ""} onChange={(v) => set("pdfUrl", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Toggle label="Has Solutions" checked={form.hasSolutions ?? false} onChange={(v) => set("hasSolutions", v)} />
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

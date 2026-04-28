"use client";

import { useEffect, useState } from "react";
import {
  apiAdminGetQuestions, apiAdminCreateQuestion, apiAdminUpdateQuestion, apiAdminDeleteQuestion,
  AdminQuestion,
} from "@/lib/api";
import { AdminTable, Pagination, Modal, Field, SelectField } from "@/components/admin/AdminTable";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const LANGUAGES = ["EN", "HI", "BILINGUAL"];

const empty = (): Partial<AdminQuestion> => ({
  text: "", options: '["","","",""]', correctIndex: 0,
  explanation: "", subject: "", topic: "", difficulty: "MEDIUM", language: "EN",
});

export default function AdminQuestionsPage() {
  const [data, setData] = useState<{ items: AdminQuestion[]; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [filterSubject, setFilterSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<AdminQuestion>>(empty());
  const [saving, setSaving] = useState(false);
  const [optionsArr, setOptionsArr] = useState(["", "", "", ""]);

  async function load(p = page) {
    setLoading(true);
    try { setData(await apiAdminGetQuestions({ page: p, limit: 20, subject: filterSubject || undefined })); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [page, filterSubject]);

  function set(key: keyof AdminQuestion, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  function openCreate() {
    setForm(empty());
    setOptionsArr(["", "", "", ""]);
    setModal("create");
  }

  function openEdit(q: AdminQuestion) {
    setForm({ ...q });
    try { setOptionsArr(JSON.parse(q.options)); } catch { setOptionsArr(["", "", "", ""]); }
    setModal("edit");
  }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, options: JSON.stringify(optionsArr), correctIndex: Number(form.correctIndex) };
      if (modal === "create") await apiAdminCreateQuestion(payload);
      else await apiAdminUpdateQuestion(form.id!, payload);
      setModal(null);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(q: AdminQuestion) {
    if (!confirm(`Delete question?`)) return;
    await apiAdminDeleteQuestion(q.id);
    load();
  }

  const cols = [
    {
      key: "text", label: "Question",
      render: (q: AdminQuestion) => <span className="line-clamp-2">{q.text.slice(0, 80)}{q.text.length > 80 ? "…" : ""}</span>,
    },
    { key: "subject", label: "Subject", render: (q: AdminQuestion) => q.subject ?? "—" },
    { key: "difficulty", label: "Difficulty", render: (q: AdminQuestion) => (
      <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{
        background: q.difficulty === "EASY" ? "var(--green-soft)" : q.difficulty === "HARD" ? "var(--red-soft)" : "var(--amber-soft)",
        color: q.difficulty === "EASY" ? "var(--green)" : q.difficulty === "HARD" ? "var(--red)" : "var(--amber)",
      }}>{q.difficulty}</span>
    )},
    { key: "language", label: "Lang" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          value={filterSubject}
          onChange={(e) => { setFilterSubject(e.target.value); setPage(1); }}
          placeholder="Filter by subject…"
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--ink-2)" }}
        />
        <button onClick={openCreate} className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--blue)" }}>
          + Add Question
        </button>
      </div>

      <AdminTable columns={cols} data={data?.items ?? []} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <Pagination page={page} total={data?.total ?? 0} limit={20} onChange={setPage} />

      {modal && (
        <Modal title={modal === "create" ? "Add Question" : "Edit Question"} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Question Text <span style={{ color: "var(--red)" }}>*</span></label>
              <textarea value={form.text ?? ""} onChange={(e) => set("text", e.target.value)} required rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }} />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium" style={{ color: "var(--ink-2)" }}>Options</label>
              {optionsArr.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: Number(form.correctIndex) === i ? "var(--green)" : "var(--line)", color: Number(form.correctIndex) === i ? "white" : "var(--ink-3)" }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input value={opt} onChange={(e) => {
                    const arr = [...optionsArr]; arr[i] = e.target.value; setOptionsArr(arr);
                  }} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
                    style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }} />
                  <button type="button" onClick={() => set("correctIndex", i)}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: Number(form.correctIndex) === i ? "var(--green-soft)" : "var(--bg)", color: Number(form.correctIndex) === i ? "var(--green)" : "var(--ink-3)", border: "1px solid var(--line)" }}>
                    Correct
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Explanation</label>
              <textarea value={form.explanation ?? ""} onChange={(e) => set("explanation", e.target.value)} rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Subject" name="subject" value={form.subject ?? ""} onChange={(v) => set("subject", v)} />
              <Field label="Topic" name="topic" value={form.topic ?? ""} onChange={(v) => set("topic", v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Difficulty" name="difficulty" value={form.difficulty ?? "MEDIUM"}
                onChange={(v) => set("difficulty", v)}
                options={DIFFICULTIES.map((d) => ({ value: d, label: d }))} />
              <SelectField label="Language" name="language" value={form.language ?? "EN"}
                onChange={(v) => set("language", v)}
                options={LANGUAGES.map((l) => ({ value: l, label: l }))} />
            </div>
            <Field label="Year (PYQ)" name="year" type="number" value={form.year ?? ""} onChange={(v) => set("year", v ? parseInt(v) : undefined)} />
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
